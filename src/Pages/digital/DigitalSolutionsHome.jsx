// src/pages/home.jsx - COMPLETE UPDATED VERSION WITH CHATBOT

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SimpleChatbot from '../../components/SimpleChatbot';

// Constants - Updated from brand document
const SERVICES = [
  {
    category: "AI Integration & Digital Transformation",
    icon: "⚡",
    description: "Upgrade your existing systems with intelligence. We integrate AI directly into your current platforms to automate workflows, enhance decision-making, and unlock new capabilities.",
    items: [
      "AI feature integration into web & mobile platforms",
      "AI chatbots & virtual assistants",
      "Smart recommendation engines",
      "Workflow & document automation",
      "Predictive analytics dashboards",
      "Custom AI API development"
    ],
    theme: {
      bg: "bg-white",
      text: "text-gray-900",
      subtext: "text-gray-600",
      checkBg: "bg-blue-100",
      checkColor: "text-blue-600",
      btnBg: "bg-blue-600 hover:bg-blue-700",
      btnText: "text-white",
      iconBg: "bg-blue-100"
    }
  },
  {
    category: "AI-Powered Web Applications",
    icon: "🌐",
    description: "Build scalable, intelligent web platforms designed for growth. From real-time analytics dashboards to AI-powered customer portals, we create web systems that think.",
    items: [
      "Custom AI-enabled web applications",
      "Business dashboards with real-time analytics",
      "SaaS platforms with predictive capabilities",
      "Multi-user secure enterprise systems",
      "Cloud-hosted scalable architecture",
      "API integrations & data pipelines"
    ],
    theme: {
      bg: "bg-gray-950",
      text: "text-white",
      subtext: "text-gray-600",
      checkBg: "bg-blue-900/50",
      checkColor: "text-blue-400",
      btnBg: "bg-orange-500 hover:bg-orange-600",
      btnText: "text-white",
      iconBg: "bg-blue-900/50"
    }
  },
  {
    category: "AI-Powered Mobile Applications",
    icon: "📱",
    description: "Create intelligent mobile experiences for modern businesses. We build AI-enabled iOS and Android apps with real-time personalization and smart automation.",
    items: [
      "AI-enabled iOS & Android applications",
      "Cross-platform mobile solutions",
      "Real-time personalization features",
      "Intelligent notifications & automation",
      "Mobile analytics dashboards",
      "Scalable backend integrations"
    ],
    theme: {
      bg: "bg-blue-700",
      text: "text-white",
      subtext: "text-blue-600",
      checkBg: "bg-white/20",
      checkColor: "text-white",
      btnBg: "bg-white hover:bg-blue-50",
      btnText: "text-blue-700",
      iconBg: "bg-white/20"
    }
  },
  {
    category: "Intelligent Automation Systems",
    icon: "🤖",
    description: "Reduce operational friction and increase efficiency. We build automated systems for onboarding, sales funnels, support routing, HR workflows, and more.",
    items: [
      "Customer onboarding automation",
      "Sales funnel & lead qualification",
      "Support ticket routing automation",
      "HR & internal operations automation",
      "Smart scheduling systems",
      "Business process optimization"
    ],
    theme: {
      bg: "bg-gray-100",
      text: "text-gray-900",
      subtext: "text-gray-600",
      checkBg: "bg-blue-100",
      checkColor: "text-blue-600",
      btnBg: "bg-orange-500 hover:bg-orange-600",
      btnText: "text-white",
      iconBg: "bg-blue-100"
    }
  },
  {
    category: "Data & Predictive Analytics",
    icon: "📊",
    description: "Turn your business data into strategic intelligence. From KPI dashboards to predictive forecasting, we help you make smarter decisions backed by real data.",
    items: [
      "KPI & real-time business intelligence",
      "Predictive sales forecasting models",
      "Customer behavior & churn analysis",
      "Demand forecasting tools",
      "Data integration pipelines",
      "Structured data architecture"
    ],
    theme: {
      bg: "bg-gray-950",
      text: "text-white",
      subtext: "text-gray-600",
      checkBg: "bg-orange-900/50",
      checkColor: "text-orange-400",
      btnBg: "bg-orange-500 hover:bg-orange-600",
      btnText: "text-white",
      iconBg: "bg-orange-900/50"
    }
  },
  {
    category: "AI Strategy & Consulting",
    icon: "💼",
    description: "Build the right intelligent system before building the product. We provide AI readiness assessments, transformation roadmaps, and implementation planning.",
    items: [
      "AI readiness assessments",
      "Digital transformation roadmaps",
      "Product architecture & MVP planning",
      "Implementation strategy",
      "AI compliance & data considerations",
      "Ongoing optimization support"
    ],
    theme: {
      bg: "bg-white",
      text: "text-gray-900",
      subtext: "text-gray-600",
      checkBg: "bg-blue-100",
      checkColor: "text-blue-700",
      btnBg: "bg-orange-500 hover:bg-orange-600",
      btnText: "text-white",
      iconBg: "bg-blue-100"
    }
  }
];

const FAQs = [
  {
    question: "What does She Model Tech do?",
    answer: "She Model Tech builds cutting-edge technology solutions for businesses. We transform web and mobile applications into intelligent systems using AI, automation, and data-driven architecture. We also run a platform where people build real-world experience through collaborative projects and get discovered by recruiters - explore it from our homepage."
  },
  {
    question: "How is She Model Tech different from other development companies?",
    answer: "We don't just build websites - we design intelligent systems that automate, analyze, and evolve. Every engagement starts with strategy, and our solutions are built to scale with your business."
  },
  {
    question: "How does your consultation and project process work?",
    answer: "We start every engagement with a consultation fee. This covers your discovery session, initial scoping, and a custom proposal outlining our services, how we operate, project timelines, and transparent pricing. If you move forward and build with us, the fee is credited toward your project - it's part of your investment, not an extra charge. If you choose not to proceed, the consultation fee is non-refundable. For full details on our process, refund policy, pricing structure, and intellectual property terms, please review our Terms of Service at shemodeltech.com/solutions/terms."
  },
  {
    question: "Is the consultation fee refundable?",
    answer: "The consultation fee is strictly non-refundable. It compensates our team for the dedicated time and expertise invested in your discovery session and custom proposal preparation. However, if you choose to build with us, this fee is applied as a credit toward your total project cost. We encourage you to read our full Terms of Service at shemodeltech.com/solutions/terms before proceeding, so you have complete clarity on our policies."
  },
  {
    question: "Can you integrate AI into my existing platform?",
    answer: "Absolutely. One of our core services is AI Integration and Digital Transformation. We upgrade existing web and mobile platforms with AI capabilities including chatbots, recommendation engines, predictive analytics, workflow automation, and custom AI APIs - without rebuilding from scratch."
  },
  {
    question: "Do you build mobile applications?",
    answer: "Yes! We build AI-powered native and cross-platform mobile applications for both iOS and Android. Our mobile solutions include real-time personalization, intelligent notifications, analytics dashboards, and scalable backend integrations."
  },
  {
    question: "What industries do you serve?",
    answer: "We partner with forward-thinking organizations across multiple sectors including financial services, healthcare, education, e-commerce, professional services, growth-stage startups, enterprise teams, and research organizations."
  },
  {
    question: "Do you offer career guidance or tech training?",
    answer: "Yes! Our platform helps people build real-world experience through collaborative projects, earn verified credentials, and get discovered by recruiters for remote and onsite roles. Head to our homepage to get started for free."
  },
  {
    question: "Will I be working with real people or just AI?",
    answer: "Both! While we use AI-powered tools to streamline assessments, roadmaps, and initial consultations, every project and inquiry is reviewed and handled by our real human team. For business solutions, a dedicated team member will personally follow up within 24 hours. For career guidance, our ProjectX program pairs you with real teams on real projects, and you can request a dedicated career coach for one-on-one support. Our AI tools enhance the experience, but real people are always behind the work."
  },
  {
    question: "Do you provide AI strategy and consulting?",
    answer: "Yes. We offer AI readiness assessments, digital transformation roadmaps, product architecture planning, MVP strategy development, implementation planning, and ongoing optimization support. We help you build the right intelligent system before building the product."
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Absolutely. Our commitment extends beyond launch. We provide reliable ongoing support, maintenance, optimization, and updates to ensure your intelligent systems continue to perform and evolve as your business grows. Support terms are outlined in your individual Project Agreement - for more details, see our Terms of Service at shemodeltech.com/solutions/terms."
  },
  {
    question: "Where can I review your full policies, pricing structure, and legal terms?",
    answer: "All of our engagement policies - including the consultation fee structure, refund terms, how we price projects, intellectual property ownership, and our full operating process - are documented in our Terms of Service. We strongly encourage every prospective client to read it before starting a consultation. You can access it at shemodeltech.com/solutions/terms or by clicking the Terms of Service link in the footer of this page."
  }
];

const CORE_VALUES = [
  { value: 'Trust', icon: '🤝', description: 'Building lasting partnerships through integrity and excellence' },
  { value: 'Transparency', icon: '💎', description: 'Clear communication and honest collaboration at every step' },
  { value: 'Timeliness', icon: '⚡', description: 'Delivering on our commitments with consistent reliability' },
  { value: 'Reliability', icon: '🛡️', description: 'Creating dependable solutions that businesses can count on' }
];

const OUTCOMES = [
  "Increased operational efficiency",
  "Reduced manual workload",
  "Faster decision-making",
  "Improved customer engagement",
  "Higher conversion rates",
  "Scalable digital infrastructure",
  "Smarter risk management",
  "Sustainable competitive advantage"
];

// Career features removed - career content lives on the main careers platform

// Lazy loading image component
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

// Component
const CareerHome = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FIX: Use ref + requestAnimationFrame for mouse tracking.
  // Old code called setState on every mousemove (100s of times/sec), causing full re-renders.
  // Now we write directly to DOM via ref - zero re-renders.
  const overlayRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          if (overlayRef.current) {
            overlayRef.current.style.background =
              `radial-gradient(400px circle at ${e.clientX}px ${e.clientY}px, rgba(34, 197, 94, 0.15), transparent 40%)`;
          }
          rafId.current = null;
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleContactUs = useCallback(() => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => window.dispatchEvent(new Event('openChatbot')), 500);
    }
  }, []);

  const handleExploreServices = useCallback(() => {
    const el = document.getElementById('why-choose-us');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleGoHome = useCallback(() => {
    const el = document.getElementById('hero-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col relative bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Animated background overlay - ref-based, no re-renders */}
      <div
        ref={overlayRef}
        className="fixed inset-0 opacity-30 pointer-events-none"
      />

      {/* Header - full width */}
          <Navbar />


      {/* Main Content */}
      <main className="flex-grow w-full pt-16 sm:pt-20 md:pt-24">

        {/* ===== HERO SECTION ===== */}
        <section id="hero-section" className="relative w-full mb-16 sm:mb-24 md:mb-32 pt-16 sm:pt-20 md:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8"
                 style={{}}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>

          <div className="w-full max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-6 sm:mb-8 md:mb-12 leading-tight tracking-tight"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: '900' }}>
              <span style={{ color: '#9CA3AF', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                Transform Your Business with
              </span>
              <br />
              <span style={{
                color: 'transparent',
                WebkitTextStroke: '2px #22c55e',
                textStroke: '2px #22c55e',
                textShadow: '0 0 20px rgba(34, 197, 94, 0.5), 2px 2px 8px rgba(0, 0, 0, 0.9)',
                letterSpacing: '-0.01em'
              }}>
                AI-Powered Digital Solutions
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 md:mb-16"
               style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)', fontFamily: '"Inter", sans-serif', fontWeight: '300' }}>
              We build and transform <span className="text-blue-400 font-semibold">web and mobile applications</span> into <span className="text-blue-400 font-semibold">intelligent systems</span> that automate operations, enhance customer experience, and drive <span className="text-orange-400 font-semibold">measurable growth</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-6 sm:mb-8 md:mb-10">
              <button onClick={handleContactUs}
                className="group relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white px-8 sm:px-10 md:px-14 py-4 sm:py-5 md:py-6 rounded-full font-bold text-base sm:text-lg md:text-xl transition-all duration-300 shadow-2xl overflow-hidden w-full sm:w-auto max-w-sm hover:shadow-blue-500/50"
                style={{ boxShadow: "0 10px 50px rgba(249, 115, 22, 0.4), 0 0 30px rgba(249, 115, 22, 0.2)", fontFamily: '"Inter", sans-serif' }}>
                <span className="relative drop-shadow-lg">Start Your Transformation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
              <button onClick={handleExploreServices}
                className="group relative border-2 border-white/80 text-white px-8 sm:px-10 md:px-14 py-4 sm:py-5 md:py-6 rounded-full font-bold text-base sm:text-lg md:text-xl transition-all duration-300 shadow-2xl overflow-hidden w-full sm:w-auto max-w-sm hover:shadow-white/50 hover:bg-white/10 hover:border-white"
                style={{ background: 'rgba(255, 255, 255, 0.05)', fontFamily: '"Inter", sans-serif' }}>
                <span className="relative drop-shadow-lg">Explore Our Services</span>
              </button>
            </div>

            <div className="inline-flex items-center bg-white/10 rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-2 border-white/30 shadow-xl">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg text-center"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)', fontFamily: '"Inter", sans-serif' }}>
                 Building Intelligent Digital Systems
              </span>
            </div>
          </div>
        </section>

        {/* ===== ABOUT SECTION ===== */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 md:mb-32">
          <div className="w-full max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 sm:mb-8"
                style={{ fontFamily: '"Inter", sans-serif' }}>
              We Don't Just Build Software.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
                We Build Intelligent Ecosystems.
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed"
               style={{ fontFamily: '"Inter", sans-serif' }}>
              She Model Tech is a digital innovation organization that builds cutting-edge technology solutions for businesses and empowers the next generation of tech professionals. We combine software engineering, strategy, and emerging technologies to build scalable solutions for growth.
            </p>
          </div>
        </section>

        {/* ===== CORE VALUES ===== */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 md:mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-black to-blue-600/10 -z-10"></div>
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6"
                style={{ fontFamily: '"Inter", sans-serif' }}>
              Our Core{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">Values</span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
               style={{ fontFamily: '"Inter", sans-serif' }}>
              The principles that guide every solution we build and every partnership we forge
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-6xl mx-auto">
            {CORE_VALUES.map((item, index) => (
              <div key={index} className="group transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500/30 via-gray-900/40 to-black/60 rounded-xl p-4 sm:p-6 md:p-8 border border-blue-500/20 shadow-xl hover:border-orange-400/40 transition-all duration-300 text-center h-full flex flex-col">
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 transform">{item.icon}</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1 sm:mb-2 text-white group-hover:text-orange-400 transition-colors"
                      style={{ fontFamily: '"Inter", sans-serif' }}>{item.value}</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-grow"
                     style={{ fontFamily: '"Inter", sans-serif' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SERVICES - FULL WIDTH ALTERNATING ===== */}
        <section id="why-choose-us" className="w-full mb-16 sm:mb-24">
          <div className="text-center mb-10 sm:mb-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6"
                style={{ fontFamily: '"Inter", sans-serif' }}>
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">Services</span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
               style={{ fontFamily: '"Inter", sans-serif' }}>
              End-to-end AI-powered solutions - from strategy to implementation to ongoing optimization
            </p>
          </div>

          {SERVICES.map((service, index) => {
            const isReversed = index % 2 !== 0;
            const t = service.theme;
            return (
              <div key={index} className={`${t.bg} w-full`}>
                <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-16 md:py-20">
                  <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-6 sm:gap-10 lg:gap-16 xl:gap-20`}>
                    <div className="w-full lg:w-5/12 flex justify-center">
                      <div className={`relative w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-3xl ${t.iconBg} flex items-center justify-center shadow-2xl transition-all duration-500`}>
                        <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">{service.icon}</span>
                        <div className={`absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 rounded-full ${t.checkBg}`}></div>
                        <div className={`absolute -bottom-3 -left-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${t.checkBg}`}></div>
                      </div>
                    </div>
                    <div className="w-full lg:w-7/12 text-center lg:text-left">
                      <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black ${t.text} mb-3 sm:mb-4 leading-tight`}
                          style={{ fontFamily: '"Inter", sans-serif' }}>{service.category}</h3>
                      <p className={`${t.subtext} text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-5 sm:mb-8 max-w-2xl mx-auto lg:mx-0`}
                         style={{ fontFamily: '"Inter", sans-serif' }}>{service.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-8">
                        {service.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-left">
                            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${t.checkBg} flex items-center justify-center flex-shrink-0`}>
                              <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${t.checkColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className={`${t.text} text-sm sm:text-base md:text-lg font-medium`} style={{ fontFamily: '"Inter", sans-serif' }}>{item}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={handleContactUs}
                        className={`${t.btnBg} ${t.btnText} px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg`}
                        style={{ fontFamily: '"Inter", sans-serif' }}>
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* ===== BUSINESS OUTCOMES ===== */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6"
                style={{ fontFamily: '"Inter", sans-serif' }}>
              Business{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">Outcomes We Drive</span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
               style={{ fontFamily: '"Inter", sans-serif' }}>
              Our solutions deliver measurable impact across your organization
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-6xl mx-auto">
            {OUTCOMES.map((outcome, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-500/30 via-gray-900/40 to-black/60 rounded-xl p-3 sm:p-4 md:p-5 border border-blue-500/20 hover:border-orange-400/40 transition-all duration-300 text-center group">
                <div className="text-orange-400 text-base sm:text-lg md:text-xl mb-1.5 sm:mb-2">✓</div>
                <p className="text-white text-sm sm:text-base md:text-lg font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>{outcome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TRUSTED BY / TICKER ===== */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 relative">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6"
                style={{ fontFamily: '"Inter", sans-serif' }}>
              Trusted by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">Industry Leaders</span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
               style={{ fontFamily: '"Inter", sans-serif' }}>
              From startups to established enterprises, we've delivered exceptional digital solutions
            </p>
          </div>
          <div className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500/40 via-gray-900/50 to-blue-600/40 rounded-2xl border border-blue-500/20 py-5 sm:py-8">
            <div className="flex animate-scroll">
              {[0, 1].map((set) => (
                <div key={set} className="flex space-x-6 sm:space-x-12 px-4 sm:px-6">
                  <div className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[180px] md:min-w-[240px]">
                    <div className="text-blue-400 text-sm sm:text-base font-bold mb-1 tracking-wider">BUSINESS WEBSITE</div>
                    <div className="text-white text-base sm:text-lg md:text-xl font-bold text-center">Content Phase Media</div>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[180px] md:min-w-[240px]">
                    <div className="text-blue-400 text-sm sm:text-base font-bold mb-1 tracking-wider">BUSINESS WEBSITE</div>
                    <div className="text-white text-base sm:text-lg md:text-xl font-bold text-center">Filomos Global Services</div>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[180px] md:min-w-[240px]">
                    <div className="text-blue-400 text-sm sm:text-base font-bold mb-1 tracking-wider">BUSINESS WEBSITE</div>
                    <div className="text-white text-base sm:text-lg md:text-xl font-bold text-center">Timeless Venture Group</div>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[180px] md:min-w-[240px]">
                    <div className="text-blue-400 text-sm sm:text-base font-bold mb-1 tracking-wider">RESEARCH WEBSITE</div>
                    <div className="text-white text-base sm:text-lg md:text-xl font-bold text-center">DEPA Lab</div>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[180px] md:min-w-[240px]">
                    <div className="text-blue-400 text-sm sm:text-base font-bold mb-1 tracking-wider">STUDENT PLATFORM</div>
                    <div className="text-white text-base sm:text-lg md:text-xl font-bold text-center">She Model Tech Careers</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TERMS OF SERVICE PREVIEW SECTION ===== */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 relative">
          <div className="w-full max-w-5xl mx-auto">

            {/* Header */}
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center bg-blue-500/10 rounded-full px-5 py-2 border border-blue-400/25 mb-6">
                <span className="text-blue-500 font-bold text-sm sm:text-base" style={{ fontFamily: '"Inter", sans-serif' }}>
                   How We Work Together
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6"
                  style={{ fontFamily: '"Inter", sans-serif' }}>
                Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
                  Engagement Process
                </span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                 style={{ fontFamily: '"Inter", sans-serif' }}>
                We believe in full transparency before any project begins. Here's a brief overview of how our client engagement works.
              </p>
            </div>

            {/* 3-Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-14">

              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-500/40 via-gray-900/50 to-black/70 rounded-2xl p-6 sm:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 h-full flex flex-col">
                  <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>Step 01</div>
                  <h3 className="text-white text-lg sm:text-xl font-black mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                    Consultation Fee
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow" style={{ fontFamily: '"Inter", sans-serif' }}>
                    We begin every engagement with a paid consultation. This fee is <span className="text-blue-400 font-semibold">credited toward your project</span> if you choose to build with us - so your investment starts working immediately.
                  </p>
                </div>
                {/* Connector arrow */}
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center text-orange-400 text-xl font-bold">›</div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-500/40 via-gray-900/50 to-black/70 rounded-2xl p-6 sm:p-8 border border-blue-500/20 hover:border-orange-400/50 transition-all duration-300 h-full flex flex-col">
                  <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>Step 02</div>
                  <h3 className="text-white text-lg sm:text-xl font-black mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                    Custom Proposal Delivered
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow" style={{ fontFamily: '"Inter", sans-serif' }}>
                    After your consultation, we deliver a tailored proposal - covering our full services, how we operate, project timeline, and transparent pricing based on exactly what you want to build.
                  </p>
                </div>
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center text-orange-400 text-xl font-bold">›</div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="bg-gradient-to-br from-blue-500/40 via-gray-900/50 to-black/70 rounded-2xl p-6 sm:p-8 border border-blue-500/20 hover:border-orange-400/50 transition-all duration-300 h-full flex flex-col">
                  <div className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>Step 03</div>
                  <h3 className="text-white text-lg sm:text-xl font-black mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                    Build & Transform Together
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow" style={{ fontFamily: '"Inter", sans-serif' }}>
                    If you move forward, we kick off your project with a dedicated team. If you don't, the consultation fee is non-refundable - it compensates for the expertise and time invested in your discovery session.
                  </p>
                </div>
              </div>

            </div>

            {/* Note + CTA bar */}
            <div className="bg-gradient-to-r from-blue-500/30 via-gray-900/40 to-blue-600/30 rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-white font-bold text-base sm:text-lg mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Transparency is one of our core values.
                </p>
                <p className="text-gray-400 text-sm sm:text-base" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Read our full Terms of Service - including refund policies, pricing structure, IP ownership, and more.
                </p>
              </div>
              <a href="/solutions/terms"
                className="group flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-7 sm:px-9 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-xl hover:shadow-orange-500/30 whitespace-nowrap"
                style={{ fontFamily: '"Inter", sans-serif' }}>
                Read Full Terms
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/20 via-black to-blue-600/10 -z-10"></div>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6"
                style={{ fontFamily: '"Inter", sans-serif' }}>
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">Questions</span>
            </h2>
          </div>
          <div className="w-full max-w-4xl mx-auto">
            {FAQs.map((faq, index) => (
              <div key={index} className="mb-3">
                <button
                  className="w-full text-left p-4 sm:p-5 transition-all duration-300 rounded-xl bg-gradient-to-br from-blue-500/30 via-gray-900/40 to-black/60 border border-blue-500/20 hover:border-blue-400/40"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  aria-expanded={expandedFAQ === index}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base sm:text-lg md:text-xl text-white pr-4" style={{ fontFamily: '"Inter", sans-serif' }}>{faq.question}</h3>
                    <span className={`transform transition-transform text-xl text-orange-400 flex-shrink-0 ${expandedFAQ === index ? 'rotate-180' : ''}`}>⌄</span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${expandedFAQ === index ? 'max-h-[600px] mt-3' : 'max-h-0'}`}>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg" style={{ fontFamily: '"Inter", sans-serif' }}>{faq.answer}</p>
                    {/* Terms of Service nudge on relevant FAQ items */}
                    {(index === 2 || index === 3 || index === 10 || index === 11) && expandedFAQ === index && (
                      <div className="mt-4 flex items-center gap-3 bg-blue-950/40 border border-blue-500/25 rounded-xl px-4 py-3">
                        <span className="text-blue-400 text-lg flex-shrink-0">📋</span>
                        <p className="text-blue-400 text-sm" style={{ fontFamily: '"Inter", sans-serif' }}>
                          For complete details, please{' '}
                          <a href="/solutions/terms" className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2 transition-colors">
                            review our full Terms of Service
                          </a>.
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* AI Chatbot */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <SimpleChatbot />
        </div>
      </main>

      {/* Footer - full width */}
      <footer className="w-full text-white py-8 sm:py-10 relative"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.98), rgba(5,20,5,0.9), transparent)' }}>
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/10 pt-6 sm:pt-8">
            <div className="flex flex-col space-y-5">
              <div className="text-center">
                <p className="text-blue-400 font-bold text-base sm:text-lg" style={{ fontFamily: '"Inter", sans-serif' }}>She Model Tech</p>
                <p className="text-gray-400 text-sm sm:text-base" style={{ fontFamily: '"Inter", sans-serif' }}>Building Intelligent Digital Systems &bull; Empowering Tech Professionals</p>
              </div>
              <div className="flex justify-center items-center gap-4 sm:gap-6">
                <a href="https://www.instagram.com/she-model-techhq/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                  </div>
                </a>
                <a href="https://www.linkedin.com/company/ascivan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                  </div>
                </a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <a href="/solutions/privacy" className="text-gray-600 hover:text-blue-400 text-base transition-colors font-medium">Privacy Policy</a>
                <span className="text-gray-500">•</span>
                <a href="/solutions/terms" className="text-gray-600 hover:text-blue-400 text-base transition-colors font-medium">Terms of Service</a>
                <span className="text-gray-500">•</span>
                <a href="/" className="text-gray-600 hover:text-blue-400 text-base transition-colors font-medium">Student Platform</a>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base">© {new Date().getFullYear()} She Model Tech. All rights reserved.</p>
                <p className="text-gray-500 text-sm mt-1">Your Digital Intelligence Partner</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 15s linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); }
        ::-webkit-scrollbar-thumb { background: rgba(34, 197, 94, 0.5); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(249, 115, 22, 0.7); }
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { overflow-x: hidden; }
        button:focus, a:focus { outline: 2px solid rgba(22, 163, 74, 0.5); outline-offset: 2px; }
      `}</style>
    </div>
  );
};

export default CareerHome;
