// Emulator tests for firestore.rules (security rules for the database).
// Run from this folder: npm install && npm test   (needs Java 21)
// GitHub runs them on every push (.github/workflows/checks.yml).
// MODE=orig expects the behaviour from before the confirmed-email gate (and
// before posts/{id} and the other open update rules were tightened); it's only
// for checking that these tests really exercise the change.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import {
  doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, collection, serverTimestamp, Timestamp, writeBatch,
  increment, arrayUnion, arrayRemove, deleteField,
} from 'firebase/firestore';

const RULES = process.env.RULES || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'firestore.rules');
const MODE = process.env.MODE || 'new';
const env = await initializeTestEnvironment({
  projectId: 'demo-smt',
  firestore: { rules: fs.readFileSync(RULES, 'utf8') },
});

const NOW = Timestamp.now();
const OLD = Timestamp.fromDate(new Date(Date.UTC(2026, 0, 1)));
const member = (uid, extra = {}) => ({
  uid, email: `${uid}@x.test`, displayName: uid, role: 'user', ageGroup: '18plus',
  onboardingComplete: true, ...extra,
});
// Users: newU = new + unconfirmed, verU = new + confirmed (token), oldU =
// unconfirmed but joined 2026-01-01, legacyU = unconfirmed, no createdAt.
const PEOPLE = {
  newU: { createdAt: NOW, verified: false },
  verU: { createdAt: NOW, verified: true },
  oldU: { createdAt: OLD, verified: false },
  legacyU: { createdAt: null, verified: false },
};

await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  for (const [uid, p] of Object.entries(PEOPLE)) {
    await setDoc(doc(db, 'users', uid), member(uid, p.createdAt ? { createdAt: p.createdAt } : {}));
    await setDoc(doc(db, 'course_enrollments', 'techdev__intro', 'learners', uid), { uid, at: '2026-10-01' });
    await setDoc(doc(db, 'conversations', `${uid}_bob`), { participants: [uid, 'bob'], lastMessage: '', unreadBy: {} });
    await setDoc(doc(db, 'conversations', `${uid}_staff1`), { participants: [uid, 'staff1'], lastMessage: '', unreadBy: {} });
  }
  await setDoc(doc(db, 'users', 'bob'), member('bob', { createdAt: OLD }));
  await setDoc(doc(db, 'users', 'staff1'), member('staff1', { role: 'admin', createdAt: OLD }));
  await setDoc(doc(db, 'users', 'newStaff'), member('newStaff', { role: 'editor', createdAt: NOW }));
  // Staff are tested on the same gated writes, so they need a conversation too.
  await setDoc(doc(db, 'conversations', 'newStaff_bob'), { participants: ['newStaff', 'bob'], lastMessage: '', unreadBy: {} });
  await setDoc(doc(db, 'projects', 'p1'), {
    projectTitle: 'Team app', submitterId: 'lead', members: [...Object.keys(PEOPLE), 'newStaff'], status: 'active', isPaid: false,
  });
  await setDoc(doc(db, 'posts', 'post1'), { authorId: 'bob', content: 'Hello' });
  await setDoc(doc(db, 'activity', 'a1'), { type: 'update', actorId: 'bob', text: 'hi', isDummy: false });
  // Community posts by bob, one per case so the cases don't depend on each other.
  for (const id of ['pRewrite', 'pEdit', 'pLike', 'pLikeOther', 'pCount', 'pStaff', 'pBadEdit']) {
    await setDoc(doc(db, 'posts', id), { authorId: 'bob', title: '', content: 'Hello', likes: [], likeCount: 0, createdAt: OLD });
  }
  await setDoc(doc(db, 'posts', 'pLiked'), { authorId: 'bob', content: 'Hello', likes: ['verU', 'carol'], likeCount: 2, reposts: ['verU'], repostCount: 1 });
  await setDoc(doc(db, 'users', 'carol'), member('carol', { createdAt: OLD, followers: [], followerCount: 0 }));
  await setDoc(doc(db, 'activity', 'a2'), { type: 'update', actorId: 'bob', text: 'hi', isDummy: false, celebratedBy: ['carol'], celebrateCount: 1, celebratedByNames: { carol: 'carol' }, celebratedByPhotos: { carol: '' } });
  await setDoc(doc(db, 'activity', 'a3'), { type: 'update', actorId: 'bob', text: 'hi', isDummy: false, celebratedBy: [], celebrateCount: 0 });
  await setDoc(doc(db, 'projects', 'p2'), { projectTitle: 'Other', submitterId: 'lead', members: [], status: 'active', applicationCount: 4 });
  await setDoc(doc(db, 'follows', 'bob_carol'), { followerId: 'bob', followingId: 'carol', status: 'active' });
  await setDoc(doc(db, 'foundationsContributions', 'fc1'), { authorId: 'bob', title: 'Lesson', ratingSum: 8, ratingCount: 2 });
});

const ctxFor = (uid, verified) =>
  env.authenticatedContext(uid, { email: `${uid}@x.test`, email_verified: verified, firebase: { sign_in_provider: 'password' } });

// ---- realistic payloads (copied from the app's write calls) ----
const gated = {
  'project forum post (ProjectWorkspace)': (db, uid) => addDoc(collection(db, 'projects', 'p1', 'forum'), {
    text: 'Pushed the login screen', link: null, imageUrl: null, authorId: uid, authorEmail: `${uid}@x.test`,
    authorName: uid, authorPhoto: null, createdAt: serverTimestamp(), editedAt: null, reactions: {}, parentId: null, mentions: [],
  }),
  'community reply (SinglePost)': (db, uid) => addDoc(collection(db, 'posts', 'post1', 'replies'), {
    content: 'Great post', authorName: uid, authorId: uid, authorPhoto: null, isCompanyPost: false,
    authorFirstName: '', authorLastName: '', authorInitials: '', authorTitle: '', taggedUsers: [], taggedUserIds: [],
    mentions: [], createdAt: serverTimestamp(),
  }),
  'new conversation (Messages)': (db, uid) => setDoc(doc(db, 'conversations', `${uid}_carol`), {
    participants: [uid, 'carol'], lastMessage: '', lastMessageAt: serverTimestamp(), createdAt: serverTimestamp(),
    unreadBy: { [uid]: 0, carol: 0 },
  }),
  'message in conversation (Messages)': (db, uid) => addDoc(collection(db, 'conversations', `${uid}_bob`, 'messages'), {
    text: 'Hi Bob', senderId: uid, createdAt: serverTimestamp(),
  }),
  'project application (ProjectDetail)': (db, uid) => addDoc(collection(db, 'project_applications'), {
    projectId: 'p1', projectTitle: 'Team app', applicantUid: uid, applicantEmail: `${uid}@x.test`, applicantName: uid,
    applicantPhoto: null, role: 'Frontend', badgeTrack: 'development', roleExperienceLevel: 'any-level',
    applicantBadgeLevel: 'None', badgeCategory: 'development', isPaid: false, payAmount: 0, payCurrency: 'USD',
    skills: 'react', message: null, portfolioUrl: null, linkedinUrl: null, status: 'submitted', createdAt: serverTimestamp(),
  }),
  'Proof Wall update (logActivity)': (db, uid) => addDoc(collection(db, 'activity'), {
    type: 'update', actorId: uid, actorName: uid, projectId: null, projectTitle: 'Team app', badgeName: null,
    text: 'Shipped it', imageUrl: null, link: null, mentions: [], meta: null, isDummy: false, createdAt: serverTimestamp(),
  }),
  'Proof Wall comment (addComment)': (db, uid) => addDoc(collection(db, 'activity', 'a1', 'comments'), {
    uid, name: uid, photoURL: null, text: 'Congrats', parentId: null, mentions: [], createdAt: serverTimestamp(),
  }),
  'course forum thread (CourseForum)': (db, uid) => addDoc(collection(db, 'course_forum', 'techdev__intro', 'threads'), {
    uid, name: uid, kind: 'question', title: 'How do I start', body: 'I am stuck on part one of the course', link: null,
    attachment: null, at: serverTimestamp(), replyCount: 0, lastAt: serverTimestamp(), track: 'techdev',
  }),
  'notification to another member': (db, uid) => addDoc(collection(db, 'notifications'), {
    userId: 'bob', recipientId: 'bob', type: 'mention', message: `${uid} mentioned you`, isRead: false, read: false,
    createdAt: serverTimestamp(),
  }),
};

// Things an unconfirmed member must still be able to do (and staff help).
const alwaysOk = {
  'own users doc: create (sign-up payload)': (db, uid) => setDoc(doc(db, 'users', `${uid}_fresh`), {}),
  'own users doc: update profile': (db, uid) => updateDoc(doc(db, 'users', uid), { bio: 'Hi', displayName: 'New name' }),
  'learning_progress write': (db, uid) => setDoc(doc(db, 'users', uid, 'learning_progress', 'techdev__intro'), { answers: { q1: 'a' }, updatedAt: serverTimestamp() }),
  'course enrolment': (db, uid) => setDoc(doc(db, 'course_enrollments', 'techdev__other', 'learners', uid), { uid, at: '2026-10-09' }),
  'notification to self': (db, uid) => addDoc(collection(db, 'notifications'), { userId: uid, type: 'my_post', message: 'x', isRead: false, createdAt: serverTimestamp() }),
  'message to staff (help)': (db, uid) => addDoc(collection(db, 'conversations', `${uid}_staff1`, 'messages'), { text: 'Help', senderId: uid, createdAt: serverTimestamp() }),
  'new conversation with staff': (db, uid) => setDoc(doc(db, 'conversations', `${uid}_staff1_new`), { participants: [uid, 'staff1'], lastMessage: '', createdAt: serverTimestamp(), unreadBy: {} }),
};

let pass = 0, fail = 0;
const rows = [];
const attempt = async (fn) => { try { await fn(); return 'allowed'; } catch (e) { if (/PERMISSION_DENIED|permission/i.test(String(e?.code || e?.message))) return 'denied'; return 'error: ' + e.message; } };
const check = (name, who, got, want) => {
  const ok = got === want;
  ok ? pass++ : fail++;
  rows.push(`${ok ? 'PASS' : 'FAIL'}  [${who}] ${name}: ${got}${ok ? '' : ` (expected ${want})`}`);
};

// The sign-up create needs a fresh uid per run; it creates users/{uid} as that uid.
const signupCreate = async (uid, verified, data) => {
  const db = ctxFor(uid, verified).firestore();
  return attempt(() => setDoc(doc(db, 'users', uid), data));
};

for (const [name, fn] of Object.entries(gated)) {
  for (const [uid, p] of Object.entries(PEOPLE)) {
    const db = ctxFor(uid, p.verified).firestore();
    const got = await attempt(() => fn(db, uid));
    const want = MODE === 'orig' ? 'allowed' : (uid === 'newU' ? 'denied' : 'allowed');
    check(name, uid, got, want);
  }
  // Staff are exempt even when brand new and unconfirmed.
  const got = await attempt(() => fn(ctxFor('newStaff', false).firestore(), 'newStaff'));
  check(name, 'newStaff (editor, unconfirmed)', got, 'allowed');
}

for (const [name, fn] of Object.entries(alwaysOk)) {
  if (name.startsWith('own users doc: create')) continue;
  const db = ctxFor('newU', false).firestore();
  check(name, 'newU', await attempt(() => fn(db, 'newU')), 'allowed');
}
// Sign-up: the exact doc createUserDocIfNew writes.
const signupDoc = {
  uid: 'freshA', email: 'freshA@x.test', displayName: 'Fresh', photoURL: null,
  createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
  emailPreferences: { dailyDigest: true, weeklyDigest: true, notifications: true, projectUpdates: true, communityUpdates: true, marketing: false, announcements: true, lastUpdated: new Date() },
  profileComplete: false, onboardingComplete: false, role: 'user', preferences: { theme: 'dark', language: 'en' },
};
check('own users doc: create (sign-up payload)', 'freshA (unconfirmed)', await signupCreate('freshA', false, signupDoc), 'allowed');
// Loophole checks (new rules only): no backdating / omitting the join date.
const noDate = { ...signupDoc, uid: 'freshB' }; delete noDate.createdAt;
check('users create WITHOUT createdAt', 'freshB', await signupCreate('freshB', false, noDate), MODE === 'orig' ? 'allowed' : 'denied');
check('users create with backdated createdAt', 'freshC', await signupCreate('freshC', false, { ...signupDoc, uid: 'freshC', createdAt: OLD }), MODE === 'orig' ? 'allowed' : 'denied');
{
  const db = ctxFor('newU', false).firestore();
  check('backdate own createdAt via update', 'newU', await attempt(() => updateDoc(doc(db, 'users', 'newU'), { createdAt: OLD })), MODE === 'orig' ? 'allowed' : 'denied');
}

// ---- Open update rules that were tightened (posts and friends) ----
// [name, who, write, expected with the new rules]. With MODE=orig every one of
// these was allowed (that was the hole).
{
  const stranger = () => ctxFor('verU', true).firestore();
  const asBob = () => ctxFor('bob', false).firestore(); // joined 2026-01-01
  const asStaff = () => ctxFor('staff1', false).firestore();
  const cases = [
    // posts/{id}
    ['posts: stranger rewrites someone else\'s post', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pRewrite'), { content: 'Buy cheap pills', title: 'Hacked', updatedAt: serverTimestamp() }), 'denied'],
    ['posts: stranger takes over authorship', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pRewrite'), { authorId: 'verU' }), 'denied'],
    ['posts: author edits own post (savePostEdit)', 'bob', () => updateDoc(doc(asBob(), 'posts', 'pEdit'), { title: 'New title', content: 'Edited text', isEdited: true, updatedAt: serverTimestamp() }), 'allowed'],
    ['posts: author edit also touching likeCount', 'bob', () => updateDoc(doc(asBob(), 'posts', 'pBadEdit'), { content: 'Edited', isEdited: true, likeCount: 500, updatedAt: serverTimestamp() }), 'denied'],
    ['posts: stranger likes (handlePostReaction)', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pLike'), { likes: arrayUnion('verU'), likeCount: increment(1), updatedAt: serverTimestamp() }), 'allowed'],
    ['posts: stranger unlikes (handlePostReaction)', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pLike'), { likes: arrayRemove('verU'), likeCount: increment(-1), updatedAt: serverTimestamp() }), 'allowed'],
    ['posts: stranger adds someone else\'s like', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pLikeOther'), { likes: arrayUnion('carol'), likeCount: increment(1), updatedAt: serverTimestamp() }), 'denied'],
    ['posts: stranger sets likeCount', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pCount'), { likeCount: 1000 }), 'denied'],
    ['posts: account deletion removes own like', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pLiked'), { likes: arrayRemove('verU'), likeCount: increment(-1) }), 'allowed'],
    ['posts: account deletion removes own repost', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pLiked'), { reposts: arrayRemove('verU'), repostCount: increment(-1) }), 'allowed'],
    ['posts: stranger removes someone else\'s like', 'verU', () => updateDoc(doc(stranger(), 'posts', 'pLiked'), { likes: arrayRemove('carol'), likeCount: increment(-1) }), 'denied'],
    ['posts: staff moderation update', 'staff1', () => updateDoc(doc(asStaff(), 'posts', 'pStaff'), { status: 'hidden', pinned: true, moderationNote: 'spam', content: '[removed]', updatedAt: serverTimestamp() }), 'allowed'],
    // users/{id}: badge cache and followers
    ['users: stranger rewrites another member\'s badges', 'verU', () => updateDoc(doc(stranger(), 'users', 'carol'), { badges: [{ id: 'techdev', projectId: 'p1' }], badgeCounts: { development: 9 } }), 'denied'],
    ['users: follow carol (own uid, +1)', 'verU', () => updateDoc(doc(stranger(), 'users', 'carol'), { followers: arrayUnion('verU'), followerCount: increment(1) }), 'allowed'],
    ['users: add someone else to carol\'s followers', 'verU', () => updateDoc(doc(stranger(), 'users', 'carol'), { followers: arrayUnion('bob', 'oldU'), followerCount: increment(2) }), 'denied'],
    // activity/{id}: Love
    ['activity: love (toggleCelebrate)', 'verU', () => updateDoc(doc(stranger(), 'activity', 'a2'), { celebratedBy: arrayUnion('verU'), celebrateCount: increment(1), 'celebratedByNames.verU': 'verU', 'celebratedByPhotos.verU': '' }), 'allowed'],
    ['activity: un-love (toggleCelebrate)', 'verU', () => updateDoc(doc(stranger(), 'activity', 'a2'), { celebratedBy: arrayRemove('verU'), celebrateCount: increment(-1), 'celebratedByNames.verU': deleteField(), 'celebratedByPhotos.verU': deleteField() }), 'allowed'],
    ['activity: wipe other people\'s love', 'verU', () => updateDoc(doc(stranger(), 'activity', 'a2'), { celebratedBy: [], celebrateCount: 0, celebratedByNames: {}, celebratedByPhotos: {} }), 'denied'],
    ['activity: inflate love count', 'verU', () => updateDoc(doc(stranger(), 'activity', 'a3'), { celebratedBy: ['x', 'y', 'z'], celebrateCount: 999 }), 'denied'],
    // projects/{id}: application counter
    ['projects: applicationCount +1 (ProjectDetail)', 'verU', () => updateDoc(doc(stranger(), 'projects', 'p2'), { applicationCount: increment(1) }), 'allowed'],
    ['projects: applicationCount reset by a stranger', 'verU', () => updateDoc(doc(stranger(), 'projects', 'p2'), { applicationCount: 0 }), 'denied'],
    // follows/{id}
    ['follows: follow as yourself', 'verU', () => setDoc(doc(stranger(), 'follows', 'verU_carol'), { followerId: 'verU', followingId: 'carol', status: 'active' }), 'allowed'],
    ['follows: create a follow as someone else', 'verU', () => setDoc(doc(stranger(), 'follows', 'bob_oldU'), { followerId: 'bob', followingId: 'oldU', status: 'active' }), 'denied'],
    ['follows: delete other people\'s follow', 'verU', () => deleteDoc(doc(stranger(), 'follows', 'bob_carol')), 'denied'],
    // company_members / group_members / event_group_members
    ['company_members: self-made admin row', 'verU', () => addDoc(collection(stranger(), 'company_members'), { companyId: 'c1', userId: 'verU', userEmail: 'verU@x.test', role: 'admin', status: 'active' }), 'denied'],
    ['company_members: join request as yourself', 'verU', () => addDoc(collection(stranger(), 'company_members'), { companyId: 'c1', userId: 'verU', userEmail: 'verU@x.test', role: 'member', status: 'pending' }), 'allowed'],
    ['group_members: add someone else', 'verU', () => addDoc(collection(stranger(), 'group_members'), { groupId: 'g1', userId: 'bob', role: 'member', status: 'pending' }), 'denied'],
    ['event_group_members: self-made active owner', 'verU', () => addDoc(collection(stranger(), 'event_group_members'), { eventGroupId: 'e1', userId: 'verU', role: 'owner', status: 'active' }), 'denied'],
    // project_completion_requests: only a project's lead (or staff)
    ['project_completion_requests: non-lead creates one', 'verU', () => addDoc(collection(stranger(), 'project_completion_requests'), { submitterId: 'verU', projectId: 'p1', status: 'draft' }), 'denied'],
    // foundationsContributions ratings
    ['foundationsContributions: one 5-star rating', 'verU', () => updateDoc(doc(stranger(), 'foundationsContributions', 'fc1'), { ratingSum: increment(5), ratingCount: increment(1) }), 'allowed'],
    ['foundationsContributions: stuff the rating', 'verU', () => updateDoc(doc(stranger(), 'foundationsContributions', 'fc1'), { ratingSum: 5000, ratingCount: 1000 }), 'denied'],
  ];
  // In order: some cases build on the one before (like, then unlike).
  for (const [name, who, fn, wantNew] of cases) {
    const want = MODE === 'orig' ? 'allowed' : wantNew;
    check(name, who, await attempt(fn), want);
  }
}

// ---- Funding requests (Support our mission → "Contact us to fund a cohort") ----
// Anyone can send one, signed in or not; only admins can read or change them.
if (MODE !== 'orig') {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'funding_requests', 'fr1'), { name: 'Ada', email: 'ada@x.test', status: 'new', createdAt: OLD });
  });
  const anon = () => env.unauthenticatedContext().firestore();
  const asMember = () => ctxFor('verU', true).firestore();
  const asAdmin = () => ctxFor('staff1', false).firestore();
  const asEditor = () => ctxFor('newStaff', false).firestore();
  const good = {
    name: 'Ada Lovelace', email: 'ada@example.org', organization: 'Analytical Ltd', phone: '',
    giverType: 'company', fundingFor: 'cohort', amount: 'unsure', message: 'We would like to fund a team.',
    status: 'new', createdAt: serverTimestamp(),
  };
  const cases = [
    ['funding: visitor sends the form (SupportMission)', 'anon', () => addDoc(collection(anon(), 'funding_requests'), good), 'allowed'],
    ['funding: member sends the form', 'verU', () => addDoc(collection(asMember(), 'funding_requests'), good), 'allowed'],
    ['funding: extra field', 'anon', () => addDoc(collection(anon(), 'funding_requests'), { ...good, staffAlerted: true }), 'denied'],
    ['funding: sent as already funded', 'anon', () => addDoc(collection(anon(), 'funding_requests'), { ...good, status: 'funded' }), 'denied'],
    ['funding: backdated', 'anon', () => addDoc(collection(anon(), 'funding_requests'), { ...good, createdAt: OLD }), 'denied'],
    ['funding: bad email', 'anon', () => addDoc(collection(anon(), 'funding_requests'), { ...good, email: 'not-an-email' }), 'denied'],
    ['funding: empty message', 'anon', () => addDoc(collection(anon(), 'funding_requests'), { ...good, message: '' }), 'denied'],
    ['funding: member reads a request', 'verU', () => getDoc(doc(asMember(), 'funding_requests', 'fr1')), 'denied'],
    ['funding: editor reads a request', 'newStaff', () => getDoc(doc(asEditor(), 'funding_requests', 'fr1')), 'denied'],
    ['funding: admin reads a request', 'staff1', () => getDoc(doc(asAdmin(), 'funding_requests', 'fr1')), 'allowed'],
    ['funding: admin marks it in touch', 'staff1', () => updateDoc(doc(asAdmin(), 'funding_requests', 'fr1'), { status: 'in_touch', teamNote: 'Called', updatedBy: 'staff1@x.test', updatedAt: serverTimestamp() }), 'allowed'],
    ['funding: member changes a request', 'verU', () => updateDoc(doc(asMember(), 'funding_requests', 'fr1'), { status: 'closed' }), 'denied'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

console.log(`\n=== MODE=${MODE} rules=${RULES} ===`);
rows.forEach((r) => console.log(r));
console.log(`\nRESULT ${MODE}: ${pass} passed, ${fail} failed`);
// On GitHub, show each failure as an error on the run's summary page (visible
// without opening the full log).
if (process.env.GITHUB_ACTIONS) {
  rows.filter((r) => r.startsWith('FAIL')).forEach((r) => console.log(`::error title=Database rules test failed::${r.replace(/\s+/g, ' ')}`));
}
await env.cleanup();
process.exit(fail ? 1 : 0);
