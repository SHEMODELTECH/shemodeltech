// src/config/nonprofit.js
// SHE MODEL TECH Inc. is a 501(c)(3). The EIN is public information (it appears
// in IRS charity records and on Form 990) and belongs on gift receipts.
export const ORG_LEGAL_NAME = 'SHE MODEL TECH Inc.';
export const ORG_EIN = process.env.REACT_APP_EIN || '99-3869491';
export const DEDUCTIBLE_LINE = `${ORG_LEGAL_NAME} is a 501(c)(3) nonprofit (EIN ${ORG_EIN}). Gifts are tax-deductible to the extent allowed by law.`;
