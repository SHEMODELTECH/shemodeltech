// src/Pages/projects/ProjectSubmission.jsx - Post a collaborative project
//
// MEMBERS POST COLLABORATIVE PROJECTS ONLY.
// The paid-project option was removed: member-to-member payment made this a
// freelancer marketplace and put us in the middle of disputes we had no
// leverage to resolve. Paid work now comes from companies only, either as a
// sponsored cohort or a company-hosted project, where a subscription gives us
// real recourse if someone isn't paid.
// Company accounts are redirected to /company/host-cohort.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import usePosterName from '../../hooks/usePosterName';
import { checkProfileComplete } from '../../utils/profileCompletion';
import {
  ROLE_TEMPLATES,
  MIN_TEAM_SIZE,
  MIN_MEMBERS,
  rolesMeetMinTeamSize,
  MIN_TEAM_SIZE_ROLES_ERROR,
} from '../../utils/projectRoles';

const industryTracks = [
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'finance', label: 'Finance / Fintech' },
  { value: 'education', label: 'Education' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'entertainment', label: 'Entertainment / Media' },
  { value: 'government', label: 'Government' },
  { value: 'technology', label: 'Technology / Software / SaaS' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'transportation', label: 'Transportation / Logistics' },
  { value: 'realestate', label: 'Real Estate / PropTech' },
  { value: 'energy', label: 'Energy / Utilities' },
  { value: 'agriculture', label: 'Agriculture / AgTech' },
  { value: 'manufacturing', label: 'Manufacturing / Industrial' },
  { value: 'legal', label: 'Legal Tech' },
  { value: 'nonprofit', label: 'Non-Profit / Social Impact' },
  { value: 'travel', label: 'Travel / Hospitality' },
  { value: 'sports', label: 'Sports / Fitness' },
  { value: 'food', label: 'Food / Beverage' },
  { value: 'fashion', label: 'Fashion / Retail' },
  { value: 'construction', label: 'Construction / Infrastructure' },
  { value: 'marketing', label: 'Marketing / Advertising' },
];

const timelineOptions = [
  { value: '1-week', label: '1 Week' },
  { value: '2-weeks', label: '2 Weeks' },
  { value: '1-month', label: '1 Month' },
  { value: '2-3-months', label: '2-3 Months' },
  { value: '3-6-months', label: '3-6 Months' },
  { value: '6-months-plus', label: '6+ Months' },
  { value: 'flexible', label: 'Flexible' },
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'any-level', label: 'Any Level' },
];

// Shared with the project edit page (ProjectSetup) via src/utils/projectRoles.js
const roleTemplates = ROLE_TEMPLATES;

const ProjectSubmission = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const { posterName: profilePosterName, isCompany: profileIsCompany } = usePosterName(currentUser);

  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    industryTrack: '',
    timeline: '',
    startDate: '',
    endDate: '',
    projectGoals: '',
    experienceLevel: '',
    contactEmail: '',
    contactName: '',
    companyName: '',
    submissionUrl: '',
    projectLink: '',
    // Pricing
  });

  // Team roles - dynamic list
  const [teamRoles, setTeamRoles] = useState([
    {
      role: '',
      customRole: '',
      skills: '',
      count: 1,
      experienceLevel: 'any-level',
      description: '',
      detailsLink: '',
      payAmount: '',
    },
  ]);

  // Members post COLLABORATIVE projects only. Paid work comes from companies:
  // a sponsored cohort or a company-hosted project. Member-to-member payment
  // would make us a freelancer marketplace and put us in the middle of
  // disputes we have no leverage to resolve; a company at least holds a
  // subscription that can be revoked.

  const [userProfile, setUserProfile] = useState(null);
  const posterIsCompany = !!userProfile?.isCompany;

  // Company accounts no longer post paid projects here - that made us look
  // like a freelancer marketplace. A company runs its own COHORT instead
  // (it owns the brief, hires every role, reviews its own applicants, pays
  // members directly, and awards no badges). Send them there.
  useEffect(() => {
    if (posterIsCompany) {
      navigate('/company/host-cohort', { replace: true });
    }
  }, [posterIsCompany, navigate]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileGate, setProfileGate] = useState({ checked: false, complete: true, missing: [] });

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login', {
        replace: true,
        state: { from: '/projects/submit', message: 'Please sign in to post a project' },
      });
    }
  }, [currentUser, authLoading, navigate]);

  // Require a complete profile before posting a project
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((snap) => {
        const data = snap.exists() ? snap.data() : null;
        setUserProfile(data);
        const result = checkProfileComplete(data);
        setProfileGate({ checked: true, ...result });
      })
      .catch(() => setProfileGate({ checked: true, complete: true, missing: [] }));
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && !formData.contactEmail) {
      setFormData((prev) => ({
        ...prev,
        contactEmail: currentUser.email || '',
        contactName: profilePosterName || currentUser.displayName || '',
        companyName: profileIsCompany ? profilePosterName : prev.companyName,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profilePosterName, profileIsCompany]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (index, field, value) => {
    setTeamRoles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addRole = () => {
    if (teamRoles.length < 10) {
      setTeamRoles((prev) => [
        ...prev,
        {
          role: '',
          customRole: '',
          skills: '',
          count: 1,
          experienceLevel: 'any-level',
          description: '',
          detailsLink: '',
          payAmount: '',
        },
      ]);
    }
  };

  const removeRole = (index) => {
    if (teamRoles.length > 1) {
      setTeamRoles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const totalTeamSize = teamRoles.reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);

  const validateForm = () => {
    const errors = [];
    if (!formData.projectTitle.trim()) errors.push('Project title is required');
    if (!formData.projectDescription.trim()) errors.push('Project description is required');
    if (!formData.industryTrack) errors.push('Industry track is required');
    if (!formData.timeline) errors.push('Timeline is required');
    if (!formData.startDate) errors.push('Start date is required');
    if (!formData.endDate) errors.push('End date is required');
    if (!formData.contactEmail.trim()) errors.push('Contact email is required');
    if (!formData.submissionUrl.trim()) errors.push('Project submission link is required');
    if (!formData.projectLink.trim()) errors.push('Project link (full description) is required');

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) errors.push('Start date cannot be in the past');
      if (end <= start) errors.push('End date must be after the start date');
    }

    const validRoles = teamRoles.filter((r) => r.role.trim());
    if (validRoles.length === 0) errors.push('At least one team role is required');
    for (const r of validRoles) {
      if (!r.skills.trim()) errors.push(`Skills required for "${r.role}" role`);
      if (!r.count || r.count < 1)
        errors.push(`Number of people for "${r.role}" must be at least 1`);
    }
    // No solo projects: the roles must offer enough seats for a real team
    // (you count as one person, so the roles cover everyone else).
    if (validRoles.length > 0 && !rolesMeetMinTeamSize(validRoles)) {
      errors.push(MIN_TEAM_SIZE_ROLES_ERROR);
    }

    // At least one open role (Beginner / Any Level) so newcomers always have
    // a way in. This is the point of collaborative projects.
    {
      const hasOpenRole = validRoles.some((r) => {
        const lvl = (r.experienceLevel || 'any-level').toLowerCase();
        return lvl === 'any-level' || lvl === 'beginner' || lvl === '';
      });
      if (validRoles.length > 0 && !hasOpenRole) {
        errors.push('Add at least one Beginner or Any Level role so newcomers can join.');
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!currentUser) {
      toast.error('Please sign in to post a project');
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    // Require a complete profile before creating a project
    try {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      const { complete } = checkProfileComplete(snap.exists() ? snap.data() : null);
      if (!complete) {
        toast.error('Please complete your profile before posting a project.');
        setIsSubmitting(false);
        navigate('/settings?tab=profile');
        return;
      }
    } catch (e) {
      console.log('Profile check skipped:', e.message);
    }

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      setIsSubmitting(false);
      return;
    }

    try {
      // Check for duplicate project name
      try {
        const dupQ = query(
          collection(db, 'projects'),
          where('projectTitle', '==', formData.projectTitle.trim())
        );
        const dupSnap = await getDocs(dupQ);
        if (!dupSnap.empty) {
          toast.error('A project with this name already exists. Please choose a different title.');
          setIsSubmitting(false);
          return;
        }
      } catch (e) {
        console.log('Duplicate check skipped:', e.message);
      }

      const validRoles = teamRoles
        .filter((r) => (r.role === '__other__' ? r.customRole?.trim() : r.role.trim()))
        .map((r) => ({
          role: r.role === '__other__' ? r.customRole.trim() : r.role.trim(),
          skills: r.skills.trim(),
          count: parseInt(r.count) || 1,
          experienceLevel: r.experienceLevel || 'any-level',
          description: r.description?.trim() || '',
          detailsLink: r.detailsLink?.trim() || '',
          payAmount: 0,
        }));

      const submissionData = {
        projectTitle: formData.projectTitle.trim(),
        projectDescription: formData.projectDescription.trim(),
        industryTrack: formData.industryTrack,
        timeline: formData.timeline,
        startDate: formData.startDate,
        endDate: formData.endDate,
        projectGoals: formData.projectGoals.trim() || null,
        projectLink: formData.projectLink.trim(),
        resources: { submissionUrl: formData.submissionUrl.trim() },
        experienceLevel: formData.experienceLevel || 'any-level',
        contactEmail: formData.contactEmail.trim(),
        contactName: formData.contactName.trim() || 'Project Owner',
        companyName: formData.companyName.trim() || null,
        // Team
        teamRoles: validRoles,
        maxTeamSize: totalTeamSize,
        // Kept at zero: members post collaborative, badge-earning projects
        // only. Paid work is company-hosted (see /company/host-cohort).
        isPaid: false,
        payCurrency: 'USD',
        totalBudget: 0,
        paymentConfirmations: {},
        leaveReasons: [],
        // Meta
        status: 'active',
        isActive: true,
        submitterId: currentUser.uid,
        submitterEmail: currentUser.email,
        submitterName: currentUser.displayName || currentUser.email,
        submitterPhoto: currentUser.photoURL || null,
        isCompanyPost: profileIsCompany,
        viewCount: 0,
        applicationCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'projects'), submissionData);

      // Log project creation
      try {
        const { logActivity } = await import('../../utils/activityLog');
        await logActivity(docRef.id, {
          type: 'project_created',
          actor: currentUser.email,
          actorName: currentUser.displayName || currentUser.email,
          description: `Project "${formData.projectTitle}" created`,
          metadata: { teamSize: teamRoles.reduce((s, r) => s + (parseInt(r.count) || 1), 0) },
        });
      } catch (e) {
        console.log('Activity log skipped:', e.message);
      }

      toast.success('Project posted successfully!');
      setTimeout(() => navigate('/projects'), 1500);
    } catch (error) {
      console.error('Error posting project:', error);
      toast.error('Error posting project: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const inputClass =
    'w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 min-h-[44px] text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none text-sm transition-all';
  const labelClass = 'block text-pink-600 font-semibold mb-2 text-sm';
  const selectClass = inputClass + ' appearance-none';

  if (authLoading || !currentUser) {
    return (
      <>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen overflow-x-hidden " style={{ backgroundColor: '#ffffff' }}>
        <main className="pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Post a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                  Project
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Create a project and build your team
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {profileGate.checked && !profileGate.complete && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
                  <p className="text-amber-800 text-sm font-semibold mb-1">
                    Complete your profile to post a project
                  </p>
                  <p className="text-gray-600 text-xs mb-3">
                    Recruiters discover talent through complete profiles. Please fill in:{' '}
                    {profileGate.missing.join(', ')}.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/settings?tab=profile')}
                    className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all"
                  >
                    Complete Profile
                  </button>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5">
                {/* Project Title */}
                <div>
                  <label className={labelClass}>Project Title *</label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g., Student Housing Finder App"
                    maxLength={120}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Project Description *</label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    className={inputClass + ' resize-none'}
                    rows="4"
                    placeholder="Describe the project, its purpose, and what the team will build..."
                    maxLength={2000}
                  />
                </div>

                {/* Industry Track */}
                <div>
                  <label className={labelClass}>Industry Track *</label>
                  <select
                    name="industryTrack"
                    value={formData.industryTrack}
                    onChange={handleInputChange}
                    className={selectClass}
                  >
                    <option value="">Select industry</option>
                    {industryTracks.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timeline + Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Timeline *</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className={selectClass}
                    >
                      <option value="">Select</option>
                      {timelineOptions.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={inputClass}
                      min={getMinDate()}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={inputClass}
                      min={formData.startDate || getMinDate()}
                    />
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <label className={labelClass}>Project Goals</label>
                  <textarea
                    name="projectGoals"
                    value={formData.projectGoals}
                    onChange={handleInputChange}
                    className={inputClass + ' resize-none'}
                    rows="2"
                    placeholder="What should the team achieve by the end?"
                    maxLength={1000}
                  />
                </div>

                {/* Submission + project links */}
                <div>
                  <label className={labelClass}>Project Submission Link *</label>
                  <input
                    type="url"
                    name="submissionUrl"
                    value={formData.submissionUrl}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="https://github.com/... (folder with all the work, team, and final solutions)"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    A GitHub repo is recommended (free). This is where the team's work lives and
                    what gets reviewed.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Project Link - Full Description *</label>
                  <input
                    type="url"
                    name="projectLink"
                    value={formData.projectLink}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="https://docs.google.com/... (a doc, slides, etc. describing the project)"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    A full description of the project - Google Doc, a .docx, a slide deck, etc.
                  </p>
                </div>
              </div>

              {/* ── TEAM ROLES ── */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Team Roles</h2>
                  <span
                    className={`text-xs ${totalTeamSize >= MIN_MEMBERS ? 'text-gray-400' : 'text-red-500 font-semibold'}`}
                  >
                    Total team: {totalTeamSize + 1} {totalTeamSize + 1 === 1 ? 'person' : 'people'}{' '}
                    (you + {totalTeamSize})
                  </span>
                </div>
                <p className="text-gray-500 text-xs -mt-2">
                  Set an experience level per role. Intermediate and Advanced roles can only be
                  filled by members who've earned the matching badge level in that track - keeping
                  your team realistic and your project outcomes protected. Use Beginner or Any Level
                  for roles open to newcomers.
                </p>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <p className="text-gray-700 text-xs">
                    <strong>Note:</strong> add or remove roles to fit your project. Keep at least
                    one Beginner or Any Level role so newcomers can join.
                  </p>
                  <p className="text-gray-700 text-xs mt-2">
                    <strong>No solo projects:</strong> a project is a team effort, so it needs at
                    least {MIN_TEAM_SIZE} people. You count as one, so your roles must add up to at
                    least {MIN_MEMBERS} {MIN_MEMBERS === 1 ? 'person' : 'people'} besides you - and
                    you'll need that many approved members on the team before you can submit for
                    review or complete the project.
                  </p>
                </div>

                {teamRoles.map((role, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 text-sm font-semibold">Role {index + 1}</span>
                      {teamRoles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRole(index)}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Role Title *</label>
                          {role.role === '__other__' ? (
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={role.customRole || ''}
                                onChange={(e) =>
                                  handleRoleChange(index, 'customRole', e.target.value)
                                }
                                className={inputClass}
                                placeholder="Enter custom role"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  handleRoleChange(index, 'role', '');
                                  handleRoleChange(index, 'customRole', '');
                                }}
                                className="text-gray-400 hover:text-gray-600 text-xs px-2 flex-shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <select
                              value={role.role}
                              onChange={(e) => handleRoleChange(index, 'role', e.target.value)}
                              className={selectClass}
                            >
                              <option value="">Select role</option>
                              {roleTemplates.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                              <option value="__other__">Other (type your own)</option>
                            </select>
                          )}
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">
                            People Needed *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={role.count}
                            onChange={(e) => handleRoleChange(index, 'count', e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">
                            Skills Required *
                          </label>
                          <input
                            type="text"
                            value={role.skills}
                            onChange={(e) => handleRoleChange(index, 'skills', e.target.value)}
                            className={inputClass}
                            placeholder="e.g., React, Node.js"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">
                            Experience Level
                          </label>
                          <select
                            value={role.experienceLevel || 'any-level'}
                            onChange={(e) =>
                              handleRoleChange(index, 'experienceLevel', e.target.value)
                            }
                            className={selectClass}
                          >
                            <option value="any-level">Any Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                      {/* Role Description */}
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Role Description</label>
                        <textarea
                          value={role.description || ''}
                          onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                          className={inputClass + ' resize-none'}
                          rows={2}
                          placeholder="Describe what this role will do, responsibilities, deliverables..."
                        />
                      </div>
                      {/* Role Details Link */}
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">
                          Details Link (optional)
                        </label>
                        <input
                          type="url"
                          value={role.detailsLink || ''}
                          onChange={(e) => handleRoleChange(index, 'detailsLink', e.target.value)}
                          className={inputClass}
                          placeholder="https://docs.google.com/... or any URL with more details"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {teamRoles.length < 10 && (
                  <button
                    type="button"
                    onClick={addRole}
                    className="w-full py-2.5 border border-dashed border-gray-200 rounded-xl text-pink-600 text-sm font-semibold hover:bg-gray-50 transition-all min-h-[44px]"
                  >
                    + Add Another Role
                  </button>
                )}
              </div>

              {/* ── CONTACT INFO ── */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Your Name</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Company / Organisation</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 min-h-[48px] bg-pink-600 hover:bg-pink-700 text-white font-black rounded-xl text-sm sm:text-base transition-all shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Posting Project...
                  </span>
                ) : (
                  'Post Project'
                )}
              </button>
            </form>

            <style jsx>{`
              select option {
                background-color: #111;
                color: white;
              }
            `}</style>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectSubmission;
