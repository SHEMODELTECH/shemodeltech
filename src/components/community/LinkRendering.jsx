// src/components/community/LinkRendering.jsx - She Model Tech Link Components - FULLY RESPONSIVE

import React from 'react';

/**
 * Parse text for markdown links [text](url) and plain URLs
 */
export const parseLinksAndUrls = (text) => {
  if (!text) return [];
  
  const parts = [];
  let currentIndex = 0;
  
  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
  let match;
  
  while ((match = combinedRegex.exec(text)) !== null) {
    const [fullMatch, markdownFull, markdownText, markdownUrl, plainUrl] = match;
    const matchIndex = match.index;
    
    if (matchIndex > currentIndex) {
      const beforeText = text.substring(currentIndex, matchIndex);
      if (beforeText.trim()) {
        parts.push({
          type: 'text',
          content: beforeText,
          key: `text-${currentIndex}-${matchIndex}`
        });
      }
    }
    
    if (markdownFull) {
      parts.push({
        type: 'link',
        content: markdownText,
        url: markdownUrl,
        key: `link-${matchIndex}-${markdownText}`,
        isMarkdown: true
      });
    } else if (plainUrl) {
      const displayUrl = plainUrl.length > 50 ? 
        plainUrl.substring(0, 47) + '...' : plainUrl;
      
      parts.push({
        type: 'link',
        content: displayUrl,
        url: plainUrl,
        key: `link-${matchIndex}-${plainUrl}`,
        isMarkdown: false
      });
    }
    
    currentIndex = matchIndex + fullMatch.length;
  }
  
  if (currentIndex < text.length) {
    const remainingText = text.substring(currentIndex);
    if (remainingText.trim()) {
      parts.push({
        type: 'text',
        content: remainingText,
        key: `text-${currentIndex}-end`
      });
    }
  }
  
  if (parts.length === 0) {
    return [{
      type: 'text',
      content: text,
      key: 'text-only'
    }];
  }
  
  return parts;
};

/**
 * Enhanced URL validation and sanitization
 */
export const sanitizeUrl = (url) => {
  if (!url) return '#';
  
  try {
    let sanitizedUrl = url.trim();
    if (!/^https?:\/\//i.test(sanitizedUrl)) {
      sanitizedUrl = 'https://' + sanitizedUrl;
    }
    
    const urlObj = new URL(sanitizedUrl);
    
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      console.warn('Blocked non-HTTP(S) URL:', url);
      return '#';
    }
    
    const hostname = urlObj.hostname.toLowerCase();
    const dangerousPatterns = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1'
    ];
    
    if (dangerousPatterns.some(pattern => hostname.includes(pattern))) {
      console.warn('Blocked potentially dangerous URL:', url);
      return '#';
    }
    
    return sanitizedUrl;
  } catch (error) {
    console.warn('Invalid URL provided:', url, error);
    return '#';
  }
};

/**
 * Component to render text with clickable links (markdown + plain URLs)
 * Fully responsive for all screen sizes
 */
export const RichTextContent = ({ content, className = "", style = {} }) => {
  const parts = parseLinksAndUrls(content);
  
  return (
    <span className={className} style={style}>
      {parts.map((part) => {
        if (part.type === 'link') {
          const sanitizedUrl = sanitizeUrl(part.url);
          
          return (
            <a
              key={part.key}
              href={sanitizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-pink-600 hover:text-orange-300 active:text-orange-200 underline hover:no-underline transition-all duration-200 font-medium break-words ${
                part.isMarkdown ? 'bg-pink-600/10 px-0.5 xs:px-1 rounded' : ''
              }`}
              onClick={(e) => {
                if (sanitizedUrl === '#') {
                  e.preventDefault();
                  console.warn('Blocked unsafe URL click');
                  return;
                }
                
                console.log('Link clicked:', {
                  url: sanitizedUrl,
                  isMarkdown: part.isMarkdown,
                  displayText: part.content
                });
              }}
              title={`Visit: ${part.content} (${sanitizedUrl})`}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {part.content}
            </a>
          );
        } else {
          return (
            <span key={part.key} style={{ whiteSpace: 'pre-wrap' }}>
              {part.content}
            </span>
          );
        }
      })}
    </span>
  );
};

/**
 * Component for truncated content with link support and "Read more"
 * Fully responsive for all screen sizes
 */
export const TruncatedRichContent = ({ content, postId, limit = 300, expandedPosts, onToggleExpansion }) => {
  if (!content) return null;
  
  const isExpanded = expandedPosts.has(postId);
  const shouldTruncate = content.length > limit;
  
  let displayContent = content;
  if (shouldTruncate && !isExpanded) {
    let truncateAt = limit;
    
    const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)|(\[([^\]]+)\]\(([^)]+)\))/g;
    let match;
    
    while ((match = urlPattern.exec(content)) !== null) {
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;
      
      if (matchStart < truncateAt && truncateAt < matchEnd) {
        truncateAt = matchStart;
        break;
      }
    }
    
    displayContent = content.substring(0, truncateAt) + '...';
  }
  
  return (
    <div>
      <RichTextContent 
        content={displayContent}
        className="text-gray-700 leading-relaxed whitespace-pre-wrap text-xs xs:text-sm sm:text-base"
      />
      
      {shouldTruncate && (
        <button
          onClick={() => onToggleExpansion(postId)}
          className="inline-flex items-center mt-2 xs:mt-2.5 sm:mt-3 text-pink-600 hover:text-orange-300 active:text-orange-200 font-semibold text-xs sm:text-sm transition-colors"
          aria-label={isExpanded ? 'Show less content' : 'Read more content'}
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <svg className="ml-1 h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Read more</span>
              <svg className="ml-1 h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
};
