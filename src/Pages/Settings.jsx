// src/Pages/Settings.jsx - Edit profile, reset password, delete account, plan
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { uploadImageToBlob, validateImageFile } from '../utils/blobStorage';
import { INDUSTRY_TRACKS } from '../utils/industryTracks';
import { BRAND } from '../config/brand';
import { deleteUserAccount } from '../utils/deleteUserContent';
import { enablePushForCurrentUser } from '../utils/pushNotifications';
import { toast } from 'react-toastify';

const skillTrackOpts = [
  { id: 'TechDev', label: 'Development' },
  { id: 'TechQA', label: 'Quality Assurance' },
  { id: 'TechPO', label: 'Product / Project Owner' },
  { id: 'TechArchs', label: 'Low/No-Code Developer' },
  { id: 'TechLeads', label: 'Non-Technical Roles' },
  { id: 'TechGuard', label: 'Cybersecurity' },
];

// Same options as onboarding step 4 ("What are you looking for?"), now editable
// here too. These feed profile completion and the AI recommendations.
const individualInterestOpts = [
  { id: 'projects', label: 'Projects', desc: 'Join real-world collaborative projects' },
  { id: 'jobs', label: 'Jobs', desc: 'Full-time, freelance, and contract roles' },
  { id: 'community', label: 'Community', desc: 'Connect with women in tech' },
  { id: 'badges', label: 'Badges', desc: 'Earn verified TechTalent credentials' },
];
const companyInterestOpts = [
  { id: 'jobs', label: 'Post Jobs', desc: 'Post opportunities for women in tech' },
  { id: 'projects', label: 'Post Projects', desc: 'Find collaborators for projects' },
  { id: 'community', label: 'Community', desc: 'Engage with the tech community' },
  { id: 'directory', label: 'Talent Board', desc: 'Discover and recruit verified talent' },
];

// Browser/OS detection so the "notifications blocked" help matches the device.
const _UA = typeof navigator !== 'undefined' ? navigator.userAgent : '';
const IS_IOS = /iPhone|iPad|iPod/i.test(_UA);
const IS_SAFARI = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(_UA);

const Settings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [form, setForm] = useState({
    displayName: '',
    specialization: '',
    experienceLevel: '',
    primarySkillTrack: '',
    highestEducation: '',
    skills: '',
    country: '',
    city: '',
    state: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    emailPublic: false,
    interests: [],
  });

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Profile picture upload (works for every account - email/password sign-ups
  // that have no picture yet, and Google sign-ins that want to change theirs).
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    const v = validateImageFile(file);
    if (v && v.valid === false) {
      toast.error(v.error || 'Invalid image.');
      return;
    }
    setUploadingPhoto(true);
    try {
      const result = await uploadImageToBlob(file, 'avatars');
      const photoURL = result?.url || result || null;
      if (!photoURL) throw new Error('Upload failed');
      await updateDoc(doc(db, 'users', currentUser.uid), { photoURL });
      // Keep the auth profile in sync so the new picture shows everywhere.
      try {
        if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL });
      } catch (_) {}
      setProfileData((prev) => ({ ...(prev || {}), photoURL }));
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error('Could not upload your picture. Please try again.');
    }
    setUploadingPhoto(false);
  };

  useEffect(() => {
    if (!currentUser) return;
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfileData(data);
          setWeeklyDigest(data.emailPreferences?.weeklyDigest === true);
          setReminders(data.emailPreferences?.reminders !== false);
          setForm({
            displayName: data.displayName || '',
            specialization: data.specialization || '',
            highestEducation: data.highestEducation || '',
            skills: data.skillsText || (Array.isArray(data.skills) ? data.skills.join(', ') : ''),
            experienceLevel: data.experienceLevel || '',
            primarySkillTrack: data.primarySkillTrack || '',
            country: data.country || '',
            city: data.city || '',
            state: data.state || '',
            portfolioUrl: data.portfolioUrl || '',
            linkedinUrl: data.linkedinUrl || '',
            githubUrl: data.githubUrl || '',
            emailPublic: data.emailPublic || false,
            interests: Array.isArray(data.interests) ? data.interests : [],
            industryInterests: Array.isArray(data.industryInterests) ? data.industryInterests : [],
          });
        }
      } catch (e) {
        console.error('Error fetching profile:', e);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!form.displayName.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!form.country.trim()) {
      toast.error('Current country is required');
      return;
    }
    // Individuals must provide the fields required to create/join projects
    if (!profileData?.isCompany) {
      if (!form.experienceLevel) {
        toast.error('Experience level is required');
        return;
      }
      if (!form.linkedinUrl.trim()) {
        toast.error('LinkedIn URL is required');
        return;
      }
    }
    setSaving(true);
    try {
      // Interests now come from THIS form (previously read from the stale profile,
      // which locked out members who skipped the interests step in onboarding).
      const hasInterests = Array.isArray(form.interests) && form.interests.length > 0;
      const requiredCommon = !!form.displayName.trim() && !!form.country.trim() && hasInterests;
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: form.displayName.trim(),
        interests: form.interests,
        industryInterests: form.industryInterests,
        specialization: form.specialization.trim() || null,
        highestEducation: form.highestEducation || null,
        skillsText: form.skills.trim() || null,
        skills: form.skills
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
        experienceLevel: form.experienceLevel || null,
        primarySkillTrack: form.primarySkillTrack || null,
        country: form.country.trim(),
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        portfolioUrl: form.portfolioUrl.trim() || null,
        linkedinUrl: form.linkedinUrl.trim() || null,
        githubUrl: form.githubUrl.trim() || null,
        emailPublic: form.emailPublic,
        // Mark complete when the required set is satisfied
        profileComplete: profileData?.isCompany
          ? requiredCommon
          : requiredCommon && !!form.experienceLevel && !!form.linkedinUrl.trim(),
      });
      toast.success('Profile updated');
    } catch (e) {
      toast.error('Failed to save profile');
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== 'DELETE') return;
    setDeleting(true);
    try {
      await deleteUserAccount(currentUser);
      navigate('/');
    } catch (e) {
      toast.error('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  const inputCls =
    'w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-all';
  const labelCls = 'block text-gray-700 font-medium mb-1.5 text-sm';

  const tabs = [
    { id: 'profile', label: 'Edit Profile' },
    { id: 'membership', label: 'What’s included' },
    { id: 'account', label: 'Account' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Edit Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          {/* Profile picture - available to all accounts */}
          <div className="flex items-center gap-4 pb-2 border-b border-gray-100">
            {profileData?.photoURL || currentUser?.photoURL ? (
              <img
                src={profileData?.photoURL || currentUser?.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center text-xl font-bold">
                {(form.displayName || profileData?.displayName || 'M')
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <label
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all ${uploadingPhoto ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
                {uploadingPhoto
                  ? 'Uploading…'
                  : profileData?.photoURL || currentUser?.photoURL
                    ? 'Change photo'
                    : 'Upload a photo'}
              </label>
              <p className="text-xs text-gray-500 mt-1.5">
                JPG, PNG or WebP. Shown on your profile and posts.
              </p>
            </div>
          </div>
          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              className={inputCls}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className={labelCls}>Primary Skill Track</label>
            <select
              value={form.primarySkillTrack}
              onChange={(e) => setForm((p) => ({ ...p, primarySkillTrack: e.target.value }))}
              className={inputCls}
            >
              <option value="">Select a track</option>
              {skillTrackOpts.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Highest Level of Education</label>
            <select
              value={form.highestEducation}
              onChange={(e) => setForm((p) => ({ ...p, highestEducation: e.target.value }))}
              className={inputCls}
            >
              <option value="">Select your education level</option>
              <option value="high_school">High School</option>
              <option value="undergrad">Undergraduate</option>
              <option value="masters">Master's</option>
              <option value="phd">PhD</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Course of Study</label>
            <input
              type="text"
              value={form.specialization}
              onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
              className={inputCls}
              placeholder="e.g., Computer Science, Chemistry, Business"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your field of study, or area of concentration if in high school.
            </p>
          </div>
          <div>
            <label className={labelCls}>Courses, Certifications & Skills</label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
              className={inputCls}
              placeholder="e.g., Python, AWS Certified, CS50, React"
            />
          </div>
          <div>
            <label className={labelCls}>
              Experience Level{!profileData?.isCompany ? ' *' : ''}
            </label>
            <select
              value={form.experienceLevel}
              onChange={(e) => setForm((p) => ({ ...p, experienceLevel: e.target.value }))}
              className={inputCls}
            >
              <option value="">Select</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Current Country *</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
              className={inputCls}
              placeholder="e.g., Nigeria, India, United States"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                className={inputCls}
                placeholder="e.g., Lagos"
              />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                className={inputCls}
                placeholder="e.g., Lagos State"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>What are you interested in? *</label>
            <p className="text-xs text-gray-500 mb-2">
              Select all that apply. This completes your profile and improves your recommendations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(profileData?.isCompany ? companyInterestOpts : individualInterestOpts).map(
                (opt) => {
                  const sel = form.interests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          interests: p.interests.includes(opt.id)
                            ? p.interests.filter((i) => i !== opt.id)
                            : [...p.interests, opt.id],
                        }))
                      }
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        sel
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`block text-sm font-semibold ${sel ? 'text-pink-700' : 'text-gray-900'}`}
                      >
                        {opt.label}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">{opt.desc}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
          {!profileData?.isCompany && (
            <div>
              <label className={labelCls}>Industries you're interested in</label>
              <p className="text-xs text-gray-500 mb-2">
                Optional. Used to recommend projects in industries you'll enjoy.
              </p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_TRACKS.map((t) => {
                  const sel = form.industryInterests.includes(t.value);
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          industryInterests: p.industryInterests.includes(t.value)
                            ? p.industryInterests.filter((i) => i !== t.value)
                            : [...p.industryInterests, t.value],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
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
          )}
          <div>
            <label className={labelCls}>LinkedIn URL{!profileData?.isCompany ? ' *' : ''}</label>
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => setForm((p) => ({ ...p, linkedinUrl: e.target.value }))}
              className={inputCls}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className={labelCls}>GitHub URL</label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
              className={inputCls}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className={labelCls}>Portfolio URL</label>
            <input
              type="url"
              value={form.portfolioUrl}
              onChange={(e) => setForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
              className={inputCls}
              placeholder="https://your-site.com"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <p className="text-gray-900 text-sm font-medium">Email Visibility</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {form.emailPublic
                  ? 'Your email is visible to other members'
                  : 'Your email is hidden from other members'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, emailPublic: !p.emailPublic }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.emailPublic ? 'bg-pink-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.emailPublic ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* What's included */}
      {activeTab === 'membership' && <IncludedTab />}

      {/* Account */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-gray-900 font-bold text-base mb-2">Push Notifications</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get notified on this device about new messages, project applications, and approvals,
              even when She Model Tech isn't open. On iPhone, add She Model Tech to your Home Screen
              first (Share, then Add to Home Screen).
            </p>
            <button
              onClick={async () => {
                await enablePushForCurrentUser({ interactive: true });
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all"
            >
              Enable notifications on this device
            </button>

            <details className="mt-4 group">
              <summary className="text-sm text-pink-600 font-medium cursor-pointer select-none list-none">
                Notifications not working? Here's how to turn them on
              </summary>
              {IS_IOS ? (
                <ol className="mt-3 ml-1 space-y-1.5 text-sm text-gray-700 list-decimal list-inside">
                  <li>
                    In Safari, tap the <span className="font-medium text-gray-900">Share</span>{' '}
                    button (the square with an arrow).
                  </li>
                  <li>
                    Choose <span className="font-medium text-gray-900">Add to Home Screen</span>,
                    then tap Add.
                  </li>
                  <li>
                    Close Safari and open{' '}
                    <span className="font-medium text-gray-900">
                      She Model Tech from the new Home Screen icon
                    </span>{' '}
                    (this step is required - notifications don't work in the Safari tab).
                  </li>
                  <li>
                    Go to Settings here and tap{' '}
                    <span className="font-medium text-gray-900">
                      Enable notifications on this device
                    </span>
                    , then tap Allow.
                  </li>
                </ol>
              ) : IS_SAFARI ? (
                <ol className="mt-3 ml-1 space-y-1.5 text-sm text-gray-700 list-decimal list-inside">
                  <li>
                    Open the <span className="font-medium text-gray-900">Safari</span> menu and
                    choose <span className="font-medium text-gray-900">Settings</span>.
                  </li>
                  <li>
                    Go to the <span className="font-medium text-gray-900">Websites</span> tab, then
                    select <span className="font-medium text-gray-900">Notifications</span> in the
                    sidebar.
                  </li>
                  <li>
                    Find <span className="font-medium text-gray-900">shemodeltech.com</span> in the
                    list and set it to <span className="font-medium text-gray-900">Allow</span>.
                  </li>
                  <li>
                    Come back here and click{' '}
                    <span className="font-medium text-gray-900">
                      Enable notifications on this device
                    </span>{' '}
                    again.
                  </li>
                </ol>
              ) : (
                <ol className="mt-3 ml-1 space-y-1.5 text-sm text-gray-700 list-decimal list-inside">
                  <li>Click the padlock (or site-settings) icon next to the address bar.</li>
                  <li>
                    Find <span className="font-medium text-gray-900">Notifications</span> and set it
                    to <span className="font-medium text-gray-900">Allow</span>.
                  </li>
                  <li>
                    Come back here and click{' '}
                    <span className="font-medium text-gray-900">
                      Enable notifications on this device
                    </span>{' '}
                    again.
                  </li>
                </ol>
              )}
              <p className="mt-2 ml-1 text-xs text-gray-500">
                Push notifications need a secure connection and, on iPhone/iPad, the app added to
                your Home Screen (iOS 16.4 or later).
              </p>
            </details>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-gray-900 font-bold text-base mb-2">Email Updates</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get a weekly email recap of your activity and what's new on She Model Tech: new
              projects, jobs, your badges, and unread messages. Sent every Sunday.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={async (e) => {
                  const next = e.target.checked;
                  setWeeklyDigest(next);
                  try {
                    await updateDoc(doc(db, 'users', currentUser.uid), {
                      'emailPreferences.weeklyDigest': next,
                    });
                    toast.success(next ? 'Weekly digest turned on.' : 'Weekly digest turned off.');
                  } catch (err) {
                    setWeeklyDigest(!next);
                    toast.error('Could not update preference.');
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Send me the weekly digest email</span>
            </label>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <p className="text-gray-500 text-sm mb-3">
                Get a personalized reminder only when you have something to pick up: a project
                you're leading, a team waiting for you, or work you paused. You'll only hear from us
                when there's something to continue, never just noise.
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={async (e) => {
                    const next = e.target.checked;
                    setReminders(next);
                    try {
                      await updateDoc(doc(db, 'users', currentUser.uid), {
                        'emailPreferences.reminders': next,
                      });
                      toast.success(next ? 'Reminders turned on.' : 'Reminders turned off.');
                    } catch (err) {
                      setReminders(!next);
                      toast.error('Could not update preference.');
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Remind me to pick up where I left off</span>
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-gray-900 font-bold text-base mb-3">Reset Password</h3>
            <p className="text-gray-500 text-sm mb-4">
              Since you signed in with Google, password management is handled through your Google
              account.
            </p>
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 text-sm font-medium hover:underline"
            >
              Manage Google Account Security
            </a>
          </div>

          <div className="bg-white border border-red-200 rounded-xl p-6">
            <h3 className="text-red-600 font-bold text-base mb-2">Delete Account</h3>
            <p className="text-gray-500 text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">
                  This will permanently delete all your posts, badges, projects, and profile data.
                </p>
                <div>
                  <label className="block text-red-600 text-xs font-semibold mb-1">
                    Type DELETE to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteText('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteText !== 'DELETE' || deleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-40 transition-all"
                  >
                    {deleting ? 'Deleting...' : 'Delete My Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

// Membership Tab with toggle dropdowns
const FeatureItem = ({ icon, label, detail, color = 'blue' }) => {
  const [open, setOpen] = useState(false);
  const iconColor = color === 'orange' ? 'text-orange-500' : 'text-pink-500';
  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 text-left py-1 group"
      >
        <svg
          className={`w-4 h-4 ${iconColor} mt-0.5 flex-shrink-0`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm text-gray-700 font-medium flex-1">{label}</span>
        {detail && (
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {open && detail && (
        <p className="text-gray-500 text-xs leading-relaxed ml-6 pb-2">{detail}</p>
      )}
    </li>
  );
};

const IncludedTab = () => {
  return (
    <div className="space-y-5">
      {/* Free banner */}
      <div className="bg-white border-2 border-pink-500 rounded-xl p-6">
        <div className="flex items-baseline gap-3 flex-wrap mb-1">
          <h3 className="text-pink-600 font-bold text-lg">Your account</h3>
          <span className="bg-pink-50 text-pink-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
            FREE FOREVER
          </span>
        </div>
        <p className="text-gray-900 font-bold text-2xl mb-3">Free</p>
        <p className="text-gray-500 text-sm">
          She Model Tech is free for everyone. There are no plans to choose between, no upgrades,
          and no features held back, every member gets everything below.
        </p>
      </div>

      {/* Everything included */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-gray-900 text-sm font-bold mb-3">Everything you get</p>
        <ul className="space-y-1">
          <FeatureItem
            label="Unlimited collaborative projects"
            detail="Create or join as many real product-build projects as you want, in any tech field, work with real teams and earn verified badges. No caps, no fees."
          />
          <FeatureItem
            label="All 6 TechTalent Badge tracks"
            detail="Earn badges across all tracks: TechDev, TechQA, TechPO, TechLeads, TechArchs, and TechGuard."
          />
          <FeatureItem
            label="Full Talent Board access"
            detail="Browse and search the whole directory of verified women, and get listed yourself once you earn your first badge."
          />
          <FeatureItem
            label="Unlimited messaging"
            detail="Message any member or company, and start as many conversations as you like. Nothing is metered."
          />
          <FeatureItem
            label="Unlimited job posts"
            detail="Post as many roles as you need. There is no monthly cap."
          />
          <FeatureItem
            label="Post paid projects"
            detail="Post paid projects and hire real teams: you set the pay per person for every role, it's visible to applicants before they join, and the project closes only when the work is verified done and every member confirms they were paid."
          />
          <FeatureItem
            label="Community, Proof Wall, and workspaces"
            detail="Share work on the Proof Wall, follow other members, and collaborate in project workspaces."
          />
          <FeatureItem
            label="Certificates on project completion"
            detail="Receive a certificate for every project you complete, documenting your role and contributions."
          />
          <FeatureItem
            label="Support"
            detail={`Reach the She Model Tech team any time at ${BRAND.supportEmail}.`}
          />
        </ul>
      </div>
    </div>
  );
};
