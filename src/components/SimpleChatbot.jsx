// src/components/SimpleChatbot.jsx
import React, { useState, useEffect, useRef } from 'react';

const SimpleChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [inquiryType, setInquiryType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    consultation: '',
    inquiryType: ''
  });
  const messagesEndRef = useRef(null);
  const chatSectionRef = useRef(null);
  const timersRef = useRef([]);

  // Listen for custom event to open chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('openChatbot', handleOpenChat);
    return () => window.removeEventListener('openChatbot', handleOpenChat);
  }, []);

  // Cleanup all pending timers on unmount or chat close
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const safeTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FIX: Guard against re-firing when messages already exist
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        addBotMessage("Hi! Welcome to She Model Tech. I'm your AI assistant here to help you navigate projects, career tools, badges, and community resources as a tech professional. What's your first name?");
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { type: 'bot', text }]);
  };

  const addBotOptions = (text, options) => {
    setMessages(prev => [...prev, { type: 'bot', text, options }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text }]);
  };

  const handleOptionClick = (option) => {
    addUserMessage(option);
    processOption(option);
  };

  const processOption = async (option) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsTyping(false);

    if (step === 3) {
      // Inquiry type selection
      const type = option.toLowerCase();
      setInquiryType(type);
      setFormData(prev => ({ ...prev, inquiryType: option }));

      if (type.includes('business') || type.includes('build')) {
        addBotMessage("Great! Tell me about your project. What are you looking to build or transform?");
        setStep(4);
      } else if (type.includes('career') || type.includes('tech') || type.includes('job')) {
        // Jobs/career branch
        addBotMessage("Great news! She Model Tech helps tech professionals find projects, jobs, career tools, and connect with a supportive community - all in one place.");
        safeTimeout(() => {
          addBotMessage("Check out our Projects section to find collaborative work, or explore Jobs for career opportunities.");
        }, 1500);
        safeTimeout(() => {
          addBotMessage("Head to your dashboard to get started: /dashboard");
        }, 3000);
        safeTimeout(() => {
          addBotMessage("Or take the free AI Career Assessment now: /career/test");
        }, 4500);
        safeTimeout(() => {
          addBotMessage("If you have any business-related inquiries, feel free to start a new chat anytime. Best of luck on your tech journey! 🚀");
        }, 6000);
        setStep(99);
      } else {
        addBotMessage("Tell me more about how we can help you!");
        setStep(4);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    addUserMessage(userText);
    setInputValue('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTyping(false);

    switch(step) {
      case 0: // First name
        setFormData(prev => ({ ...prev, firstName: userText }));
        addBotMessage(`Nice to meet you, ${userText}! What's your last name?`);
        setStep(1);
        break;

      case 1: // Last name
        setFormData(prev => ({ ...prev, lastName: userText }));
        addBotMessage("Great! What's your email address?");
        setStep(2);
        break;

      case 2: // Email
        if (!userText.includes('@')) {
          addBotMessage("That doesn't look like a valid email. Can you try again?");
          return;
        }
        setFormData(prev => ({ ...prev, email: userText }));
        addBotOptions(
          `Perfect, ${formData.firstName}! How can we help you today?`,
          [
            "🏢 Business Solutions - Build or transform my product",
            "🚀 Career Guidance - Transition into or grow in tech",
            "💬 General Inquiry - Something else"
          ]
        );
        setStep(3);
        break;

      case 3: // If they type instead of clicking an option
        processOption(userText);
        break;

      case 4: // Business project description
        setFormData(prev => ({ ...prev, message: userText }));
        addBotMessage("What's your phone number so our team can reach you?");
        setStep(5);
        break;

      case 5: // Phone
        setFormData(prev => ({ ...prev, phone: userText }));
        addBotMessage("Our consultation sessions have a $100 non-refundable fee. If you proceed to build with us, this fee will be credited toward your project cost. Would you like to proceed? (Yes/No)");
        setStep(6);
        break;

      case 6: // Consultation fee agreement
        const response = userText.toLowerCase().trim();
        if (response !== 'yes' && response !== 'no') {
          addBotMessage("Please reply with Yes or No.");
          return;
        }
        const consultationAnswer = response === 'yes' ? 'Yes' : 'No';
        setFormData(prev => ({ ...prev, consultation: consultationAnswer }));
        
        await submitForm({ ...formData, consultation: consultationAnswer });
        
        addBotMessage("Thank you! Your information has been submitted successfully.");
        
        safeTimeout(() => {
          addBotMessage("A real member of our team will personally review your inquiry and reach out to you via email within the next 24 hours to discuss your project and next steps.");
        }, 1500);
        
        safeTimeout(() => {
          addBotMessage("Please ensure that the email address and contact information you provided are correct so we can reach you promptly.");
        }, 3000);

        safeTimeout(() => {
          addBotMessage("As a thank you, here's a FREE copy of our 'AI Business Growth Toolkit: Strategic Prompts for Business Owners'. Download it here: https://selar.com/q3tk00n000");
        }, 5000);

        safeTimeout(() => {
          addBotMessage("We're excited to help transform your business! Talk soon. 🚀");
        }, 6500);
        
        setStep(99);
        break;

      default:
        addBotMessage("Thanks for chatting! Feel free to reach out anytime.");
    }
  };

  const submitForm = async (data) => {
    let form = null;
    let iframe = null;
    try {
      form = document.createElement('form');
      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLScKWa6lglk6AYwRDbBIO7R84LX_8QiP4iA9tGowd-BuvvLrQw/formResponse';
      form.method = 'POST';
      form.target = 'hidden_iframe';
      form.style.display = 'none';

      const fields = {
        'entry.640877948': data.firstName,
        'entry.708138434': data.lastName,
        'entry.64027578': data.email,
        'entry.1300524080': data.phone,
        'entry.1092093939': `[${data.inquiryType || 'General'}] ${data.message}`,
        'entry.133740837': data.consultation
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value || '';
        form.appendChild(input);
      });

      iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      
      form.submit();

      // FIX: Clean up DOM elements reliably
      safeTimeout(() => {
        try { if (form && form.parentNode) document.body.removeChild(form); } catch (_) {}
        try { if (iframe && iframe.parentNode) document.body.removeChild(iframe); } catch (_) {}
      }, 2000);
    } catch (error) {
      console.error('Submit error:', error);
      // Ensure cleanup on error
      try { if (form && form.parentNode) document.body.removeChild(form); } catch (_) {}
      try { if (iframe && iframe.parentNode) document.body.removeChild(iframe); } catch (_) {}
    }
  };

  return (
    <section id="contact-section" className="mb-16 sm:mb-24" ref={chatSectionRef}>
      <div className="max-w-4xl mx-auto">
        
        {/* Chat Interface or Prompt */}
        {!isOpen ? (
          <div className="text-center">
            <div className="bg-gradient-to-br from-pink-950/30 via-gray-900/40 to-black/60 rounded-2xl border border-gray-200 shadow-2xl p-6 sm:p-8 md:p-12">
              
              {/* Large Chat Icon */}
              <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 ">💬</div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-gray-900" 
                  style={{
                    textShadow: '0 0 30px rgba(255,255,255,0.2), 2px 2px 4px rgba(0,0,0,0.9)',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                Chat With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-400 to-pink-300">
                  Our Team
                </span>
              </h2>
              
              <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-4" 
                 style={{
                   textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                   fontFamily: '"Inter", sans-serif'
                 }}>
                Have a business solution in mind? Share your details and a real team member will follow up with you personally.
              </p>

              <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-8" 
                 style={{ fontFamily: '"Inter", sans-serif' }}>
                This assistant collects your information - our human team handles everything from there.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={() => setIsOpen(true)}
                  className="group relative bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 text-gray-900 px-10 sm:px-14 py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl transition-all duration-300 shadow-2xl overflow-hidden"
                  style={{
                    boxShadow: '0 10px 50px rgba(249, 115, 22, 0.4), 0 0 30px rgba(249, 115, 22, 0.2)',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  <span className="relative drop-shadow-lg flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Start Chatting
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
                <div className="inline-flex items-center bg-pink-600/20 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border border-pink-500/30">
                  <span className="text-pink-500 font-bold text-xs sm:text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                    🏢 Business Solutions
                  </span>
                </div>
                <div className="inline-flex items-center bg-pink-600/15 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border border-pink-500/25">
                  <span className="text-pink-400 font-bold text-xs sm:text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                    💬 General Inquiries
                  </span>
                </div>
                <div className="inline-flex items-center bg-pink-600/20 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border border-pink-500/30">
                  <span className="text-pink-500 font-bold text-xs sm:text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                    👤 Real Human Follow-up
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Window */
          <div className="bg-gradient-to-br from-pink-950/30 via-gray-900/40 to-black/60 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
            <div className="max-w-4xl mx-auto">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-600 to-pink-500 p-3 sm:p-4 md:p-6 text-gray-900 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl">She Model Tech Assistant</h3>
                    <p className="text-sm text-gray-900/80">Collecting your info - our team follows up personally</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="h-72 sm:h-80 md:h-96 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-900/20 to-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-gray-900' 
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }`}>
                        {msg.text.includes('http') ? (
                          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line break-words">
                            {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                              /https?:\/\/[^\s]+/.test(part) ? (
                                <a 
                                  key={i}
                                  href={part} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="underline hover:text-pink-500 transition-colors font-semibold break-all"
                                >
                                  {part}
                                </a>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        ) : (
                          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line break-words">{msg.text}</p>
                        )}
                      </div>
                    </div>

                    {/* Clickable Options */}
                    {msg.options && (
                      <div className="flex flex-col gap-2 mt-3 ml-4">
                        {msg.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleOptionClick(option)}
                            className="text-left px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-pink-500/20 border border-pink-500/30 text-gray-900 hover:from-pink-500/40 hover:to-pink-500/40 hover:border-pink-500/50 transition-all duration-300 text-xs sm:text-sm md:text-base font-medium"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 border border-gray-200 p-4 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-white rounded-full "></div>
                        <div className="w-3 h-3 bg-white rounded-full " style={{animationDelay: '0.2s'}}></div>
                        <div className="w-3 h-3 bg-white rounded-full " style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-gray-100">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={step === 3 ? "Or type your answer..." : "Type your message..."}
                    disabled={step >= 99}
                    className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-50 text-base"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || step >= 99}
                    className="bg-gradient-to-r from-pink-600 to-pink-500 text-gray-900 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all text-base"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SimpleChatbot;
