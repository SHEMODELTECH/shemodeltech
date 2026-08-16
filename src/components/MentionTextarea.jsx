// components/MentionTextarea.jsx - Responsive Google Login Version
import React, { useState, useRef, useEffect } from 'react';
import { searchUsers, formatUserForMention, getUserDisplayText } from '../utils/mentionUtils';

export const MentionTextarea = ({ 
  value, 
  onChange, 
  placeholder = "Write something...",
  className = "",
  onMentionSelect,
  ...props 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle text changes and detect @ mentions (Google Login version)
  const handleTextChange = async (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    
    // Check if user is typing a mention - look for @ followed by any text
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(?:"([^"]*)"|(\S*))$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1] || mentionMatch[2] || ''; // Handle quoted or unquoted
      setMentionQuery(query);
      setMentionStartIndex(mentionMatch.index);
      
      if (query.length >= 1) {
        try {
          const users = await searchUsers(query);
          setSuggestions(users);
          setShowSuggestions(users.length > 0);
          setSelectedSuggestionIndex(0);
        } catch (error) {
          console.error('Error fetching user suggestions:', error);
          setShowSuggestions(false);
        }
      } else if (query.length === 0) {
        // Show recent users or popular users when just @ is typed
        try {
          const users = await searchUsers(''); // This will return recent users
          setSuggestions(users.slice(0, 5)); // Show top 5
          setShowSuggestions(users.length > 0);
          setSelectedSuggestionIndex(0);
        } catch (error) {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection (Google Login version)
  const selectSuggestion = (user, index = selectedSuggestionIndex) => {
    if (!suggestions[index]) return;
    
    const selectedUser = suggestions[index];
    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = value.substring(textareaRef.current.selectionStart);
    
    // Format the mention based on user's display name
    const mentionText = formatUserForMention(selectedUser);
    const newValue = beforeMention + mentionText + ' ' + afterMention;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // Notify parent component about the mention
    if (onMentionSelect) {
      onMentionSelect(selectedUser);
    }
    
    // Focus back to textarea and position cursor
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
      
      {/* Mention Suggestions Dropdown - Responsive Google Login Version */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-900/95 border border-gray-200 rounded-lg shadow-2xl max-h-60 sm:max-h-72 overflow-y-auto"
          style={{
            top: '100%',
            left: 0,
            marginTop: '4px'
          }}
        >
          <div className="p-1.5 sm:p-2">
            {/* Header */}
            <div className="text-xs sm:text-sm text-gray-400 px-2 sm:px-3 py-1 sm:py-1.5 border-b border-gray-200 mb-1">
              Mention someone
            </div>
            
            {/* User Suggestions */}
            {suggestions.map((user, index) => (
              <button
                key={user.uid}
                onClick={() => selectSuggestion(user, index)}
                className={`flex items-center space-x-2 sm:space-x-3 w-full px-2 sm:px-3 py-2 sm:py-3 text-left hover:bg-gray-100 rounded-lg transition-colors ${
                  index === selectedSuggestionIndex ? 'bg-blue-600/20 text-orange-400' : 'text-gray-900'
                }`}
              >
                {/* User Avatar */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center text-gray-900 font-bold text-xs sm:text-sm flex-shrink-0">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={getUserDisplayText(user)} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {getUserDisplayText(user).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">
                    {user.displayName || 'No Display Name'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 truncate">
                    {user.email}
                  </div>
                </div>
                
                {/* Mention Preview - Hidden on very small screens */}
                <div className="hidden xs:block text-xs sm:text-sm text-blue-600 bg-blue-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 max-w-[80px] sm:max-w-[120px] truncate">
                  {formatUserForMention(user)}
                </div>
              </button>
            ))}
          </div>
          
          {/* Helper Text - Responsive visibility */}
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
