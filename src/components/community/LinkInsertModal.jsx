// src/components/community/LinkInsertModal.jsx - She Model Tech Link Insertion - FULLY RESPONSIVE

import React, { useState } from 'react';

/**
 * Link Insert Modal Component for She Model Tech
 * Allows users to insert markdown-formatted links into posts
 * Fully responsive for all screen sizes
 */
const LinkInsertModal = ({ isOpen, onClose, onInsert }) => {
  const [linkData, setLinkData] = useState({
    url: '',
    text: '',
    openInNewTab: true
  });

  const [validating, setValidating] = useState(false);
  const [urlError, setUrlError] = useState('');

  const validateUrl = (url) => {
    if (!url.trim()) return 'URL is required';
    
    try {
      let fullUrl = url.trim();
      if (!/^https?:\/\//i.test(fullUrl)) {
        fullUrl = 'https://' + fullUrl;
      }
      
      const urlObj = new URL(fullUrl);
      
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return 'Only HTTP and HTTPS URLs are allowed';
      }
      
      return null;
    } catch (error) {
      return 'Please enter a valid URL';
    }
  };

  const handleUrlChange = (url) => {
    setLinkData(prev => ({ ...prev, url }));
    setUrlError('');
    
    if (!linkData.text && url) {
      try {
        let displayUrl = url.trim();
        if (!/^https?:\/\//i.test(displayUrl)) {
          displayUrl = 'https://' + displayUrl;
        }
        const urlObj = new URL(displayUrl);
        const domain = urlObj.hostname.replace(/^www\./, '');
        setLinkData(prev => ({ ...prev, text: domain }));
      } catch (error) {
        // Ignore error, keep existing text
      }
    }
  };

  const handleInsert = async () => {
    const error = validateUrl(linkData.url);
    if (error) {
      setUrlError(error);
      return;
    }

    setValidating(true);
    
    try {
      let finalUrl = linkData.url.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }

      const finalText = linkData.text.trim() || finalUrl;
      const markdownLink = `[${finalText}](${finalUrl})`;
      
      onInsert(markdownLink);
      handleClose();
    } catch (error) {
      setUrlError('Failed to process URL');
    } finally {
      setValidating(false);
    }
  };

  const handleClose = () => {
    setLinkData({ url: '', text: '', openInNewTab: true });
    setUrlError('');
    setValidating(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && linkData.url.trim()) {
      e.preventDefault();
      handleInsert();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500 z-[150] flex items-center justify-center p-3 xs:p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl xs:rounded-2xl border border-gray-200 shadow-2xl w-full max-w-[calc(100vw-1.5rem)] xs:max-w-md"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 xs:p-5 sm:p-6 border-b border-pink-600/10">
          <h3 className="text-base xs:text-lg font-bold text-gray-900 flex items-center gap-1.5 xs:gap-2">
            <svg className="w-4 h-4 xs:w-5 xs:h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Insert Link
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-900 transition-colors p-1 xs:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <svg className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 xs:p-5 sm:p-6 space-y-3 xs:space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-gray-900 font-medium text-sm xs:text-base mb-1.5 xs:mb-2">
              URL <span className="text-pink-600">*</span>
            </label>
            <input
              type="url"
              value={linkData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com or example.com"
              className={`w-full p-2.5 xs:p-3 bg-gray-50 border rounded-lg text-sm xs:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                urlError 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-gray-200 focus:border-pink-500 focus:ring-orange-400/20'
              }`}
              autoFocus
            />
            {urlError && (
              <p className="text-red-400 text-xs xs:text-sm mt-1 flex items-start gap-1">
                <svg className="w-3 h-3 xs:w-4 xs:h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {urlError}
              </p>
            )}
            <p className="text-gray-400 text-[10px] xs:text-xs mt-1 flex items-start gap-1">
              <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Tip: You can paste any valid web URL
            </p>
          </div>

          {/* Display Text Input */}
          <div>
            <label className="block text-gray-900 font-medium text-sm xs:text-base mb-1.5 xs:mb-2">
              Display Text
            </label>
            <input
              type="text"
              value={linkData.text}
              onChange={(e) => setLinkData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Link text (optional - will use domain if empty)"
              className="w-full p-2.5 xs:p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm xs:text-base text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
            />
            <p className="text-gray-400 text-[10px] xs:text-xs mt-1">
              Leave empty to auto-generate from URL
            </p>
          </div>

          {/* Preview */}
          {linkData.url && (
            <div className="p-2.5 xs:p-3 bg-pink-600/10 border border-gray-200 rounded-lg">
              <p className="text-orange-300 text-xs xs:text-sm font-medium mb-1">Preview:</p>
              <div className="text-pink-600 hover:text-orange-300 underline cursor-pointer text-xs xs:text-sm break-all">
                {linkData.text || linkData.url}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 xs:p-5 sm:p-6 border-t border-pink-600/10 bg-gray-100">
          <div className="flex gap-2 xs:gap-3">
            <button
              onClick={handleClose}
              disabled={validating}
              className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 text-sm xs:text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!linkData.url.trim() || validating}
              className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 text-sm xs:text-base bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 text-gray-900 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validating ? (
                <span className="flex items-center justify-center gap-1.5 xs:gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-white"></div>
                  <span className="hidden xs:inline">Processing...</span>
                  <span className="xs:hidden">...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5 xs:gap-2">
                  <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="hidden xs:inline">Insert Link</span>
                  <span className="xs:hidden">Insert</span>
                </span>
              )}
            </button>
          </div>
          <p className="text-gray-400 text-[10px] xs:text-xs text-center mt-2 xs:mt-3">
            Press Enter to insert &bull; Esc to cancel
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkInsertModal;
