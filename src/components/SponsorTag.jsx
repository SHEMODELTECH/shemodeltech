// src/components/SponsorTag.jsx
//
// The visible acknowledgement a sponsor pays for: their name and logo on the
// team they funded.
//
// This is shown to MEMBERS as well as to visitors, deliberately — a woman
// receiving a stipend should know exactly who funded it. Hidden sponsorship
// would be the beginning of the platform quietly selling access.

import React from 'react';
import { FUNDING_TYPE } from '../utils/sponsorships';

/**
 * @param {'sm'|'md'} size
 * @param {boolean} showLabel  include the "Sponsored cohort" wording
 */
const SponsorTag = ({ project, size = 'md', showLabel = true }) => {
  if (!project) return null;

  const sponsored = project.fundingType === FUNDING_TYPE.SPONSORED
    && project.sponsorName;

  // Community-funded teams get a quiet tag of their own, so "no sponsor"
  // never reads as "lesser project".
  if (!sponsored) {
    if (!showLabel) return null;
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
        Community cohort
      </span>
    );
  }

  const logo = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

  const inner = (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200">
      {project.sponsorLogo && (
        <img
          src={project.sponsorLogo}
          alt={`${project.sponsorName} logo`}
          className={`${logo} rounded object-contain`}
        />
      )}
      <span className="text-[10px] font-bold uppercase tracking-wide text-purple-800">
        {showLabel ? 'Sponsored by ' : ''}{project.sponsorName}
      </span>
    </span>
  );

  return project.sponsorWebsite ? (
    <a
      href={project.sponsorWebsite}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="hover:opacity-80 transition-opacity"
    >
      {inner}
    </a>
  ) : inner;
};

export default SponsorTag;
