// src/utils/teamForum.js
// Helpers for the project team forum (projects/{id}/forum): links, @mentions
// limited to the project's team, and who to notify (each person once).
import { notifyMember } from './staffAlerts';

// Opens the workspace on the Discussion tab, scrolled to one post or reply.
export const teamForumLink = (projectId, itemId) =>
  `/projects/${projectId}/workspace?tab=forum${itemId ? `&post=${itemId}` : ''}`;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// People who can be tagged: the team (owner + approved members) and any
// organization observers, one entry per uid. [{ uid, name, photo }]
export const buildMentionables = (teamMembers = [], observers = []) => {
  const seen = new Set();
  const out = [];
  const add = (uid, name, photo) => {
    const n = (name || '').trim();
    if (!uid || !n || seen.has(uid)) return;
    seen.add(uid);
    out.push({ uid, name: n, photo: photo || null });
  };
  teamMembers.forEach((m) => add(m.uid, m.displayName || m.applicantName, m.photoURL));
  observers.forEach((o) => add(o.uid, o.name, o.photoURL || o.photo));
  return out;
};

// The uids of teammates tagged as "@Full Name" in the text.
export const findMentions = (text, people = []) => {
  if (!text) return [];
  const uids = [];
  people.forEach((p) => {
    const re = new RegExp(`@${escapeRe(p.name)}(?![\\p{L}\\p{N}])`, 'iu');
    if (re.test(text) && !uids.includes(p.uid)) uids.push(p.uid);
  });
  return uids;
};

// Split text into plain and "@Name" pieces for display: [{ text, mention }]
export const splitMentions = (text, people = []) => {
  if (!text) return [];
  const names = [...new Set(people.map((p) => p.name))].sort((a, b) => b.length - a.length);
  if (!names.length) return [{ text, mention: false }];
  const re = new RegExp(`(@(?:${names.map(escapeRe).join('|')}))(?![\\p{L}\\p{N}])`, 'giu');
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), mention: false });
    out.push({ text: m[0], mention: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), mention: false });
  return out;
};

// Send each recipient one notice. `plan` is a list of [uid, notice] in
// priority order: the first notice for a uid wins, later ones are skipped.
// Never notifies `meUid`. Bell + push, no email (the daily digest covers it).
export const sendTeamNotices = (meUid, plan) => {
  const done = new Set([meUid]);
  plan.forEach(([uid, n]) => {
    if (!uid || done.has(uid)) return;
    done.add(uid);
    notifyMember(uid, { ...n, sendEmail: false, push: true });
  });
};
