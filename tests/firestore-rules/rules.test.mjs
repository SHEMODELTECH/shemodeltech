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
    ['funding: a link in the message', 'anon', () => addDoc(collection(anon(), 'funding_requests'), { ...good, message: 'Details here: https://evil.example.com' }), 'denied'],
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

// ---- Contact us (shemodeltech.com/contact) ----
// Anyone can send a message, signed in or not; only admins can read or change them.
if (MODE !== 'orig') {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'contact_messages', 'cm1'), { name: 'Ada', email: 'ada@x.test', topic: 'general', reference: '', message: 'Hi', status: 'new', createdAt: OLD });
  });
  const anon = () => env.unauthenticatedContext().firestore();
  const good = { name: 'Ada Lovelace', email: 'ada@example.org', topic: 'letter', reference: '', message: 'Could I get a volunteer letter?', status: 'new', createdAt: serverTimestamp() };
  const cases = [
    ['contact: visitor sends a message', 'anon', () => addDoc(collection(anon(), 'contact_messages'), good), 'allowed'],
    ['contact: member sends a message', 'verU', () => addDoc(collection(ctxFor('verU', true).firestore(), 'contact_messages'), { ...good, topic: 'certificate', reference: 'SMT-123' }), 'allowed'],
    ['contact: unknown topic', 'anon', () => addDoc(collection(anon(), 'contact_messages'), { ...good, topic: 'hack' }), 'denied'],
    ['contact: extra field', 'anon', () => addDoc(collection(anon(), 'contact_messages'), { ...good, staffAlerted: true }), 'denied'],
    ['contact: a link in the message', 'anon', () => addDoc(collection(anon(), 'contact_messages'), { ...good, message: 'Please log in at https://evil.example.com/login' }), 'denied'],
    ['contact: www link in the message', 'anon', () => addDoc(collection(anon(), 'contact_messages'), { ...good, message: 'Visit www.evil.com today' }), 'denied'],
    ['contact: an email address in the message is fine', 'anon', () => addDoc(collection(anon(), 'contact_messages'), { ...good, message: 'You can also reach me at ada@example.org about Node.js/React' }), 'allowed'],
    ['contact: empty message', 'anon', () => addDoc(collection(anon(), 'contact_messages'), { ...good, message: '' }), 'denied'],
    ['contact: member reads a message', 'verU', () => getDoc(doc(ctxFor('verU', true).firestore(), 'contact_messages', 'cm1')), 'denied'],
    ['contact: admin reads a message', 'staff1', () => getDoc(doc(ctxFor('staff1', false).firestore(), 'contact_messages', 'cm1')), 'allowed'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Join the team (Team page): profile link from LinkedIn, GitHub, Behance, or Dribbble; no other links ----
if (MODE !== 'orig') {
  const anon = () => env.unauthenticatedContext().firestore();
  const app = { name: 'Ada Lovelace', email: 'ada@example.org', phone: '+1 555 0100', linkedinOrPortfolio: 'https://www.linkedin.com/in/ada',
    socialPlatform: 'Instagram', socialHandle: '@ada', role: 'content', otherRoles: [], hours: '3', why: 'I would love to help women grow in tech.',
    status: 'new', createdAt: serverTimestamp() };
  const cases = [
    ['team application: LinkedIn profile', 'anon', () => addDoc(collection(anon(), 'team_applications'), app), 'allowed'],
    ['team application: profile link on another site', 'anon', () => addDoc(collection(anon(), 'team_applications'), { ...app, linkedinOrPortfolio: 'https://evil.example.com/linkedin.com' }), 'denied'],
    ['team application: a link in "why"', 'anon', () => addDoc(collection(anon(), 'team_applications'), { ...app, why: 'See my work at www.evil.com' }), 'denied'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Cohort projects: the lead opens her project (Project setup) ----
// She Model Tech sets the team size; when none was set, the lead's roles set it once.
if (MODE !== 'orig') {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    const base = { projectTitle: 'Transit Planner', projectDescription: 'Plan routes', submitterId: 'verU', members: [], status: 'setup',
      isCohort: true, cohortId: 'c1', startDate: '2026-11-01', endDate: '2026-12-01', isActive: true };
    await setDoc(doc(db, 'projects', 'coNoSize'), { ...base, maxTeamSize: 0 });
    await setDoc(doc(db, 'projects', 'coSized'), { ...base, maxTeamSize: 5, roleSlots: 4 });
  });
  const lead = () => ctxFor('verU', true).firestore();
  const open = (extra) => ({ status: 'active', teamRoles: [{ role: 'Developer', count: 3 }], leadDetails: 'Weekly calls on Mondays', updatedAt: serverTimestamp(), ...extra });
  const cases = [
    ['cohort: lead opens a project with no team size set (roles set it)', 'verU', () => updateDoc(doc(lead(), 'projects', 'coNoSize'), open({ maxTeamSize: 4, roleSlots: 3 })), 'allowed'],
    ['cohort: lead changes a team size She Model Tech set', 'verU', () => updateDoc(doc(lead(), 'projects', 'coSized'), open({ maxTeamSize: 9, roleSlots: 8 })), 'denied'],
    ['cohort: lead opens a project with a set team size', 'verU', () => updateDoc(doc(lead(), 'projects', 'coSized'), open({})), 'allowed'],
    ['cohort: lead changes the dates', 'verU', () => updateDoc(doc(lead(), 'projects', 'coSized'), { endDate: '2027-01-01' }), 'denied'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Member directory (Talent Board and Search; written only by the server) ----
if (MODE !== 'orig') {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'public_index', 'members'), { chunks: 1, count: 1 });
  });
  const cases = [
    ['member directory: member reads it', 'verU', () => getDoc(doc(ctxFor('verU', true).firestore(), 'public_index', 'members')), 'allowed'],
    ['member directory: visitor reads it', 'anon', () => getDoc(doc(env.unauthenticatedContext().firestore(), 'public_index', 'members')), 'denied'],
    ['member directory: member rewrites it', 'verU', () => setDoc(doc(ctxFor('verU', true).firestore(), 'public_index', 'members'), { chunks: 0 }), 'denied'],
    ['member directory: admin rewrites it', 'staff1', () => setDoc(doc(ctxFor('staff1', false).firestore(), 'public_index', 'members_0'), { entries: [] }), 'denied'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Member-hosted events (Events → Host an event) ----
// Adult members (not companies, not under-18s) submit an event for review; it
// stays unpublished until staff publish it. Hosts edit or delete only their own
// unpublished events, and set the joining link on their own events.
if (MODE !== 'orig') {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'users', 'teenU'), member('teenU', { ageGroup: '13-17', createdAt: OLD }));
    await setDoc(doc(db, 'users', 'coU'), member('coU', { isCompany: true, createdAt: OLD }));
    const base = { title: 'Intro to Git', category: 'workshop', startAt: '2026-12-01T18:00:00.000Z', durationMins: 60, hosts: 'verU',
      description: 'A friendly hands-on start with Git and GitHub.', capacity: null, imageUrl: null, status: 'scheduled', createdAt: OLD };
    await setDoc(doc(db, 'events', 'evMine'), { ...base, hostUid: 'verU', hostName: 'verU', published: false, reviewStatus: 'pending' });
    await setDoc(doc(db, 'events', 'evMineLive'), { ...base, hostUid: 'verU', hostName: 'verU', published: true, reviewStatus: 'approved' });
    await setDoc(doc(db, 'events', 'evOther'), { ...base, hostUid: 'bob', hostName: 'bob', published: false, reviewStatus: 'pending' });
  });
  const as = (uid) => ctxFor(uid, true).firestore();
  const ev = (uid, extra = {}) => ({
    title: 'Resume clinic', category: 'workshop', startAt: '2026-12-05T17:00:00.000Z', durationMins: 60, hosts: uid,
    description: 'Bring your resume and we will review it together.', capacity: 30, imageUrl: null, published: false,
    status: 'scheduled', hostUid: uid, hostName: uid, reviewStatus: 'pending', createdAt: serverTimestamp(), ...extra,
  });
  const cases = [
    ['events: adult member submits an event for review', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU')), 'allowed'],
    ['events: member submits it already published', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU', { published: true })), 'denied'],
    ['events: member submits it as approved', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU', { reviewStatus: 'approved' })), 'denied'],
    ['events: member submits for someone else', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('bob')), 'denied'],
    ['events: under-18 submits an event', 'teenU', () => addDoc(collection(as('teenU'), 'events'), ev('teenU')), 'denied'],
    ['events: company submits an event', 'coU', () => addDoc(collection(as('coU'), 'events'), ev('coU')), 'denied'],
    ['events: host reads her unpublished event', 'verU', () => getDoc(doc(as('verU'), 'events', 'evMine')), 'allowed'],
    ['events: member reads someone else\'s unpublished event', 'verU', () => getDoc(doc(as('verU'), 'events', 'evOther')), 'denied'],
    ['events: host edits her event under review', 'verU', () => updateDoc(doc(as('verU'), 'events', 'evMine'), { title: 'Intro to Git and GitHub', updatedAt: serverTimestamp() }), 'allowed'],
    ['events: host publishes her own event', 'verU', () => updateDoc(doc(as('verU'), 'events', 'evMine'), { published: true }), 'denied'],
    ['events: host edits her published event', 'verU', () => updateDoc(doc(as('verU'), 'events', 'evMineLive'), { title: 'Changed' }), 'denied'],
    ['events: member edits someone else\'s event', 'verU', () => updateDoc(doc(as('verU'), 'events', 'evOther'), { title: 'Mine now' }), 'denied'],
    ['events: host sets her joining link', 'verU', () => setDoc(doc(as('verU'), 'events', 'evMine', 'private', 'info'), { joinUrl: 'https://meet.google.com/abc-defg-hij' }), 'allowed'],
    ['events: host sets a joining link that isn\'t a meeting service', 'verU', () => setDoc(doc(as('verU'), 'events', 'evMine', 'private', 'info'), { joinUrl: 'https://evil.example.com/zoom.us' }), 'denied'],
    ['events: a link in the event description', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU', { description: 'Sign up first at bit.ly/free-prize to get a seat at this workshop.' })), 'denied'],
    ['events: member sets another host\'s joining link', 'verU', () => setDoc(doc(as('verU'), 'events', 'evOther', 'private', 'info'), { joinUrl: 'https://evil.example.com' }), 'denied'],
    ['events: host deletes her published event', 'verU', () => deleteDoc(doc(as('verU'), 'events', 'evMineLive')), 'denied'],
    ['events: staff publishes a member event', 'staff1', () => updateDoc(doc(ctxFor('staff1', false).firestore(), 'events', 'evOther'), { published: true, reviewStatus: 'approved' }), 'allowed'],
    ['events: team member hosts a demo day for her project', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU', { category: 'demoday', projectId: 'p1', projectTitle: 'Team app' })), 'allowed'],
    ['events: links an event to a project she is not on', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU', { projectId: 'p2', projectTitle: 'Other' })), 'denied'],
    ['events: member event with 5 images', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU', { images: ['https://x/1.png', 'https://x/2.png', 'https://x/3.png', 'https://x/4.png', 'https://x/5.png'] })), 'allowed'],
    ['events: member event with 6 images', 'verU', () => addDoc(collection(as('verU'), 'events'), ev('verU', { images: ['a', 'b', 'c', 'd', 'e', 'f'] })), 'denied'],
    ['events: host deletes her event under review', 'verU', () => deleteDoc(doc(as('verU'), 'events', 'evMine')), 'allowed'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Founders (Founders page) ----
// Members 13+ (not companies) with at least one badge pitch an idea; staff
// accept or decline; accepted pitches are readable by members.
if (MODE !== 'orig') {
  const badge = [{ id: 'techdev', projectId: 'p1', category: 'development' }];
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'users', 'fdr'), member('fdr', { createdAt: OLD, badges: badge }));
    await setDoc(doc(db, 'users', 'fdrTeen'), member('fdrTeen', { ageGroup: '13-17', createdAt: OLD, badges: badge }));
    await setDoc(doc(db, 'users', 'fdrCo'), member('fdrCo', { isCompany: true, createdAt: OLD, badges: badge }));
    await setDoc(doc(db, 'users', 'fdrAcc'), member('fdrAcc', { createdAt: OLD, badges: badge }));
    const p = { name: 'x', ideaName: 'Clinic Buddy', problem: 'Patients forget their appointments.', audience: 'Small clinics', solution: 'Text reminders that patients can answer.', stage: 'idea', tracksNeeded: ['TechDev'], rolesNeeded: 'A developer', why: 'I work at a clinic and see it daily.', createdAt: OLD, updatedAt: OLD };
    await setDoc(doc(db, 'founder_pitches', 'fdrAcc'), { ...p, uid: 'fdrAcc', name: 'fdrAcc', status: 'accepted' });
    await setDoc(doc(db, 'founder_pitches', 'bob'), { ...p, uid: 'bob', name: 'bob', status: 'pending' });
  });
  const as = (uid) => ctxFor(uid, true).firestore();
  const pitch = (uid, extra = {}) => ({ uid, name: uid, ideaName: 'Study Buddy', tagline: 'Study partners matched by course', problem: 'Students study alone and give up.', audience: 'College students',
    solution: 'An app that matches study partners by course.', stage: 'prototype', tracksNeeded: ['TechDev', 'TechQA'], rolesNeeded: 'A frontend developer and a tester',
    why: 'I built the first version for my class.', status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp(), ...extra });
  const cases = [
    ['founders: member with a badge pitches', 'fdr', () => setDoc(doc(as('fdr'), 'founder_pitches', 'fdr'), pitch('fdr')), 'allowed'],
    ['founders: teen with a badge pitches (open to partner events)', 'fdrTeen', () => setDoc(doc(as('fdrTeen'), 'founder_pitches', 'fdrTeen'), pitch('fdrTeen', { partnerOptIn: true })), 'allowed'],
    ['founders: member without a badge pitches', 'verU', () => setDoc(doc(as('verU'), 'founder_pitches', 'verU'), pitch('verU')), 'denied'],
    ['founders: company pitches', 'fdrCo', () => setDoc(doc(as('fdrCo'), 'founder_pitches', 'fdrCo'), pitch('fdrCo')), 'denied'],
    ['founders: pitches as already accepted', 'fdrTeen', () => setDoc(doc(as('fdrTeen'), 'founder_pitches', 'fdrTeen'), pitch('fdrTeen', { status: 'accepted' })), 'denied'],
    ['founders: pitch for someone else', 'fdr', () => setDoc(doc(as('fdr'), 'founder_pitches', 'verU'), pitch('verU')), 'denied'],
    ['founders: a link in the pitch', 'fdr', () => updateDoc(doc(as('fdr'), 'founder_pitches', 'fdr'), { solution: 'See the demo at bit.ly/my-demo before you decide.', updatedAt: serverTimestamp() }), 'denied'],
    ['founders: founder accepts her own pitch', 'fdr', () => updateDoc(doc(as('fdr'), 'founder_pitches', 'fdr'), { status: 'accepted' }), 'denied'],
    ['founders: member reads an accepted pitch (now private)', 'verU', () => getDoc(doc(as('verU'), 'founder_pitches', 'fdrAcc')), 'denied'],
    ['founders: pitch without a tagline', 'fdrTeen', () => setDoc(doc(as('fdrTeen'), 'founder_pitches', 'fdrTeen'), pitch('fdrTeen', { tagline: '' })), 'denied'],
    ['founders: member reads a pitch under review', 'verU', () => getDoc(doc(as('verU'), 'founder_pitches', 'bob')), 'denied'],
    ['founders: accepted founder updates team needs', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_pitches', 'fdrAcc'), { tracksNeeded: ['TechQA'], rolesNeeded: 'A tester', updatedAt: serverTimestamp() }), 'allowed'],
    ['founders: accepted founder rewrites her pitch', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_pitches', 'fdrAcc'), { ideaName: 'Something else' }), 'denied'],
    ['founders: staff accepts a pitch', 'staff1', () => updateDoc(doc(ctxFor('staff1', false).firestore(), 'founder_pitches', 'bob'), { status: 'accepted', decisionNote: null, decidedBy: 'staff1@x.test', decidedAt: serverTimestamp() }), 'allowed'],
    ['founders: founder withdraws her pitch', 'fdr', () => deleteDoc(doc(as('fdr'), 'founder_pitches', 'fdr')), 'allowed'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Founder team groups ----
// The founder invites members with a badge; invitees join or decline
// themselves; only members read the chat (staff only after a report).
if (MODE !== 'orig') {
  const badge = [{ id: 'techdev', projectId: 'p1', category: 'development' }];
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'users', 'gMate'), member('gMate', { createdAt: OLD, badges: badge }));
    await setDoc(doc(db, 'users', 'gNoBadge'), member('gNoBadge', { createdAt: OLD }));
    await setDoc(doc(db, 'founder_groups', 'fdrAcc'), { founderUid: 'fdrAcc', name: 'Clinic Buddy team', members: ['fdrAcc'], memberNames: { fdrAcc: 'fdrAcc' }, invited: ['gMate'], status: 'active', reported: false, createdAt: OLD, updatedAt: OLD, lastMessageAt: OLD });
    await setDoc(doc(db, 'founder_groups', 'fdrAcc', 'messages', 'm1'), { senderUid: 'fdrAcc', senderName: 'fdrAcc', text: 'Welcome!', images: [], createdAt: OLD });
  });
  const as = (uid) => ctxFor(uid, true).firestore();
  const g = (uid) => doc(as(uid), 'founder_groups', 'fdrAcc');
  const cases = [
    ['groups: non-founder creates a group', 'verU', () => setDoc(doc(as('verU'), 'founder_groups', 'verU'), { founderUid: 'verU', name: 'x team', members: ['verU'], memberNames: {}, invited: [], status: 'active', reported: false }), 'denied'],
    ['groups: founder invites a member without a badge', 'fdrAcc', () => updateDoc(g('fdrAcc'), { invited: ['gMate', 'gNoBadge'], updatedAt: serverTimestamp() }), 'denied'],
    ['groups: outsider adds herself as a member', 'verU', () => updateDoc(g('verU'), { members: ['fdrAcc', 'verU'] }), 'denied'],
    ['groups: invitee reads the chat before joining', 'gMate', () => getDoc(doc(as('gMate'), 'founder_groups', 'fdrAcc', 'messages', 'm1')), 'denied'],
    ['groups: invitee joins', 'gMate', () => updateDoc(g('gMate'), { invited: [], members: ['fdrAcc', 'gMate'], 'memberNames.gMate': 'gMate', updatedAt: serverTimestamp() }), 'allowed'],
    ['groups: member reads the chat', 'gMate', () => getDoc(doc(as('gMate'), 'founder_groups', 'fdrAcc', 'messages', 'm1')), 'allowed'],
    ['groups: member sends a message with 3 images', 'gMate', () => addDoc(collection(as('gMate'), 'founder_groups', 'fdrAcc', 'messages'), { senderUid: 'gMate', senderName: 'gMate', text: 'Hi team, see github.com/x', images: ['a', 'b', 'c'], createdAt: serverTimestamp() }), 'allowed'],
    ['groups: member sends 4 images', 'gMate', () => addDoc(collection(as('gMate'), 'founder_groups', 'fdrAcc', 'messages'), { senderUid: 'gMate', senderName: 'gMate', text: '', images: ['a', 'b', 'c', 'd'], createdAt: serverTimestamp() }), 'denied'],
    ['groups: member edits the founder\'s message', 'gMate', () => updateDoc(doc(as('gMate'), 'founder_groups', 'fdrAcc', 'messages', 'm1'), { text: 'Changed', editedAt: serverTimestamp() }), 'denied'],
    ['groups: staff reads an unreported group chat', 'staff1', () => getDoc(doc(ctxFor('staff1', false).firestore(), 'founder_groups', 'fdrAcc', 'messages', 'm1')), 'denied'],
    ['groups: member reports the group', 'gMate', () => updateDoc(g('gMate'), { reported: true, reportedAt: serverTimestamp() }), 'allowed'],
    ['groups: staff reads a reported group chat', 'staff1', () => getDoc(doc(ctxFor('staff1', false).firestore(), 'founder_groups', 'fdrAcc', 'messages', 'm1')), 'allowed'],
    ['groups: founder deletes a member\'s message', 'fdrAcc', async () => { const r = await addDoc(collection(as('gMate'), 'founder_groups', 'fdrAcc', 'messages'), { senderUid: 'gMate', senderName: 'gMate', text: 'oops', images: [], createdAt: serverTimestamp() }); return deleteDoc(doc(as('fdrAcc'), 'founder_groups', 'fdrAcc', 'messages', r.id)); }, 'allowed'],
    ['groups: founder archives the group', 'fdrAcc', () => updateDoc(g('fdrAcc'), { status: 'archived', updatedAt: serverTimestamp() }), 'allowed'],
    ['groups: message in an archived group', 'gMate', () => addDoc(collection(as('gMate'), 'founder_groups', 'fdrAcc', 'messages'), { senderUid: 'gMate', senderName: 'gMate', text: 'Still here?', images: [], createdAt: serverTimestamp() }), 'denied'],
    ['groups: member leaves', 'gMate', () => updateDoc(g('gMate'), { members: ['fdrAcc'], 'memberNames.gMate': deleteField(), updatedAt: serverTimestamp() }), 'allowed'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Founder cards (the public part of an accepted pitch) ----
if (MODE !== 'orig') {
  const as = (uid) => ctxFor(uid, true).firestore();
  const staff = () => ctxFor('staff1', false).firestore();
  const card = { uid: 'fdrAcc', name: 'fdrAcc', ideaName: 'Clinic Buddy', tagline: 'Reminders for small clinics', stage: 'idea', tracksNeeded: ['TechDev'], rolesNeeded: 'A developer', acceptingTeam: true };
  const cases = [
    ['cards: staff publishes a founder card', 'staff1', () => setDoc(doc(staff(), 'founder_cards', 'fdrAcc'), card), 'allowed'],
    ['cards: member publishes her own card', 'fdr', () => setDoc(doc(as('fdr'), 'founder_cards', 'fdr'), { ...card, uid: 'fdr' }), 'denied'],
    ['cards: member reads a founder card', 'verU', () => getDoc(doc(as('verU'), 'founder_cards', 'fdrAcc')), 'allowed'],
    ['cards: founder updates her team needs and tagline', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_cards', 'fdrAcc'), { tracksNeeded: ['TechQA'], rolesNeeded: 'A tester', tagline: 'Text reminders for clinics', updatedAt: serverTimestamp() }), 'allowed'],
    ['cards: founder renames her idea on the card', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_cards', 'fdrAcc'), { ideaName: 'Something else' }), 'denied'],
    ['cards: someone edits another founder\'s card', 'verU', () => updateDoc(doc(as('verU'), 'founder_cards', 'fdrAcc'), { rolesNeeded: 'Nobody', updatedAt: serverTimestamp() }), 'denied'],
  ];
  for (const [name, who, fn, want] of cases) check(name, who, await attempt(fn), want);
}

// ---- Founders: conference details, pitch slots, attendance ----
if (MODE !== 'orig') {
  const as = (uid) => ctxFor(uid, true).firestore();
  const staff = () => ctxFor('staff1', false).firestore();
  const cases = [
    ['conference: staff saves the details', 'staff1', () => setDoc(doc(staff(), 'founders_conference', 'info'), { dateText: 'March 20, 2027', venue: 'Online', joinLink: 'https://meet.google.com/abc' }), 'allowed'],
    ['conference: member edits the details', 'verU', () => setDoc(doc(as('verU'), 'founders_conference', 'info'), { venue: 'Somewhere else' }), 'denied'],
    ['conference: member reads the details', 'verU', () => getDoc(doc(as('verU'), 'founders_conference', 'info')), 'allowed'],
    ['founders: staff sets a pitch slot', 'staff1', () => updateDoc(doc(staff(), 'founder_pitches', 'fdrAcc'), { pitchSlot: '2027-03-20T14:15:00.000Z', slotNote: 'Room B', slotSetAt: serverTimestamp() }), 'allowed'],
    ['founders: founder sets her own pitch slot', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_pitches', 'fdrAcc'), { pitchSlot: '2027-03-20T09:00:00.000Z' }), 'denied'],
    ['founders: founder opts in to partner events', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_pitches', 'fdrAcc'), { partnerOptIn: true, updatedAt: serverTimestamp() }), 'allowed'],
    ['founders: partner opt-in that is not yes/no', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_pitches', 'fdrAcc'), { partnerOptIn: 'maybe', updatedAt: serverTimestamp() }), 'denied'],
    ['founders: founder confirms she will be there', 'fdrAcc', () => updateDoc(doc(as('fdrAcc'), 'founder_pitches', 'fdrAcc'), { attendance: 'yes', attendanceAt: serverTimestamp(), updatedAt: serverTimestamp() }), 'allowed'],
    ['founders: someone else answers for the founder', 'verU', () => updateDoc(doc(as('verU'), 'founder_pitches', 'fdrAcc'), { attendance: 'no', attendanceAt: serverTimestamp(), updatedAt: serverTimestamp() }), 'denied'],
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
