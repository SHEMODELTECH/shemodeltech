// src/components/CompanyVerificationBanner.jsx
// Shown on an unverified company's dashboard: where verification stands, what
// to do next, and a direct line to the She Model Tech team.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStaff } from '../utils/staffAlerts';

const CompanyVerificationBanner = ({ profile }) => {
  const navigate = useNavigate();
  const [teamUid, setTeamUid] = useState(profile?.companyProfile?.infoRequestedBy || null);

  useEffect(() => {
    if (teamUid) return;
    getStaff(['admin']).then((s) => s[0] && setTeamUid(s[0].uid)).catch(() => {});
  }, [teamUid]);

  if (!profile?.isCompany || profile.isVerified) return null;
  const status = profile.companyProfile?.verificationStatus;
  const asked = status === 'info_requested';
  const updated = status === 'details_updated';

  return (
    <div className={`rounded-xl border p-5 mb-6 ${asked ? 'border-amber-200 bg-amber-50' : 'border-purple-200 bg-purple-50'}`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${asked ? 'text-amber-800' : 'text-purple-700'}`}>
        {asked ? 'Action needed' : 'Verification pending'}
      </p>
      <h2 className="text-lg font-bold text-gray-900 mt-1">
        {asked
          ? 'We need a few more details to verify your company'
          : updated
          ? 'Thanks, we are reviewing your updated details'
          : 'Your company account is being reviewed'}
      </h2>
      <p className="text-sm text-gray-700 mt-1 max-w-3xl">
        {asked
          ? 'Our team sent you a message. Reply there, and add any missing details (website, phone, registration) to your company profile.'
          : 'Our team verifies every company before it can post paid projects. You can explore the platform in the meantime. Adding your website, phone number, and registration details helps us verify you faster.'}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {teamUid && (
          <button
            onClick={() => navigate(`/messages?to=${teamUid}`)}
            className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            {asked ? 'Read and reply' : 'Message She Model Tech'}
          </button>
        )}
        <Link to="/settings" className="text-sm font-semibold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50">
          Update company details
        </Link>
      </div>
    </div>
  );
};

export default CompanyVerificationBanner;
