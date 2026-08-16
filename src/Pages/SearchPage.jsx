// Global search - reachable from the search icon in the top bar (all screen
// sizes, including mobile/handheld). Members can search:
//   - MEMBERS by name or specialization (links to their profile - profiles
//     are viewable by everyone; this is a simple name lookup, NOT the curated
//     Talent Board with badge filtering and ranking)
//   - PROJECTS by title or field (free and paid)
//   - FOUNDATIONS COURSES by track or course title
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { tracksWithCourses, trackMeta, coursesForTrack } from '../utils/foundationsCourses';
import ProjectPayBadge from '../components/ProjectPayBadge';

const SearchPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);
  const [term, setTerm] = useState(searchParams.get('q') || '');
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    inputRef.current?.focus();
  }, [currentUser, navigate]);

  // Keep the term in sync when a new search comes in from the top-bar search
  // bar while already on this page (the ?q= param changes without a remount).
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setTerm(q);
  }, [searchParams]);

  // Load searchable data once. Matching happens client-side as you type.
  useEffect(() => {
    if (!currentUser) return;
    let active = true;
    (async () => {
      try {
        const [uSnap, pSnap] = await Promise.all([
          getDocs(query(collection(db, 'users'), limit(500))),
          getDocs(query(collection(db, 'projects'), limit(300))),
        ]);
        if (!active) return;
        setMembers(
          uSnap.docs
            .map(d => ({ uid: d.id, ...d.data() }))
            .filter(u => u.onboardingComplete !== false && (u.displayName || u.companyName))
        );
        setProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error('Search data load failed:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [currentUser]);

  // Static course list (from Foundations)
  const courses = useMemo(() => {
    const list = [];
    tracksWithCourses().forEach(trackId => {
      const meta = trackMeta(trackId);
      coursesForTrack(trackId).forEach(c => {
        list.push({ trackId, trackLabel: meta.label, title: c.title, slug: c.slug });
      });
    });
    return list;
  }, []);

  const q = term.trim().toLowerCase();

  const memberResults = useMemo(() => {
    if (!q) return [];
    return members
      .filter(u => {
        const name = (u.displayName || u.companyName || '').toLowerCase();
        const spec = (u.specialization || '').toLowerCase();
        return name.includes(q) || spec.includes(q);
      })
      .slice(0, 12);
  }, [q, members]);

  const projectResults = useMemo(() => {
    if (!q) return [];
    return projects
      .filter(p => {
        const title = (p.projectTitle || '').toLowerCase();
        const field = (p.projectField || p.field || '').toLowerCase();
        return title.includes(q) || field.includes(q);
      })
      .slice(0, 12);
  }, [q, projects]);

  const courseResults = useMemo(() => {
    if (!q) return [];
    return courses
      .filter(c => c.title.toLowerCase().includes(q) || c.trackLabel.toLowerCase().includes(q))
      .slice(0, 8);
  }, [q, courses]);

  const total = memberResults.length + projectResults.length + courseResults.length;

  const SectionHeader = ({ children }) => (
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6 first:mt-0">{children}</p>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Search</h1>
      <p className="text-gray-500 text-sm mb-5">Find members, projects, and Foundations courses.</p>

      {/* Search input */}
      <div className="relative mb-6">
        <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder="Search members, projects, courses…"
          className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none shadow-sm"
        />
        {term && (
          <button onClick={() => setTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700" aria-label="Clear search">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : !q ? (
        <div className="text-center py-14">
          <p className="text-gray-400 text-sm">Type to search across members, projects, and courses.</p>
        </div>
      ) : total === 0 ? (
        <div className="text-center py-14">
          <p className="text-gray-700 text-sm font-semibold mb-1">No results for "{term}"</p>
          <p className="text-gray-400 text-xs">Try a different name, project title, or track.</p>
        </div>
      ) : (
        <div>
          {memberResults.length > 0 && (
            <div>
              <SectionHeader>Members</SectionHeader>
              <div className="space-y-1.5">
                {memberResults.map(u => (
                  <button
                    key={u.uid}
                    onClick={() => navigate(`/profile/${u.email || u.uid}`)}
                    className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left"
                  >
                    {u.photoURL ? (
                      <img src={u.photoURL} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(u.displayName || u.companyName || '?')[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 text-sm font-semibold truncate">{u.displayName || u.companyName}</p>
                      <p className="text-gray-400 text-xs truncate">{u.isCompany ? 'Company / Organisation' : (u.specialization || 'Member')}</p>
                    </div>
                    {u.isCompany && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">COMPANY</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {projectResults.length > 0 && (
            <div>
              <SectionHeader>Projects</SectionHeader>
              <div className="space-y-1.5">
                {projectResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 text-sm font-semibold truncate">{p.projectTitle || 'Untitled project'}</p>
                      <p className="text-gray-400 text-xs truncate capitalize">
                        {(p.projectField || p.field || 'Project')}{p.status ? ` · ${p.status === 'awaiting_payment_confirmation' ? 'awaiting payment' : p.status}` : ''}
                      </p>
                    </div>
                    <ProjectPayBadge isPaid={p.isPaid} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {courseResults.length > 0 && (
            <div>
              <SectionHeader>Foundations Courses</SectionHeader>
              <div className="space-y-1.5">
                {courseResults.map((c, i) => (
                  <button
                    key={`${c.trackId}-${c.slug}-${i}`}
                    onClick={() => navigate('/foundations')}
                    className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 text-sm font-semibold truncate">{c.title}</p>
                      <p className="text-gray-400 text-xs truncate">{c.trackLabel} · Foundations</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
