// src/Pages/org/Org.jsx
// Organizations (course licensing):
//   JoinOrganization  /join/:code            learners join with consent (13+; under 18 needs school consent)
//   OrgDashboard      /org/:orgId            the organization's admins see learners' progress
//   OrgEdition        /org/:orgId/edition/:courseId   instructor editions shared with them
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';
import { findOrgByInvite, getOrganization, joinOrganization, leaveOrganization, listOrgMembers } from '../../utils/organizations';
import { getTeacherContent, getTeacherCourse, displayMarkdown } from '../../utils/teacherCourses';
import { renderCourse } from '../../utils/renderCourseMarkdown';

// ---------- Join ----------
export const JoinOrganization = () => {
  const { code } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [member, setMember] = useState(null);
  const [age, setAge] = useState('');
  const [consent, setConsent] = useState(false);
  const [schoolConsent, setSchoolConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    findOrgByInvite(code).then(setOrg).catch(() => setOrg(null));
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => setProfile(s.data() || {})).catch(() => {});
  }, [code, currentUser]);
  useEffect(() => {
    if (currentUser && org) getDoc(doc(db, 'organizations', org.id, 'members', currentUser.uid)).then((s) => setMember(s.exists() ? s.data() : null)).catch(() => {});
  }, [currentUser, org]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">You’ve been invited to She Model Tech</h1>
          <p className="text-gray-600 mt-2">Sign in or create a free account to join your organization’s learning.</p>
          <button
            onClick={() => {
              try {
                sessionStorage.setItem('smt_return_to', `/join/${code}`);
              } catch (_) {
                /* ignore */
              }
              navigate('/login');
            }}
            className="mt-5 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Sign in or create an account
          </button>
        </div>
      </div>
    );
  }

  const minor = age === '13-17';
  const canJoin = consent && age && age !== 'under13' && (!minor || (org?.allowMinors && schoolConsent));
  const join = async () => {
    setBusy(true);
    try {
      await joinOrganization(org, currentUser, profile, { minor });
      setMember({ consent: true, minor });
      toast.success(`You’ve joined ${org.name}.`);
    } catch (e) {
      toast.error('Could not join. The invite may have ended.');
    }
    setBusy(false);
  };
  const leave = async () => {
    if (!window.confirm(`Leave ${org.name}? They will no longer see your progress.`)) return;
    await leaveOrganization(org.id, currentUser.uid).catch(() => {});
    setMember(null);
    toast.success('You’ve left the organization.');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {org === undefined ? (
          <p className="text-gray-500">Loading...</p>
        ) : !org || org.status !== 'active' ? (
          <p className="text-gray-700">This invite link isn’t active. Ask your organization for a new one.</p>
        ) : member ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h1 className="text-xl font-bold text-gray-900">You’re part of {org.name}</h1>
            <p className="text-gray-700 mt-2">Start with your organization’s courses:</p>
            <ul className="mt-2 space-y-1">
              {(org.courses || []).map((c) => (
                <li key={c.slug}><Link to={`/learning/${c.track}/${c.slug}`} className="text-pink-700 font-semibold hover:underline">{c.title}</Link></li>
              ))}
              {(org.courses || []).length === 0 && <li className="text-gray-600">Browse all courses in <Link to="/learning" className="text-pink-700 font-semibold">Learning</Link>.</li>}
            </ul>
            <button onClick={leave} className="mt-5 text-sm text-gray-600 underline">Leave {org.name}</button>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Join {org.name} on She Model Tech</h1>
            <p className="text-gray-600 mt-2">Your courses stay free. Joining lets your organization follow your learning.</p>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-gray-800">How old are you?</legend>
              {[['18plus', '18 or older'], ['13-17', '13 to 17'], ['under13', 'Under 13']].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 text-sm text-gray-700 mt-1.5">
                  <input type="radio" name="age" value={v} checked={age === v} onChange={() => setAge(v)} /> {l}
                </label>
              ))}
            </fieldset>
            {age === 'under13' && <p className="text-sm text-red-700 mt-2">She Model Tech is for learners aged 13 and over.</p>}
            {minor && !org.allowMinors && <p className="text-sm text-red-700 mt-2">This organization’s invite is for learners aged 18 and over.</p>}
            {minor && org.allowMinors && (
              <label className="flex items-start gap-2 text-sm text-gray-700 mt-3">
                <input type="checkbox" className="mt-1" checked={schoolConsent} onChange={(e) => setSchoolConsent(e.target.checked)} />
                <span>My school has my parent or guardian’s permission for me to use She Model Tech. (Learners under 18 get a private profile and can only message their school’s instructors and our team.)</span>
              </label>
            )}
            <label className="flex items-start gap-2 text-sm text-gray-700 mt-3">
              <input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I agree to share my course progress, badges, and certificates with <strong>{org.name}</strong>. I can leave at any time.</span>
            </label>
            <button onClick={join} disabled={!canJoin || busy} className="mt-5 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50">
              Join {org.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Organization dashboard ----------
export const OrgDashboard = () => {
  const { orgId } = useParams();
  const { currentUser } = useAuth();
  const [org, setOrg] = useState(undefined);
  const [allowed, setAllowed] = useState(false);
  const [members, setMembers] = useState(null);
  const [details, setDetails] = useState({});
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const o = await getOrganization(orgId).catch(() => null);
      setOrg(o);
      if (!o) return;
      const me = await getDoc(doc(db, 'users', currentUser.uid)).catch(() => null);
      const staff = ['admin', 'editor'].includes(me?.data()?.role);
      const ok = staff || (o.adminUids || []).includes(currentUser.uid);
      setAllowed(ok);
      if (!ok) return;
      const ms = await listOrgMembers(orgId).catch(() => []);
      setMembers(ms);
      const info = {};
      await Promise.all(
        ms.map(async (m) => {
          const [u, certs] = await Promise.all([
            getDoc(doc(db, 'users', m.uid)).catch(() => null),
            getDocs(query(collection(db, 'learning_certificates'), where('uid', '==', m.uid))).catch(() => null),
          ]);
          info[m.uid] = { user: u?.data() || {}, certs: certs ? certs.docs.map((d) => d.data()).filter((c) => c.type !== 'mentor') : [] };
        })
      );
      setDetails(info);
      const eds = await Promise.all((o.editionIds || []).map((id) => getTeacherCourse(id).catch(() => null)));
      setEditions(eds.filter(Boolean));
    })();
  }, [orgId, currentUser]);

  const rows = useMemo(
    () =>
      (members || []).map((m) => {
        const u = details[m.uid]?.user || {};
        const courses = (org?.courses || []).map((c) => {
          const enrolled = !!((u.learningEnrolled || {})[c.track] || {})[c.slug];
          const done = !!((u.foundationsCourses || {})[c.track] || {})[c.slug];
          return { ...c, status: done ? 'Completed' : enrolled ? 'In progress' : 'Not started' };
        });
        return { m, courses, certs: details[m.uid]?.certs || [], badges: (u.badges || []).length };
      }),
    [members, details, org]
  );

  if (org === undefined) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!org || !allowed) return <p className="text-gray-600">You don’t have access to this organization.</p>;
  const invite = `${window.location.origin}/join/${org.inviteCode}`;
  const remove = async (m) => {
    if (!window.confirm(`Remove ${m.name} from ${org.name}?`)) return;
    await leaveOrganization(orgId, m.uid).catch(() => toast.error('Could not remove them.'));
    setMembers((xs) => xs.filter((x) => x.uid !== m.uid));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{org.name}</h1>
      <p className="text-gray-600 text-sm mt-1">Your learners’ progress, badges, and certificates. Learners join with their consent and can leave at any time.</p>

      <div className="mt-5 rounded-xl border border-pink-200 bg-pink-50/40 p-4">
        <p className="text-sm font-semibold text-gray-900">Invite link</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <input readOnly value={invite} className="flex-1 min-w-[16rem] text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white" aria-label="Invite link" />
          <button onClick={() => navigator.clipboard.writeText(invite).then(() => toast.success('Link copied.'))} className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg">Copy</button>
        </div>
        <p className="text-xs text-gray-500 mt-1">{org.allowMinors ? 'Learners aged 13 and over can join (under 18 with your school’s guardian consent).' : 'For learners aged 18 and over.'}</p>
      </div>

      {editions.length > 0 && (
        <div className="mt-5 rounded-xl border border-indigo-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">Instructor editions</p>
          <ul className="mt-2 space-y-1">
            {editions.map((e) => (
              <li key={e.id}><Link to={`/org/${orgId}/edition/${e.id}`} className="text-indigo-700 font-semibold hover:underline">{e.title}</Link></li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Learners ({rows.length})</h2>
      {members === null ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-500 text-sm">No learners yet. Share your invite link.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <th className="p-3">Learner</th>
                {(org.courses || []).map((c) => <th key={c.slug} className="p-3">{c.title}</th>)}
                <th className="p-3">Certificates</th>
                <th className="p-3">Badges</th>
                <th className="p-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ m, courses, certs, badges }) => (
                <tr key={m.uid} className="border-t border-gray-100">
                  <td className="p-3">
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}{m.minor ? ' · under 18' : ''}</p>
                  </td>
                  {courses.map((c) => (
                    <td key={c.slug} className={`p-3 ${c.status === 'Completed' ? 'text-emerald-700 font-semibold' : c.status === 'In progress' ? 'text-amber-700' : 'text-gray-500'}`}>{c.status}</td>
                  ))}
                  <td className="p-3">{certs.length}</td>
                  <td className="p-3">{badges}</td>
                  <td className="p-3"><button onClick={() => remove(m)} className="text-xs text-gray-500 hover:text-red-700">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ---------- Instructor edition (read-only) ----------
export const OrgEdition = () => {
  const { orgId, courseId } = useParams();
  const [course, setCourse] = useState(undefined);
  const [content, setContent] = useState('');
  useEffect(() => {
    (async () => {
      const c = await getTeacherCourse(courseId).catch(() => null);
      setCourse(c);
      if (c) setContent(await getTeacherContent(courseId, c.chunkCount).catch(() => ''));
    })();
  }, [courseId]);
  const html = useMemo(() => (course && course.kind !== 'html' ? renderCourse(displayMarkdown(course.kind, content)).html : ''), [course, content]);
  if (course === undefined) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!course) return <p className="text-gray-600">This instructor edition isn’t available to you.</p>;
  return (
    <div className="max-w-5xl mx-auto">
      <Link to={`/org/${orgId}`} className="text-sm font-semibold text-gray-600">&larr; Back to your organization</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-3">{course.title}</h1>
      <p className="text-sm text-gray-500">Instructor edition</p>
      {course.kind === 'html' ? (
        <iframe title={course.title} srcDoc={content} sandbox="allow-scripts allow-popups" className="w-full mt-4 rounded-xl border border-gray-200" style={{ height: 'calc(100vh - 14rem)', minHeight: 520 }} />
      ) : (
        <div className="course-prose mt-4 bg-white border border-gray-200 rounded-2xl p-6" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
};
