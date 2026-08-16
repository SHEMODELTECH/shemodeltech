// src/Pages/PostJobs.jsx - Post a Job

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';
import usePosterName from '../hooks/usePosterName';

const PostJobs = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const isEditing = !!jobId;
  const { currentUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalLink: '',
    companyName: '',
    posterName: '',
    posterEmail: '',
    posterPhone: '',
    tags: '',
    requirements: '',
    category: 'job',
    jobType: '',
    deadline: '',
    salaryRange: '',
    location: '',
    workAuth: '', // required: 'provided' or 'required' (candidate must have own)
    expirationOption: '30',
    customExpirationDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { posterName: profilePosterName, isCompany: profileIsCompany } = usePosterName(currentUser);

  const jobTypes = [
    { id: 'full-time', label: 'Full-time', description: 'Permanent, full-time position' },
    { id: 'part-time', label: 'Part-time', description: 'Ongoing, part-time hours' },
    { id: 'contract', label: 'Contract', description: 'Fixed-term contract role' },
    { id: 'freelance', label: 'Freelance', description: 'Project-based freelance work' },
    { id: 'internship', label: 'Internship', description: 'Internship opportunity' },
    { id: 'remote', label: 'Virtual / Online', description: 'Fully remote, work from anywhere' },
  ];

  const categories = [
    { id: 'job',         label: 'Job',         description: 'A paid role, full or part-time' },
    { id: 'freelance',   label: 'Freelance',   description: 'Project-based or contract work' },
    { id: 'scholarship', label: 'Scholarship', description: 'Funding to study or train' },
    { id: 'grant',       label: 'Grant',       description: 'Funding for research or a project' },
    { id: 'partnership', label: 'Partnership', description: 'Co-founder, partner, or team-up' },
  ];

  const expirationOptions = [
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: 'custom', label: 'Custom date' },
    { value: 'never', label: 'Never expires' },
  ];

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login', { replace: true, state: { from: '/jobs/post', message: 'Please sign in to post a job' } });
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    if (currentUser && !formData.posterEmail) {
      setFormData(prev => ({
        ...prev,
        posterEmail: currentUser.email || '',
        posterName: profilePosterName || currentUser.displayName || '',
        companyName: profileIsCompany ? profilePosterName : prev.companyName,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profilePosterName, profileIsCompany]);

  // Edit mode: load the existing job and prefill the form (only the owner may edit).
  useEffect(() => {
    if (!jobId || !currentUser) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'hub_posts', jobId));
        if (!snap.exists()) { toast.error('That job post no longer exists.'); navigate('/jobs'); return; }
        const j = snap.data();
        if (j.posterId !== currentUser.uid) { toast.error('You can only edit your own job posts.'); navigate('/jobs'); return; }
        setFormData(prev => ({
          ...prev,
          title: j.title || '',
          description: j.description || '',
          externalLink: j.externalLink || '',
          companyName: j.companyName || '',
          posterName: j.posterName || '',
          posterEmail: j.posterEmail || '',
          posterPhone: j.posterPhone || '',
          tags: Array.isArray(j.tags) ? j.tags.join(', ') : (j.tags || ''),
          requirements: j.requirements || '',
          category: j.category || 'job',
          jobType: j.jobType || '',
          deadline: j.deadline || '',
          salaryRange: j.salaryRange || '',
          location: j.location || '',
          workAuth: j.workAuth || '',
          expirationOption: j.expirationOption || '30',
          customExpirationDate: (j.expirationOption === 'custom' && j.expiresAt && typeof j.expiresAt.toDate === 'function')
            ? j.expiresAt.toDate().toISOString().slice(0, 10)
            : '',
        }));
      } catch (e) {
        console.error('Could not load job for editing:', e);
        toast.error('Could not load this job.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateUrl = (url) => {
    if (!url) { setUrlError('Application link is required'); return false; }
    const urlPattern = /^https?:\/\/(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(url)) { setUrlError('Please enter a valid URL (e.g., https://example.com)'); return false; }
    setUrlError('');
    return true;
  };

  const validatePhone = (phone) => {
    if (!phone) { setPhoneError(''); return true; }
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    if (!phonePattern.test(phone)) { setPhoneError('Please enter a valid phone number'); return false; }
    setPhoneError('');
    return true;
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, externalLink: url }));
    validateUrl(url);
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData(prev => ({ ...prev, posterPhone: phone }));
    validatePhone(phone);
  };

  const validateForm = () => {
    const errors = [];
    if ((formData.category === 'job' || formData.category === 'freelance') && !formData.jobType) errors.push('Job type is required');
    if (!formData.workAuth) errors.push('Please indicate whether work authorization is provided');
    if (!formData.title.trim()) errors.push('Job title is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!validateUrl(formData.externalLink)) errors.push('Valid application link is required');
    if (!formData.posterName.trim()) errors.push('Your name is required');
    if (!formData.posterEmail.trim()) errors.push('Your email is required');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.posterEmail && !emailRegex.test(formData.posterEmail)) errors.push('Please enter a valid email address');
    if (formData.posterPhone && !validatePhone(formData.posterPhone)) errors.push('Please enter a valid phone number');
    if (formData.expirationOption === 'custom' && !formData.customExpirationDate) errors.push('Please select a custom expiration date');
    return errors;
  };

  const calculateExpirationDate = () => {
    if (formData.expirationOption === 'never') return null;
    if (formData.expirationOption === 'custom') return new Date(formData.customExpirationDate);
    const days = parseInt(formData.expirationOption);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!currentUser) {
      toast.error('Please sign in to post a job');
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(`Please fix: ${errors[0]}`);
      setIsSubmitting(false);
      return;
    }

    // Edit mode: update the existing post in place (doesn't count against the
    // monthly job-post quota).
    if (isEditing) {
      try {
        const expirationDate = calculateExpirationDate();
        await updateDoc(doc(db, 'hub_posts', jobId), {
          category: formData.category,
          jobType: formData.jobType,
          deadline: formData.deadline || null,
          title: formData.title.trim(),
          description: formData.description.trim(),
          externalLink: formData.externalLink.trim(),
          companyName: formData.companyName.trim() || null,
          salaryRange: formData.salaryRange.trim() || null,
          location: formData.location.trim() || null,
          workAuth: formData.workAuth,
          workAuthProvided: formData.workAuth === 'provided',
          posterName: formData.posterName.trim(),
          posterEmail: formData.posterEmail.trim(),
          posterPhone: formData.posterPhone.trim() || null,
          tags: formData.tags.trim() ? formData.tags.trim().split(',').map(t => t.trim()) : [],
          requirements: formData.requirements.trim() || null,
          expiresAt: expirationDate,
          expirationOption: formData.expirationOption,
          updatedAt: serverTimestamp(),
        });
        toast.success('Job updated successfully!');
        setTimeout(() => navigate('/jobs'), 1200);
      } catch (error) {
        console.error('Error updating job post:', error);
        toast.error('Error updating job: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Job posting is unlimited for everyone - no quota check.

    try {
      const expirationDate = calculateExpirationDate();

      await addDoc(collection(db, 'hub_posts'), {
        category: 'job',
        category: formData.category,
        jobType: formData.jobType,
        deadline: formData.deadline || null,
        title: formData.title.trim(),
        description: formData.description.trim(),
        externalLink: formData.externalLink.trim(),
        companyName: formData.companyName.trim() || null,
        salaryRange: formData.salaryRange.trim() || null,
        location: formData.location.trim() || null,
        workAuth: formData.workAuth,
        workAuthProvided: formData.workAuth === 'provided',
        posterName: formData.posterName.trim(),
        posterEmail: formData.posterEmail.trim(),
        posterPhone: formData.posterPhone.trim() || null,
        posterId: currentUser.uid,
        isCompanyPost: profileIsCompany,
        tags: formData.tags.trim() ? formData.tags.trim().split(',').map(t => t.trim()) : [],
        requirements: formData.requirements.trim() || null,
        status: 'active',
        isActive: true,
        isFeatured: false,
        expiresAt: expirationDate,
        expirationOption: formData.expirationOption,
        viewCount: 0,
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        submissionSource: 'web_form',
      });

      // Mark this user as a recruiter for outreach purposes (posted a job).
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { hasPostedJob: true });
      } catch (flagErr) {
        console.error('Could not set hasPostedJob flag:', flagErr);
      }

      toast.success('Job posted successfully!');
      setTimeout(() => navigate('/jobs'), 1500);

    } catch (error) {
      console.error('Error creating job post:', error);
      toast.error('Error posting job: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const inputClass = "w-full bg-white border border-gray-300 rounded-xl px-4 py-3 min-h-[44px] text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm transition-all";
  const labelClass = "block text-orange-400 font-semibold mb-2 text-sm";

  if (authLoading || !currentUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

            {/* Header */}
            <section className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
                {isEditing ? 'Edit your ' : 'Post an '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Opportunity</span>
              </h1>
              <p className="text-gray-600 text-base">{isEditing ? 'Update the details of your job listing and save your changes.' : 'Reach verified women in tech who have already shipped real projects'}</p>
            </section>

            {/* Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-300 p-4 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Category */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Category *</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                        className={`p-4 rounded-xl border-2 text-left ${
                          formData.category === cat.id
                            ? 'border-orange-400 bg-orange-500/20'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-gray-900 font-bold mb-1 text-sm">{cat.label}</div>
                        <div className="text-gray-500 text-xs">{cat.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Type - only for jobs and freelance */}
                {(formData.category === 'job' || formData.category === 'freelance') && (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Job Type *</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {jobTypes.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, jobType: type.id }))}
                        className={`p-4 rounded-xl border-2 text-left ${
                          formData.jobType === type.id
                            ? 'border-orange-400 bg-orange-500/20'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-gray-900 font-bold mb-1 text-sm">{type.label}</div>
                        <div className="text-gray-500 text-xs">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {/* Application deadline - for scholarships, grants, partnerships */}
                {(formData.category === 'scholarship' || formData.category === 'grant' || formData.category === 'partnership') && (
                  <div>
                    <label className={labelClass}>Application deadline (optional)</label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className={inputClass} />
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Job Details</h2>

                  <div>
                    <label className={labelClass}>Job Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={inputClass} placeholder="e.g., Software Engineer, Marketing Intern" />
                  </div>

                  <div>
                    <label className={labelClass}>Company / Organization</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={inputClass} placeholder="Enter company or organization name" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={inputClass} placeholder="e.g., Remote, New York, NY" />
                    </div>
                    <div>
                      <label className={labelClass}>Salary / Compensation</label>
                      <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleInputChange} className={inputClass} placeholder="e.g., $50k–$70k / year" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Work authorization for this role *</label>
                    <p className="text-gray-500 text-xs mb-2">Will work authorization (e.g. visa/sponsorship) be provided, must the candidate already have their own, or is it not required (e.g. quick freelance/remote work)?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, workAuth: 'provided' }))}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          formData.workAuth === 'provided'
                            ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-gray-900 text-sm font-semibold">Visa/sponsorship provided</div>
                        <div className="text-gray-500 text-xs mt-0.5">Work authorization will be provided for this role.</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, workAuth: 'required' }))}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          formData.workAuth === 'required'
                            ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-gray-900 text-sm font-semibold">Must be authorized to work</div>
                        <div className="text-gray-500 text-xs mt-0.5">Candidate must already have work authorization.</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, workAuth: 'not_required' }))}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          formData.workAuth === 'not_required'
                            ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-gray-900 text-sm font-semibold">Work authorization not required</div>
                        <div className="text-gray-500 text-xs mt-0.5">Not a factor - e.g. quick freelance or remote work.</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="5" className={inputClass + " resize-none"} placeholder="Describe the role, responsibilities, and what you're looking for..." />
                  </div>

                  <div>
                    <label className={labelClass}>Requirements</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows="3" className={inputClass + " resize-none"} placeholder="List qualifications, experience, or skills required..." />
                  </div>

                  <div>
                    <label className={labelClass}>Application Link *</label>
                    <input
                      type="url"
                      name="externalLink"
                      value={formData.externalLink}
                      onChange={handleUrlChange}
                      required
                      className={`w-full bg-white border ${urlError ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm`}
                      placeholder="https://example.com/careers/apply"
                    />
                    {urlError && <p className="text-red-400 text-xs mt-1.5">{urlError}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                    <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className={inputClass} placeholder="e.g., React, Python, Remote, Entry-level" />
                  </div>
                </div>

                {/* Your Info */}
                <div className="space-y-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Contact Info</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Your Name *</label>
                      <input type="text" name="posterName" value={formData.posterName} onChange={handleInputChange} required className={inputClass} placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className={labelClass}>Your Email *</label>
                      <input type="email" name="posterEmail" value={formData.posterEmail} onChange={handleInputChange} required className={inputClass} placeholder="your.email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="tel"
                      name="posterPhone"
                      value={formData.posterPhone}
                      onChange={handlePhoneChange}
                      className={`w-full bg-white border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {phoneError && <p className="text-red-400 text-xs mt-1.5">{phoneError}</p>}
                  </div>
                </div>

                {/* Expiration */}
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Listing Duration</h2>
                  <div>
                    <label className={labelClass}>When should this listing expire?</label>
                    <select name="expirationOption" value={formData.expirationOption} onChange={handleInputChange} className={inputClass}>
                      {expirationOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  {formData.expirationOption === 'custom' && (
                    <div>
                      <label className={labelClass}>Expiration Date *</label>
                      <input type="date" name="customExpirationDate" value={formData.customExpirationDate} onChange={handleInputChange} required min={getMinDate()} className={inputClass} />
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !!urlError || !!phoneError}
                    className="px-8 sm:px-12 py-4 w-full sm:w-auto bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white font-black text-base sm:text-lg rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed "
                    style={{}}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        {isEditing ? 'Saving...' : 'Posting...'}
                      </span>
                    ) : (isEditing ? 'Save Changes' : 'Post Opportunity')}
                  </button>
                  <p className="text-gray-400 text-xs mt-3">* Required fields. Your listing will be visible immediately.</p>
                </div>

              </form>
            </div>
        <style jsx>{`
          select option { background-color: #111; color: white; }
        `}</style>
      </div>
  );
};

export default PostJobs;
