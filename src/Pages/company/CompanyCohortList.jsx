// src/Pages/company/CompanyCohortList.jsx
//
// Browse open company-hosted paid projects.
//
// Members without a badge can SEE everything here, the roles, the pay, the
// companies. They just can't apply yet. Hiding paid work from women who
// haven't earned a badge would remove the reason to earn one; showing it is
// what makes the free cohort worth finishing.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOpenCompanyCohorts, canApplyToCompanyCohort } from '../../utils/companyCohorts';
import { formatMoney } from '../../utils/paidProjects';

const CompanyCohortList = () => {
  const { currentUser } = useAuth();
  const [cohorts, setCohorts] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const list = await getOpenCompanyCohorts();
        if (!dead) setCohorts(list);
        if (currentUser) {
          const e = await canApplyToCompanyCohort(currentUser.uid);
          if (!dead) setEligibility(e);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, [currentUser]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Paid projects</h1>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        Real companies hiring She Model Tech members for paid work. The company owns the project,
        reviews applications, and pays you directly. These don&rsquo;t award badges, you receive a
        verified paid work-experience record instead.
      </p>

      {eligibility && !eligibility.allowed && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
          <p className="text-gray-900 text-sm font-bold mb-1">
            Earn your first badge to unlock paid projects
          </p>
          <p className="text-gray-600 text-xs mb-2 leading-relaxed">
            Companies hire from our badge holders because a badge means verified, commit-backed
            proof you shipped something on a real team. Have a look around here in the meantime.
          </p>
          <Link to="/projects" className="text-pink-700 text-sm font-semibold hover:underline">
            Join the current cohort
          </Link>
        </div>
      )}

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}

      {!loading && cohorts.length === 0 && (
        <p className="text-gray-500 text-sm">
          No paid projects are open right now. New ones appear as companies post them.
        </p>
      )}

      <div className="space-y-3">
        {cohorts.map((c) => (
          <Link
            key={c.id}
            to={`/company-cohorts/${c.id}`}
            className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
          >
            <div className="flex items-start gap-3">
              {c.companyLogo && (
                <img
                  src={c.companyLogo}
                  alt=""
                  className="w-10 h-10 rounded-lg object-contain bg-gray-50 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 text-xs">{c.companyName}</span>
                  {c.companyVerified && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 uppercase">
                      Verified
                    </span>
                  )}
                </div>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{c.title}</p>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{c.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                  <span className="text-green-700 font-semibold">
                    {formatMoney(c.totalBudget)} total
                  </span>
                  <span className="text-gray-400">
                    {(c.roles || []).length} role{(c.roles || []).length === 1 ? '' : 's'}
                  </span>
                  <span className="text-gray-400">by {c.endDate}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompanyCohortList;
