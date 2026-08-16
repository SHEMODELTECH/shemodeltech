// src/components/community/MentionTextarea.jsx - She Model Tech Mention System - FULLY RESPONSIVE

import React, { useState, useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LinkInsertModal from './LinkInsertModal';

/**
 * Enhanced Textarea with @mention autocomplete and link insertion
 * She Model Tech Community
 * Fully responsive for all screen sizes
 */
const MentionTextarea = ({ 
  value, 
  onChange, 
  placeholder = "Write something...",
  className = "",
  onMentionSelect,
  rows = 12,
  showLinkButton = false,
  ...props 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const textareaRef = useRef(null);

  /**
   * Search users in Firestore for mention autocomplete
   */
  const searchUsers = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    try {
      const displayNameQuery = query(
        collection(db, 'users'),
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff')
      );
      
      const emailQuery = query(
        collection(db, 'users'),
        where('email', '>=', searchTerm),
        where('email', '<=', searchTerm + '\uf8ff')
      );
      
      const [displayNameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(displayNameQuery),
        getDocs(emailQuery)
      ]);
      
      const users = new Map();
      
      [...displayNameSnapshot.docs, ...emailSnapshot.docs].forEach(doc => {
        users.set(doc.id, {
          uid: doc.id,
          ...doc.data()
        });
      });
      
      return Array.from(users.values()).slice(0, 5);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  /**
   * Handle text changes and detect @ mentions
   */
  const handleTextChange = async (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1];
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
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  /**
   * Select a user mention from suggestions
   */
  const selectSuggestion = (user, index = selectedSuggestionIndex) => {
    if (!suggestions[index]) return;
    
    const selectedUser = suggestions[index];
    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = value.substring(textareaRef.current.selectionStart);
    const newValue = beforeMention + `@${selectedUser.displayName || selectedUser.email.split('@')[0]} ` + afterMention;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    if (onMentionSelect) {
      onMentionSelect(selectedUser);
    }
    
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPosition = beforeMention.length + `@${selectedUser.displayName || selectedUser.email.split('@')[0]} `.length;
      textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  /**
   * Insert markdown link into textarea
   */
  const handleLinkInsert = (markdownLink) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeSelection = value.substring(0, start);
    const afterSelection = value.substring(end);
    
    const newValue = beforeSelection + markdownLink + afterSelection;
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = start + markdownLink.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  /**
   * Handle keyboard navigation in mention suggestions
   */
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
    }
  };

  return (
    <div className="relative">
      {/* Formatting Toolbar */}
      {showLinkButton && (
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-2 xs:mb-2.5">
          <div className="flex items-center gap-1.5 xs:gap-2">
            <span className="text-gray-400 text-xs xs:text-sm">Formatting:</span>
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 active:bg-blue-600/40 border border-blue-600/40 rounded text-orange-300 hover:text-orange-200 transition-colors text-[10px] xs:text-xs"
              title="Insert Link"
              aria-label="Insert link"
            >
              <svg className="h-2.5 w-2.5 xs:h-3 xs:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Link</span>
            </button>
          </div>
          <div className="text-gray-400 text-[10px] xs:text-xs">
            <span className="hidden sm:inline">Use @username to mention &bull; Add links with the link button</span>
            <span className="sm:hidden">@username to mention</span>
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        rows={rows}
        {...props}
      />
      
      {/* Mention Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute z-50 w-full max-w-[calc(100vw-2rem)] xs:max-w-xs bg-white border border-gray-200 rounded-lg shadow-2xl max-h-48 xs:max-h-56 overflow-y-auto"
          style={{
            top: '100%',
            left: 0,
            marginTop: '4px'
          }}
        >
          {suggestions.map((user, index) => (
            <button
              key={user.uid}
              onClick={() => selectSuggestion(user, index)}
              className={`flex items-center gap-2 xs:gap-3 w-full px-3 xs:px-4 py-2 xs:py-3 text-left hover:bg-gray-100 active:bg-gray-200 transition-colors ${
                index === selectedSuggestionIndex ? 'bg-blue-600/20 text-orange-300' : 'text-gray-900'
              }`}
            >
              <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold text-xs xs:text-sm flex-shrink-0">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate text-sm xs:text-base">
                  {user.displayName || user.email?.split('@')[0]}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Link Insert Modal */}
      <LinkInsertModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={handleLinkInsert}
      />
    </div>
  );
};

export default MentionTextarea;
