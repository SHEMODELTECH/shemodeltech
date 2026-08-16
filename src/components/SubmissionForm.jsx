// src/components/SubmissionForm.jsx
//
// The submission gate. A team cannot go to review without a GitHub repository
// AND confirmation that the SHEMODELTECH account was invited as a collaborator.
//
// The collaborator invite is the point. A public repo link proves a project
// exists; commit history proves who wrote it. Badges certify individual
// contribution, so reviewers need to see per-author commits, otherwise a
// badge is a claim, not evidence.

import React, { useState } from 'react';
import {
 parseRepoUrl, collaboratorSettingsUrl, COLLABORATOR_STEPS, GITHUB_ORG,
 GITHUB_ORG_URL, validateSubmission,
} from '../utils/githubSubmission';

const SubmissionForm = ({ project, onSubmit, submitting, disabled, disabledReason }) => {
 const [repoUrl, setRepoUrl] = useState(project?.reviewRepoUrl || '');
 const [liveUrl, setLiveUrl] = useState(project?.reviewLiveUrl || '');
 const [notes, setNotes] = useState('');
 const [invited, setInvited] = useState(false);
 const [errors, setErrors] = useState([]);

 const parsed = parseRepoUrl(repoUrl);
 const settingsUrl = collaboratorSettingsUrl(repoUrl);
 const round = project?.reviewRound || 0;

 const handleSubmit = () => {
 const result = validateSubmission({
 repoUrl, collaboratorInvited: invited, liveUrl,
 });
 if (!result.valid) { setErrors(result.errors); return; }
 setErrors([]);
 onSubmit({ repoUrl: result.repoUrl, collaboratorInvited: true, liveUrl, notes });
 };

 return (
 <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
 <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
 <h3 className="text-gray-900 font-bold text-lg">Submit for review</h3>
 {round > 0 && (
 <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">
 Attempt {round + 1}
 </span>
 )}
 </div>
 <p className="text-gray-500 text-sm mb-5">
 Once approved, you&rsquo;ll be able to award badges and issue certificates to your team.
 </p>

 {/* Repository */}
 <label className="block text-sm font-semibold text-gray-900 mb-1.5">
 GitHub repository <span className="text-pink-600">*</span>
 </label>
 <input
 type="url"
 value={repoUrl}
 onChange={(e) => setRepoUrl(e.target.value)}
 placeholder="https://github.com/your-team/project-name"
 className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
 repoUrl && !parsed.valid
 ? 'border-red-300 focus:border-red-500'
 : 'border-gray-300 focus:border-pink-500'
 }`}
 />
 {repoUrl && !parsed.valid && (
 <p className="text-red-600 text-xs mt-1.5">{parsed.error}</p>
 )}
 {parsed.valid && (
 <p className="text-green-700 text-xs mt-1.5">
 Repository recognised: {parsed.owner}/{parsed.repo}
 </p>
 )}

 {/* Collaborator requirement */}
 <div className="mt-5 bg-pink-50 border border-pink-200 rounded-xl p-4">
 <p className="text-gray-900 text-sm font-bold mb-1">
 Invite {GITHUB_ORG} as a collaborator
 </p>
 <p className="text-gray-600 text-xs mb-3 leading-relaxed">
 Your badge certifies what <em>you</em> built. Reviewers need access to the
 commit history to verify each person&rsquo;s contribution, a public
 link alone can&rsquo;t show who wrote what.
 </p>
 <ol className="text-gray-700 text-xs space-y-1 mb-3 list-decimal list-inside">
 {COLLABORATOR_STEPS.map((step, i) => <li key={i}>{step}</li>)}
 </ol>
 <div className="flex flex-wrap gap-3 mb-3">
 {settingsUrl && (
 <a href={settingsUrl} target="_blank" rel="noopener noreferrer"
 className="text-pink-700 text-xs font-semibold underline">
 Open your collaborator settings
 </a>
 )}
 <a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer"
 className="text-pink-700 text-xs font-semibold underline">
 View the {GITHUB_ORG} account
 </a>
 </div>
 <label className="flex items-start gap-2.5 cursor-pointer">
 <input
 type="checkbox"
 checked={invited}
 onChange={(e) => setInvited(e.target.checked)}
 className="mt-0.5 w-4 h-4 accent-pink-600"
 />
 <span className="text-gray-900 text-xs font-semibold">
 I have invited <strong>{GITHUB_ORG}</strong> as a collaborator on this repository.
 </span>
 </label>
 </div>

 {/* Optional extras */}
 <label className="block text-sm font-semibold text-gray-900 mb-1.5 mt-5">
 Live demo link <span className="text-gray-400 font-normal">(optional)</span>
 </label>
 <input
 type="url"
 value={liveUrl}
 onChange={(e) => setLiveUrl(e.target.value)}
 placeholder="https://your-project.vercel.app"
 className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none"
 />

 <label className="block text-sm font-semibold text-gray-900 mb-1.5 mt-4">
 Anything the reviewer should know? <span className="text-gray-400 font-normal">(optional)</span>
 </label>
 <textarea
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 rows={3}
 placeholder="Known issues, what you'd do with more time, who focused on what…"
 className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none resize-y"
 />

 {errors.length > 0 && (
 <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
 {errors.map((e, i) => (
 <p key={i} className="text-red-700 text-xs leading-relaxed">{e}</p>
 ))}
 </div>
 )}

 {disabled && disabledReason && (
 <p className="text-orange-700 text-xs mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
 {disabledReason}
 </p>
 )}

 <button
 type="button"
 onClick={handleSubmit}
 disabled={submitting || disabled || !parsed.valid || !invited}
 className="mt-5 w-full sm:w-auto bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all"
 >
 {submitting ? 'Submitting…' : 'Submit for review'}
 </button>
 </div>
 );
};

export default SubmissionForm;
