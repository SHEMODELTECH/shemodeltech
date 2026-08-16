// src/Pages/company/SponsorDashboard.jsx
//
// What a sponsor sees. READ-ONLY, and deliberately coarse.
//
// Status, milestones, team size, and the finished repo once approved — not
// the workspace, not the forum, not work in progress. Sponsors WATCH,
// ACKNOWLEDGE and RECRUIT. The moment a sponsor can review deliverables or
// direct the work, the stipend starts to look like a wage and we become a
// staffing intermediary.
//
// Sponsors will drift toward involvement — it's natural, they paid. This page
// says the boundary out loud so it isn't a surprise in week six.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getSponsorshipsForCompany, getSponsorProgress, buildImpactReport,
  computeStipends, SPONSORSHIP_STATUS, SPONSOR_LIMITS,
} from '../../utils/sponsorships';
import { formatMoney } from '../../utils/paidProjects';

const STATUS_COPY = {
  [SPONSORSHIP_STATUS.PLEDGED]: { label: 'Awaiting payment', style: 'bg-amber-100 text-amber-700' },
  [SPONSORSHIP_STATUS.FUNDED]: { label: 'Funded', style: 'bg-green-100 text-green-700' },
  [SPONSORSHIP_STATUS.DISTRIBUTED]: { label: 'Stipends paid', style: 'bg-blue-100 text-blue-700' },
  [SPONSORSHIP_STATUS.CANCELLED]: { label: 'Cancelled', style: 'bg-gray-100 text-gray-500' },
};

const SponsorDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    let dead = false;

    (async () => {
      try {
        const sponsorships = await getSponsorshipsForCompany(currentUser.uid);
        const detailed = await Promise.all(sponsorships.map(async (s) => {
          const [progress, report] = await Promise.all([
            getSponsorProgress(s.id).catch(() => null),
            buildImpactReport(s.id).catch(() => null),
          ]);
          return { sponsorship: s, progress, report };
        }));
        if (!dead) setRows(detailed);
      } catch (e) {
        console.error(e);
      } finally {
        if (!dead) setLoading(false);
      }
    })();

    return () => { dead = true; };
  }, [currentUser, navigate]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;
  }

  if (!rows.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No sponsorships yet</h1>
        <p className="text-gray-600 text-sm mb-6">
          Sponsor a team and you&rsquo;ll see their progress here.
        </p>
        <button onClick={() => navigate('/sponsor')}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-3 rounded-lg">
          Sponsor a team
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your sponsorships</h1>
      <p className="text-gray-600 text-sm mb-8">
        Progress on the teams you fund, and their impact reports.
      </p>

      <div className="space-y-4 mb-10">
        {rows.map(({ sponsorship: s, progress, report }) => {
          const status = STATUS_COPY[s.status] || STATUS_COPY[SPONSORSHIP_STATUS.PLEDGED];
          const p = progress?.project;
          const split = p ? computeStipends(s.amount, p.teamSize) : null;

          return (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="font-bold text-gray-900">
                    {p ? p.title : 'Awaiting allocation to a team'}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {formatMoney(s.amount)}
                    {p && ` · ${p.teamSize} women · ${p.track}`}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${status.style}`}>
                  {status.label}
                </span>
              </div>

              {p && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-gray-100 mb-3">
                    <Stat label="Status" value={p.status} />
                    <Stat label="Team" value={`${p.teamSize} women`} />
                    <Stat label="Lead" value={p.leadName || '—'} />
                    <Stat label="Due" value={p.endDate || '—'} />
                  </div>

                  {split && (
                    <p className="text-gray-500 text-xs mb-3">
                      {formatMoney(split.perMember)} stipend per member
                      &middot; {formatMoney(split.stipendPool)} to the team
                      &middot; {formatMoney(split.overhead)} programme costs
                    </p>
                  )}

                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                      className="text-pink-600 text-sm font-semibold hover:underline">
                      View the finished repository
                    </a>
                  )}
                </>
              )}

              {report?.completed && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-900 text-sm font-bold mb-1">Impact</p>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    {report.womenSupported} women completed &ldquo;{report.project}&rdquo;
                    and earned {report.badgesEarned} verified badge
                    {report.badgesEarned === 1 ? '' : 's'} between {report.period}.
                    {' '}{formatMoney(report.totalToMembers)} went directly to members
                    as training stipends.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* The boundary, stated plainly */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <p className="text-gray-900 text-sm font-bold mb-2">How sponsorship works</p>
        <p className="text-gray-600 text-xs mb-3 leading-relaxed">
          You fund the programme and are acknowledged for it. You&rsquo;ll see
          progress, meet the team at demo day, and get a two-week first look at
          the graduates you funded &mdash; first look, never exclusivity.
        </p>
        <p className="text-gray-500 text-xs font-semibold mb-1">What sponsorship isn&rsquo;t:</p>
        <ul className="text-gray-500 text-xs space-y-0.5">
          {SPONSOR_LIMITS.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
        <p className="text-gray-500 text-xs mt-3 leading-relaxed">
          If you need work built to your specification, that&rsquo;s a different
          arrangement &mdash; host your own paid project instead.
        </p>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-bold">{label}</p>
    <p className="text-gray-900 text-sm font-semibold capitalize">{value}</p>
  </div>
);

export default SponsorDashboard;
