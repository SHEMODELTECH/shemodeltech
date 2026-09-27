// src/components/TrainerPanel.jsx
// Mentor Hub: "Training contracts". Mentors can ask to be available for paid
// training contracts; approved trainers see their assignments here.
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { alertStaff } from '../utils/staffAlerts';
import { ORG_TYPES, STATUS_LABELS, TRAINER_CRITERIA, listMyAssignments } from '../utils/organizations';

const TrainerPanel = ({ uid, name }) => {
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'users', uid)).then((s) => setProfile(s.data() || {})).catch(() => setProfile({}));
    listMyAssignments(uid).then(setAssignments).catch(() => {});
  }, [uid]);

  if (!profile) return <p className="text-sm text-gray-500">Loading...</p>;
  const eligible = (profile.mentorApprovedCourses || 0) >= 1;

  const request = async () => {
    setBusy(true);
    try {
      await updateDoc(doc(db, 'users', uid), { trainerRequested: true });
      setProfile({ ...profile, trainerRequested: true });
      alertStaff({ type: 'trainer_request', title: 'A mentor wants to train', body: `${name} asked to be available for training contracts.`, link: '/admin', roles: ['admin'] });
      toast.success('Request sent. An admin will review it.');
    } catch (e) {
      toast.error('Could not send the request.');
    }
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <p>Organizations pay She Model Tech to train their learners or staff. Selected mentors deliver the training and are paid a fair fee.</p>
      {profile.isTrainer ? (
        <>
          <p className="font-semibold text-indigo-800">You’re a She Model Tech trainer.</p>
          {assignments.length === 0 ? (
            <p className="text-gray-600">No training assignments yet. We’ll notify you when you’re assigned.</p>
          ) : (
            <ul className="space-y-2">
              {assignments.map((a) => (
                <li key={a.id} className="border border-gray-200 rounded-lg p-3">
                  <p className="font-semibold text-gray-900">{a.orgName} <span className="font-normal text-gray-500">· {ORG_TYPES[a.orgType] || a.orgType} · {STATUS_LABELS[a.status]}</span></p>
                  <p className="text-gray-700">{a.topics}</p>
                  {a.timeline && <p className="text-xs text-gray-500">{a.timeline}</p>}
                  {a.workspaceProjectId && (
                    <a href={`/projects/${a.workspaceProjectId}/workspace`} className="inline-block mt-1 text-xs font-semibold text-indigo-700 hover:underline">Open the training workspace</a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : profile.trainerRequested ? (
        <p className="font-semibold text-amber-800">Your request to train is waiting for an admin’s review.</p>
      ) : (
        <>
          <p className="text-gray-600">{TRAINER_CRITERIA}</p>
          <button onClick={request} disabled={busy || !eligible}
            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
            Make me available for training contracts
          </button>
          {!eligible && <p className="text-xs text-gray-500">Publish your first course in Learning to become eligible.</p>}
        </>
      )}
    </div>
  );
};

export default TrainerPanel;
