// src/utils/dateRules.js
// One rule for every start/end date on the platform:
//  - New start dates can't be in the past (today is fine, if the time is still ahead).
//  - Something that already started may keep its original start date, but can't
//    be moved to a different past date.
//  - The end date must be after the start date, and not in the past.

// Today's date in the person's own time zone, as YYYY-MM-DD.
export const todayISO = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

// The earliest start date the calendar should allow.
export const minStartDate = (originalStart) => {
  const t = todayISO();
  return originalStart && originalStart < t ? originalStart : t;
};

// The earliest end date the calendar should allow.
export const minEndDate = (start) => {
  const t = todayISO();
  if (!start) return t;
  // the day after the start, or today, whichever is later
  const d = new Date(`${start}T12:00:00`);
  d.setDate(d.getDate() + 1);
  const next = d.toISOString().slice(0, 10);
  return next > t ? next : t;
};

/**
 * Returns an error message, or '' if the dates are fine.
 * start, end: YYYY-MM-DD. startTime: HH:MM (optional). originalStart: the saved
 * start date when editing something that already exists.
 */
export const checkDates = ({ start, end, startTime = null, originalStart = null, requireStart = true }) => {
  const t = todayISO();
  if (requireStart && !start) return 'Choose a start date.';
  if (start) {
    const keepingOriginal = originalStart && start === originalStart;
    if (!keepingOriginal && start < t) return 'The start date can’t be in the past.';
    if (!keepingOriginal && start === t && startTime) {
      const at = new Date(`${start}T${startTime}`);
      if (at.getTime() < Date.now()) return 'That start time has already passed today. Choose a later time.';
    }
  }
  if (!end) return 'Choose an end date.';
  if (end < t) return 'The end date can’t be in the past.';
  if (start && end <= start) return 'The end date must be after the start date.';
  return '';
};
