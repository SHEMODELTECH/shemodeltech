// src/Pages/projects/ProjectDetail.jsx - View Single Project

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { notifyNewApplicationToOwner } from '../../utils/emailNotifications';
import { sendPush } from '../../utils/pushNotifications';
import { checkRoleEligibility } from '../../utils/roleEligibility';
import { checkProfileComplete } from '../../utils/profileCompletion';
import ProjectPayBadge from '../../components/ProjectPayBadge';
import { formatMoney, getPayRangeLabel } from '../../utils/paidProjects';

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

const getIndustryLabel = (val) => industryTracks.find(t => t.value === val)?.label || val;

const formatTimeline = (t) => ({
  '1-week': '1 Week', '2-weeks': '2 Weeks', '1-month': '1 Month',
  '2-3-months': '2-3 Months', '3-6-months': '3-6 Months',
  '6-months-plus': '6+ Months', 'flexible': 'Flexible'
}[t] || t);

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [roleFill, setRoleFill] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [wasRejected, setWasRejected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);

  // Application form state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyForm, setApplyForm] = useState({ role: '', skills: '', message: '', portfolioUrl: '', linkedinUrl: '' });
  const [submittingApp, setSubmittingApp] = useState(false);
  const [memberProfile, setMemberProfile] = useState(null);

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, 'users', currentUser.uid))
        .then(snap => setMemberProfile(snap.exists() ? snap.data() : {}))
        .catch(() => setMemberProfile({}));
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', projectId));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProject(data);
          // Count approved members per role (for the "X of N filled" soft-cap display).
          try {
            const approvedSnap = await getDocs(query(
              collection(db, 'project_applications'),
              where('projectId', '==', projectId),
              where('status', '==', 'approved')
            ));
            const fill = {};
            approvedSnap.docs.forEach(d => {
              const r = d.data().role;
              if (r) fill[r] = (fill[r] || 0) + 1;
            });
            setRoleFill(fill);
          } catch (e) { /* non-blocking */ }
          if (currentUser) {
            setIsOwner(data.submitterId === currentUser.uid || data.submitterEmail === currentUser.email);
            const membersList = data.members || [];
            // A user is a member if their uid OR email is in the members array, or they own it.
            const memberByArray = membersList.includes(currentUser.uid) || membersList.includes(currentUser.email);
            // Check their applications for this project.
            const appQuery = query(
              collection(db, 'project_applications'),
              where('projectId', '==', projectId),
              where('applicantEmail', '==', currentUser.email)
            );
            const appSnap = await getDocs(appQuery);
            const apps = appSnap.docs.map(d => d.data());
            const approvedApp = apps.some(a => a.status === 'approved');
            const pendingApp = apps.some(a => a.status === 'submitted' || a.status === 'pending');
            const rejectedApp = apps.some(a => a.status === 'rejected') && !approvedApp;

            const member = memberByArray || approvedApp || data.submitterId === currentUser.uid || data.submitterEmail === currentUser.email;
            setIsMember(member);
            // "Applied" should only show while genuinely pending - not once approved.
            setHasApplied(pendingApp && !member);
            setWasRejected(rejectedApp && !member);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      }
      setLoading(false);
    };
    fetchProject();
  }, [projectId, currentUser]);

  // Leads are SELECTED after an interview, not claimed first-come. Clicking
  // through takes the member to the cohort application form where she ranks
  // up to 3 projects. (The old behaviour auto-confirmed whoever clicked
  // first, which in a cohort means one flaky lead can sink a whole team's
  // eight weeks, with no way to choose between two good candidates.)
  const handleApplyToLead = async () => {
    if (!currentUser) { navigate('/login'); return; }

    // Company accounts cannot lead collaborative projects - they hire teams
    // by posting paid projects instead.
    if (memberProfile?.isCompany) {
      toast.error("Company accounts can't lead projects. Post a paid project to hire a team instead.");
      return;
    }

    // A complete profile is required, but there is NO badge gate to lead -
    // leading is itself a skill-building path open to anyone.
    const profileStatus = checkProfileComplete(memberProfile);
    if (!profileStatus.complete) {
      toast.error('Please complete your profile before applying to lead.');
      navigate('/settings?tab=profile');
      return;
    }

    navigate(`/cohort/apply-to-lead?project=${projectId}`);
  };

  const handleApply = async () => {
    if (!currentUser) { navigate('/login'); return; }

    // Company accounts cannot apply to any project (free or paid) and never
    // earn badges - they hire teams by posting paid projects instead.
    if (memberProfile?.isCompany) {
      toast.error("Company accounts can't apply to projects. Post a paid project to hire a team instead.");
      return;
    }

    // Require a complete profile before joining a project
    const profileStatus = checkProfileComplete(memberProfile);
    if (!profileStatus.complete) {
      toast.error('Please complete your profile before applying to a project.');
      navigate('/settings?tab=profile');
      return;
    }

    if (!applyForm.role) { toast.error('Please select a role'); return; }
    if (!applyForm.skills.trim()) { toast.error('Please list your relevant skills'); return; }

    // Enforced role-difficulty matching: block applications to roles the member
    // has not earned the badge level for. Beginner / any-level roles pass freely.
    const selectedRole = (project.teamRoles || []).find(r => r.role === applyForm.role);
    const eligibility = checkRoleEligibility(memberProfile, selectedRole);
    if (!eligibility.eligible) {
      toast.error(eligibility.reason || 'You do not meet the level requirement for this role.');
      return;
    }

    setSubmittingApp(true);
    try {
      await addDoc(collection(db, 'project_applications'), {
        projectId,
        projectTitle: project.projectTitle,
        applicantUid: currentUser.uid,
        applicantEmail: currentUser.email,
        applicantName: currentUser.displayName || currentUser.email,
        applicantPhoto: currentUser.photoURL || null,
        role: applyForm.role,
        roleExperienceLevel: selectedRole?.experienceLevel || 'any-level',
        applicantBadgeLevel: eligibility.current || 'None',
        badgeCategory: eligibility.category,
        // Paid projects: the pay for this role is locked onto the application
        // at apply time - this is the source of truth for the member's
        // pending/earned amounts on their Account page.
        isPaid: !!project.isPaid,
        payAmount: project.isPaid ? (Number(selectedRole?.payAmount) || 0) : 0,
        payCurrency: project.payCurrency || 'USD',
        skills: applyForm.skills.trim(),
        message: applyForm.message.trim() || null,
        portfolioUrl: applyForm.portfolioUrl.trim() || null,
        linkedinUrl: applyForm.linkedinUrl.trim() || null,
        status: 'submitted',
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'projects', projectId), { applicationCount: increment(1) });
      setHasApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted!');

      // Notify project owner about new application
      try {
        // In-app notification
        if (project.submitterId) {
          await addDoc(collection(db, 'notifications'), {
            userId: project.submitterId,
            type: 'project_application',
            message: `${currentUser.displayName || currentUser.email} applied to "${project.projectTitle}" as ${applyForm.role}`,
            projectId,
            projectTitle: project.projectTitle,
            mentionedByName: currentUser.displayName || currentUser.email,
            mentionedByPhoto: currentUser.photoURL || null,
            isRead: false,
            createdAt: serverTimestamp(),
          });
          // Push to owner (non-blocking)
          sendPush({
            recipientUid: project.submitterId,
            title: 'New project application',
            body: `${currentUser.displayName || currentUser.email} applied to "${project.projectTitle}" as ${applyForm.role}`,
            link: '/projects/owner-dashboard',
          });
        }
        // Email notification
        await notifyNewApplicationToOwner({
          projectOwnerEmail: project.submitterEmail || project.contactEmail,
          projectOwnerName: project.contactName || project.submitterName,
          applicantName: currentUser.displayName || currentUser.email,
          applicantEmail: currentUser.email,
          projectTitle: project.projectTitle,
          role: applyForm.role,
          skills: applyForm.skills.trim(),
          message: applyForm.message.trim() || '',
        });
      } catch (emailErr) {
        console.error('Notification failed (non-blocking):', emailErr);
      }
    } catch (err) {
      console.error('Error applying:', err);
      toast.error('Failed to submit application');
    }
    setSubmittingApp(false);
  };

  const inputClass = "w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 min-h-[44px] text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none text-sm transition-all";

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
          <div className="text-center">
            <p className="text-gray-900 text-lg font-bold mb-4">Project not found</p>
            <Link to="/projects" className="text-pink-600 hover:text-pink-500 font-semibold text-sm">Back to Projects</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen overflow-x-hidden " style={{ backgroundColor: '#ffffff' }}>
        <main className="pb-16 sm:pb-20">
          <div className="max-w-6xl mx-auto">

            {/* Back */}
            <Link to="/projects" className="inline-flex items-center text-gray-400 hover:text-gray-900 text-sm font-semibold mb-6 transition-colors">
              ← Back to Projects
            </Link>

            {/* Header */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">{project.projectTitle}</h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ProjectPayBadge isPaid={!!project.isPaid} size="md" />
                  <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${project.status === 'lead_recruitment' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-pink-600/20 text-pink-500 border-pink-600/30'}`}>
                    {project.status === 'lead_recruitment' ? 'Looking for a Lead' : project.isPaid ? 'Paid Project' : 'Collaborative Project'}
                  </span>
                </div>
              </div>

              {project.isPaid && getPayRangeLabel(project.teamRoles) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-amber-800 text-sm font-bold">{getPayRangeLabel(project.teamRoles)}</p>
                    <p className="text-gray-500 text-xs">Pay is per person, set per role by the project owner, and paid on verified completion. Everyone's pay is visible below. No badges are awarded on paid projects.</p>
                  </div>
                </div>
              )}

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">{project.projectDescription}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  ['Industry', getIndustryLabel(project.industryTrack)],
                  ['Timeline', formatTimeline(project.timeline)],
                  ['Team Size', `${project.maxTeamSize || 0} people`],
                  ['Level', project.experienceLevel === 'any-level' ? 'Any Level' : project.experienceLevel || 'Any'],
                ].map(([label, val]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
                    <p className="text-gray-900 text-sm font-medium mt-0.5">{val}</p>
                  </div>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Start Date</p>
                  <p className="text-gray-900 text-sm font-medium mt-0.5">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">End Date</p>
                  <p className="text-gray-900 text-sm font-medium mt-0.5">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>

              {/* Goals */}
              {project.projectGoals && (
                <div className="mb-6">
                  <h3 className="text-pink-600 font-semibold text-sm mb-2">Project Goals</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{project.projectGoals}</p>
                </div>
              )}

              {/* Posted by */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {project.submitterPhoto && (
                  <img src={project.submitterPhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
                )}
                <div>
                  <p className="text-gray-900 text-sm font-semibold">{project.contactName || 'Project Owner'}</p>
                  <p className="text-gray-500 text-xs">{project.companyName || project.submitterEmail}</p>
                </div>
              </div>
            </div>

            {/* Team Roles */}
            {project.teamRoles && project.teamRoles.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-8 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Team Roles Needed</h2>
                <div className="space-y-3">
                  {project.teamRoles.map((role, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{role.role}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Skills: {role.skills}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {project.isPaid && (Number(role.payAmount) || 0) > 0 && (
                          <span className="text-amber-700 text-xs font-black bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">{formatMoney(role.payAmount)} / person</span>
                        )}
                        {role.experienceLevel && role.experienceLevel !== 'any-level' && (
                          <span className="text-pink-500 text-xs font-bold capitalize">{role.experienceLevel}</span>
                        )}
                        {(() => {
                          const filled = roleFill[role.role] || 0;
                          const cap = parseInt(role.count, 10) || 0;
                          const isFull = cap > 0 && filled >= cap;
                          return (
                            <span className={`text-xs font-bold ${isFull ? 'text-green-600' : 'text-gray-400'}`}>
                              {filled} of {cap} filled{isFull ? ' · Full' : ''}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lead Recruitment - only the lead opening is available */}
            {project.status === 'lead_recruitment' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-1">This project needs a lead</h2>
                <p className="text-gray-600 text-sm mb-3">
                  No one is leading this project yet. Apply to lead it - as the lead, you'll shape the idea, decide which roles and how many people the team needs, then open it up for others to join. Leading is its own skill path and earns a Leadership badge on completion. No badge is required to apply.
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  New to how roles work? <a href="/support" className="text-pink-600 underline">See how it works</a>.
                </p>
                {!currentUser ? (
                  <button onClick={() => navigate('/login')} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all">
                    Sign in to lead this project
                  </button>
                ) : memberProfile?.isCompany ? (
                  <p className="text-gray-500 text-xs">Company accounts can't lead collaborative projects or earn badges. To hire a team, <button onClick={() => navigate('/projects/submit')} className="text-pink-600 underline">post a paid project</button> instead.</p>
                ) : memberProfile && !checkProfileComplete(memberProfile).complete ? (
                  <div>
                    <p className="text-amber-700 text-xs mb-2">Complete your profile first: {checkProfileComplete(memberProfile).missing.join(', ')}.</p>
                    <button onClick={() => navigate('/settings?tab=profile')} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-all">
                      Complete Profile
                    </button>
                  </div>
                ) : (
                  <button onClick={handleApplyToLead} disabled={submittingApp} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-50">
                    Apply to Lead This Project
                  </button>
                )}
              </div>
            )}

            {/* Setup in progress - lead is configuring the team */}
            {project.status === 'setup' && !isOwner && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-8 text-center">
                <p className="text-gray-900 font-semibold text-sm mb-1">A lead is setting up this project</p>
                <p className="text-gray-500 text-xs">Roles will open for applications shortly. Check back soon.</p>
              </div>
            )}

            {/* Apply Section - only once the lead has opened the project */}
            {project.status === 'active' && !isOwner && currentUser && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-8">
                {memberProfile?.isCompany ? (
                  <div className="text-center py-4">
                    <p className="text-gray-900 font-semibold text-sm mb-1">Company accounts hire teams - they don't join them</p>
                    <p className="text-gray-500 text-xs mb-3 max-w-md mx-auto">Company accounts can't apply to projects or earn badges. Instead, post a paid project: set the pay per person for every role and hire verified talent for your own team.</p>
                    <button onClick={() => navigate('/projects/submit')} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all">
                      Post a Paid Project
                    </button>
                  </div>
                ) : memberProfile && !checkProfileComplete(memberProfile).complete ? (
                  <div className="text-center py-4">
                    <p className="text-amber-700 font-semibold text-sm mb-1">Complete your profile to apply</p>
                    <p className="text-gray-500 text-xs mb-3">Please fill in: {checkProfileComplete(memberProfile).missing.join(', ')}. A complete profile is how recruiters and project owners find you.</p>
                    <button onClick={() => navigate('/settings?tab=profile')} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all">
                      Complete Profile
                    </button>
                  </div>
                ) : isMember ? (
                  <div className="text-center py-4">
                    <p className="text-green-600 font-bold text-base mb-1">You have been approved!</p>
                    <p className="text-gray-500 text-xs mb-3">You can click "Open Workspace" below to join your project team.</p>
                    <button onClick={() => navigate(`/projects/${projectId}/workspace`)} className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-5 py-2 rounded-lg transition-all">
                      Open Workspace
                    </button>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center py-4">
                    <p className="text-pink-600 font-bold text-sm">You have already applied to this project</p>
                    <p className="text-gray-500 text-xs mt-1">The project owner will review your application</p>
                  </div>
                ) : (wasRejected && project.applicationsOpen === false) ? (
                  <div className="text-center py-4">
                    <p className="text-gray-700 font-bold text-sm mb-1">You were not approved to join this project</p>
                    <p className="text-gray-500 text-xs">Applications are now closed. You can apply to other projects on the <button onClick={() => navigate('/projects')} className="text-pink-600 font-semibold hover:underline">projects page</button>, or visit your <button onClick={() => navigate('/my-workspaces')} className="text-pink-600 font-semibold hover:underline">workspace</button>.</p>
                  </div>
                ) : project.applicationsOpen === false ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 font-semibold text-sm mb-1">Applications are closed</p>
                    <p className="text-gray-400 text-xs">The project owner has closed applications for this project.</p>
                  </div>
                ) : !showApplyForm ? (
                  <div className="text-center">
                    {wasRejected && (
                      <p className="text-gray-500 text-xs mb-3">Your previous application wasn't approved. You're welcome to apply again while applications are open.</p>
                    )}
                    <button onClick={() => setShowApplyForm(true)}
                      className="px-8 py-3 min-h-[48px] bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg">
                      {wasRejected ? 'Apply Again' : 'Apply to This Project'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-gray-900 font-bold text-base">Apply to this project</h3>
                    <div>
                      <label className="block text-pink-600 font-semibold mb-2 text-sm">Role you are applying for *</label>
                      <select value={applyForm.role} onChange={e => setApplyForm(p => ({ ...p, role: e.target.value }))}
                        className={inputClass + " appearance-none"}>
                        <option value="">Select a role</option>
                        {(project.teamRoles || []).map((r, i) => {
                          const elig = checkRoleEligibility(memberProfile, r);
                          const lvl = (r.experienceLevel && r.experienceLevel !== 'any-level')
                            ? r.experienceLevel.charAt(0).toUpperCase() + r.experienceLevel.slice(1)
                            : 'Any Level';
                          const filled = roleFill[r.role] || 0;
                          const cap = parseInt(r.count, 10) || 0;
                          const full = cap > 0 && filled >= cap;
                          const payLabel = project.isPaid && (Number(r.payAmount) || 0) > 0 ? ` · ${formatMoney(r.payAmount)}` : '';
                          return (
                            <option key={i} value={r.role} disabled={!elig.eligible}>
                              {r.role}{payLabel} · {lvl} ({filled}/{cap} filled{full ? ', full' : ''}){!elig.eligible ? ' - Locked' : ''}
                            </option>
                          );
                        })}
                      </select>
                      {applyForm.role && (() => {
                        const sel = (project.teamRoles || []).find(r => r.role === applyForm.role);
                        const elig = checkRoleEligibility(memberProfile, sel);
                        if (elig.eligible) return null;
                        return <p className="text-red-600 text-xs mt-2 leading-relaxed">{elig.reason}</p>;
                      })()}
                      {project.isPaid && applyForm.role && (() => {
                        const sel = (project.teamRoles || []).find(r => r.role === applyForm.role);
                        const pay = Number(sel?.payAmount) || 0;
                        if (pay <= 0) return null;
                        return (
                          <p className="text-amber-700 text-xs mt-2 font-semibold bg-amber-50 border border-amber-200 rounded-lg p-2">
                            You'll be paid {formatMoney(pay)} for this role on verified completion. No badge is awarded on paid projects - you're compensated instead. Leaving mid-project forfeits your pay.
                          </p>
                        );
                      })()}
                      {(project.teamRoles || []).some(r => !checkRoleEligibility(memberProfile, r).eligible) && (
                        <p className="text-gray-400 text-xs mt-2">This role needs a higher badge. Apply to open roles first to earn it.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-pink-600 font-semibold mb-2 text-sm">Your Relevant Skills *</label>
                      <input type="text" value={applyForm.skills} onChange={e => setApplyForm(p => ({ ...p, skills: e.target.value }))}
                        className={inputClass} placeholder="e.g., React, Python, UI/UX Design" />
                    </div>
                    <div>
                      <label className="block text-pink-600 font-semibold mb-2 text-sm">Message to Project Owner</label>
                      <textarea value={applyForm.message} onChange={e => setApplyForm(p => ({ ...p, message: e.target.value }))}
                        className={inputClass + " resize-none"} rows="3" placeholder="Why are you interested in this project?" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-pink-600 font-semibold mb-2 text-sm">Portfolio / Resume URL</label>
                        <input type="url" value={applyForm.portfolioUrl} onChange={e => setApplyForm(p => ({ ...p, portfolioUrl: e.target.value }))}
                          className={inputClass} placeholder="https://your-portfolio.com or resume link" />
                      </div>
                      <div>
                        <label className="block text-pink-600 font-semibold mb-2 text-sm">LinkedIn URL</label>
                        <input type="url" value={applyForm.linkedinUrl} onChange={e => setApplyForm(p => ({ ...p, linkedinUrl: e.target.value }))}
                          className={inputClass} placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowApplyForm(false)}
                        className="px-5 py-2.5 min-h-[44px] bg-gray-100 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl text-sm transition-all">
                        Cancel
                      </button>
                      <button onClick={handleApply} disabled={submittingApp}
                        className="px-8 py-2.5 min-h-[44px] bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg disabled:opacity-50">
                        {submittingApp ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lead setup in progress (owner) */}
            {isOwner && project.status === 'setup' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-amber-800 font-semibold text-sm mb-1">Finish setting up your project</p>
                <p className="text-gray-600 text-xs mb-3">You're the lead. Refine the details and open the team roles so others can apply.</p>
                <button onClick={() => navigate(`/projects/${projectId}/setup`)} className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all">
                  Continue Setup
                </button>
              </div>
            )}

            {/* Owner notice */}
            {isOwner && project.status !== 'setup' && (
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
                <p className="text-pink-700 font-semibold text-sm mb-1">You are the owner of this project</p>
                <p className="text-gray-500 text-xs mb-3">Manage applications, project completion, and badge assignment from your dashboard.</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => navigate(`/projects/${projectId}/workspace`)} className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all">
                    Open Workspace
                  </button>
                  <button onClick={() => navigate('/projects/owner-dashboard')} className="bg-white border border-gray-300 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
                    Manage Project
                  </button>
                </div>
              </div>
            )}

            {/* Member workspace access - only when the apply card above isn't already showing the approved state */}
            {isMember && !isOwner && project.status !== 'active' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <p className="text-green-700 font-semibold text-sm mb-1">You have been approved!</p>
                <p className="text-gray-500 text-xs mb-3">You can click "Open Workspace" below to join your project team.</p>
                <button onClick={() => navigate(`/projects/${projectId}/workspace`)} className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all">
                  Open Workspace
                </button>
              </div>
            )}

            {/* Not logged in */}
            {!currentUser && project.status === 'active' && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-gray-600 text-sm mb-3">Sign in to apply for this project</p>
                <Link to="/login" className="inline-flex px-6 py-2.5 min-h-[44px] bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-sm transition-all items-center">
                  Sign In
                </Link>
              </div>
            )}

          </div>
        </main>
        <style jsx>{`select option { background-color: white; color: #111; }`}</style>
      </div>
    </>
  );
};

export default ProjectDetail;
