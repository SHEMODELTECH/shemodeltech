// src/utils/eventUtils.js
// Utility functions for handling event dates, times, and formatting

/**
 * Parse duration string and return milliseconds
 * Handles formats like: "1 hour", "30 minutes", "2 hours", "1.5 hours", "1 day", etc.
 * @param {string} durationString - Duration in human-readable format
 * @returns {number} Duration in milliseconds
 */
export function parseDurationToMs(durationString) {
  if (!durationString || typeof durationString !== 'string') {
    return 60 * 60 * 1000; // Default to 1 hour
  }

  const duration = durationString.toLowerCase().trim();
  let totalMs = 0;

  // Match different time units
  const patterns = [
    { regex: /(\d+(?:\.\d+)?)\s*days?/, multiplier: 24 * 60 * 60 * 1000 },
    { regex: /(\d+(?:\.\d+)?)\s*hours?/, multiplier: 60 * 60 * 1000 },
    { regex: /(\d+)\s*minutes?/, multiplier: 60 * 1000 },
  ];

  let matched = false;
  
  for (const pattern of patterns) {
    const match = duration.match(pattern.regex);
    if (match) {
      totalMs += parseFloat(match[1]) * pattern.multiplier;
      matched = true;
    }
  }

  // If no patterns matched, try to extract any number and assume hours
  if (!matched) {
    const numberMatch = duration.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      totalMs = parseFloat(numberMatch[1]) * 60 * 60 * 1000; // Assume hours
    } else {
      totalMs = 60 * 60 * 1000; // Default to 1 hour
    }
  }

  return totalMs;
}

/**
 * Calculate human-readable duration between two dates
 * @param {Date|string} startDate - Start date/time
 * @param {Date|string} endDate - End date/time
 * @returns {string} Human-readable duration
 */
export function calculateEventDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end - start;
  
  if (durationMs <= 0) {
    return '0 minutes';
  }
  
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const parts = [];
  
  if (days > 0) {
    parts.push(`${days} day${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0 && days === 0) { // Only show minutes if less than a day
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  
  if (parts.length === 0) {
    return 'Less than 1 minute';
  }
  
  return parts.join(', ');
}

/**
 * Check if an event spans multiple days
 * @param {Date|string} startDate - Start date/time
 * @param {Date|string} endDate - End date/time
 * @returns {boolean} True if event spans multiple days
 */
export function isMultiDayEvent(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start.toDateString() !== end.toDateString();
}

/**
 * Format event date and time for display
 * @param {Object} event - Event object with startDate and endDate
 * @returns {Object} Formatted date/time information
 */
export function formatEventDateTime(event) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isMultiDay = isMultiDayEvent(startDate, endDate);
  
  if (isMultiDay) {
    // Multi-day event
    const startFormatted = startDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const endFormatted = endDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return {
      primary: `${startFormatted} - ${endFormatted}`,
      duration: calculateEventDuration(startDate, endDate),
      isMultiDay: true
    };
  } else {
    // Same day event
    const dateFormatted = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const startTime = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return {
      primary: dateFormatted,
      time: `${startTime} - ${endTime}`,
      duration: calculateEventDuration(startDate, endDate),
      isMultiDay: false
    };
  }
}

/**
 * Convert legacy event format to new format
 * @param {Object} legacyEvent - Event with eventDate and duration
 * @returns {Object} Event with startDate and endDate
 */
export function convertLegacyEventFormat(legacyEvent) {
  if (legacyEvent.startDate && legacyEvent.endDate) {
    return legacyEvent; // Already in new format
  }
  
  let startDate;
  if (legacyEvent.eventDate && typeof legacyEvent.eventDate.toDate === 'function') {
    // Firestore Timestamp
    startDate = legacyEvent.eventDate.toDate();
  } else if (legacyEvent.eventDate instanceof Date) {
    startDate = legacyEvent.eventDate;
  } else if (typeof legacyEvent.eventDate === 'string') {
    startDate = new Date(legacyEvent.eventDate);
  } else {
    startDate = new Date(); // Fallback to current time
  }
  
  // Calculate end date from duration
  const durationMs = legacyEvent.durationMs || parseDurationToMs(legacyEvent.duration);
  const endDate = new Date(startDate.getTime() + durationMs);
  
  return {
    ...legacyEvent,
    startDate: startDate,
    endDate: endDate,
    durationMs: durationMs,
    isMultiDay: isMultiDayEvent(startDate, endDate),
    computedDuration: calculateEventDuration(startDate, endDate)
  };
}

/**
 * Generate Google Calendar URL for an event
 * @param {Object} event - Event object with startDate, endDate, and other details
 * @returns {string} Google Calendar URL
 */
export function generateGoogleCalendarUrl(event) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const eventDetails = [
    event.eventDescription,
    event.learningObjectives ? `\nWhat you'll learn:\n${event.learningObjectives}` : '',
    event.requirements ? `\nRequirements:\n${event.requirements}` : '',
    event.meetingUrl ? `\nJoin here: ${event.meetingUrl}` : ''
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.eventTitle,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: eventDetails,
    location: event.meetingUrl || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Check if an event is currently happening
 * @param {Object} event - Event object with startDate and endDate
 * @returns {boolean} True if event is currently happening
 */
export function isEventHappening(event) {
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  return now >= startDate && now <= endDate;
}

/**
 * Check if an event is upcoming
 * @param {Object} event - Event object with startDate
 * @returns {boolean} True if event hasn't started yet
 */
export function isEventUpcoming(event) {
  const now = new Date();
  const startDate = new Date(event.startDate);
  
  return startDate > now;
}

/**
 * Check if an event has ended
 * @param {Object} event - Event object with endDate
 * @returns {boolean} True if event has ended
 */
export function isEventEnded(event) {
  const now = new Date();
  const endDate = new Date(event.endDate);
  
  return endDate < now;
}

/**
 * Get event status as string
 * @param {Object} event - Event object with startDate and endDate
 * @returns {string} Event status: 'upcoming', 'happening', or 'ended'
 */
export function getEventStatus(event) {
  if (isEventHappening(event)) {
    return 'happening';
  } else if (isEventUpcoming(event)) {
    return 'upcoming';
  } else {
    return 'ended';
  }
}

/**
 * Get time until event starts (for upcoming events)
 * @param {Object} event - Event object with startDate
 * @returns {string|null} Human-readable time until event starts, or null if not upcoming
 */
export function getTimeUntilEvent(event) {
  if (!isEventUpcoming(event)) {
    return null;
  }
  
  const now = new Date();
  const startDate = new Date(event.startDate);
  const timeDiff = startDate - now;
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `in ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return 'starting soon';
  }
}

/**
 * Validate event date range
 * @param {Date|string} startDate - Start date/time
 * @param {Date|string} endDate - End date/time
 * @returns {Object} Validation result with isValid and error message
 */
export function validateEventDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  // Check if dates are valid
  if (isNaN(start.getTime())) {
    return { isValid: false, error: 'Start date is invalid' };
  }
  
  if (isNaN(end.getTime())) {
    return { isValid: false, error: 'End date is invalid' };
  }
  
  // Check if start date is in the future
  if (start <= now) {
    return { isValid: false, error: 'Start date must be in the future' };
  }
  
  // Check if end date is after start date
  if (end <= start) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  
  // Check if event is not too long (max 7 days)
  const maxDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  if (end - start > maxDuration) {
    return { isValid: false, error: 'Event duration cannot exceed 7 days' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Get event complexity based on duration, type, and description
 * @param {Object} event - Event object
 * @returns {string} Complexity level: 'simple', 'moderate', or 'complex'
 */
export function getEventComplexity(event) {
  let complexity = 'simple';
  
  const description = (event.eventDescription || '').toLowerCase();
  const learningObjectives = (event.learningObjectives || '').toLowerCase();
  const type = event.eventType;
  
  // Check for complex topics
  const complexTopics = ['ai', 'machine learning', 'blockchain', 'advanced', 'expert', 'architecture'];
  const hasComplexTopic = complexTopics.some(topic => 
    description.includes(topic) || learningObjectives.includes(topic)
  );
  
  // Check if multi-day event
  const isMultiDay = event.isMultiDay || isMultiDayEvent(event.startDate, event.endDate);
  
  // Check duration
  const duration = event.computedDuration || calculateEventDuration(event.startDate, event.endDate);
  const isLongDuration = duration.includes('day') || duration.includes('6 hour') || duration.includes('8 hour');
  
  // Check event type
  const complexTypes = ['workshop', 'conference'];
  const isComplexType = complexTypes.includes(type);
  
  if (hasComplexTopic || isLongDuration || isComplexType || isMultiDay) {
    complexity = 'complex';
  } else if (description.length > 500) {
    complexity = 'moderate';
  }
  
  return complexity;
}

/**
 * Filter events based on timeframe
 * @param {Array} events - Array of event objects
 * @param {string} timeframe - Timeframe filter ('this-week', 'this-month', 'next-month')
 * @returns {Array} Filtered events
 */
export function filterEventsByTimeframe(events, timeframe) {
  if (!timeframe) {
    return events;
  }
  
  const now = new Date();
  
  return events.filter(event => {
    const eventStartDate = new Date(event.startDate);
    const daysDiff = Math.ceil((eventStartDate - now) / (1000 * 60 * 60 * 24));
    
    switch (timeframe) {
      case 'this-week':
        return daysDiff <= 7;
      case 'this-month':
        return daysDiff <= 30;
      case 'next-month':
        return daysDiff > 30 && daysDiff <= 60;
      default:
        return true;
    }
  });
}

/**
 * Sort events by start date
 * @param {Array} events - Array of event objects
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted events
 */
export function sortEventsByDate(events, order = 'asc') {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    
    if (order === 'desc') {
      return dateB - dateA;
    }
    return dateA - dateB;
  });
}

/**
 * Group events by date
 * @param {Array} events - Array of event objects
 * @returns {Object} Events grouped by date string
 */
export function groupEventsByDate(events) {
  return events.reduce((groups, event) => {
    const startDate = new Date(event.startDate);
    const dateKey = startDate.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(event);
    return groups;
  }, {});
}
