// src/components/TopBarIcons.jsx
// The four icons at the top right for signed-in members: Proof Wall,
// Messaging, Notifications and Me. Shared by the app's top bar (AppLayout) and
// the public pages' top bar (Navbar: Events, About, Learning…), so they look
// and behave the same on every page.
//   Desktop: icon with a small label underneath and a pink line under the
//   current page. Phones: icons only, sized for thumbs.
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Proof Wall: a gear with a check in the middle (verified work).
const GEAR = 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
export const PROOF_WALL_ICON = `${GEAR} M9.5 12.2l1.8 1.8 3.4-3.6`;
const CHAT = 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';
const BELL = 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';

const Badge = ({ n }) =>
  n > 0 ? (
    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-white">
      {n > 9 ? '9+' : n}
    </span>
  ) : null;

const Item = ({ to, label, active, badge = 0, hideOnMobile = false, children }) => (
  <Link
    to={to}
    aria-label={badge > 0 ? `${label} (${badge > 9 ? 'more than 9' : badge} new)` : label}
    aria-current={active ? 'page' : undefined}
    title={label}
    className={`relative ${hideOnMobile ? 'hidden lg:flex' : 'flex'} flex-col items-center justify-center gap-1 min-w-[40px] sm:min-w-[44px] lg:min-w-[68px] px-1 lg:px-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
      active ? 'text-pink-600' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    <span className="relative flex items-center justify-center w-9 h-9 lg:w-8 lg:h-8 rounded-full lg:rounded-lg transition-colors hover:bg-gray-100">
      {children}
      <Badge n={badge} />
    </span>
    <span className="hidden lg:block text-[11px] font-semibold leading-none whitespace-nowrap">{label}</span>
    {/* The current page: a pink line along the bottom of the bar (desktop). */}
    <span aria-hidden="true" className={`hidden lg:block absolute bottom-0 left-2 right-2 h-[3px] rounded-t-full ${active ? 'bg-pink-600' : 'bg-transparent'}`} />
  </Link>
);

const Icon = ({ d, active }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.2 : 1.9} d={d} />
  </svg>
);

/**
 * unreadMessages / unreadNotifications: counts for the red badges.
 * messagesOnMobile: false inside the app, where phones have Messages in the bottom bar.
 */
const TopBarIcons = ({ unreadMessages = 0, unreadNotifications = 0, messagesOnMobile = true, className = '' }) => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  if (!currentUser) return null;
  const myProfile = `/profile/${currentUser.uid}`;
  const onProfile = pathname === myProfile || decodeURIComponent(pathname) === myProfile;
  const at = (p) => pathname === p || pathname.startsWith(`${p}/`);
  const initial = (currentUser.displayName || currentUser.email || 'U').trim().charAt(0).toUpperCase();
  return (
    <nav aria-label="Your shortcuts" className={`flex items-stretch self-stretch gap-0.5 sm:gap-1 lg:gap-1.5 ${className}`}>
      <Item to="/proof-wall" label="Proof Wall" active={at('/proof-wall')}>
        <Icon d={PROOF_WALL_ICON} active={at('/proof-wall')} />
      </Item>
      <Item to="/messages" label="Messaging" active={at('/messages')} badge={unreadMessages} hideOnMobile={!messagesOnMobile}>
        <Icon d={CHAT} active={at('/messages')} />
      </Item>
      <Item to="/notifications" label="Notifications" active={at('/notifications')} badge={unreadNotifications}>
        <Icon d={BELL} active={at('/notifications')} />
      </Item>
      <Item to={myProfile} label="Me" active={onProfile}>
        {currentUser.photoURL ? (
          <img src={currentUser.photoURL} alt="" className={`w-7 h-7 lg:w-6 lg:h-6 rounded-full object-cover ${onProfile ? 'ring-2 ring-pink-600' : 'ring-1 ring-gray-200'}`} />
        ) : (
          <span className={`w-7 h-7 lg:w-6 lg:h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${onProfile ? 'bg-pink-600' : 'bg-gray-800'}`}>
            {initial}
          </span>
        )}
      </Item>
    </nav>
  );
};

export default TopBarIcons;
