// src/utils/projectSlots.js
// Places for people besides the lead. Saved as roleSlots; older projects stored
// the team size without the lead (equal to their roles), newer ones with it.
export const roleSlotsOf = (data, existingTotal) => {
  if (Number(data.roleSlots) > 0) return Number(data.roleSlots);
  const max = Number(data.maxTeamSize) || 0;
  if (existingTotal > 0 && existingTotal >= max) return existingTotal;
  return max > 1 ? max - 1 : 0;
};
