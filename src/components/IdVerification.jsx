// src/components/IdVerification.jsx - Reusable ID Verification Form
// Used in both Onboarding and Dashboard Profile
// Includes Tier 1 cross-verification against user profile data (no API needed)

import React, { useState, useMemo } from 'react';

const idTypes = [
  { value: 'national_id', label: 'National ID' },
  { value: 'drivers_licence', label: "Driver's Licence" },
  { value: 'passport', label: 'Passport' },
];

// ─── Name matching utility ───────────────────────────────────────────
// Normalises and compares the ID name against the profile display name.
// Returns { match, confidence, details }
const compareNames = (idName, profileName) => {
  if (!idName || !profileName) return { match: false, confidence: 'none', details: 'Missing name data' };

  const normalize = (n) =>
    n.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();

  const idNorm = normalize(idName);
  const profNorm = normalize(profileName);

  if (!idNorm || !profNorm) return { match: false, confidence: 'none', details: 'Missing name data' };

  // Exact match after normalisation
  if (idNorm === profNorm) return { match: true, confidence: 'high', details: 'Names match exactly' };

  const idParts = idNorm.split(' ').filter(Boolean);
  const profParts = profNorm.split(' ').filter(Boolean);

  // Check if one name fully contains all tokens of the other
  // (covers "John Smith" vs "John Michael Smith" or reversed order like "Smith John")
  const idInProf = idParts.every((t) => profParts.includes(t));
  const profInId = profParts.every((t) => idParts.includes(t));
  if (idInProf || profInId) return { match: true, confidence: 'high', details: 'Names match (all key parts found)' };

  // Check if first + last tokens overlap (handles middle-name differences)
  const shareFirst = idParts[0] === profParts[0];
  const shareLast = idParts[idParts.length - 1] === profParts[profParts.length - 1];
  if (shareFirst && shareLast && idParts.length >= 2 && profParts.length >= 2) {
    return { match: true, confidence: 'partial', details: 'First and last names match (middle name differs)' };
  }

  // Check if at least 2 tokens overlap (covers reordering)
  const overlap = idParts.filter((t) => profParts.includes(t));
  if (overlap.length >= 2) return { match: true, confidence: 'partial', details: `${overlap.length} name parts match (possible reorder)` };

  // Single token match - too weak to count
  if (overlap.length === 1) {
    return { match: false, confidence: 'none', details: `Only "${overlap[0]}" matches between your ID and profile name` };
  }

  return { match: false, confidence: 'none', details: 'The name on your ID does not match your profile name' };
};

// ─── Mismatch banner component ───────────────────────────────────────
const MismatchBanner = ({ mismatches, onDismiss, dismissed }) => {
  if (!mismatches || mismatches.length === 0) return null;

  const hasBlocker = mismatches.some((m) => m.severity === 'error');
  const warningsOnly = !hasBlocker;

  // If only warnings and user dismissed them, hide
  if (warningsOnly && dismissed) return null;

  return (
    <div className={`rounded-xl border p-4 ${hasBlocker ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${hasBlocker ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
          <svg className={`w-5 h-5 ${hasBlocker ? 'text-red-400' : 'text-orange-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${hasBlocker ? 'text-red-300' : 'text-orange-500'}`}>
            {hasBlocker ? 'Profile Mismatch Detected' : 'Please Review'}
          </p>
          <div className="mt-2 space-y-1.5">
            {mismatches.map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.severity === 'error' ? 'bg-red-400' : 'bg-orange-400'}`} />
                <p className="text-gray-600 text-xs leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
          {hasBlocker && (
            <p className="text-gray-500 text-[11px] mt-3">
              Please update either your profile name or the name on this form so they match before submitting.
            </p>
          )}
          {warningsOnly && onDismiss && (
            <button type="button" onClick={onDismiss}
              className="mt-3 text-orange-500 text-xs font-semibold hover:text-orange-500 transition-colors underline underline-offset-2">
              I've double-checked, continue anyway
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Match indicator (inline, next to the name field) ────────────────
const NameMatchIndicator = ({ idName, profileName }) => {
  if (!idName?.trim() || !profileName) return null;

  const result = compareNames(idName, profileName);

  if (result.confidence === 'high' && result.match) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5">
        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span className="text-blue-400 text-xs font-medium">Matches your profile name</span>
      </div>
    );
  }

  if (result.confidence === 'partial' && result.match) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5">
        <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
        </svg>
        <span className="text-orange-500 text-xs font-medium">Partial match: {result.details}</span>
      </div>
    );
  }

  if (!result.match) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5">
        <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-red-400 text-xs font-medium">Does not match profile name "{profileName}"</span>
      </div>
    );
  }

  return null;
};


// ═════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════
// NEW prop: profileData - the user's dashboard profile object
//   Expected shape: { displayName, university, city, state, ... }
//   When provided, the component cross-verifies the ID name against it.

const IdVerification = ({ initialData, onSave, saving = false, inputClass, labelClass, profileData }) => {
  const defaultInput = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 min-h-[44px] text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm transition-all";
  const defaultLabel = "block text-orange-400 font-semibold mb-2 text-sm";
  const iCls = inputClass || defaultInput;
  const lCls = labelClass || defaultLabel;

  const [idForm, setIdForm] = useState({
    idType: initialData?.idType || '',
    fullName: initialData?.fullName || '',
    idNumber: initialData?.idNumber || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    expiryDate: initialData?.expiryDate || '',
    issuingCountry: initialData?.issuingCountry || '',
    issuingAuthority: initialData?.issuingAuthority || '',
    isPublic: initialData?.isPublic ?? false,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [compressedBase64, setCompressedBase64] = useState(null);
  const [warningDismissed, setWarningDismissed] = useState(false);

  // ── Cross-verification logic (runs on every relevant change) ──────
  const mismatches = useMemo(() => {
    if (!profileData) return []; // no profile to compare - skip verification
    const issues = [];

    // 1. Name check - compare ID name against profile displayName
    if (idForm.fullName.trim() && profileData.displayName) {
      const result = compareNames(idForm.fullName, profileData.displayName);
      if (!result.match) {
        issues.push({
          field: 'fullName',
          severity: 'error', // blocking - names MUST match
          message: `The name on your ID "${idForm.fullName.trim()}" does not match your profile name "${profileData.displayName}". ${result.details}.`,
        });
      } else if (result.confidence === 'partial') {
        issues.push({
          field: 'fullName',
          severity: 'warning', // non-blocking but flagged for review
          message: `${result.details}. Profile: "${profileData.displayName}" - ID: "${idForm.fullName.trim()}". Please confirm this is correct.`,
        });
      }
    }

    // 2. Expired document check
    if (idForm.expiryDate && new Date(idForm.expiryDate) < new Date()) {
      issues.push({
        field: 'expiryDate',
        severity: 'error',
        message: 'This ID has expired. Please use a valid, non-expired document.',
      });
    }

    return issues;
  }, [idForm.fullName, idForm.expiryDate, profileData]);

  const hasBlockingMismatch = mismatches.some((m) => m.severity === 'error');

  // Compress image using Canvas API - targets ~300KB max
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.6);
          resolve(base64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WebP image');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB');
      return;
    }

    try {
      const base64 = await compressImage(file);
      setPreviewUrl(base64);
      setCompressedBase64(base64);
      setImageLoaded(true);
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Error processing image. Please try another file.');
    }
  };

  const handleChange = (field, value) => {
    setIdForm(prev => ({ ...prev, [field]: value }));
    // Reset warning dismissal when name changes so banner reappears
    if (field === 'fullName') setWarningDismissed(false);
  };

  const isExpired = () => {
    if (!idForm.expiryDate) return false;
    return new Date(idForm.expiryDate) < new Date();
  };

  const handleSubmit = () => {
    // Standard field validations
    if (!idForm.idType) { alert('Please select an ID type'); return; }
    if (!imageLoaded || !compressedBase64) { alert('Please upload a photo of your ID document'); return; }
    if (!idForm.fullName.trim()) { alert('Please enter the full name on the ID'); return; }
    if (!idForm.idNumber.trim()) { alert('Please enter the ID number'); return; }
    if (!idForm.expiryDate) { alert('Please enter the expiry date'); return; }
    if (isExpired()) { alert('This ID has expired. Please use a valid, non-expired document.'); return; }

    // Cross-verification gate - block if name mismatch is severe
    if (hasBlockingMismatch) {
      alert('Your ID details do not match your profile. Please correct the name on your ID or update your profile name before verifying.');
      return;
    }

    // Determine verification status based on match quality
    const nameResult = profileData?.displayName
      ? compareNames(idForm.fullName, profileData.displayName)
      : { match: true, confidence: 'high' };

    const verificationStatus = nameResult.match && nameResult.confidence === 'high'
      ? 'verified'
      : nameResult.match && nameResult.confidence === 'partial'
        ? 'pending_review'  // partial match - admin can review
        : 'verified';       // no profile data to compare - default verified

    onSave({
      idType: idForm.idType,
      fullName: idForm.fullName.trim(),
      idNumber: idForm.idNumber.trim(),
      dateOfBirth: idForm.dateOfBirth || null,
      expiryDate: idForm.expiryDate,
      issuingCountry: idForm.issuingCountry.trim() || null,
      issuingAuthority: idForm.issuingAuthority.trim() || null,
      isPublic: idForm.isPublic,
      idImage: compressedBase64,
      verified: true,
      verificationStatus,   // 'verified' | 'pending_review'
      profileNameAtVerification: profileData?.displayName || null, // snapshot for audit
      verifiedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-5">

      {/* ── Cross-verification banner ── */}
      {mismatches.length > 0 && (
        <MismatchBanner
          mismatches={mismatches}
          dismissed={warningDismissed}
          onDismiss={() => setWarningDismissed(true)}
        />
      )}

      {/* ── Profile context hint ── */}
      {profileData?.displayName && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {profileData.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{profileData.displayName}</p>
            <p className="text-gray-500 text-[11px]">Your ID details will be verified against this profile</p>
          </div>
        </div>
      )}

      {/* ID Type */}
      <div>
        <label className={lCls}>ID Type *</label>
        <div className="grid grid-cols-3 gap-2">
          {idTypes.map(t => (
            <button key={t.value} type="button" onClick={() => handleChange('idType', t.value)}
              className={`p-3 rounded-xl border-2 text-center text-sm font-semibold transition-all active:scale-95 ${
                idForm.idType === t.value ? 'border-orange-400 bg-orange-500/20 text-white' : 'border-white/15 bg-white/5 text-gray-600 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload for reference */}
      <div>
        <label className={lCls}>Upload ID Document *</label>
        <p className="text-gray-500 text-xs mb-2">Upload a clear photo of your ID. The image will be compressed and securely stored.</p>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileUpload}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 file:cursor-pointer file:transition-all" />
        {previewUrl && (
          <div className="mt-3 relative">
            <img src={previewUrl} alt="ID Preview" className="max-h-48 rounded-xl border border-white/20 object-contain" />
            <button type="button" onClick={() => { setPreviewUrl(null); setImageLoaded(false); setCompressedBase64(null); }}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80 transition-colors">
              X
            </button>
            <p className="text-gray-500 text-[10px] mt-1">This image will be compressed and securely stored in our database</p>
          </div>
        )}
      </div>

      {/* Manual entry fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={lCls}>Full Name (as on ID) *</label>
          <input
            type="text"
            value={idForm.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            className={`${iCls} ${
              profileData?.displayName && idForm.fullName.trim()
                ? compareNames(idForm.fullName, profileData.displayName).match
                  ? 'border-blue-500/40 focus:border-blue-400'
                  : 'border-red-500/40 focus:border-red-400'
                : ''
            }`}
            placeholder="Full legal name"
          />
          {/* Inline match indicator below the name field */}
          <NameMatchIndicator idName={idForm.fullName} profileName={profileData?.displayName} />
        </div>
        <div>
          <label className={lCls}>ID Number *</label>
          <input type="text" value={idForm.idNumber} onChange={e => handleChange('idNumber', e.target.value)} className={iCls} placeholder="ID / Licence / Passport number" />
        </div>
        <div>
          <label className={lCls}>Date of Birth</label>
          <input type="date" value={idForm.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} className={iCls} />
        </div>
        <div>
          <label className={lCls}>Expiry Date *</label>
          <input type="date" value={idForm.expiryDate} onChange={e => handleChange('expiryDate', e.target.value)} className={iCls} />
          {isExpired() && (
            <p className="text-red-400 text-xs mt-1 font-semibold">This ID has expired. Please use a valid document.</p>
          )}
        </div>
        <div>
          <label className={lCls}>Issuing Country</label>
          <input type="text" value={idForm.issuingCountry} onChange={e => handleChange('issuingCountry', e.target.value)} className={iCls} placeholder="e.g., Nigeria" />
        </div>
        <div className="sm:col-span-2">
          <label className={lCls}>Issuing Authority</label>
          <input type="text" value={idForm.issuingAuthority} onChange={e => handleChange('issuingAuthority', e.target.value)} className={iCls} placeholder="e.g., Immigration Service" />
        </div>
      </div>

      {/* Privacy Toggle */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">ID Visibility</p>
            <p className="text-gray-400 text-xs mt-0.5">
              {idForm.isPublic ? 'Your ID details are visible on your profile' : 'Your ID details are private (only you and admins can see)'}
            </p>
          </div>
          <button type="button" onClick={() => handleChange('isPublic', !idForm.isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${idForm.isPublic ? 'bg-orange-500' : 'bg-white/20'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${idForm.isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        <p className="text-gray-600 text-[10px] mt-2">Regardless of this setting, your ID information is always securely saved in our database.</p>
      </div>

      {/* Save - disabled when blocking mismatches exist */}
      <button type="button" onClick={handleSubmit} disabled={saving || hasBlockingMismatch}
        className={`w-full py-3 min-h-[44px] font-bold rounded-xl text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          hasBlockingMismatch
            ? 'bg-gray-600 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
        }`}>
        {saving ? 'Saving...' : hasBlockingMismatch ? 'Fix Mismatches to Continue' : 'Save ID Information'}
      </button>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════
// DISPLAY COMPONENT (for showing saved ID info in profile view)
// ═════════════════════════════════════════════════════════════════════
export const IdVerificationDisplay = ({ idData, onToggleVisibility, onEdit }) => {
  if (!idData || !idData.verified) return null;

  const idTypeLabels = { national_id: 'National ID', drivers_licence: "Driver's Licence", passport: 'Passport' };

  const statusConfig = {
    verified: { label: 'Verified', bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30' },
    pending_review: { label: 'Pending Review', bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30' },
  };
  const status = statusConfig[idData.verificationStatus] || statusConfig.verified;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">ID Verification</h3>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button type="button" onClick={onEdit} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-orange-400 font-semibold rounded-lg text-xs transition-all min-h-[32px]">
              Edit
            </button>
          )}
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text} border ${status.border}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Pending review notice */}
      {idData.verificationStatus === 'pending_review' && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
          <p className="text-orange-500 text-xs">Your ID name partially matched your profile. An admin will review and confirm your verification shortly.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ['ID Type', idTypeLabels[idData.idType] || idData.idType],
          ['Full Name', idData.fullName],
          ['ID Number', idData.isPublic ? idData.idNumber : '****' + (idData.idNumber?.slice(-4) || '')],
          ['Date of Birth', idData.dateOfBirth ? new Date(idData.dateOfBirth).toLocaleDateString() : null],
          ['Expiry Date', idData.expiryDate ? new Date(idData.expiryDate).toLocaleDateString() : null],
          ['Issuing Country', idData.issuingCountry],
        ].filter(([, val]) => val).map(([label, val]) => (
          <div key={label}>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-white text-sm font-medium">{val}</p>
          </div>
        ))}
      </div>

      {/* Privacy toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          <p className="text-gray-400 text-xs font-semibold">{idData.isPublic ? 'Public' : 'Private'}</p>
          <p className="text-gray-600 text-[10px]">{idData.isPublic ? 'Visible on your profile' : 'Only you and admins can see'}</p>
        </div>
        {onToggleVisibility && (
          <button type="button" onClick={onToggleVisibility}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${idData.isPublic ? 'bg-orange-500' : 'bg-white/20'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${idData.isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        )}
      </div>
    </div>
  );
};

export default IdVerification;
