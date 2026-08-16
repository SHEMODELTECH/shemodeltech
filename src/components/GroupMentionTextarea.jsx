// components/GroupMentionTextarea.jsx - Responsive Google Login Version
import React, { useState, useRef, useEffect } from 'react';
import { 
  getProfessionalDisplayName, 
  getProfessionalInitials, 
  formatUserForMention, 
  getMentionHandle 
} from '../utils/mentionUtils';

export const GroupMentionTextarea = ({ 
  value, 
  onChange, 
  placeholder = "Write something...",
  className = "",
  onMentionSelect,
  groupMembers = [], // Array of group members
  currentUserId,
  ...props 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Convert group member to user object format
  const memberToUser = (member) => ({
    uid: member.userId || member.uid,
    email: member.userEmail || member.email,
    displayName: member.userName || member.displayName,
    photoURL: member.photoURL || null,
    profile: member.profile || {}
  });

  // Filter group members based on search query
  const searchGroupMembers = (query) => {
    if (!groupMembers || groupMembers.length === 0) return [];
    
    // Exclude current user from suggestions
    const availableMembers = groupMembers.filter(member => 
      (member.userId || member.uid) !== currentUserId
    );
    
    if (!query || query.trim() === '') {
      return availableMembers.slice(0, 8);
    }

    const searchTerm = query.toLowerCase().trim();
    
    const filtered = availableMembers.filter(member => {
      const user = memberToUser(member);
      const searchableFields = [
        user.displayName?.toLowerCase(),
        user.email?.toLowerCase(),
        user.email?.split('@')[0]?.toLowerCase()
      ].filter(Boolean);
      
      return searchableFields.some(field => 
        field && field.includes(searchTerm)
      );
    });

    return filtered.slice(0, 10);
  };

  // Handle text changes and detect @ mentions
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(?:"([^"]*)"|(\S*))$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1] || mentionMatch[2] || '';
      setMentionQuery(query);
      setMentionStartIndex(mentionMatch.index);
      
      const memberResults = searchGroupMembers(query);
      setSuggestions(memberResults);
      setShowSuggestions(memberResults.length > 0);
      setSelectedSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (member, index = selectedSuggestionIndex) => {
    if (!suggestions[index]) return;
    
    const selectedMember = suggestions[index];
    const selectedUser = memberToUser(selectedMember);
    
    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = value.substring(textareaRef.current.selectionStart);
    
    const mentionText = formatUserForMention(selectedUser);
    const newValue = beforeMention + mentionText + ' ' + afterMention;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    if (onMentionSelect) {
      onMentionSelect(selectedUser);
    }
    
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPosition = beforeMention.length + mentionText.length + 1;
      textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (suggestions[selectedSuggestionIndex]) {
          e.preventDefault();
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
      case 'Tab':
        if (suggestions[selectedSuggestionIndex]) {
          e.preventDefault();
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        }
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        {...props}
      />
      
      {/* Suggestions Dropdown - Responsive */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-900/95 border border-gray-200 rounded-lg shadow-2xl max-h-56 sm:max-h-64 md:max-h-72 overflow-y-auto"
          style={{
            top: '100%',
            left: 0,
            marginTop: '4px'
          }}
        >
          <div className="p-1.5 sm:p-2">
            {/* Header */}
            <div className="text-xs sm:text-sm text-gray-400 px-2 sm:px-3 py-1 sm:py-1.5 border-b border-gray-200 mb-1 flex items-center justify-between">
              <span className="truncate">
                <span className="hidden xs:inline">Mention team member</span>
                <span className="xs:hidden">Mention</span>
              </span>
              <span className="text-blue-600 text-xs ml-2 flex-shrink-0">
                {suggestions.length}
                <span className="hidden sm:inline"> available</span>
              </span>
            </div>

            {/* Member Suggestions */}
            {suggestions.map((member, index) => {
              const user = memberToUser(member);
              return (
                <button
                  key={member.id || member.userId || index}
                  onClick={() => selectSuggestion(member, index)}
                  className={`flex items-center space-x-2 sm:space-x-3 w-full px-2 sm:px-3 py-2 sm:py-3 text-left hover:bg-gray-100 rounded-lg transition-colors ${
                    index === selectedSuggestionIndex ? 'bg-blue-600/20 text-orange-400' : 'text-gray-900'
                  }`}
                >
                  {/* Member Avatar */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center text-gray-900 font-bold text-xs sm:text-sm flex-shrink-0">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={getProfessionalDisplayName(user)} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {getProfessionalInitials(user)}
                      </span>
                    )}
                  </div>
                  
                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base truncate">
                      {getProfessionalDisplayName(user)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 truncate flex items-center flex-wrap">
                      {member.role === 'admin' ? (
                        <span className="text-orange-500 flex items-center flex-shrink-0">
                          <span className="hidden xs:inline">👑</span>
                          <span className="ml-0.5 xs:ml-1">Admin</span>
                        </span>
                      ) : (
                        <span className="flex items-center flex-shrink-0">
                          <span className="hidden xs:inline">👤</span>
                          <span className="ml-0.5 xs:ml-1">Member</span>
                        </span>
                      )}
                      {user.email && (
                        <span className="hidden sm:inline ml-2 truncate">• {user.email}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Mention Preview - Hidden on small screens */}
                  <div className="hidden md:block text-xs sm:text-sm text-blue-600 bg-blue-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] truncate">
                    {formatUserForMention(user)}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Helper Text - Responsive */}
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 border-t border-gray-200 bg-gray-100">
            <div className="text-xs text-gray-400">
              {/* Desktop version */}
              <span className="hidden sm:inline">
                ↑↓ Navigate • Enter/Tab to select • Esc to close
              </span>
              {/* Mobile version */}
              <span className="sm:hidden">
                Tap to select
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMentionTextarea;
