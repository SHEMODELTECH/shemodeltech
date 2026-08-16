// src/Pages/Messages.jsx - Follow-based messaging system (fully responsive)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  limitToLast,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { sendPush } from '../utils/pushNotifications';

const getConversationId = (uid1, uid2) => [uid1, uid2].sort().join('_');

const formatTime = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getDisplayName = (user) => {
  if (!user) return 'User';
  if (user.displayName) return user.displayName;
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return full || user.email?.split('@')[0] || 'User';
};

const Avatar = ({ user, size = 'md' }) => {
  const sz =
    size === 'sm' ? 'w-8 h-8 text-xs' :
    size === 'lg' ? 'w-14 h-14 text-lg' :
    'w-10 h-10 text-sm';
  const initial = (getDisplayName(user)?.[0] || 'U').toUpperCase();
  return user?.photoURL ? (
    <img src={user.photoURL} alt="" className={`${sz} rounded-full object-cover flex-shrink-0 border-2 border-gray-200`} />
  ) : (
    <div className={`${sz} rounded-full bg-blue-600 flex items-center justify-center text-gray-900 font-bold flex-shrink-0`}>
      {initial}
    </div>
  );
};

const Messages = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId]   = useState(null);
  const [activeUser, setActiveUser]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [newMessage, setNewMessage]       = useState('');
  const [sending, setSending]             = useState(false);
  const [loading, setLoading]             = useState(true);
  const [unreadCounts, setUnreadCounts]   = useState({});
  const [mobileView, setMobileView]       = useState('list'); // 'list' | 'chat'
  const [myData, setMyData]               = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  // Load own profile (needed for the account-type messaging rules). The full
  // member list is no longer fetched - conversations start from profiles only.
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const meSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (meSnap.exists()) setMyData({ uid: currentUser.uid, ...meSnap.data() });
      } catch (e) {
        console.error('Error loading profile:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  // Listen to conversations
  const userCacheRef = useRef({});
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid)
    );
    const unsub = onSnapshot(q, async (snap) => {
      try {
        const convs = await Promise.all(
          snap.docs.map(async (d) => {
            const data = d.data();
            const otherId = data.participants.find(p => p !== currentUser.uid);
            if (!userCacheRef.current[otherId]) {
              const otherSnap = await getDoc(doc(db, 'users', otherId));
              userCacheRef.current[otherId] = otherSnap.exists()
                ? { uid: otherId, ...otherSnap.data() }
                : { uid: otherId, displayName: 'Unknown' };
            }
            return { id: d.id, ...data, otherUser: userCacheRef.current[otherId] };
          })
        );
        // Sort newest-first client-side (avoids needing a composite index).
        convs.sort((a, b) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0));
        setConversations(convs);
        const counts = {};
        convs.forEach(c => {
          const n = c.unreadBy?.[currentUser.uid] || 0;
          if (n > 0) counts[c.id] = n;
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error('Error loading conversations:', err);
      }
    });
    return () => unsub();
  }, [currentUser]);

  // URL param ?with=uid or ?to=uid - auto-open conversation
  useEffect(() => {
    const targetUid = searchParams.get('with') || searchParams.get('to');
    if (targetUid && !loading) openConversation(targetUid);
  }, [searchParams, loading]);

  // Listen to messages in active conv
  useEffect(() => {
    if (!activeConvId) return;
    const q = query(
      collection(db, 'conversations', activeConvId, 'messages'),
      orderBy('createdAt', 'asc'),
      limitToLast(200)
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    markAsRead(activeConvId);
    return () => unsub();
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const markAsRead = async (convId) => {
    try {
      await updateDoc(doc(db, 'conversations', convId), {
        [`unreadBy.${currentUser.uid}`]: 0,
      });
    } catch (_) {}
  };

  const openConversation = async (targetUid) => {
    if (!targetUid) { toast.error('Could not start chat: missing user.'); return; }
    if (!currentUser || targetUid === currentUser.uid) return;
    try {
      const convId  = getConversationId(currentUser.uid, targetUid);
      const convRef = doc(db, 'conversations', convId);
      const convSnap = await getDoc(convRef);

      // Fetch the target's profile up front (also used for the cap check)
      const otherSnap = await getDoc(doc(db, 'users', targetUid));
      const otherUser = otherSnap.exists() ? { uid: targetUid, ...otherSnap.data() } : { uid: targetUid };

      if (!convSnap.exists()) {
        // NEW conversation. Messaging is unlimited for everyone - any member
        // can start a conversation with any other member or company.
        await setDoc(convRef, {
          participants:  [currentUser.uid, targetUid],
          lastMessage:   '',
          lastMessageAt: serverTimestamp(),
          createdAt:     serverTimestamp(),
          unreadBy:      { [currentUser.uid]: 0, [targetUid]: 0 },
        });
      }

      setActiveConvId(convId);
      setActiveUser(otherUser);
      setMobileView('chat');
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error('Error opening conversation:', err, 'code=', err?.code);
      toast.error('Could not start chat: ' + (err?.message || 'unknown error'));
    }
  };

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !activeConvId || sending) return;
    setSending(true);
    setNewMessage('');
    try {
      await addDoc(collection(db, 'conversations', activeConvId, 'messages'), {
        text,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'conversations', activeConvId), {
        lastMessage:   text,
        lastMessageAt: serverTimestamp(),
        [`unreadBy.${activeUser?.uid}`]: (unreadCounts[activeConvId] || 0) + 1,
      });
      // Push to the recipient (non-blocking).
      if (activeUser?.uid) {
        sendPush({
          recipientUid: activeUser.uid,
          title: `New message from ${myData?.displayName || currentUser.displayName || 'someone'}`,
          body: text.length > 80 ? text.slice(0, 80) + '…' : text,
          link: '/messages',
        });
      }
    } catch (e) {
      console.error('Send error:', e);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const goBackToList = () => {
    setMobileView('list');
    setActiveConvId(null);
    setActiveUser(null);
    setMessages([]);
  };

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      

      {/* Fill remaining viewport; works with both 64px and 80px navbar heights */}
      <div className="bg-gray-50 flex flex-col" style={{ height: 'calc(100svh - 4rem)' }}>
        <div className="flex flex-col flex-1 overflow-hidden max-w-6xl w-full mx-auto md:px-4 md:py-4">

          {/* Main card */}
          <div className="flex flex-1 overflow-hidden bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200">

            {/* ── SIDEBAR ───────────────────────────────────────────── */}
            <div className={`
              flex-col border-r border-gray-200 bg-white
              w-full md:w-72 lg:w-80 flex-shrink-0
              ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}
            `}>

              {/* Sidebar header. Conversations can ONLY be started from a
                  member's profile (open a profile -> Message), so there is
                  no member search / new-conversation picker here. */}
              <div className="px-4 py-3.5 border-b border-gray-200 flex-shrink-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900">Messages</h1>
                {totalUnread > 0 && (
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{totalUnread} unread</p>
                )}
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No conversations yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Start a conversation from a member's profile - open their profile and tap Message
                    </p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setActiveUser(conv.otherUser);
                                          setMobileView('chat');
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100
                        hover:bg-gray-50 active:bg-gray-100 transition-colors text-left
                        ${activeConvId === conv.id ? 'bg-blue-50 border-l-[3px] border-l-orange-500' : ''}
                      `}
                    >
                      <Avatar user={conv.otherUser} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{getDisplayName(conv.otherUser)}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(conv.lastMessageAt)}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.lastMessage || 'Start the conversation'}
                        </p>
                      </div>
                      {unreadCounts[conv.id] > 0 && (
                        <span className="flex-shrink-0 bg-blue-600 text-white text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center font-bold">
                          {unreadCounts[conv.id] > 9 ? '9+' : unreadCounts[conv.id]}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* ── CHAT PANEL ────────────────────────────────────────── */}
            <div className={`
              flex-col flex-1 min-w-0 bg-white
              ${mobileView === 'chat' ? 'flex' : 'hidden md:flex'}
            `}>
              {activeConvId && activeUser ? (
                <>
                  {/* Chat header */}
                  <div className="px-3 md:px-4 py-3 border-b border-gray-200 flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <button
                      onClick={goBackToList}
                      className="md:hidden p-2 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 text-gray-600 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                      aria-label="Back"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <Avatar user={activeUser} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{getDisplayName(activeUser)}</p>
                      {(activeUser?.specialization || (activeUser?.isCompany ? 'Company / Organisation' : '')) && (
                        <p className="text-xs text-gray-500 font-medium truncate">{activeUser?.specialization || 'Company / Organisation'}</p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/profile/${activeUser.email || activeUser.uid}`)}
                      className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors min-h-[36px]"
                    >
                      Profile
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-5 py-4 space-y-2 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <Avatar user={activeUser} size="lg" />
                        <p className="mt-3 font-bold text-gray-800">{getDisplayName(activeUser)}</p>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs">You're connected! Send a message to get started 👋</p>
                      </div>
                    ) : (
                      messages.map(msg => {
                        const isOwn = msg.senderId === currentUser.uid;
                        return (
                          <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isOwn && <Avatar user={activeUser} size="sm" />}
                            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[78%] sm:max-w-[65%]`}>
                              <div className={`
                                px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words overflow-hidden
                                ${isOwn
                                  ? 'bg-blue-600 text-white rounded-br-sm'
                                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'}
                              `} style={{ overflowWrap: 'anywhere' }}>
                                {msg.text}
                              </div>
                              <p className="text-xs text-gray-400 mt-1 px-1">{formatTime(msg.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div className="px-3 sm:px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                        }}
                        placeholder="Type a message..."
                        maxLength={2000}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[44px] placeholder-gray-400"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 transition-colors flex-shrink-0 flex items-center justify-center"
                        aria-label="Send"
                      >
                        {sending ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state - desktop only */
                <div className="flex-col flex-1 items-center justify-center text-center p-10 bg-gray-50 hidden md:flex">
                  <div className="w-20 h-20 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Your messages</h2>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Select a conversation, or start a new one from a member's profile - open their profile and tap Message.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
