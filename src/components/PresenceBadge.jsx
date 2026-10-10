// src/components/PresenceBadge.jsx
// Shows whether a member is on She Model Tech right now.
//   online  -> pink dot + "Active now"
//   offline -> grey dot + "Last active 3 hours ago"
//   hidden (turned off in Settings) or unknown -> nothing
// Pass `uid` (it subscribes itself) or a ready `info` from usePresenceMany.
import React from 'react';
import { timeAgo, usePresence } from '../utils/presence';

const Dot = ({ online, className = '' }) => (
  <span
    aria-hidden="true"
    className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${online ? 'bg-pink-600 ring-2 ring-pink-100' : 'bg-gray-300'} ${className}`}
  />
);

export const PresenceView = ({ info, compact = false, className = '' }) => {
  if (!info) return null;
  const text = info.online ? 'Active now' : `Last active ${timeAgo(info.lastActive)}`;
  if (compact) {
    // Just the dot (e.g. beside a name in a list), with the text for screen readers and on hover.
    return (
      <span className={`inline-flex items-center ${className}`} title={text}>
        <Dot online={info.online} />
        <span className="sr-only">{text}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${info.online ? 'text-pink-700 font-semibold' : 'text-gray-500'} ${className}`}>
      <Dot online={info.online} />
      {text}
    </span>
  );
};

const PresenceBadge = ({ uid, ...rest }) => {
  const info = usePresence(uid);
  return <PresenceView info={info} {...rest} />;
};

export default PresenceBadge;
