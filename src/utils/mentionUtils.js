// utils/mentionUtils.js - Updated for Professional Names (Clean Version)
import { loadMemberDirectory } from './memberIndex';

// Helper function to get professional display name
export const getProfessionalDisplayName = (user) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.displayName || 'Professional User';
};

// Helper function to get professional initials
export const getProfessionalInitials = (user) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  return user.initials || user.displayName?.charAt(0)?.toUpperCase() || 'U';
};

// Helper function to get mention handle (for @username display)
export const getMentionHandle = (user) => {
  // Use firstName + lastName for handle if available, otherwise fall back to displayName or email
  if (user.firstName && user.lastName) {
    return `${user.firstName}${user.lastName}`.replace(/\s+/g, ''); // Remove spaces
  }
  return user.displayName?.replace(/\s+/g, '') || user.email?.split('@')[0] || 'user';
};

// Format user for mention in text
export const formatUserForMention = (user) => {
  const handle = getMentionHandle(user);
  // If the handle contains spaces or special characters, wrap in quotes
  if (handle.includes(' ') || /[^a-zA-Z0-9_]/.test(handle)) {
    return `@"${handle}"`;
  }
  return `@${handle}`;
};

// The people you can @-mention: everyone in the member directory (a few
// reads, kept for 10 minutes; src/utils/memberIndex.js). It used to read the
// first 200 member records, so later members couldn't be mentioned here.
const getUserPool = () => loadMemberDirectory();

// Search users function - searches by name and email, client-side for reliability
// (no composite indexes needed, case-insensitive). `term` is the typed query.
export const searchUsers = async (term) => {
  try {
    // Use the cached pool (one read per minute), then filter/sort in JS.
    const users = await getUserPool();

    const t = (term || '').toLowerCase().trim();

    if (!t) {
      // No query yet (just typed "@"): show a few recent/any users.
      return users.slice(0, 5);
    }

    // Match across displayName, firstName, lastName, and email, case-insensitively.
    const matches = users.filter(u => {
      const fields = [
        u.displayName, u.firstName, u.lastName, u.email,
        `${u.firstName || ''} ${u.lastName || ''}`,
      ].map(x => (x || '').toString().toLowerCase());
      return fields.some(f => f.includes(t));
    });

    return matches.slice(0, 10);
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Extract mentions from text
export const extractMentions = (text) => {
  if (!text) return [];
  
  // Match both quoted and unquoted mentions: @username or @"display name"
  const mentionRegex = /@(?:"([^"]+)"|(\w+))/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    const mentionText = match[1] || match[2]; // Quoted or unquoted
    mentions.push(mentionText);
  }
  
  return mentions;
};

// Validate mentions against actual users
export const validateMentions = async (text, taggedUsers = []) => {
  const mentions = extractMentions(text);
  const validMentions = [];
  
  for (const mention of mentions) {
    const user = taggedUsers.find(user => 
      getMentionHandle(user) === mention ||
      getProfessionalDisplayName(user) === mention
    );
    
    if (user) {
      validMentions.push(user);
    }
  }
  
  return validMentions;
};

// Format mentions for display with professional names
export const formatMentions = (text, taggedUsers = []) => {
  if (!text || !taggedUsers.length) return text;
  
  let formattedText = text;
  
  taggedUsers.forEach(user => {
    const handle = getMentionHandle(user);
    const displayName = getProfessionalDisplayName(user);
    
    // Replace both quoted and unquoted mentions
    const quotedPattern = new RegExp(`@"${handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'gi');
    const unquotedPattern = new RegExp(`@${handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    const replacement = `<span class="text-pink-600 hover:text-pink-700 cursor-pointer font-medium" title="${displayName}">@${handle}</span>`;
    
    formattedText = formattedText.replace(quotedPattern, replacement);
    formattedText = formattedText.replace(unquotedPattern, replacement);
  });
  
  return formattedText;
};

// Legacy function for backward compatibility
export const getUserDisplayText = (user) => {
  return getProfessionalDisplayName(user);
};
