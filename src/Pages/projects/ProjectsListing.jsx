// src/Pages/projects/ProjectsListing.jsx - Browse Projects

import PremiumBadge from '../../components/PremiumBadge';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  doc,
  getDoc,
  getDocs,
  limit,
} from 'firebase/firestore';
import ProjectPayBadge from '../../components/ProjectPayBadge';
import { getPayRangeLabel } from '../../utils/paidProjects';
import AIRecommendations from '../../components/AIRecommendations';
import { useFeatures } from '../../utils/features';
import { ShareDialogButton, shareUrl } from '../../components/ShareButtons';
import { COMPANY_COHORTS_ENABLED } from '../../config/companyAccess';
import { useCollapsed } from '../../components/CollapseToggle';

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

export const getIndustryLabel = (val) => industryTracks.find((t) => t.value === val)?.label || val;

export const formatTimeline = (t) =>
  ({
    '1-week': '1 Week',
    '2-weeks': '2 Weeks',
    '1-month': '1 Month',
    '2-3-months': '2-3 Months',
    '3-6-months': '3-6 Months',
    '6-months-plus': '6+ Months',
    flexible: 'Flexible',
  })[t] || t;

const ProjectsListing = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const features = useFeatures();
  const [myProfile, setMyProfile] = useState(null);
  const [appliedProjectIds, setAppliedProjectIds] = useState(new Set());
  // Paid company projects need one earned badge to apply. null = not known yet.
  const [hasBadge, setHasBadge] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setHasBadge(null);
      return;
    }
    // Badges awarded before memberUid was recorded only carry the email.
    (async () => {
      const byUid = await getDocs(
        query(collection(db, 'member_badges'), where('memberUid', '==', currentUser.uid), limit(1))
      );
      if (!byUid.empty) return true;
      const byEmail = await getDocs(
        query(collection(db, 'member_badges'), where('memberEmail', '==', currentUser.email), limit(1))
      );
      return !byEmail.empty;
    })()
      .then(setHasBadge)
      .catch(() => setHasBadge(null));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    getDoc(doc(db, 'users', currentUser.uid))
      .then((snap) => {
        setIsAdmin(snap.exists() && snap.data().role === 'admin');
        setMyProfile(snap.exists() ? snap.data() : null);
      })
      .catch(() => setIsAdmin(false));
  }, [currentUser]);

  // Which projects has this user applied to (or is a member of / leading)?
  useEffect(() => {
    if (!currentUser) {
      setAppliedProjectIds(new Set());
      return;
    }
    (async () => {
      const ids = new Set();
      try {
        const snap = await getDocs(
          query(
            collection(db, 'project_applications'),
            where('applicantUid', '==', currentUser.uid)
          )
        );
        snap.forEach((d) => {
          const pid = d.data().projectId;
          if (pid) ids.add(pid);
        });
      } catch (e) {
        /* ignore */
      }
      try {
        const snap2 = await getDocs(
          query(
            collection(db, 'project_applications'),
            where('applicantEmail', '==', currentUser.email)
          )
        );
        snap2.forEach((d) => {
          const pid = d.data().projectId;
          if (pid) ids.add(pid);
        });
      } catch (e) {
        /* ignore */
      }
      try {
        const snap3 = await getDocs(
          query(
            collection(db, 'company_cohort_applications'),
            where('applicantUid', '==', currentUser.uid)
          )
        );
        snap3.forEach((d) => {
          const a = d.data();
          if (a.cohortId && a.status !== 'withdrawn') ids.add(a.cohortId);
        });
      } catch (e) {
        /* ignore */
      }
      setAppliedProjectIds(ids);
    })();
  }, [currentUser]);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  // Projects this member has already applied to lead, so the card can say
  // "You applied" rather than inviting her to apply again.
  const [myRankedIds, setMyRankedIds] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setMyRankedIds([]);
      return undefined;
    }
    let dead = false;
    getDocs(
      query(collection(db, 'lead_applications'), where('applicantUid', '==', currentUser.uid))
    )
      .then((snap) => {
        if (dead) return;
        const ids = snap.docs
          .map((d) => d.data())
          .filter((a) => a.status !== 'withdrawn')
          .flatMap((a) => a.rankedProjectIds || []);
        setMyRankedIds(ids);
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [currentUser]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ industryTrack: '', timeline: '', payType: '' });
  const [loading, setLoading] = useState(true);

  // Company paid work now lives in the main projects collection (one system
  // for all paid work); the old company_cohorts collection is no longer listed.
  const [smtProjects, setSmtProjects] = useState([]);
  const [smtLoaded, setSmtLoaded] = useState(false);

  // One board: She Model Tech projects (including paid work), newest first.
  useEffect(() => {
    // Featured projects (a Premium feature) first, then newest.
    const merged = [...smtProjects].sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );
    setProjects(merged);
    if (smtLoaded) setLoading(false);
  }, [smtProjects, smtLoaded]);

  useEffect(() => {
    // Query without orderBy so it never depends on a composite index
    // (which may not exist yet on a fresh project). Sort client-side instead.
    const q = query(
      collection(db, 'projects'),
      where('status', 'in', ['active', 'lead_recruitment', 'setup'])
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          // Rejected projects are dead - never show them on the board.
          .filter((p) => p.reviewStatus !== 'rejected')
          // Newest first, sorted in JS (handles missing createdAt gracefully).
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setSmtProjects(list);
        setSmtLoaded(true);
      },
      (err) => {
        console.error('Error fetching projects:', err);
        setSmtLoaded(true);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    let result = [...projects];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.projectTitle?.toLowerCase().includes(q) ||
          p.projectDescription?.toLowerCase().includes(q) ||
          p.companyName?.toLowerCase().includes(q)
      );
    }
    if (filters.industryTrack)
      result = result.filter((p) => p.industryTrack === filters.industryTrack);
    if (filters.timeline) result = result.filter((p) => p.timeline === filters.timeline);
    if (filters.payType === 'paid') result = result.filter((p) => !!p.isPaid);
    if (filters.payType === 'free') result = result.filter((p) => !p.isPaid);
    // Focus mode: paid company work and paid cohorts stay hidden until switched on.
    if (!isAdmin) {
      if (!features.paidProjects) result = result.filter((p) => !p.isCompanyPost && !p.isCompanyProject);
    }
    setFilteredProjects(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters, projects, features, isAdmin]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ industryTrack: '', timeline: '', payType: '' });
  };

  // "How projects work here" can be hidden once read (remembered on this device).
  const [introHidden, toggleIntro] = useCollapsed('projects-intro', currentUser?.uid);
  const filtering = !!(searchQuery || filters.industryTrack || filters.timeline || filters.payType);
  // Members have the Projects tabs above, so the big heading would repeat them.
  const showHeading = !!myProfile?.isCompany;

  const selectClass =
    'bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 min-h-[44px] text-gray-900 text-sm focus:border-pink-500 focus:outline-none transition-all appearance-none';

  return (
    <>
      <div className="min-h-screen overflow-x-hidden " style={{ backgroundColor: '#ffffff' }}>
        <main className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                {showHeading && (
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>
                    Projects
                  </h1>
                )}
                <p className={showHeading ? 'text-gray-400 text-sm mt-1' : 'text-gray-500 text-sm'}>
                  {filteredProjects.length} open {filteredProjects.length === 1 ? 'project' : 'projects'}
                </p>
              </div>
              {introHidden && (
                <button type="button" onClick={toggleIntro} className="text-sm font-semibold text-pink-700 hover:underline">
                  How projects work
                </button>
              )}
            </div>

            {/* AI-powered project matches: free for every member */}
            {myProfile && !myProfile.isCompany && <AIRecommendations currentUser={currentUser} />}

            {/* How leading works (hideable) */}
            {!introHidden && (
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-semibold mb-1">How projects work here</p>
                  <p className="text-gray-600 text-sm">
                    Tap <span className="font-semibold">Join the Project</span> to lead a project or join its
                    team as a contributor. Leads are chosen after a short chat, because a whole team depends on
                    whoever takes it on. As a lead you shape the project, set the roles, and your team
                    builds it with you.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleIntro}
                  className="flex-shrink-0 text-xs font-semibold text-gray-600 hover:text-gray-900 px-2 py-1"
                >
                  Got it
                </button>
              </div>
            )}

            {/* Search + Filters (once there are projects to search) */}
            {(loading || projects.length > 0) && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 space-y-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 min-h-[44px] text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none text-sm transition-all"
                placeholder="Search projects..."
              />
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.industryTrack}
                  onChange={(e) => setFilters((p) => ({ ...p, industryTrack: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">All Industries</option>
                  {industryTracks.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.timeline}
                  onChange={(e) => setFilters((p) => ({ ...p, timeline: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">Any Timeline</option>
                  <option value="1-week">1 Week</option>
                  <option value="2-weeks">2 Weeks</option>
                  <option value="1-month">1 Month</option>
                  <option value="2-3-months">2-3 Months</option>
                  <option value="3-6-months">3-6 Months</option>
                  <option value="6-months-plus">6+ Months</option>
                  <option value="flexible">Flexible</option>
                </select>
                <select
                  value={filters.payType}
                  onChange={(e) => setFilters((p) => ({ ...p, payType: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">All Projects</option>
                  <option value="paid">Paid Projects</option>
                  <option value="free">Free (Collaborative) Projects</option>
                </select>
                {filtering && (
                  <button
                    onClick={clearFilters}
                    className="text-pink-600 hover:text-pink-500 text-xs font-semibold px-3 py-2 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            )}

            {/* Empty */}
            {!loading && filteredProjects.length === 0 && (
              filtering ? (
                <div className="text-center py-16">
                  <p className="text-gray-900 text-lg font-semibold mb-2">No projects match that</p>
                  <p className="text-gray-500 text-sm mb-4">Try another word, or clear the filters.</p>
                  <button onClick={clearFilters} className="text-sm font-semibold text-pink-700 hover:underline">Clear filters</button>
                </div>
              ) : (
                <div className="text-center py-16 px-4 border border-dashed border-gray-300 rounded-2xl">
                  <p className="text-gray-900 text-lg font-semibold mb-2">No open projects right now</p>
                  <p className="text-gray-600 text-sm max-w-md mx-auto mb-5">
                    New projects open regularly. In the meantime, see what members have built in the
                    Project Vault, or take a free course to get ready.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Link to="/project-vault" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">See the Project Vault</Link>
                    <Link to="/learning" className="text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg">Browse courses</Link>
                  </div>
                </div>
              )
            )}

            {/* Project Cards */}
            {!loading && filteredProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(project.href || `/projects/${project.id}`)}
                    className="bg-white rounded-xl p-4 sm:p-5 border border-pink-200 cursor-pointer hover:border-pink-400 hover:shadow-sm transition-all duration-200 active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-gray-900 font-bold text-sm sm:text-base line-clamp-2">
                        {project.featured && <span className="mr-1.5 align-middle"><PremiumBadge kind="featured" /></span>}
                        {project.projectTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <ProjectPayBadge isPaid={!!project.isPaid} size="xs" />
                        <span
                          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            project.status === 'lead_recruitment'
                              ? myRankedIds.includes(project.id)
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-gray-100 text-gray-900'
                              : project.status === 'setup'
                                ? 'bg-pink-100 text-gray-900'
                                : project.applicationsOpen === false
                                  ? 'bg-gray-200 text-gray-700'
                                  : 'bg-pink-100 text-gray-900'
                          }`}
                        >
                          {project.status === 'lead_recruitment'
                            ? myRankedIds.includes(project.id)
                              ? 'You applied'
                              : 'Needs a Lead'
                            : project.status === 'setup'
                              ? 'Being set up'
                              : project.applicationsOpen === false
                                ? 'Closed'
                                : 'Open to Join'}
                        </span>
                      </div>
                    </div>

                    {project.isPaid && getPayRangeLabel(project.teamRoles) && (
                      <p className="text-pink-700 text-xs font-black mb-2">
                        {getPayRangeLabel(project.teamRoles)} · paid on completion
                      </p>
                    )}

                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-3">
                      {project.projectDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {project.isCohort && (
                        <span className="px-2 py-0.5 bg-pink-50 text-pink-700 rounded-md text-[10px] font-semibold">
                          Cohort{project.startAt ? ` · starts ${new Date(project.startAt).toLocaleDateString()}` : ''}
                        </span>
                      )}
                      {(project.isCompanyProject || project.isCompanyPost) ? (
                        <>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">
                            {project.companyKind === 'freelance' ? 'Freelance · 1 person' : project.companyKind === 'cohort' && COMPANY_COHORTS_ENABLED ? 'Company cohort' : 'Company project'}
                          </span>
                          {project.endDate && (
                            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">
                              Due {new Date(project.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">
                            {getIndustryLabel(project.industryTrack)}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">
                            {formatTimeline(project.timeline)}
                          </span>
                        </>
                      )}
                      {appliedProjectIds.has(project.id) ||
                      (currentUser &&
                        (project.submitterId === currentUser.uid ||
                          project.submitterEmail === currentUser.email)) ? (
                        <span className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm font-semibold">
                          View Project
                        </span>
                      ) : (project.isCompanyProject || project.isCompanyPost) && hasBadge === false ? (
                        <span
                          title="Earn one badge on She Model Tech to apply"
                          className="px-3 py-1.5 bg-white border border-pink-300 text-pink-700 rounded-lg text-sm font-semibold"
                        >
                          Badge required
                        </span>
                      ) : project.status === 'setup' ? (
                        <span className="px-3 py-1.5 bg-pink-100 text-gray-700 rounded-lg text-sm font-semibold">
                          Ongoing application
                        </span>
                      ) : project.applicationsOpen === false ? (
                        <span className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">
                          Closed
                        </span>
                      ) : ['lead_recruitment', 'setup'].includes(project.status) ? (
                        // Coming soon: one Join (lead it, or join the team).
                        <span className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-semibold">
                          Join the Project
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-semibold">
                          Join the Project
                        </span>
                      )}
                      {!(project.isCompanyProject || project.isCompanyPost) && (
                        <ShareDialogButton
                          url={shareUrl('p', project.id)}
                          text={`Join a team building "${project.projectTitle}" on She Model Tech.`}
                          title={project.projectTitle || 'Project'}
                          label=""
                          className="ml-auto inline-flex items-center px-2.5 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>
                        {project.status === 'lead_recruitment' || project.isCohort
                          ? 'By She Model Tech'
                          : (project.isCompanyProject || project.isCompanyPost)
                            ? `Posted by ${project.companyName || 'a company'}${project.companyVerified ? ' (verified)' : ''}`
                            : `Posted by ${project.contactName || 'Project Owner'}`}
                      </span>
                      <span>
                        {project.createdAt?.toDate
                          ? new Date(project.createdAt.toDate()).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <style jsx>{`
          select option {
            background-color: white;
            color: #111;
          }
        `}</style>
      </div>
    </>
  );
};

export default ProjectsListing;
