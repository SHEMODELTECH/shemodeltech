// src/components/admin/ProtectProjectLinks.jsx
// Admin → Settings: one-time move of older projects' meeting link, details
// link and notes from the project itself (readable by any signed-in member)
// into the team-only record projects/{id}/private/workspace. The submission
// link stays on the project (reviewers use it). Safe to run more than once.
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, documentId } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PAGE = 300;

const ProtectProjectLinks = () => {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const run = async () => {
    if (!window.confirm('Move every project\'s meeting link, details link and notes into the team-only area now?')) return;
    setBusy(true);
    let checked = 0;
    let moved = 0;
    let failed = 0;
    try {
      let last = null;
      for (;;) {
        const q = last
          ? query(collection(db, 'projects'), orderBy(documentId()), startAfter(last), limit(PAGE))
          : query(collection(db, 'projects'), orderBy(documentId()), limit(PAGE));
        // eslint-disable-next-line no-await-in-loop
        const snap = await getDocs(q);
        if (snap.empty) break;
        for (const d of snap.docs) {
          checked += 1;
          const r = d.data().resources || {};
          if (!r.meetingUrl && !r.detailsUrl && !r.notes) continue;
          try {
            // eslint-disable-next-line no-await-in-loop
            await setDoc(doc(db, 'projects', d.id, 'private', 'workspace'), {
              meetingUrl: r.meetingUrl || '',
              detailsUrl: r.detailsUrl || '',
              notes: r.notes || '',
              updatedAt: serverTimestamp(),
            }, { merge: true });
            // eslint-disable-next-line no-await-in-loop
            await updateDoc(doc(db, 'projects', d.id), { resources: r.submissionUrl ? { submissionUrl: r.submissionUrl } : {} });
            moved += 1;
          } catch (e) {
            failed += 1;
          }
          setStatus(`Checked ${checked} projects, moved ${moved}…`);
        }
        last = snap.docs[snap.docs.length - 1];
        setStatus(`Checked ${checked} projects, moved ${moved}…`);
        if (snap.size < PAGE) break;
      }
      setStatus(`Done. Checked ${checked} projects and moved the links of ${moved}.${failed ? ` ${failed} could not be moved.` : ''}`);
      if (failed) toast.error(`${failed} project(s) could not be moved. Try again.`);
      else toast.success('Older project links are now team-only.');
    } catch (e) {
      setStatus('');
      toast.error('Could not finish. Try again.');
    }
    setBusy(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900">Protect older project links</h3>
      <p className="text-sm text-gray-600 mt-1">
        Projects set up before the workspace became team-only kept their meeting link, details link and notes on the
        project itself, where any signed-in member could read them. This moves them into the team-only area. The
        submission link stays where reviewers can see it. Safe to run more than once.
      </p>
      <button onClick={run} disabled={busy}
        className="mt-3 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60">
        {busy ? 'Moving…' : 'Move them now'}
      </button>
      {status && <p className="text-sm text-gray-700 mt-2" role="status">{status}</p>}
    </div>
  );
};

export default ProtectProjectLinks;
