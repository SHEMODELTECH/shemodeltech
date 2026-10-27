// src/Pages/FounderGroup.jsx
// A founder's team group (shemodeltech.com/founders/group/:gid): the team chat
// (text, emojis, links with a "you're leaving" warning, up to 3 images, edit
// and delete), the members, and the founder's tools: invite members with a
// badge from her conversations, remove people, archive, reopen, or delete.
// Private to members; staff can read it only after it's reported.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import ReportButton from '../components/ReportButton';
import { shrinkImage } from '../components/EventImages';
import { uploadImageToBlob, validateImageFile } from '../utils/blobStorage';
import {
  MAX_GROUP, MAX_IMAGES, MAX_TEXT, acceptInvite, cancelInvite, conversationPartners, declineInvite, deleteGroup,
  deleteMessage, editMessage, invite, leaveGroup, markReported, removeMember, sendMessage, setGroupStatus,
  watchGroup, watchMessages,
} from '../utils/founderGroups';

const EMOJIS = ['😀', '😂', '👍', '🙏', '🎉', '❤️', '🔥', '👏', '✅', '🚀', '💡', '👀'];
const URL_RE = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

// Text with clickable links; opening one asks first ("you're leaving").
const Linkified = ({ text }) => {
  const parts = String(text || '').split(URL_RE);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <React.Fragment key={i}>{part}</React.Fragment>;
    const href = /^https?:\/\//i.test(part) ? part : `https://${part}`;
    return (
      <a key={i} href={href} target="_blank" rel="noopener noreferrer nofollow" className="underline break-all"
        onClick={(e) => { if (!window.confirm(`You’re leaving She Model Tech to open:\n${href}\n\nOnly open links from people you trust. Never enter your password or payment details on a site someone sent you.`)) e.preventDefault(); }}>
        {part}
      </a>
    );
  });
};

const when = (ts) => {
  const d = ts?.toDate ? ts.toDate() : null;
  if (!d) return '';
  const same = new Date().toDateString() === d.toDateString();
  return same ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const FounderGroup = () => {
  const { gid } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const me = currentUser?.uid;
  const [group, setGroup] = useState(undefined);
  const [msgs, setMsgs] = useState(undefined);
  const [myName, setMyName] = useState('');
  const [isStaff, setIsStaff] = useState(false);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editing, setEditing] = useState(null); // { id, text }
  const [partners, setPartners] = useState(null);
  const [invitedNames, setInvitedNames] = useState({});
  const endRef = useRef(null);

  useEffect(() => {
    if (!me) return undefined;
    getDoc(doc(db, 'users', me)).then((s) => {
      const d = s.data() || {};
      setMyName(d.displayName || currentUser.displayName || 'Member');
      setIsStaff(['admin', 'editor'].includes(d.role));
    }).catch(() => {});
    return watchGroup(gid, setGroup);
  }, [gid, me]); // eslint-disable-line react-hooks/exhaustive-deps

  const isMember = !!group && (group.members || []).includes(me);
  const isFounder = !!group && group.founderUid === me;
  const isInvited = !!group && (group.invited || []).includes(me);
  const canRead = isMember || (isStaff && group?.reported);
  const archived = group?.status === 'archived';

  useEffect(() => {
    if (!canRead) return undefined;
    return watchMessages(gid, setMsgs);
  }, [gid, canRead]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [msgs?.length]);
  useEffect(() => {
    if (isFounder && partners === null) conversationPartners(me).then(setPartners).catch(() => setPartners([]));
  }, [isFounder, me, partners]);

  // Names of people with a pending invite (shown to the founder).
  const invitedKey = (group?.invited || []).join(',');
  useEffect(() => {
    if (!isFounder || !invitedKey) return;
    invitedKey.split(',').filter((uid) => !invitedNames[uid]).forEach((uid) => {
      getDoc(doc(db, 'users', uid)).then((s) => setInvitedNames((m) => ({ ...m, [uid]: s.data()?.displayName || 'Member' }))).catch(() => {});
    });
  }, [isFounder, invitedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const room = group ? MAX_GROUP - (group.members || []).length - (group.invited || []).length : 0;
  const names = group?.memberNames || {};
  const memberList = useMemo(() => (group?.members || []).map((uid) => ({ uid, name: names[uid] || 'Member' }))
    .sort((a, b) => (a.uid === group.founderUid ? -1 : b.uid === group.founderUid ? 1 : a.name.localeCompare(b.name))), [group]); // eslint-disable-line react-hooks/exhaustive-deps

  const addImages = async (files) => {
    const picked = Array.from(files || []).slice(0, MAX_IMAGES - images.length);
    if (!picked.length) return;
    for (const f of picked) { const bad = validateImageFile(f); if (bad) { toast.error(bad); return; } }
    setUploading(true);
    const urls = [];
    for (const f of picked) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const small = await shrinkImage(f);
        // eslint-disable-next-line no-await-in-loop
        urls.push((await uploadImageToBlob(small, 'founders')).url);
      } catch (_) { toast.error(`Could not upload ${f.name}. Please try again.`); }
    }
    setImages((xs) => [...xs, ...urls].slice(0, MAX_IMAGES));
    setUploading(false);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() && !images.length) return;
    setSending(true);
    try {
      await sendMessage(gid, { uid: me, name: myName }, text.trim(), images);
      setText(''); setImages([]);
    } catch (_) { toast.error('Could not send. Please try again.'); }
    setSending(false);
  };
  const saveEdit = async () => {
    if (!editing.text.trim()) return;
    try { await editMessage(gid, editing.id, editing.text.trim()); setEditing(null); } catch (_) { toast.error('Could not save the change.'); }
  };
  const del = async (m) => {
    if (!window.confirm('Delete this message for everyone?')) return;
    try { await deleteMessage(gid, m.id); } catch (_) { toast.error('Could not delete it.'); }
  };
  const act = async (fn, ok) => { try { await fn(); if (ok) toast.success(ok); } catch (_) { toast.error('Something went wrong. Please try again.'); } };

  if (group === undefined) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" /></div>;
  if (group === null) {
    return (
      <div className="max-w-6xl mx-auto [&>*]:max-w-2xl">
        <p className="text-gray-900 font-semibold">This team group doesn’t exist any more.</p>
        <Link to="/founders" className="inline-block mt-3 text-sm font-semibold text-pink-700 hover:underline">← Back to Founders</Link>
      </div>
    );
  }
  if (!canRead) {
    return (
      <div className="max-w-6xl mx-auto [&>*]:max-w-2xl">
        <Link to="/founders" className="text-sm font-semibold text-gray-600 hover:text-gray-900">← Founders</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">{group.name}</h1>
        {isInvited ? (
          <div className="mt-4 rounded-2xl border border-pink-200 bg-white p-5">
            <p className="font-semibold text-gray-900">{names[group.founderUid] || 'The founder'} invited you to join this team.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => act(() => acceptInvite(gid, me, myName), 'Welcome to the team!')} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Join</button>
              <button type="button" onClick={() => act(() => declineInvite(gid, me).then(() => navigate('/founders')), 'Invite declined.')} className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Decline</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mt-2">This team group is private to its members.</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/founders" className="text-sm font-semibold text-gray-600 hover:text-gray-900">← Founders</Link>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{group.name}</h1>
        {archived && <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">Archived</span>}
        {!isMember && isStaff && <span className="text-xs font-bold bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full">Staff view (reported)</span>}
      </div>
      <p className="text-sm text-gray-500 mt-1">{memberList.length} of {MAX_GROUP} people · Be kind, keep it about the work, and never share passwords or payment details.</p>

      <div className="mt-5 grid lg:grid-cols-3 gap-5">
        {/* Chat */}
        <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white flex flex-col min-h-[60vh]" aria-label="Team chat">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[65vh]">
            {msgs === undefined ? <p className="text-sm text-gray-400">Loading…</p>
              : msgs === null ? <p className="text-sm text-gray-500">Could not load the chat.</p>
              : msgs.length === 0 ? <p className="text-sm text-gray-500 text-center py-10">No messages yet. Say hello to your team 👋</p>
              : msgs.map((m) => {
                const mine = m.senderUid === me;
                return (
                  <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{mine ? 'You' : m.senderName}</span>{m.senderUid === group.founderUid ? ' · Founder' : ''} · {when(m.createdAt)}{m.editedAt ? ' · edited' : ''}</p>
                    {editing?.id === m.id ? (
                      <div className="mt-1 w-full max-w-md">
                        <textarea rows={3} value={editing.text} maxLength={MAX_TEXT} onChange={(e) => setEditing({ ...editing, text: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        <div className="flex gap-2 justify-end mt-1">
                          <button type="button" onClick={() => setEditing(null)} className="text-xs font-semibold text-gray-600">Cancel</button>
                          <button type="button" onClick={saveEdit} className="text-xs font-semibold bg-gray-900 text-white px-3 py-1 rounded-lg">Save</button>
                        </div>
                      </div>
                    ) : (
                      <div className={`mt-1 max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${mine ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        {m.text && <Linkified text={m.text} />}
                        {(m.images || []).length > 0 && (
                          <div className={`flex flex-wrap gap-2 ${m.text ? 'mt-2' : ''}`}>
                            {m.images.map((u) => (
                              <a key={u} href={u} target="_blank" rel="noopener noreferrer"><img src={u} alt="" loading="lazy" className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-lg bg-white" /></a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {isMember && !archived && editing?.id !== m.id && (mine || isFounder) && (
                      <div className="mt-0.5 flex gap-3 text-xs">
                        {mine && m.text && <button type="button" onClick={() => setEditing({ id: m.id, text: m.text })} className="text-gray-500 hover:text-gray-900">Edit</button>}
                        <button type="button" onClick={() => del(m)} className="text-gray-500 hover:text-red-600">Delete</button>
                      </div>
                    )}
                  </div>
                );
              })}
            <div ref={endRef} />
          </div>

          {isMember && (archived ? (
            <p className="border-t border-gray-100 p-4 text-sm text-gray-600">This group is archived, so the chat is read-only.{isFounder ? ' You can reopen it any time.' : ''}</p>
          ) : (
            <form onSubmit={send} className="border-t border-gray-100 p-3">
              {images.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {images.map((u, i) => (
                    <span key={u} className="relative">
                      <img src={u} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                      <button type="button" aria-label="Remove image" onClick={() => setImages((xs) => xs.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 text-white text-xs">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1 mb-2" aria-label="Emojis">
                {EMOJIS.map((em) => <button key={em} type="button" onClick={() => setText((t) => (t + em).slice(0, MAX_TEXT))} className="w-8 h-8 rounded-lg hover:bg-gray-100 text-lg">{em}</button>)}
              </div>
              <div className="flex items-end gap-2">
                <textarea rows={2} value={text} maxLength={MAX_TEXT} onChange={(e) => setText(e.target.value)} placeholder="Write to your team…"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e); } }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                <label className={`flex-shrink-0 text-sm font-semibold border border-gray-300 px-3 py-2 rounded-lg ${uploading || images.length >= MAX_IMAGES ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}`} title={`Add up to ${MAX_IMAGES} images`}>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" disabled={uploading || images.length >= MAX_IMAGES}
                    onChange={(e) => { const fl = e.target.files; addImages(fl); e.target.value = ''; }} />
                  {uploading ? '…' : '🖼'}
                </label>
                <button type="submit" disabled={sending || uploading || (!text.trim() && !images.length)} className="flex-shrink-0 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">Send</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">{text.length} / {MAX_TEXT} · up to {MAX_IMAGES} images · Enter to send, Shift+Enter for a new line</p>
            </form>
          ))}
        </section>

        {/* People and settings */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-bold text-gray-900">Members</h2>
            <ul className="mt-2 space-y-2">
              {memberList.map((p) => (
                <li key={p.uid} className="flex items-center justify-between gap-2 text-sm">
                  <Link to={`/profile/${encodeURIComponent(p.uid)}`} className="truncate font-semibold text-gray-800 hover:text-pink-700">{p.name}{p.uid === group.founderUid ? <span className="ml-1.5 text-[10px] font-bold uppercase bg-gray-900 text-white px-1.5 py-0.5 rounded">Founder</span> : null}</Link>
                  {isFounder && p.uid !== me && (
                    <button type="button" onClick={() => window.confirm(`Remove ${p.name} from the group?`) && act(() => removeMember(gid, p.uid), 'Removed.')} className="text-xs text-gray-500 hover:text-red-600">Remove</button>
                  )}
                </li>
              ))}
            </ul>
            {isFounder && (group.invited || []).length > 0 && (
              <>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4">Invited</h3>
                <ul className="mt-1 space-y-1">
                  {group.invited.map((uid) => (
                    <li key={uid} className="flex items-center justify-between text-sm">
                      <span className="truncate text-gray-700">{invitedNames[uid] || (partners || []).find((x) => x.uid === uid)?.name || 'Member'}</span>
                      <button type="button" onClick={() => act(() => cancelInvite(gid, uid), 'Invite cancelled.')} className="text-xs text-gray-500 hover:text-red-600">Cancel</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {isFounder && !archived && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <h2 className="text-sm font-bold text-gray-900">Invite to the group</h2>
              <p className="text-xs text-gray-500 mt-0.5">People you’ve messaged. They need at least one badge, and they choose to join. {room} {room === 1 ? 'place' : 'places'} left.</p>
              {partners === null ? <p className="text-xs text-gray-400 mt-2">Loading…</p> : partners.length === 0 ? (
                <p className="text-sm text-gray-600 mt-2">Message members first (Founders page or Talent Board), then invite them here.</p>
              ) : (
                <ul className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                  {partners.map((p) => {
                    const inGroup = (group.members || []).includes(p.uid);
                    const invited = (group.invited || []).includes(p.uid);
                    return (
                      <li key={p.uid} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-gray-800">{p.name}</span>
                        {inGroup ? <span className="text-xs text-gray-400">Member</span>
                          : invited ? <span className="text-xs text-pink-700">Invited</span>
                          : !p.hasBadge ? <span className="text-xs text-gray-400" title="Joining a founder’s team needs at least one badge">Needs a badge</span>
                          : <button type="button" disabled={room <= 0} onClick={() => act(() => invite(group, p.uid, p.name, myName), `${p.name} was invited.`)} className="text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg disabled:opacity-50">Invite</button>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2">
            {isFounder ? (
              <>
                <button type="button" onClick={() => act(() => setGroupStatus(gid, archived ? 'active' : 'archived'), archived ? 'Group reopened.' : 'Group archived.')} className="w-full text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">{archived ? 'Reopen the group' : 'Archive the group'}</button>
                <p className="text-xs text-gray-500">Archive after your pitch: the chat stays readable, but no new messages. Reopen it any time to keep going.</p>
                <button type="button" onClick={() => window.confirm('Delete this group and all its messages for everyone? This can’t be undone.') && act(() => deleteGroup(gid).then(() => navigate('/founders')), 'Group deleted.')} className="w-full text-sm font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg">Delete the group</button>
              </>
            ) : isMember ? (
              <button type="button" onClick={() => window.confirm('Leave this group? You’ll need a new invite to come back.') && act(() => leaveGroup(gid, me).then(() => navigate('/founders')), 'You left the group.')} className="w-full text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Leave the group</button>
            ) : null}
            {isMember && (
              <div className="text-center">
                <ReportButton label="Report this group" target={{ area: 'founder_group', kind: 'group', path: '', link: `/founders/group/${gid}`, excerpt: group.name }}
                  me={{ uid: me, name: myName }} onSent={() => markReported(gid).catch(() => {})} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FounderGroup;
