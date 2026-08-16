// src/Pages/ProjectVault.jsx - Completed projects with certificates
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { verificationUrl, qrCodeUrl } from '../utils/certificateVerification';
import TierBadge from '../components/TierBadge';
import { formatMoney, hasOpenDispute, confirmPaymentReceived, markOwnerPaidAll, isReadyToComplete, healPaidProjectStatus } from '../utils/paidProjects';
import { toast } from 'react-toastify';

// Map a badge category (stored on evaluations) to its badge image in /public/Images.
const BADGE_IMAGES = {
  development: '/Images/TechDev.png',
  'quality-assurance': '/Images/TechQA.png',
  mentorship: '/Images/TechMO.png',
  leadership: '/Images/TechLeads.png',
  design: '/Images/TechArchs.png',
  security: '/Images/TechGuard.png',
};
const getBadgeImage = (category) => BADGE_IMAGES[category] || null;

// Track aliases so we can count badges per track regardless of how category is stored.
const TRACK_ALIASES = {
  development: ['development', 'techdev', 'developer'],
  'quality-assurance': ['quality-assurance', 'techqa', 'quality', 'qa'],
  security: ['security', 'techguard', 'cybersecurity', 'network'],
  leadership: ['leadership', 'techleads', 'leader', 'non-technical'],
  design: ['design', 'techarchs', 'architecture', 'low-code', 'no-code'],
  mentorship: ['mentorship', 'techpo', 'techmo', 'product', 'project-owner'],
};

// Count a user's badges in the same track as `category`, then derive the live tier.
// This matches how the profile/dashboard show level (by count, not frozen value).
const deriveLevel = (badges, category) => {
  const cat = (category || '').toString().toLowerCase();
  // Find which alias group this category belongs to.
  let aliases = [cat];
  for (const [, group] of Object.entries(TRACK_ALIASES)) {
    if (group.includes(cat)) { aliases = group; break; }
  }
  const count = (badges || []).filter(b => {
    const fields = [b.category, b.id, b.title, b.badgeCategory].map(x => (x || '').toString().toLowerCase());
    return aliases.some(a => fields.some(f => f === a || f.includes(a)));
  }).length;
  return count >= 11 ? 'Expert' : count >= 6 ? 'Advanced' : count >= 2 ? 'Associate' : count >= 1 ? 'Novice' : 'Novice';
};

// Tier ring color for the printed certificate (matches TierBadge: steel/bronze/silver/gold).
const tierRingCss = (level) => {
  const k = (level || '').toString().toLowerCase();
  if (k.startsWith('expert')) return 'linear-gradient(135deg,#fcd34d,#d97706)';
  if (k.startsWith('advanc')) return 'linear-gradient(135deg,#e5e7eb,#9ca3af)';
  if (k.startsWith('assoc')) return 'linear-gradient(135deg,#d8975a,#a55b2e)';
  return 'linear-gradient(135deg,#9ca3af,#6b7280)';
};

const ProjectVault = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userBadges, setUserBadges] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [disputedProjects, setDisputedProjects] = useState([]);
  // Paid projects awaiting payment confirmation (work done; money not yet
  // fully confirmed). They live here - NOT on the completed wall - until every
  // member confirms payment. Disputed ones link to their dispute room.
  const [awaitingProjects, setAwaitingProjects] = useState([]);
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedHistory, setExpandedHistory] = useState({});
  const [viewingCert, setViewingCert] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchProjects = async () => {
      try {
        // Load the user's badges so we can derive certificate tier by COUNT
        // (same as the profile/dashboard), not the frozen badgeLevel.
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const uSnap = await getDoc(doc(db, 'users', currentUser.uid));
          if (uSnap.exists()) setUserBadges(uSnap.data().badges || []);
        } catch (_) {}
        const allDisputed = [];

        // Fetch ALL projects the user is involved in with just two single-field
        // queries (no composite index needed), then categorize client-side.
        const involved = new Map();
        try {
          const memberSnap = await getDocs(query(collection(db, 'projects'), where('members', 'array-contains', currentUser.uid)));
          memberSnap.docs.forEach(d => involved.set(d.id, { id: d.id, ...d.data(), isOwner: false }));
        } catch (e) { console.log('Member projects query:', e.message); }
        try {
          const ownerSnap = await getDocs(query(collection(db, 'projects'), where('submitterId', '==', currentUser.uid)));
          ownerSnap.docs.forEach(d => involved.set(d.id, { id: d.id, ...d.data(), isOwner: true }));
        } catch (e) { console.log('Owner projects query:', e.message); }

        const all = Array.from(involved.values());

        // SELF-HEAL: a paid project where the owner marked everyone paid AND
        // every member confirmed should be 'completed'. If one is still stuck
        // at 'awaiting_payment_confirmation' (e.g. the final flip failed),
        // complete it now and show it on the completed wall immediately.
        for (const p of all) {
          if (isReadyToComplete(p)) {
            const healed = await healPaidProjectStatus(p);
            if (healed) p.status = 'completed';
          }
        }

        // Completed + rejected go on the "completed" wall.
        const completed = all
          .filter(p => p.status === 'completed' || p.reviewStatus === 'rejected')
          .map(p => p.reviewStatus === 'rejected' ? { ...p, isRejected: true } : p);

        completed.sort((a, b) => (b.completedAt?.toDate?.() || 0) - (a.completedAt?.toDate?.() || 0));
        setCompletedProjects(completed);

        // Paid projects awaiting payment confirmation. Disputed ones are
        // split out; the rest show with inline confirm / mark-paid actions.
        const awaiting = all.filter(p => p.status === 'awaiting_payment_confirmation');
        setAwaitingProjects(awaiting);
        awaiting.forEach(data => {
          if (Object.values(data.paymentConfirmations || {}).some(c => c.status === 'disputed')
              && !allDisputed.find(p => p.id === data.id)) {
            allDisputed.push(data);
          }
        });

        setDisputedProjects(allDisputed);
      } catch (e) { console.error('Error fetching projects:', e); }
      setLoading(false);
    };
    fetchProjects();
  }, [currentUser, refreshKey]);

  const toggleHistory = (id) => {
    setExpandedHistory(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Find the user's certificate for this project.
  // Paid projects still get a certificate of completion (proof of work), but
  // NO badge appears on it - paid projects never award badges.
  const getUserCertificate = (project) => {
    const userDoc = currentUser;
    // Check if user is owner
    if (project.submitterId === currentUser.uid) {
      return {
        role: 'Project Owner',
        projectTitle: project.projectTitle || project.title,
        completedAt: project.completedAt?.toDate?.()?.toLocaleDateString() || 'N/A',
        teamSize: (project.members || []).length,
        badgeCategory: project.isPaid ? '' : 'leadership',
        isOwner: true,
      };
    }
    // Check completionData for member info
    const evals = project.completionData?.evaluations || project.pendingEvaluations || [];
    const myEval = evals.find(e => e.memberEmail === currentUser.email);
    return {
      role: myEval?.memberRole || 'Team Member',
      projectTitle: project.projectTitle || project.title,
      completedAt: project.completedAt?.toDate?.()?.toLocaleDateString() || 'N/A',
      badgeName: project.isPaid ? '' : (myEval?.badgeCategory || ''),
      badgeCategory: project.isPaid ? '' : (myEval?.badgeCategory || ''),
      badgeLevel: project.isPaid ? '' : (myEval?.badgeLevel || ''),
      isOwner: false,
    };
  };

  const handleViewCertificate = (project) => {
    setViewingCert(getUserCertificate(project));
  };

  return (
    
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Project Vault</h1>
        <p className="text-gray-500 text-sm mb-6">Your completed projects and earned certificates.</p>

        {/* Certificate Modal */}
        {viewingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewingCert(null)}>
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div id="certificate-content" className="p-8 text-center bg-white">
                <div className="border-2 border-blue-200 rounded-xl p-8 flex flex-col justify-between">
                  <div>
                    <img src="/Images/512X512.png" alt="She Model Tech" className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">Certificate of Completion</p>
                    <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ background: 'linear-gradient(90deg,#2563eb,#f97316)' }} />
                  </div>
                  <div className="my-4">
                    <p className="text-gray-500 text-sm mb-1">This certifies that</p>
                    <p className="text-gray-900 text-2xl font-bold mb-1">{currentUser?.displayName || 'Member'}</p>
                    <p className="text-gray-500 text-sm mb-4">has successfully completed the project</p>
                    <p className="text-blue-600 text-lg font-bold mb-1">{viewingCert.projectTitle}</p>
                    <p className="text-gray-600 text-sm mb-1">serving as <span className="font-semibold">{viewingCert.role}</span></p>
                    {getBadgeImage(viewingCert.badgeCategory) && (
                      <div className="flex justify-center mt-3 mb-1">
                        <TierBadge image={getBadgeImage(viewingCert.badgeCategory)} alt="Badge earned" level={deriveLevel(userBadges, viewingCert.badgeCategory)} size={72} showLabel={true} />
                      </div>
                    )}
                    {viewingCert.badgeName && (
                      <p className="text-gray-500 text-xs mt-2">Badge earned: {viewingCert.badgeName} ({deriveLevel(userBadges, viewingCert.badgeCategory)})</p>
                    )}
                    {viewingCert.isOwner && viewingCert.teamSize > 0 && (
                      <p className="text-gray-500 text-xs mt-1">Team size: {viewingCert.teamSize} members</p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-center gap-10">
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Date Completed</p>
                        <p className="text-gray-700 text-sm font-semibold">{viewingCert.completedAt}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Issued By</p>
                        <p className="text-gray-700 text-sm font-semibold">She Model Tech</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-[10px] mt-3">shemodeltech.com</p>
                    {viewingCert.certificateId && (
                      <div className="mt-4 flex flex-col items-center gap-1.5">
                        <img
                          src={qrCodeUrl(viewingCert.certificateId, 96)}
                          alt="Scan to verify this certificate"
                          className="w-16 h-16"
                        />
                        <p className="text-gray-400 text-[9px] font-mono tracking-wide">
                          {viewingCert.certificateId}
                        </p>
                        <p className="text-gray-300 text-[8px]">
                          Verify at {verificationUrl(viewingCert.certificateId).replace('https://', '')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-8 pb-6 space-y-3">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-700 text-xs text-center">Please download and save your certificate. Do not rely on our server for long-term storage.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('certificate-content');
                      if (!el) return;
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html><head><title>Certificate - ${viewingCert.projectTitle}</title>
                        <style>
                        /* Standard certificate size: US Letter 8.5in x 11in */
                        @page{size:8.5in 11in;margin:0}
                        *{box-sizing:border-box}html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
                        .page{width:8.5in;height:11in;padding:0.5in;margin:0 auto;display:flex;overflow:hidden;page-break-after:avoid;break-after:avoid;page-break-before:avoid;break-before:avoid;page-break-inside:avoid;break-inside:avoid}
                        .border{flex:1;min-height:0;border:3px solid #bfdbfe;border-radius:16px;padding:0.4in 0.55in;display:flex;overflow:hidden;position:relative;page-break-inside:avoid;break-inside:avoid}
                        .border::before{content:'';position:absolute;inset:9px;border:1px solid #dbeafe;border-radius:11px;pointer-events:none}
                        .inner{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;position:relative;z-index:1;overflow:hidden}
                        .top{display:flex;flex-direction:column;align-items:center}
                        img.logo{width:1in;height:1in;margin-bottom:0.15in}
                        .subtitle{color:#2563eb;font-size:15pt;font-weight:800;text-transform:uppercase;letter-spacing:4px}
                        .rule{width:80px;height:3px;background:linear-gradient(90deg,#2563eb,#f97316);border-radius:2px;margin:0.12in auto 0}
                        .middle{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;min-height:0;overflow:hidden}
                        .label{color:#6b7280;font-size:12pt;margin:0.07in 0}
                        .name{font-size:34pt;font-weight:800;color:#111827;margin:0.08in 0;font-family:Georgia,'Times New Roman',serif;line-height:1.15}
                        .project{color:#2563eb;font-size:20pt;font-weight:700;margin:0.08in 0;max-width:85%;line-height:1.25}
                        .role{color:#374151;font-size:13pt;margin-top:0.03in}
                        .meta{color:#9ca3af;font-size:10pt;margin-top:0.1in}
                        .bottom{display:flex;flex-direction:column;align-items:center;width:100%}
                        .meta-row{display:flex;justify-content:center;gap:1.2in;width:100%;padding-top:0.16in;border-top:1px solid #e5e7eb}
                        .meta-col{text-align:center}
                        .meta-col .l{font-size:8pt;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;margin-bottom:0.03in}
                        .meta-col .v{font-size:11pt;color:#374151;font-weight:700}
                        .site{color:#d1d5db;font-size:9pt;margin-top:0.1in}
                        </style></head><body>
                        <div class="page">
                        <div class="border">
                        <div class="inner">
                        <div class="top">
                        <img class="logo" src="${window.location.origin}/Images/512X512.png" alt="She Model Tech" />
                        <div class="subtitle">Certificate of Completion</div>
                        <div class="rule"></div>
                        </div>
                        <div class="middle">
                        <div class="label">This certifies that</div>
                        <div class="name">${currentUser?.displayName || 'Member'}</div>
                        <div class="label">has successfully completed the project</div>
                        <div class="project">${viewingCert.projectTitle}</div>
                        <div class="role">serving as <strong>${viewingCert.role}</strong></div>
                        ${getBadgeImage(viewingCert.badgeCategory) ? `<div style="margin:0.15in auto 0.04in;width:1.1in;height:1.1in;border-radius:9999px;background:${tierRingCss(deriveLevel(userBadges, viewingCert.badgeCategory))};display:flex;align-items:center;justify-content:center;padding:5px;box-sizing:border-box"><div style="width:100%;height:100%;border-radius:9999px;background:#fff;display:flex;align-items:center;justify-content:center"><img src="${window.location.origin}${getBadgeImage(viewingCert.badgeCategory)}" alt="Badge" style="width:78%;height:78%;object-fit:contain" /></div></div>` : ''}
                        ${viewingCert.badgeName ? `<div class="meta">Badge earned: ${viewingCert.badgeName} (${deriveLevel(userBadges, viewingCert.badgeCategory)})</div>` : ''}
                        ${viewingCert.isOwner && viewingCert.teamSize > 0 ? `<div class="meta">Team size: ${viewingCert.teamSize} members</div>` : ''}
                        </div>
                        <div class="bottom">
                        <div class="meta-row">
                        <div class="meta-col"><div class="l">Date Completed</div><div class="v">${viewingCert.completedAt}</div></div>
                        <div class="meta-col"><div class="l">Issued By</div><div class="v">She Model Tech</div></div>
                        </div>
                        <div class="site">shemodeltech.com</div>
                        ${viewingCert.certificateId ? `
                        <div style="margin-top:14px;text-align:center">
                          <img src="${qrCodeUrl(viewingCert.certificateId, 110)}" width="72" height="72" alt="Verify" />
                          <div style="font-family:monospace;font-size:8pt;color:#666;margin-top:4px">${viewingCert.certificateId}</div>
                          <div style="font-size:7pt;color:#999">Verify at ${verificationUrl(viewingCert.certificateId).replace('https://','')}</div>
                        </div>` : ''}
                        </div>
                        </div>
                        </div></div></body></html>
                      `);
                      printWindow.document.close();
                      setTimeout(() => { printWindow.print(); }, 500);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-all"
                  >
                    Download Certificate
                  </button>
                  <button onClick={() => setViewingCert(null)} className="px-4 py-2.5 text-gray-500 text-sm font-medium hover:text-gray-700 border border-gray-200 rounded-lg">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (completedProjects.length === 0 && awaitingProjects.length === 0) ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-900 font-semibold text-lg mb-2">No completed projects yet</p>
            <p className="text-gray-400 text-sm mb-4">Complete your first project to see it here with a certificate.</p>
            <a href="/projects" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">Browse Projects</a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Paid projects awaiting payment confirmation */}
            {awaitingProjects.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Payment Confirmations
                </h2>
                <p className="text-gray-400 text-xs mb-3">Work on these paid projects is done. They move to your completed wall once the owner marks everyone paid and every member confirms receipt. Disputes are handled in the dispute room.</p>
                <div className="space-y-4">
                  {awaitingProjects.map(project => {
                    const disputed = hasOpenDispute(project);
                    const isOwner = project.isOwner;
                    const myEntry = (project.paymentConfirmations || {})[currentUser.email] || null;
                    const myAmount = myEntry ? (myEntry.amountPaid ?? myEntry.amountDue) : 0;
                    return (
                      <div key={project.id} className={`bg-white border rounded-xl p-5 ${disputed ? 'border-red-200' : 'border-amber-200'}`}>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-gray-900 font-semibold text-base truncate">{project.projectTitle || project.title || 'Untitled'}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full flex-shrink-0">PAID</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${disputed ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                            {disputed ? 'Disputed' : 'Awaiting Confirmation'}
                          </span>
                        </div>

                        {/* Member statuses */}
                        <div className="space-y-2 mt-3">
                          {Object.entries(project.paymentConfirmations || {}).map(([email, data]) => (
                            <div key={email} className={`flex items-center justify-between p-2 rounded-lg text-xs ${data.status === 'disputed' ? 'bg-red-50' : data.status === 'confirmed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                              <span className="text-gray-900 font-medium">{data.memberName || data.name || email}{data.role ? ` (${data.role})` : ''}{email === currentUser.email ? ' - you' : ''}</span>
                              <span className="flex items-center gap-2">
                                <span className="text-gray-900 font-black">{formatMoney(data.amountPaid ?? data.amountDue)}</span>
                                <span className={`font-semibold ${data.status === 'disputed' ? 'text-red-600' : data.status === 'confirmed' ? 'text-green-600' : 'text-gray-500'}`}>
                                  {data.status === 'disputed' ? 'Disputed' : data.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {/* Owner: mark all paid */}
                          {isOwner && !project.ownerPaidAll && (
                            <button disabled={busy} onClick={async () => {
                              setBusy(true);
                              try {
                                const completed = await markOwnerPaidAll(project, currentUser);
                                toast.success(completed ? 'All confirmed - the project is closing and will move to the Project Vault shortly.' : 'Marked as paid. Members have been asked to confirm receipt.');
                                setRefreshKey(k => k + 1);
                              } catch (e) { toast.error(e.message || 'Action failed.'); }
                              setBusy(false);
                            }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                              I've Paid Everyone
                            </button>
                          )}
                          {isOwner && project.ownerPaidAll && !disputed && (
                            <span className="text-gray-400 text-xs py-2">Waiting on member confirmations...</span>
                          )}
                          {/* Member: confirm received */}
                          {myEntry && myEntry.status === 'pending' && (
                            <>
                              <button disabled={busy} onClick={async () => {
                                setBusy(true);
                                try {
                                  const { completed } = await confirmPaymentReceived(project, currentUser);
                                  toast.success(completed ? 'All payments confirmed - the project is closing and will move to your completed wall shortly.' : 'Payment confirmed. Thank you!');
                                  setRefreshKey(k => k + 1);
                                } catch (e) { toast.error(e.message || 'Action failed.'); }
                                setBusy(false);
                              }} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                                I Received {formatMoney(myAmount)}
                              </button>
                              <button onClick={() => navigate(`/disputes/${project.id}`)} className="text-red-600 border border-red-200 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                                I Was Not Paid
                              </button>
                            </>
                          )}
                          {/* Everyone: open the dispute room */}
                          <button onClick={() => navigate(`/disputes/${project.id}`)} className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${disputed ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}>
                            {disputed ? 'Open Dispute Room' : 'View Details'}
                          </button>
                        </div>

                        {/* Dispute History */}
                        {(project.disputeHistory || []).length > 0 && (
                          <div className="mt-3">
                            <button onClick={() => toggleHistory(project.id)} className="text-blue-600 text-xs font-medium hover:underline">
                              {expandedHistory[project.id] ? 'Hide history' : 'View history'}
                            </button>
                            {expandedHistory[project.id] && (
                              <div className="mt-2 space-y-1.5">
                                {project.disputeHistory.map((h, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                                    <span className="text-gray-700">{h.memberName} - <span className={h.action === 'disputed' ? 'text-red-600 font-semibold' : h.action === 'confirmed' ? 'text-blue-600 font-semibold' : 'text-gray-600 font-semibold'}>{h.action.replace(/_/g, ' ')}</span></span>
                                    <span className="text-gray-400">{new Date(h.at || h.timestamp).toLocaleDateString()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Projects */}
            <div>
              {awaitingProjects.length > 0 && completedProjects.length > 0 && <h2 className="text-lg font-bold text-gray-900 mb-3">Completed</h2>}
              <div className="space-y-4">
                {completedProjects.map(project => (
                  <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-900 font-semibold text-base truncate">{project.title || project.projectTitle || 'Untitled Project'}</h3>
                          {project.isRejected ? (
                            <span className="text-xs font-medium px-2 py-0.5 bg-red-50 text-red-600 rounded-md flex-shrink-0">Rejected</span>
                          ) : (
                            <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md flex-shrink-0">Completed</span>
                          )}
                          {project.isOwner && <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex-shrink-0">Owner</span>}
                        </div>
                        <p className="text-gray-400 text-xs">{project.category || 'General'}</p>
                        {project.isRejected ? (
                          <p className="text-red-500 text-xs mt-1">This project was rejected. No certificate was awarded.{project.reviewFeedback ? ` Reviewer note: ${project.reviewFeedback}` : ''}</p>
                        ) : project.completedAt && (
                          <p className="text-gray-400 text-xs mt-1">
                            Completed {project.completedAt?.toDate?.().toLocaleDateString() || ''}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!project.isRejected && (
                          <button
                            onClick={() => handleViewCertificate(project)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
                          >
                            View Certificate
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Dispute/Confirmation History */}
                    {(project.disputeHistory || []).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => toggleHistory(project.id)} className="text-blue-600 text-xs font-medium hover:underline">
                          {expandedHistory[project.id] ? 'Hide payment history' : 'View payment history'}
                        </button>
                        {expandedHistory[project.id] && (
                          <div className="mt-2 space-y-1.5">
                            {project.disputeHistory.map((h, i) => (
                              <div key={i} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">{h.memberName} - <span className={h.action === 'disputed' ? 'text-red-600 font-semibold' : h.action === 'confirmed' ? 'text-blue-600 font-semibold' : 'text-gray-600 font-semibold'}>{h.action}</span></span>
                                <span className="text-gray-400">{new Date(h.timestamp).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Activity Log */}
                    {(project.activityLog || []).length > 0 && (
                      <div className={`mt-3 pt-3 border-t border-gray-100 ${!(project.disputeHistory || []).length ? '' : ''}`}>
                        <button onClick={() => toggleHistory(`log-${project.id}`)} className="text-gray-500 text-xs font-medium hover:underline">
                          {expandedHistory[`log-${project.id}`] ? 'Hide activity log' : `View activity log (${project.activityLog.length})`}
                        </button>
                        {expandedHistory[`log-${project.id}`] && (
                          <div className="mt-2 space-y-1">
                            {project.activityLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((log, i) => (
                              <div key={i} className="flex items-start justify-between text-xs p-2 bg-gray-50 rounded gap-2">
                                <div className="min-w-0 flex-1">
                                  <span className="text-gray-900 font-medium">{log.actorName}</span>
                                  <span className="text-gray-500"> - {log.description}</span>
                                </div>
                                <span className="text-gray-400 flex-shrink-0 whitespace-nowrap">{new Date(log.timestamp).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default ProjectVault;
