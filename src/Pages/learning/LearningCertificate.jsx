// src/Pages/learning/LearningCertificate.jsx
// A certificate of completion (/learning/certificate/:id). Public, so anyone
// with the link can verify it. Prints as one landscape page (save as PDF).

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import LearningLayout from './LearningLayout';
import { certificateCode, certificateUrl, getCertificate, linkedInAddUrl } from '../../utils/learningCertificates';
import { formatTime, look } from './shared';

const fmtDate = (iso) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const LearningCertificate = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [cert, setCert] = useState(undefined);

  useEffect(() => {
    getCertificate(id)
      .then(setCert)
      .catch(() => setCert(null));
  }, [id]);

  if (cert === undefined) {
    return (
      <LearningLayout>
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
        </div>
      </LearningLayout>
    );
  }
  if (cert === null) {
    return (
      <LearningLayout>
        <div className="max-w-lg mx-auto text-center py-24 px-4">
          <h1 className="text-xl font-bold text-gray-900">Certificate not found</h1>
          <p className="text-gray-600 mt-2">This link doesn't match a She Model Tech certificate. Check the link and try again.</p>
          <Link to="/learning" className="inline-block mt-5 text-pink-700 font-semibold hover:underline">Go to Learning</Link>
        </div>
      </LearningLayout>
    );
  }

  const L = look(cert.track);
  const isMentor = cert.type === 'mentor';
  const mine = currentUser && currentUser.uid === cert.uid;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(certificateUrl(cert.id));
      toast.success('Link copied.');
    } catch (_) {
      toast.info(certificateUrl(cert.id));
    }
  };

  return (
    <LearningLayout accent={L}>
      <style>{CERT_CSS}</style>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="cert-actions flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Verified certificate
            </span>{' '}
            issued by SHE MODEL TECH Inc., a registered 501(c)(3) nonprofit
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.print()} className="fd-btn">Download PDF</button>
            <button onClick={copy} className="text-sm font-semibold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50">
              Copy link
            </button>
            {mine && (
              <a href={linkedInAddUrl(cert)} target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50">
                Add to LinkedIn
              </a>
            )}
          </div>
        </div>

        <article className="cert" aria-label={`${isMentor ? 'Certificate of recognition' : 'Certificate of completion'} for ${cert.name}`} style={{ '--c': L.accent, '--t': L.tint }}>
          <div className="cert-inner">
            <div className="cert-top">
              <img src="/Images/she-model-tech-logo.png" alt="She Model Tech" className="cert-logo" />
              {L.img && <img src={L.img} alt="" className="cert-medal" />}
            </div>
            <p className="cert-kicker">{isMentor ? 'Certificate of recognition' : 'Certificate of completion'}</p>
            <p className="cert-small">This certifies that</p>
            <h1 className="cert-name">{cert.name}</h1>
            <p className="cert-small">
              {isMentor ? 'has created and published the course' : 'has successfully completed'}
            </p>
            <h2 className="cert-course">{cert.courseTitle}</h2>
            <p className="cert-meta">
              {[
                isMentor ? 'She Model Tech Mentor' : '',
                cert.trackLabel && `${cert.trackLabel} track`,
                cert.level,
                !isMentor && cert.minutes ? formatTime(cert.minutes) : '',
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </p>
            <div className="cert-foot">
              <div>
                <p className="cert-foot-value">{fmtDate(cert.completedOn)}</p>
                <p className="cert-foot-label">{isMentor ? 'Date published' : 'Date completed'}</p>
              </div>
              <div className="cert-sign">
                <p className="cert-foot-value cert-script">She Model Tech</p>
                <p className="cert-foot-label">SHE MODEL TECH Inc.</p>
              </div>
              <div>
                <p className="cert-foot-value cert-id">{certificateCode(cert.id)}</p>
                <p className="cert-foot-label">Certificate ID</p>
              </div>
            </div>
            <p className="cert-org">SHE MODEL TECH Inc. is a registered 501(c)(3) nonprofit organization.</p>
            <p className="cert-verify">Verify at {certificateUrl(cert.id).replace(/^https?:\/\//, '')}</p>
          </div>
        </article>

        <p className="cert-actions text-xs text-gray-500 mt-4">
          To save it as a PDF, choose Download PDF, then "Save as PDF" in the print window.
        </p>
      </div>
    </LearningLayout>
  );
};

const CERT_CSS = `
.cert { background:#fff; border-radius:1rem; box-shadow:0 10px 40px rgba(17,24,39,.10); padding:14px; aspect-ratio:1.414/1; }
.cert-inner { height:100%; border:2px solid var(--c); outline:1px solid var(--c); outline-offset:-10px; border-radius:.6rem;
  padding:4% 7%; display:flex; flex-direction:column; align-items:center; text-align:center;
  background: radial-gradient(ellipse at top, var(--t) 0%, #fff 60%); }
.cert-top { width:100%; display:flex; justify-content:space-between; align-items:center; }
.cert-logo { height:clamp(34px, 6vw, 64px); width:auto; }
.cert-medal { height:clamp(40px, 7vw, 76px); width:auto; }
.cert-kicker { margin-top:2%; font-size:clamp(.7rem,1.3vw,1rem); font-weight:800; letter-spacing:.22em; text-transform:uppercase; color:var(--c); }
.cert-small { margin-top:2.2%; font-size:clamp(.72rem,1.3vw,1rem); color:#4B5563; }
.cert-name { margin-top:1%; font-family:'Archivo Black', Georgia, serif; font-size:clamp(1.5rem,4.6vw,3.4rem); line-height:1.1; color:#111827;
  border-bottom:2px solid #E5E7EB; padding:0 4% 1.5%; }
.cert-course { margin-top:1.2%; font-size:clamp(1rem,2.6vw,1.9rem); font-weight:800; color:#111827; max-width:90%; line-height:1.2; }
.cert-meta { margin-top:1%; font-size:clamp(.7rem,1.2vw,.95rem); color:#6B7280; white-space:pre-wrap; }
.cert-foot { margin-top:auto; width:100%; display:grid; grid-template-columns:1fr 1fr 1fr; gap:4%; align-items:end; }
.cert-foot-value { font-weight:700; color:#111827; font-size:clamp(.72rem,1.3vw,1rem); border-bottom:1px solid #D1D5DB; padding-bottom:.35rem; }
.cert-foot-label { margin-top:.35rem; font-size:clamp(.6rem,1vw,.78rem); color:#6B7280; text-transform:uppercase; letter-spacing:.08em; }
.cert-script { font-family:'Brush Script MT','Segoe Script',cursive; font-weight:400; font-size:clamp(1rem,2vw,1.6rem); color:var(--c); }
.cert-id { font-family:ui-monospace,Menlo,Consolas,monospace; letter-spacing:.05em; }
.cert-org { margin-top:2.2%; font-size:clamp(.6rem,1vw,.8rem); font-weight:600; color:#4B5563; letter-spacing:.02em; }
.cert-verify { margin-top:.6%; font-size:clamp(.55rem,.9vw,.72rem); color:#9CA3AF; }
@media print {
  @page { size: A4 landscape; margin: 0; }
  body * { visibility:hidden !important; }
  .cert, .cert * { visibility:visible !important; }
  .cert { position:fixed; inset:0; box-shadow:none; border-radius:0; padding:8mm; aspect-ratio:auto; width:100vw; height:100vh; }
  .cert-inner { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .cert-name { font-size:34pt; } .cert-course { font-size:20pt; } .cert-kicker { font-size:11pt; }
  .cert-small, .cert-foot-value { font-size:11pt; } .cert-meta { font-size:10pt; } .cert-foot-label { font-size:8pt; } .cert-verify { font-size:8pt; } .cert-org { font-size:9pt; }
  .cert-logo { height:56px; } .cert-medal { height:66px; } .cert-script { font-size:20pt; }
}
`;

export default LearningCertificate;
