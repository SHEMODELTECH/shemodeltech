// src/Pages/applications/SubmitApplication.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';

const SubmitApplication = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    experience: '',
    motivation: '',
    portfolio: '',
    skills: '',
    availability: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Submit to Firebase
      await addDoc(collection(db, 'applications'), {
        userId: currentUser.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: currentUser.email,
        phone: formData.phone,
        status: 'submitted',
        applicationData: {
          experience: formData.experience,
          motivation: formData.motivation,
          portfolio: formData.portfolio,
          skills: formData.skills,
          availability: formData.availability
        },
        submittedAt: serverTimestamp()
      });

      setSubmitStatus('success');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        experience: '',
        motivation: '',
        portfolio: '',
        skills: '',
        availability: ''
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <div 
      className="min-h-screen overflow-hidden flex flex-col relative"
      style={{}}
    >
      {/* Global Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-16 max-w-7xl">
          
          {/* Hero Section */}
          <section className="relative mb-8 xs:mb-10 sm:mb-12 md:mb-16 lg:mb-20 pt-4 xs:pt-6 sm:pt-8 md:pt-12 lg:pt-16">
            <div className="max-w-4xl mx-auto text-center">
              
              {/* Animated Badge */}
              <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 mb-4 xs:mb-5 sm:mb-6 md:mb-8 animate-pulse">
                <div className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 bg-pink-400 rounded-full" 
                     ></div>
                <span className="text-pink-500 uppercase tracking-wider xs:tracking-widest text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-black" 
                      style={{
                        textShadow: '0 0 20px rgba(34,197,94,0.7), 2px 2px 4px rgba(0,0,0,0.9)',
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: '0.1em'
                      }}>
                  Join Our Platform
                </span>
                <div className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 bg-pink-400 rounded-full" 
                     ></div>
              </div>
              
              {/* Main Title */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-12 leading-tight tracking-tight px-2"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f7fbff 50%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(34,197,94,0.18)',
                    filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9))'
                  }}>
                Submit Your{' '}
                <span className="block mt-1 xs:mt-2 sm:mt-3 md:mt-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-500 to-orange-400"
                      style={{
                        textShadow: 'none',
                        filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.45))',
                        
                      }}>
                  Application
                </span>
              </h1>

              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light mb-6 xs:mb-7 sm:mb-8 md:mb-10 lg:mb-12 px-4" 
                 style={{
                   textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                   fontFamily: '"Inter", sans-serif'
                 }}>
                Apply to join our platform of talented developers and tech professionals. 
                <span className="text-pink-500 font-semibold block sm:inline mt-1 sm:mt-0"> Get access to exclusive opportunities</span> and connect with industry leaders.
              </p>
              
              <div className="h-0.5 xs:h-1 sm:h-1.5 md:h-2 w-12 xs:w-16 sm:w-20 md:w-24 lg:w-32 bg-gradient-to-r from-pink-500 to-orange-400 mx-auto rounded-full shadow-2xl mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16"
                   ></div>
            </div>
          </section>

          {/* Application Form */}
          <section className="mb-8 xs:mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 border border-white/20 shadow-2xl">
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 xs:mb-7 sm:mb-8 p-4 xs:p-5 sm:p-6 bg-gradient-to-r from-pink-500/12 to-orange-500/12 border border-pink-500/30 rounded-lg xs:rounded-xl">
                  <div className="flex items-start xs:items-center">
                    <div className="text-pink-400 text-xl xs:text-2xl mr-3 xs:mr-4 flex-shrink-0">✓</div>
                    <div className="flex-1">
                      <h3 className="text-pink-400 font-bold text-base xs:text-lg mb-1 xs:mb-2">Application Submitted Successfully</h3>
                      <p className="text-gray-700 text-xs xs:text-sm sm:text-base">Thank you for your application. Our team will review it and get back to you within 3-5 business days.</p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 xs:mb-7 sm:mb-8 p-4 xs:p-5 sm:p-6 bg-gradient-to-r from-orange-500/12 to-orange-400/12 border border-orange-500/30 rounded-lg xs:rounded-xl">
                  <div className="flex items-start xs:items-center">
                    <div className="text-orange-400 text-xl xs:text-2xl mr-3 xs:mr-4 flex-shrink-0">⚠</div>
                    <div className="flex-1">
                      <h3 className="text-orange-400 font-bold text-base xs:text-lg mb-1 xs:mb-2">Submission Failed</h3>
                      <p className="text-gray-700 text-xs xs:text-sm sm:text-base">There was an error submitting your application. Please try again or contact support.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 xs:space-y-7 sm:space-y-8">
                
                {/* Personal Information */}
                <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-white mb-4 xs:mb-5 sm:mb-6" 
                      style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.9)',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                        placeholder="Enter your first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                        placeholder="Enter your last name"
                      />
                    </div>

                    {/* Email (pre-filled) */}
                    <div>
                      <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={currentUser.email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-gray-400 text-xs xs:text-sm mt-1 xs:mt-2">This is your account email and cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-white mb-4 xs:mb-5 sm:mb-6" 
                      style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.9)',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                    Professional Background
                  </h2>

                  {/* Experience */}
                  <div>
                    <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                      Professional Experience *
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 resize-vertical"
                      placeholder="Describe your professional experience, including roles, companies, and key achievements..."
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                      Technical Skills & Technologies *
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 resize-vertical"
                      placeholder="List your technical skills, programming languages, frameworks, tools, and technologies you're proficient in..."
                    />
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                      Portfolio/Website URL
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                </div>

                {/* Motivation & Availability */}
                <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-white mb-4 xs:mb-5 sm:mb-6" 
                      style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.9)',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                    Motivation & Availability
                  </h2>

                  {/* Motivation */}
                  <div>
                    <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                      Why do you want to join our platform? *
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 resize-vertical"
                      placeholder="Tell us why you're interested in joining our platform and what you hope to achieve..."
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-pink-500 font-semibold mb-2 xs:mb-3 text-sm xs:text-base sm:text-lg">
                      Availability for Projects
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-sm xs:text-base text-white focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="" className="bg-gray-900">Select your availability</option>
                      <option value="full-time" className="bg-gray-900">Full-time (40+ hours/week)</option>
                      <option value="part-time" className="bg-gray-900">Part-time (20-39 hours/week)</option>
                      <option value="freelance" className="bg-gray-900">Freelance/Contract (Flexible)</option>
                      <option value="weekends" className="bg-gray-900">Weekends Only</option>
                      <option value="evenings" className="bg-gray-900">Evenings Only</option>
                      <option value="flexible" className="bg-gray-900">Flexible Schedule</option>
                    </select>
                  </div>
                </div>

                {/* Application Guidelines */}
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6">
                  <h3 className="text-pink-500 font-bold text-base xs:text-lg mb-3 xs:mb-4">Application Guidelines</h3>
                  <ul className="text-gray-600 space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
                    <li>• <strong>Be authentic:</strong> Tell us your real story and motivations</li>
                    <li>• <strong>Showcase your skills:</strong> Highlight relevant experience and projects</li>
                    <li>• <strong>Community focus:</strong> We value collaborative and helpful members</li>
                    <li>• <strong>Review process:</strong> Applications are reviewed within 3-5 business days</li>
                    <li>• <strong>Follow up:</strong> You'll receive an email notification about your application status</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4 xs:pt-6 sm:pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.firstName.trim() || !formData.lastName.trim() || !formData.experience.trim() || !formData.motivation.trim()}
                    className="group relative bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 xs:px-8 sm:px-10 md:px-12 py-3 xs:py-4 sm:py-5 md:py-6 rounded-full font-black text-sm xs:text-base sm:text-lg md:text-xl transition-all duration-500 shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    style={{
                      boxShadow: '0 0 40px rgba(34,197,94,0.18), 0 20px 40px rgba(0,0,0,0.3)',
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 xs:mr-3"></div>
                          <span className="hidden xs:inline">Submitting Application...</span>
                          <span className="xs:hidden">Submitting...</span>
                        </>
                      ) : (
                        <>
                          Submit Application
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                  
                  <p className="text-gray-400 text-[10px] xs:text-xs sm:text-sm mt-4 xs:mt-5 sm:mt-6 px-2" 
                     style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    * Required fields. Your application will be reviewed by our team and you'll hear back within 3-5 business days.
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer style={{background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'}} 
              className="text-white py-6 xs:py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-6 xs:mb-8 sm:mb-10 md:mb-12">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                <img 
                  src="/Images/512X512.png" 
                  alt="She Model Tech Logo" 
                  className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 mr-2 xs:mr-2.5 sm:mr-3 md:mr-4 transform"
                />
                <span className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-black" 
                      style={{
                        textShadow: '0 0 20px rgba(34,197,94,0.45), 2px 2px 4px rgba(0,0,0,0.8)',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                  She Model Tech
                </span>
              </div>
              <p className="text-gray-600 text-xs xs:text-sm sm:text-base leading-relaxed max-w-sm mx-auto sm:mx-0"
                 style={{
                   textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                   fontFamily: '"Inter", sans-serif'
                 }}>
                AI-powered career transformation with real projects and badge validation - completely free.
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="text-base xs:text-lg sm:text-xl font-black text-pink-400 mb-3 xs:mb-4 sm:mb-5 md:mb-6"
                  style={{
                    textShadow: '0 0 15px rgba(34,197,94,0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                Quick Links
              </h4>
              <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    Projects
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/career/contact" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    Hire Talents
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
              <h4 className="text-base xs:text-lg sm:text-xl font-black text-pink-400 mb-3 xs:mb-4 sm:mb-5 md:mb-6"
                  style={{
                    textShadow: '0 0 15px rgba(34,197,94,0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                Support & Legal
              </h4>
              <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
                <li>
                  <Link to="/career/support" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/career/about" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/career/terms" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/career/privacy" className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-xs xs:text-sm sm:text-base font-medium"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 xs:pt-5 sm:pt-6 md:pt-8 text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 xs:space-y-4 sm:space-y-0">
              <p className="text-gray-600 text-xs xs:text-sm sm:text-base" 
                 style={{
                   textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                   fontFamily: '"Inter", sans-serif'
                 }}>
                © {new Date().getFullYear()} She Model Tech. All rights reserved.
              </p>

              <div className="flex items-center">
                <span className="text-gray-600 text-xs xs:text-sm font-medium"
                      style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                  Turn your skills into proof. Build real work, earn verified badges, and meet the builders who open doors wherever you're headed next.
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(34,197,94,0.45)); }
          50% { filter: drop-shadow(0 0 40px rgba(34,197,94,0.7)); }
        }
        
        * {
          font-family: 'Inter', sans-serif;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        @media (min-width: 640px) {
          ::-webkit-scrollbar {
            width: 8px;
          }
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.7);
        }

        /* Touch targets for mobile */
        @media (max-width: 768px) {
          button, a, input, textarea, select {
            min-height: 44px;
          }
        }

        /* Prevent horizontal scroll */
        body {
          overflow-x: hidden;
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 374px) {
          h1 {
            font-size: 1.5rem !important;
          }
          
          h2 {
            font-size: 1.25rem !important;
          }
        }

        /* Landscape mobile optimization */
        @media (max-height: 600px) and (orientation: landscape) {
          main {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          
          section {
            margin-bottom: 2rem;
          }
          
          footer {
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmitApplication;
