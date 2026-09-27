// src/components/OrgMembershipsCard.jsx
// Dashboard: organizations you run (dashboard link) or belong to (leave anytime).
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrganization, leaveOrganization, listMyOrganizations } from '../utils/organizations';

const OrgMembershipsCard = ({ uid, profile }) => {
  const [admin, setAdmin] = useState([]);
  const [member, setMember] = useState([]);
  useEffect(() => {
    if (!uid) return;
    listMyOrganizations(uid).then(setAdmin).catch(() => {});
    const ids = Object.keys(profile?.orgMemberships || {});
    Promise.all(ids.map((id) => getOrganization(id).catch(() => null))).then((l) => setMember(l.filter(Boolean)));
  }, [uid, profile]);
  if (!admin.length && !member.length) return null;
  const leave = async (o) => {
    if (!window.confirm(`Leave ${o.name}? They will no longer see your progress.`)) return;
    await leaveOrganization(o.id, uid).catch(() => {});
    setMember((xs) => xs.filter((x) => x.id !== o.id));
    toast.success('You’ve left the organization.');
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
      <p className="font-bold text-gray-900">Your organizations</p>
      <ul className="mt-2 space-y-2 text-sm">
        {admin.map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-2">
            <span>{o.name} <span className="text-gray-500">· you manage it</span></span>
            <Link to={`/org/${o.id}`} className="font-semibold text-pink-700 hover:underline">Open dashboard</Link>
          </li>
        ))}
        {member.filter((o) => !admin.some((a) => a.id === o.id)).map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-2">
            <span>{o.name} <span className="text-gray-500">· sees your course progress</span></span>
            <button onClick={() => leave(o)} className="text-xs text-gray-600 underline">Leave</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrgMembershipsCard;
