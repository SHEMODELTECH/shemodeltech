// src/Pages/VerifyCertificate.jsx
//
// The public verification page: shemodeltech.com/verify/SMT-4K2P-9XRT
//
// PUBLIC ON PURPOSE. No login, no account. A recruiter who receives a
// certificate has to be able to check it in one click from whatever device
// they're on — if verification required signing up, nobody would ever use it
// and the certificate would be decoration again.
//
// It shows only what's already printed on the certificate: name, project,
// role, dates, badges. No email, no contact details, no way to work backwards
// from a certificate to a member's private information.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { verifyCertificate } from '../utils/certificateVerification';
import { BRAND } from '../config/brand';

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(!!certificateId);
  const [input, setInput] = useState(certificateId || '');

  useEffect(() => {
    if (!certificateId) return;
    let dead = false;
    verifyCertificate(certificateId).then(r => {
      if (!dead) { setResult(r); setLoading(false); }
    });
    return () => { dead = true; };
  }, [certificateId]);

  const lookup = (e) => {
    e?.preventDefault();
    if (input.trim()) navigate(`/verify/${input.trim().toUpperCase()}`);
  };

  const valid = result?.found && result?.valid;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <img src={BRAND.logo.mark} alt={BRAND.name}
            className="w-16 h-16 mx-auto mb-3 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">Verify a certificate</h1>
          <p className="text-gray-500 text-sm mt-1">
            Check that a {BRAND.name} certificate is genuine.
          </p>
        </div>

        {/* Lookup */}
        <form onSubmit={lookup} className="flex gap-2 mb-8">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="SMT-XXXX-XXXX"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none font-mono uppercase"
          />
          <button type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 rounded-lg">
            Verify
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-500 text-sm">Checking our records…</p>
        )}

        {/* Valid */}
        {!loading && valid && (
          <div className="bg-white border-2 border-green-500 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white grid place-items-center text-sm font-bold">
                ✓
              </span>
              <p className="text-green-700 font-bold">Verified certificate</p>
            </div>

            <Field label="Awarded to" value={result.data.memberName} big />
            <Field label="Project" value={result.data.projectTitle} />
            {result.data.roleTitle && <Field label="Role" value={result.data.roleTitle} />}
            {(result.data.startDate || result.data.endDate) && (
              <Field label="Period"
                value={[result.data.startDate, result.data.endDate].filter(Boolean).join(' — ')} />
            )}
            {result.data.cohortNumber && (
              <Field label="Cohort" value={`Cohort ${result.data.cohortNumber}`} />
            )}

            {result.data.badges?.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-[10px] uppercase tracking-wide font-bold mb-1.5">
                  Badges earned
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.data.badges.map((b, i) => (
                    <span key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {typeof b === 'string' ? b : `${b.title || b.category} ${b.level || ''}`.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-gray-400 text-xs mt-6 pt-5 border-t border-gray-100 font-mono">
              {result.data.certificateId}
            </p>
            <p className="text-gray-500 text-xs mt-2 leading-relaxed">
              Issued by {BRAND.name}. This project was completed collaboratively
              and reviewed by our team, including the work&rsquo;s commit history.
            </p>
          </div>
        )}

        {/* Revoked */}
        {!loading && result?.found && !result.valid && (
          <div className="bg-white border-2 border-red-400 rounded-2xl p-6">
            <p className="text-red-700 font-bold mb-1">This certificate is not valid</p>
            <p className="text-gray-600 text-sm">{result.reason}</p>
          </div>
        )}

        {/* Not found */}
        {!loading && result && !result.found && (
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <p className="text-gray-900 font-bold mb-1">Not found</p>
            <p className="text-gray-600 text-sm mb-3">{result.reason}</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Check the ID for typos &mdash; it&rsquo;s printed at the bottom of the
              certificate. If it still doesn&rsquo;t match, the certificate may not
              have been issued by us. You can email{' '}
              <a href={`mailto:${BRAND.supportEmail}`} className="text-pink-600 font-semibold">
                {BRAND.supportEmail}
              </a>{' '}and we&rsquo;ll check.
            </p>
          </div>
        )}

        <p className="text-center text-gray-400 text-xs mt-10">
          <Link to="/" className="hover:text-gray-600">{BRAND.domain}</Link>
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, value, big }) => (
  <div className="mb-3">
    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-bold">{label}</p>
    <p className={`text-gray-900 ${big ? 'text-xl font-bold' : 'text-sm font-semibold'}`}>
      {value || '—'}
    </p>
  </div>
);

export default VerifyCertificate;
