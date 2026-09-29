// src/components/SummitCard.jsx
// Dashboard card for the current Summit. Members register in one click;
// companies see partner options and the status of their requests.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { PARTNER_OPTIONS, PARTNER_STATUS_LABELS, getCurrentSummit, getMyRegistration, listMyPartnerRequests, registerForSummit } from '../utils/summit';

const SummitCard = ({ profile }) => {
  const { currentUser } = useAuth();
  const [summit, setSummit] = useState(null);
  const [reg, setReg] = useState(undefined);
  const [partnerReqs, setPartnerReqs] = useState([]);

  useEffect(() => {
    getCurrentSummit()
      .then(async (s) => {
        setSummit(s);
        if (s && currentUser) {
          setReg(await getMyRegistration(s.id, currentUser.uid).catch(() => null));
          if (profile?.isCompany) setPartnerReqs((await listMyPartnerRequests(currentUser.uid).catch(() => [])).filter((p) => p.summitId === s.id));
        }
      })
      .catch(() => {});
  }, [currentUser, profile]);

  if (!summit) return null;
  const when = summit.startDate ? new Date(`${summit.startDate}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const register = async () => {
    try {
      await registerForSummit(summit, currentUser, profile, false);
      setReg({ checkedIn: false });
      toast.success('You’re registered for the Summit.');
    } catch (e) {
      toast.error('Could not register you.');
    }
  };

  return (
    <div className="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-indigo-50 p-5 mb-6">
      <p className="text-xs font-bold uppercase tracking-wider text-pink-700">She Model Tech Summit</p>
      <p className="text-lg font-bold text-gray-900 mt-1">{summit.title}</p>
      <p className="text-sm text-gray-700">{when}{summit.venue ? ` · ${summit.venue}` : ''}</p>
      <div className="flex flex-wrap items-center gap-3 mt-3">
        {profile?.isCompany ? (
          <>
            <Link to="/summit#partner" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg">Partner with the Summit</Link>
            {partnerReqs.map((p) => (
              <span key={p.id} className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1">
                {PARTNER_OPTIONS[p.option] || p.option}: {PARTNER_STATUS_LABELS[p.status]}
              </span>
            ))}
          </>
        ) : reg ? (
          <span className="text-sm font-semibold text-emerald-800">✓ You’re registered</span>
        ) : (
          reg !== undefined && <button onClick={register} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Register free</button>
        )}
        <Link to="/summit" className="text-sm font-semibold text-pink-700 hover:underline">See the agenda</Link>
      </div>
    </div>
  );
};

export default SummitCard;
