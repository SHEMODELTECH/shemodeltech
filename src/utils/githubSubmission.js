// src/utils/githubSubmission.js
//
// GitHub is the evidence layer for She Model Tech.
//
// WHY A PUBLIC LINK IS NOT ENOUGH
// A repo URL proves a project exists. It does NOT prove who wrote the code.
// Commit history does. That is why every submission must invite the
// SHEMODELTECH account as a collaborator: with collaborator access a reviewer
// can see per-author commits and verify that the woman claiming a TechDev
// badge actually wrote the code. Without it, a badge is a claim rather than
// evidence — and verified proof of work is the entire product.

import { BRAND } from '../config/brand';

export const GITHUB_ORG = BRAND.githubOrg || 'SHEMODELTECH';
export const GITHUB_ORG_URL = BRAND.github || 'https://github.com/SHEMODELTECH';

// Accepts:  https://github.com/owner/repo   (with or without .git / trailing /)
// Rejects:  gists, user profiles, non-GitHub hosts, and bare "owner/repo".
const REPO_RE = /^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(\.git)?\/?$/i;

/**
 * Validate and normalise a GitHub repository URL.
 * @returns {{valid:boolean, error?:string, url?:string, owner?:string, repo?:string}}
 */
export const parseRepoUrl = (raw) => {
  const value = (raw || '').trim();
  if (!value) {
    return { valid: false, error: 'A GitHub repository link is required.' };
  }
  if (/gist\.github\.com/i.test(value)) {
    return { valid: false, error: 'That is a Gist, not a repository. Please link the project repository.' };
  }
  if (!/github\.com/i.test(value)) {
    return { valid: false, error: 'That does not look like a GitHub link. It should start with https://github.com/' };
  }

  const m = value.match(REPO_RE);
  if (!m) {
    return {
      valid: false,
      error: 'Use the repository link in the form https://github.com/owner/repository',
    };
  }

  const [, , owner, repo] = m;
  if (owner.toLowerCase() === 'orgs' || !repo) {
    return { valid: false, error: 'That looks like an organisation page, not a repository.' };
  }

  return {
    valid: true,
    url: `https://github.com/${owner}/${repo}`,
    owner,
    repo,
  };
};

/** Direct link to the repo's collaborator settings, to remove all guesswork. */
export const collaboratorSettingsUrl = (repoUrl) => {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed.valid) return null;
  return `https://github.com/${parsed.owner}/${parsed.repo}/settings/access`;
};

/** Step-by-step instructions shown next to the submission field. */
export const COLLABORATOR_STEPS = [
  'Open your repository on GitHub.',
  'Go to Settings → Collaborators (or Settings → Access).',
  'Click "Add people".',
  `Enter ${GITHUB_ORG} and send the invitation.`,
  'Come back here and tick the confirmation box below.',
];

/**
 * Validate a full submission before it goes to review.
 * @returns {{valid:boolean, errors:string[], repoUrl?:string}}
 */
export const validateSubmission = ({ repoUrl, collaboratorInvited, liveUrl }) => {
  const errors = [];

  const parsed = parseRepoUrl(repoUrl);
  if (!parsed.valid) errors.push(parsed.error);

  if (!collaboratorInvited) {
    errors.push(
      `You must invite ${GITHUB_ORG} as a collaborator and tick the box to confirm. ` +
      'Reviewers need commit history to verify who did what — this is how your badge is earned.'
    );
  }

  // A live/demo URL is optional, but if given it should be a real URL.
  if (liveUrl && liveUrl.trim()) {
    try {
      const u = new URL(liveUrl.trim());
      if (!['http:', 'https:'].includes(u.protocol)) {
        errors.push('The live demo link should start with http:// or https://');
      }
    } catch (_) {
      errors.push('The live demo link is not a valid URL.');
    }
  }

  return { valid: errors.length === 0, errors, repoUrl: parsed.url };
};
