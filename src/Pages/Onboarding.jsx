// src/Pages/Onboarding.jsx - Account-type-aware onboarding for tech professionals

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';
import SkillPicker from '../components/SkillPicker';
import { INDUSTRY_TRACKS } from '../utils/industryTracks';

const BLOCKED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
  'fastmail.com',
  'tutanota.com',
];

const isBusinessEmail = (email) => {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !BLOCKED_EMAIL_DOMAINS.includes(domain);
};

const Onboarding = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    experienceLevel: '', // 'beginner' | 'intermediate' | 'advanced' | 'expert'
    primarySkillTrack: '', // TechPO, TechQA, TechDev, TechLeads, TechArchs, TechGuard, others, notsure
    highestEducation: '', // high_school | undergrad | masters | phd
    specialization: '',
    skillsList: [],
    yearsOfExperience: '',
    country: '',
    city: '',
    state: '',
    interests: [],
    industryInterests: [],
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    companyName: '',
    companyWebsite: '',
    companyEmail: '',
    companyLocation: '',
    companyDescription: '',
  });

  const experienceLevels = [
    {
      id: 'beginner',
      label: 'Beginner',
      desc: 'Just getting started in tech, learning fundamentals',
    },
    { id: 'intermediate', label: 'Intermediate', desc: '1-3 years of experience, building skills' },
    { id: 'advanced', label: 'Advanced', desc: '3-7 years of experience, strong contributor' },
    { id: 'expert', label: 'Expert', desc: '7+ years of experience, leading and mentoring' },
  ];

  const skillTracks = [
    { id: 'TechDev', label: 'Coding Developer', desc: 'Frontend, backend, mobile, full-stack' },
    {
      id: 'TechArchs',
      label: 'Low/No-Code Developer',
      desc: 'Build with low-code and no-code platforms',
    },
    { id: 'TechQA', label: 'Quality Tester', desc: 'Testing, reviews, quality control' },
    { id: 'TechGuard', label: 'Network & Cybersecurity', desc: 'Security, cloud, DevOps' },
    {
      id: 'TechPO',
      label: 'Product / Project Owner',
      desc: 'Own product vision, requirements, and backlog',
    },
    {
      id: 'TechLeads',
      label: 'Non-Technical Roles',
      desc: 'Management, writing, research, coordination',
    },
    { id: 'others', label: 'Others', desc: 'A tech role not listed here' },
    { id: 'notsure', label: 'Not sure yet', desc: 'Help me discover the right track' },
  ];

  const educationLevels = [
    { id: 'high_school', label: 'High School' },
    { id: 'undergrad', label: 'Undergraduate' },
    { id: 'masters', label: "Master's" },
    { id: 'phd', label: 'PhD' },
  ];

  const individualInterests = [
    { id: 'projects', label: 'Projects', desc: 'Join real-world collaborative projects' },
    { id: 'jobs', label: 'Jobs', desc: 'Full-time, freelance, and contract roles' },
    { id: 'community', label: 'Community', desc: 'Connect with tech professionals' },
    { id: 'badges', label: 'Badges', desc: 'Earn verified TechTalent credentials' },
  ];

  const companyInterests = [
    { id: 'community', label: 'Community', desc: 'Engage with the tech community' },
    { id: 'directory', label: 'Talent Board', desc: 'Discover and recruit verified talent' },
  ];

  const isCompany = accountType === 'company';
  const TOTAL_STEPS = isCompany ? 4 : 4;

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({ ...prev, displayName: currentUser.displayName || '' }));
    }
  }, [currentUser]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!currentUser) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.onboardingComplete) {
            navigate('/dashboard', { replace: true });
            return;
          }
          if (!data.accountType) {
            navigate('/account-type', { replace: true });
            return;
          }
          setAccountType(data.accountType);
        } else {
          navigate('/account-type', { replace: true });
          return;
        }
      } catch (e) {
        console.error('Error checking onboarding:', e);
      }
      setLoading(false);
    };
    checkStatus();
  }, [currentUser, navigate]);

  const toggleInterest = (id) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleNext = () => {
    if (isCompany) {
      if (step === 1 && !formData.displayName.trim()) {
        toast.error('Please enter your name');
        return;
      }
      if (step === 2) {
        if (!formData.companyName.trim()) {
          toast.error('Please enter your company name');
          return;
        }
        if (!formData.companyEmail.trim()) {
          toast.error('Please enter your business email');
          return;
        }
        if (!isBusinessEmail(formData.companyEmail)) {
          toast.error('Please use a business email (not Gmail, Yahoo, Outlook, etc.)');
          return;
        }
      }
      if (step === 3 && !formData.country.trim()) {
        toast.error('Please enter your current country');
        return;
      }
      // interests optional now: shown on profile, editable later
    } else {
      // Individual: step 1=experience level, 2=name/profile/links, 3=location, 4=interests
      if (step === 1 && !formData.experienceLevel) {
        toast.error('Please select your experience level');
        return;
      }
      if (step === 2) {
        if (!formData.displayName.trim()) {
          toast.error('Please enter your name');
          return;
        }
        if (!formData.primarySkillTrack) {
          toast.error('Please select your track');
          return;
        }
        if (!formData.highestEducation) {
          toast.error('Please select your highest level of education');
          return;
        }
        if (!formData.specialization.trim()) {
          toast.error('Please enter your course of study or area of concentration');
          return;
        }
        if (!formData.skillsList?.length) {
          toast.error('Pick at least one skill, or type your own');
          return;
        }
      }
      if (step === 3 && !formData.country.trim()) {
        toast.error('Please enter your current country');
        return;
      }
      // interests optional now: shown on profile, editable later
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      // Allow changing account type before onboarding is complete.
      navigate('/account-type');
      return;
    }
    setStep((s) => s - 1);
  };

  const handleComplete = async () => {
    if (isCompany) {
      if (!formData.companyName.trim()) {
        toast.error('Please enter your company name');
        return;
      }
      if (!formData.companyEmail.trim()) {
        toast.error('Please enter your business email');
        return;
      }
      if (!isBusinessEmail(formData.companyEmail)) {
        toast.error('Please use a business email (not Gmail, Yahoo, Outlook, etc.)');
        return;
      }
    }
    try {
      await saveOnboarding();
    } catch (err) {
      console.error('Error completing onboarding:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const saveOnboarding = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const updateData = {
        displayName: formData.displayName.trim() || currentUser.displayName || '',
        country: formData.country.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        interests: formData.interests,
        industryInterests: formData.industryInterests,
        isCompany: isCompany,
        onboardingComplete: true,
        onboardingSkipped: false,
        onboardingCompletedAt: new Date(),
        profileComplete: true,
      };
      if (isCompany) {
        updateData.companyProfile = {
          companyName: formData.companyName.trim(),
          companyWebsite: formData.companyWebsite.trim() || null,
          companyEmail: formData.companyEmail.trim(),
          companyLocation: formData.companyLocation.trim() || null,
          companyDescription: formData.companyDescription.trim() || null,
          verifiedAt: null,
          createdAt: new Date(),
        };
      } else {
        updateData.experienceLevel = formData.experienceLevel || null;
        updateData.primarySkillTrack = formData.primarySkillTrack || null;
        updateData.highestEducation = formData.highestEducation || null;
        updateData.specialization = formData.specialization.trim() || null;
        // Skills come from the picker, so they are already consistent. Store
        // the lowercase array for matching/filtering and the display list as
        // chosen, rather than re-parsing free text.
        updateData.skills = (formData.skillsList || [])
          .map((x) => x.trim().toLowerCase())
          .filter(Boolean);
        updateData.skillsList = formData.skillsList || [];
        updateData.skillsText = (formData.skillsList || []).join(', ') || null;
        updateData.yearsOfExperience = formData.yearsOfExperience || null;
        updateData.portfolioUrl = formData.portfolioUrl.trim() || null;
        updateData.linkedinUrl = formData.linkedinUrl.trim() || null;
        updateData.githubUrl = formData.githubUrl.trim() || null;
      }
      await updateDoc(doc(db, 'users', currentUser.uid), updateData);
      toast.success('Welcome to She Model Tech!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const progress = (step / TOTAL_STEPS) * 100;
  const inputClass =
    'w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 min-h-[44px] text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none text-sm transition-all';
  const labelClass = 'block text-pink-600 font-semibold mb-2 text-sm';

  const renderIndividualStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                What is your experience level?
              </h2>
              <p className="text-gray-500 text-sm">
                This helps us match you with the right projects and resources.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experienceLevels.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, experienceLevel: option.id }))}
                  className={`p-5 rounded-xl border-2 text-left transition-all duration-200 active:scale-[0.97] ${
                    formData.experienceLevel === option.id
                      ? 'border-pink-500 bg-pink-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`text-base font-bold mb-1 ${formData.experienceLevel === option.id ? 'text-gray-900' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </div>
                  <div className="text-gray-500 text-xs">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                Your Profile
              </h2>
              <p className="text-gray-500 text-sm">This takes less than a minute.</p>
            </div>
            <div>
              <label className={labelClass}>Your Name *</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData((p) => ({ ...p, displayName: e.target.value }))}
                className={inputClass}
                placeholder="Enter your full name"
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>Your Track *</label>
              <select
                value={formData.primarySkillTrack}
                onChange={(e) => setFormData((p) => ({ ...p, primarySkillTrack: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select your track</option>
                {skillTracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} - {t.desc}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                We use this to match you with projects that fit you. Not sure? Pick "Not sure yet"
                and we'll help you discover one.
              </p>
            </div>
            <div>
              <label className={labelClass}>Highest Level of Education *</label>
              <select
                value={formData.highestEducation}
                onChange={(e) => setFormData((p) => ({ ...p, highestEducation: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select your education level</option>
                {educationLevels.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This helps us guide you to the right tech track.
              </p>
            </div>
            <div>
              <label className={labelClass}>Course of Study *</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData((p) => ({ ...p, specialization: e.target.value }))}
                className={inputClass}
                placeholder="e.g., Computer Science, Chemistry, Business"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your field of study. If you're in high school, your area of concentration.
              </p>
            </div>
            <div>
              <label className={labelClass}>Your skills *</label>
              <p className="text-xs text-gray-500 mb-2">
                Pick what you can already do. Non-technical strengths count too, and if something is
                missing you can type it in.
              </p>
              <SkillPicker
                value={formData.skillsList}
                onChange={(list) => setFormData((p) => ({ ...p, skillsList: list }))}
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData((p) => ({ ...p, linkedinUrl: e.target.value }))}
                className={inputClass}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData((p) => ({ ...p, githubUrl: e.target.value }))}
                className={inputClass}
                placeholder="https://github.com/your-username"
              />
            </div>
            <div>
              <label className={labelClass}>Portfolio URL</label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData((p) => ({ ...p, portfolioUrl: e.target.value }))}
                className={inputClass}
                placeholder="https://your-portfolio.com"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                Where are you based?
              </h2>
              <p className="text-gray-500 text-sm">
                Your country helps recruiters know where you can work from. Remote opportunities are
                open to everyone.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g., Nigeria, India, United States"
                  autoFocus
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g., Lagos"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>State / Region</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g., Lagos State"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                What are you looking for?
              </h2>
              <p className="text-gray-500 text-sm">
                Select all that apply. You can always explore everything.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {individualInterests.map((option) => {
                const sel = formData.interests.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleInterest(option.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 active:scale-[0.97] ${
                      sel
                        ? 'border-pink-500 bg-pink-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`text-base font-bold mb-1 ${sel ? 'text-gray-900' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </div>
                    <div className="text-gray-500 text-xs">{option.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Topical interests: which industries excite them. Optional, powers
                project matching and AI recommendations. */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Which industries interest you?
              </h3>
              <p className="text-gray-500 text-xs mb-3">
                Optional. We'll use this to recommend projects you'll actually enjoy.
              </p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_TRACKS.map((t) => {
                  const sel = formData.industryInterests.includes(t.value);
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          industryInterests: p.industryInterests.includes(t.value)
                            ? p.industryInterests.filter((i) => i !== t.value)
                            : [...p.industryInterests, t.value],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all active:scale-95 ${
                        sel
                          ? 'border-pink-500 bg-pink-600 text-white'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-pink-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCompanyStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                Welcome!
              </h2>
              <p className="text-gray-500 text-sm">
                Let's set up your company profile. This takes less than a minute.
              </p>
            </div>
            <div>
              <label className={labelClass}>Your Name *</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData((p) => ({ ...p, displayName: e.target.value }))}
                className={inputClass}
                placeholder="Enter your full name"
                autoFocus
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                Company Details
              </h2>
              <p className="text-gray-500 text-sm">Tell us about your organization.</p>
            </div>
            <div>
              <label className={labelClass}>Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                className={inputClass}
                placeholder="e.g., TechStart Inc."
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>Business Email *</label>
              <input
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData((p) => ({ ...p, companyEmail: e.target.value }))}
                className={`${inputClass} ${formData.companyEmail && !isBusinessEmail(formData.companyEmail) ? 'border-red-400 focus:border-red-500' : ''}`}
                placeholder="you@company.com"
              />
              {formData.companyEmail && !isBusinessEmail(formData.companyEmail) && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">
                  Please use a business email -- Gmail, Yahoo, Outlook, etc. are not accepted.
                </p>
              )}
              <p className="text-gray-400 text-xs mt-1">
                Must be a company domain (not Gmail, Yahoo, Outlook, etc.)
              </p>
            </div>
            <div>
              <label className={labelClass}>Company Website</label>
              <input
                type="url"
                value={formData.companyWebsite}
                onChange={(e) => setFormData((p) => ({ ...p, companyWebsite: e.target.value }))}
                className={inputClass}
                placeholder="https://company.com"
              />
            </div>
            <div>
              <label className={labelClass}>Brief Description</label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => setFormData((p) => ({ ...p, companyDescription: e.target.value }))}
                className={inputClass + ' resize-none'}
                rows="3"
                placeholder="What does your company do? (optional)"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                Where is your company based?
              </h2>
              <p className="text-gray-500 text-sm">
                Helps professionals find opportunities near them.
              </p>
            </div>
            <div>
              <label className={labelClass}>Country *</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                className={inputClass}
                placeholder="e.g., Nigeria, India, United States"
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>Company Location</label>
              <input
                type="text"
                value={formData.companyLocation}
                onChange={(e) => setFormData((p) => ({ ...p, companyLocation: e.target.value }))}
                className={inputClass}
                placeholder="e.g., Lagos or Remote"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g., Baltimore"
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g., MD"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                What will you use She Model Tech for?
              </h2>
              <p className="text-gray-500 text-sm">Select all that apply.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {companyInterests.map((option) => {
                const sel = formData.interests.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleInterest(option.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 active:scale-[0.97] ${
                      sel
                        ? 'border-pink-500 bg-pink-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`text-base font-bold mb-1 ${sel ? 'text-gray-900' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </div>
                    <div className="text-gray-500 text-xs">{option.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-white">
      <div className="flex items-center gap-2 mb-8">
        <img
          src="/Images/512X512.png"
          alt="She Model Tech"
          className="w-8 h-8"
          onError={(e) => (e.target.style.display = 'none')}
        />
        <span className="text-gray-900 font-extrabold text-xl sm:text-2xl">She Model Tech</span>
      </div>

      <div className="mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
            isCompany
              ? 'bg-pink-50 text-pink-600 border-pink-200'
              : 'bg-pink-50 text-pink-600 border-pink-200'
          }`}
        >
          {isCompany ? 'Company Account' : 'Individual Account'}
        </span>
      </div>

      <div className="w-full max-w-lg mx-4 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="w-full h-1 bg-gray-100">
          <div
            className="h-full bg-pink-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          {isCompany ? renderCompanyStep() : renderIndividualStep()}

          <div className="flex mt-8 gap-3 justify-between">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 min-h-[44px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
              >
                Back
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 min-h-[44px] text-gray-500 hover:text-gray-700 font-semibold rounded-xl text-sm transition-all"
                title="Choose a different account type"
              >
                ← Change account type
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                className="px-8 py-2.5 min-h-[44px] bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="px-8 py-2.5 min-h-[44px] bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Setting up...
                  </span>
                ) : (
                  'Get Started'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${i + 1 === step ? 'w-6 h-2 bg-pink-600' : i + 1 < step ? 'w-2 h-2 bg-pink-400' : 'w-2 h-2 bg-gray-200'}`}
          />
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-4">
        {new Date().getFullYear()} She Model Tech. All rights reserved.
      </p>
    </div>
  );
};

export default Onboarding;
