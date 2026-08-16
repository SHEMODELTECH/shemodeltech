// src/Pages/projects/ProjectsListing.jsx - Browse Projects

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';
import { collection, query, orderBy, onSnapshot, where, doc, getDoc, getDocs } from 'firebase/firestore';
import ProjectPayBadge from '../../components/ProjectPayBadge';
import { getPayRangeLabel } from '../../utils/paidProjects';

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

const ProjectsListing = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [appliedProjectIds, setAppliedProjectIds] = useState(new Set());

  useEffect(() => {
    if (!currentUser) { setIsAdmin(false); return; }
    getDoc(doc(db, 'users', currentUser.uid))
      .then(snap => setIsAdmin(snap.exists() && snap.data().role === 'admin'))
      .catch(() => setIsAdmin(false));
  }, [currentUser]);

  // Which projects has this user applied to (or is a member of / leading)?
  useEffect(() => {
    if (!currentUser) { setAppliedProjectIds(new Set()); return; }
    (async () => {
      const ids = new Set();
      try {
        const snap = await getDocs(query(collection(db, 'project_applications'), where('applicantUid', '==', currentUser.uid)));
        snap.forEach(d => { const pid = d.data().projectId; if (pid) ids.add(pid); });
      } catch (e) { /* ignore */ }
      try {
        const snap2 = await getDocs(query(collection(db, 'project_applications'), where('applicantEmail', '==', currentUser.email)));
        snap2.forEach(d => { const pid = d.data().projectId; if (pid) ids.add(pid); });
      } catch (e) { /* ignore */ }
      setAppliedProjectIds(ids);
    })();
  }, [currentUser]);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ industryTrack: '', timeline: '', payType: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query without orderBy so it never depends on a composite index
    // (which may not exist yet on a fresh project). Sort client-side instead.
    const q = query(
      collection(db, 'projects'),
      where('status', 'in', ['active', 'lead_recruitment', 'setup'])
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Rejected projects are dead - never show them on the board.
        .filter(p => p.reviewStatus !== 'rejected')
        // Newest first, sorted in JS (handles missing createdAt gracefully).
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setProjects(list);
      setFilteredProjects(list);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching projects:', err);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let result = [...projects];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.projectTitle?.toLowerCase().includes(q) ||
        p.projectDescription?.toLowerCase().includes(q) ||
        p.companyName?.toLowerCase().includes(q)
      );
    }
    if (filters.industryTrack) result = result.filter(p => p.industryTrack === filters.industryTrack);
    if (filters.timeline) result = result.filter(p => p.timeline === filters.timeline);
    if (filters.payType === 'paid') result = result.filter(p => !!p.isPaid);
    if (filters.payType === 'free') result = result.filter(p => !p.isPaid);
    setFilteredProjects(result);
  }, [searchQuery, filters, projects]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ industryTrack: '', timeline: '', payType: '' });
  };

  const selectClass = "bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 min-h-[44px] text-gray-900 text-sm focus:border-pink-500 focus:outline-none transition-all appearance-none";

  return (
    <>
      
      <div className="min-h-screen overflow-x-hidden " style={{ backgroundColor: '#ffffff' }}>
        <main className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>
                  <span className="text-gray-900">Projects</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">{filteredProjects.length} active {filteredProjects.length === 1 ? 'project' : 'projects'}</p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/projects/generate"
                    className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all">
                    Generate
                  </Link>
                )}
                <Link to="/projects/submit"
                  className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg">
                  Post a Project
                </Link>
              </div>
            </div>

            {/* How leading works */}
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-6">
              <p className="text-gray-800 text-sm font-semibold mb-1">Two ways to lead a project</p>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Apply to lead</span> an available project below, or <Link to="/projects/submit" className="text-pink-600 font-semibold hover:underline">create your own project</Link> to lead. As a lead you review and shape the project, set the dates and roles, and your team builds it with you.
              </p>
            </div>

            {/* Search + Filters */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 space-y-3">
              <input
                type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 min-h-[44px] text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none text-sm transition-all"
                placeholder="Search projects..."
              />
              <div className="flex flex-wrap gap-2">
                <select value={filters.industryTrack} onChange={e => setFilters(p => ({ ...p, industryTrack: e.target.value }))} className={selectClass}>
                  <option value="">All Industries</option>
                  {industryTracks.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <select value={filters.timeline} onChange={e => setFilters(p => ({ ...p, timeline: e.target.value }))} className={selectClass}>
                  <option value="">Any Timeline</option>
                  <option value="1-week">1 Week</option>
                  <option value="2-weeks">2 Weeks</option>
                  <option value="1-month">1 Month</option>
                  <option value="2-3-months">2-3 Months</option>
                  <option value="3-6-months">3-6 Months</option>
                  <option value="6-months-plus">6+ Months</option>
                  <option value="flexible">Flexible</option>
                </select>
                <select value={filters.payType} onChange={e => setFilters(p => ({ ...p, payType: e.target.value }))} className={selectClass}>
                  <option value="">All Projects</option>
                  <option value="paid">Paid Projects</option>
                  <option value="free">Free (Collaborative) Projects</option>
                </select>
                {(searchQuery || filters.industryTrack || filters.timeline || filters.payType) && (
                  <button onClick={clearFilters} className="text-pink-600 hover:text-pink-500 text-xs font-semibold px-3 py-2 transition-colors">Clear All</button>
                )}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            )}

            {/* Empty */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg font-semibold mb-2">No projects found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Project Cards */}
            {!loading && filteredProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map(project => (
                  <div key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="bg-white rounded-xl p-4 sm:p-5 border border-pink-200 cursor-pointer hover:border-pink-400 hover:shadow-sm transition-all duration-200 active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-gray-900 font-bold text-sm sm:text-base line-clamp-2">{project.projectTitle}</h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                      <ProjectPayBadge isPaid={!!project.isPaid} size="xs" />
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        project.status === 'lead_recruitment' ? 'bg-amber-100 text-gray-900'
                        : project.status === 'setup' ? 'bg-purple-100 text-gray-900'
                        : project.applicationsOpen === false ? 'bg-gray-200 text-gray-700'
                        : 'bg-pink-100 text-gray-900'}`}>
                        {project.status === 'lead_recruitment' ? 'Needs a Lead'
                          : project.status === 'setup' ? 'Being set up'
                          : project.applicationsOpen === false ? 'Closed'
                          : 'Open to Join'}
                      </span>
                      </div>
                    </div>

                    {project.isPaid && getPayRangeLabel(project.teamRoles) && (
                      <p className="text-amber-700 text-xs font-black mb-2">{getPayRangeLabel(project.teamRoles)} · paid on completion</p>
                    )}

                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-3">{project.projectDescription}</p>

                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">{getIndustryLabel(project.industryTrack)}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">{formatTimeline(project.timeline)}</span>
                      {(appliedProjectIds.has(project.id)
                        || (currentUser && (project.submitterId === currentUser.uid || project.submitterEmail === currentUser.email))) ? (
                        <span className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm font-semibold">View Project</span>
                      ) : project.status === 'setup' ? (
                        <span className="px-3 py-1.5 bg-purple-100 text-gray-700 rounded-lg text-sm font-semibold">Ongoing application</span>
                      ) : project.applicationsOpen === false ? (
                        <span className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">Closed</span>
                      ) : project.status === 'lead_recruitment' ? (
                        <span className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-semibold">Apply to lead</span>
                      ) : (
                        <span className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-semibold">Join the Project</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>{project.status === 'lead_recruitment' ? 'Auto-generated by She Model Tech' : `Posted by ${project.contactName || 'Project Owner'}`}</span>
                      <span>{project.createdAt?.toDate ? new Date(project.createdAt.toDate()).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
        <style jsx>{`select option { background-color: white; color: #111; }`}</style>
      </div>
    </>
  );
};

export default ProjectsListing;
