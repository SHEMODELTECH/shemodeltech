// src/Pages/community/SubmitPost.jsx - She Model Tech Submit Post (Complete - Responsive)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  writeBatch,
  doc
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import usePosterName from '../../hooks/usePosterName';

// Import utilities
import { 
  showSuccessMessage, 
  showWarningMessage,
  safeFirestoreOperation 
} from '../../utils/errorHandler';
import { extractMentions, validateMentions } from '../../utils/mentionUtils';
import { safeMentionNotification } from '../../utils/emailNotifications';
import {
  validateImageFile,
  uploadImageToStorage,
  createImagePreview,
  cleanupImagePreviews,
  formatFileSize
} from '../../utils/communityHelpers';

// Import components
import MentionTextarea from '../../components/community/MentionTextarea';
import { TaggedUsersSmall } from '../../components/community/UserComponents';
import LinkInsertModal from '../../components/community/LinkInsertModal';

/**
 * She Model Tech - Submit Post Page
 * Create new community posts with images, links, and mentions
 * Uses Vercel Blob for image storage
 * FULLY RESPONSIVE for mobile, tablet, and desktop
 */
const SubmitPost = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { posterName: profilePosterName, isCompany: profileIsCompany } = usePosterName(currentUser);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Image Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);

  // Mention State
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [mentionedUsers, setMentionedUsers] = useState([]);

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      showWarningMessage('Please login to create posts');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      cleanupImagePreviews(previewUrlsRef.current);
    };
  }, []);

  /**
   * Handle form input changes
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle mention selection
   */
  const handleMentionSelect = (user) => {
    setTaggedUsers(prev => {
      const exists = prev.find(u => u.uid === user.uid);
      if (exists) return prev;
      return [...prev, user];
    });
  };

  /**
   * Remove tagged user
   */
  const handleRemoveTag = (indexOrAll) => {
    if (indexOrAll === 'all') {
      setTaggedUsers([]);
    } else {
      setTaggedUsers(prev => prev.filter((_, i) => i !== indexOrAll));
    }
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = async (files) => {
    const newFiles = [];
    const errors = [];
    const newPreviews = [];

    for (const file of files) {
      // Validate file
      const error = validateImageFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
        continue;
      }

      // Check total file count (max 4 images)
      if (selectedFiles.length + newFiles.length >= 4) {
        errors.push('Maximum 4 images allowed per post');
        break;
      }

      newFiles.push(file);
      
      // Create preview
      const previewUrl = createImagePreview(file);
      newPreviews.push(previewUrl);
      previewUrlsRef.current.push(previewUrl);
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      setTimeout(() => setUploadErrors([]), 5000);
    }

    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input
    e.target.value = '';
  };

  /**
   * Handle drag and drop
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleFileSelect(imageFiles);
    } else if (files.length > 0) {
      showWarningMessage('Please drop only image files');
    }
  };

  /**
   * Remove selected file
   */
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Cleanup preview URL
    if (previewUrls[index] && previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    previewUrlsRef.current = previewUrlsRef.current.filter((_, i) => i !== index);
  };

  /**
   * Upload images to Vercel Blob
   */
  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    setUploading(true);
    const uploadedMedia = [];
    const errors = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      try {
        setUploadProgress(prev => ({ ...prev, [i]: 0 }));
        
        // Upload to Vercel Blob
        const result = await uploadImageToStorage(file, 'posts');
        
        uploadedMedia.push(result);
        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
        
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        errors.push(`${file.name}: ${error.message}`);
        setUploadProgress(prev => ({ ...prev, [i]: -1 }));
      }
    }

    setUploading(false);

    if (errors.length > 0) {
      setUploadErrors(errors);
      throw new Error(`Failed to upload ${errors.length} image(s)`);
    }

    return uploadedMedia;
  };

  /**
   * Handle link insertion
   */
  const handleLinkInsert = (markdownLink) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + markdownLink
    }));
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    if (!formData.content.trim()) {
      showWarningMessage('Post content is required');
      return false;
    }

    if (formData.content.length > 5000) {
      showWarningMessage('Post content must be under 5000 characters');
      return false;
    }

    if (formData.title && formData.title.length > 200) {
      showWarningMessage('Post title must be under 200 characters');
      return false;
    }

    return true;
  };

  /**
   * Submit post
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showWarningMessage('You must be logged in to post');
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setUploadErrors([]);

    try {
      // Upload images first
      let uploadedMedia = [];
      if (selectedFiles.length > 0) {
        try {
          uploadedMedia = await uploadImages();
        } catch (error) {
          showWarningMessage(error.message || 'Failed to upload images');
          setSubmitting(false);
          return;
        }
      }

      // Extract mentions from content
      const mentions = extractMentions(formData.content);
      const mentionedUsersFromContent = await validateMentions(mentions);

      // Combine explicitly tagged users with mentioned users
      const allTaggedUsers = [...taggedUsers];
      mentionedUsersFromContent.forEach(user => {
        const exists = allTaggedUsers.find(u => u.uid === user.uid);
        if (!exists) {
          allTaggedUsers.push(user);
        }
      });

      // Create post
      await safeFirestoreOperation(async () => {
        const postData = {
          title: formData.title.trim() || '',
          content: formData.content.trim(),
          authorName: profilePosterName || currentUser.displayName || currentUser.email,
          authorId: currentUser.uid,
          authorEmail: currentUser.email,
          authorPhoto: currentUser.photoURL || null,
          isCompanyPost: profileIsCompany,
          authorFirstName: currentUser.firstName || '',
          authorLastName: currentUser.lastName || '',
          authorInitials: currentUser.initials || '',
          authorTitle: currentUser.profile?.title || '',
          media: uploadedMedia,
          taggedUsers: allTaggedUsers,
          taggedUserIds: allTaggedUsers.map(user => user.uid),
          mentions: allTaggedUsers.map(user => `@${user.displayName || user.email.split('@')[0]}`),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          likes: [],
          likeCount: 0,
          repostCount: 0,
          reposts: [],
          isEdited: false
        };

        const postRef = await addDoc(collection(db, 'posts'), postData);

        // Send notifications to tagged users
        if (allTaggedUsers.length > 0) {
          const batch = writeBatch(db);
          
          allTaggedUsers.forEach(user => {
            const notificationRef = doc(collection(db, 'notifications'));
            batch.set(notificationRef, {
              userId: user.uid,
              type: 'mention',
              postId: postRef.id,
              postContent: formData.content.trim(),
              mentionedBy: currentUser.uid,
              mentionedByName: currentUser.displayName || currentUser.email,
              mentionedByFirstName: currentUser.firstName || '',
              mentionedByLastName: currentUser.lastName || '',
              mentionedByPhoto: currentUser.photoURL || null,
              message: `${currentUser.displayName || currentUser.email} mentioned you in a post`,
              isRead: false,
              createdAt: serverTimestamp()
            });
          });
          
          await batch.commit();

          // Send email notifications
          for (const user of allTaggedUsers) {
            try {
              await safeMentionNotification(
                {
                  userId: user.uid,
                  type: 'mention',
                  postId: postRef.id,
                  mentionedBy: currentUser.uid,
                  mentionedByName: currentUser.displayName || currentUser.email,
                  mentionedByFirstName: currentUser.firstName || '',
                  mentionedByLastName: currentUser.lastName || '',
                  mentionedByPhoto: currentUser.photoURL || null
                },
                user,
                {
                  ...currentUser,
                  firstName: currentUser.firstName || '',
                  lastName: currentUser.lastName || '',
                  profile: currentUser.profile || {}
                },
                {
                  id: postRef.id,
                  content: formData.content.trim(),
                  title: formData.title.trim()
                },
                true
              );
            } catch (emailError) {
              console.error('Email notification failed:', emailError);
            }
          }
        }

        return postRef.id;
      }, 'creating post');

      // Cleanup
      cleanupImagePreviews(previewUrlsRef.current);

      const tagMessage = allTaggedUsers.length > 0 
        ? ` ${allTaggedUsers.length} user${allTaggedUsers.length !== 1 ? 's' : ''} will be notified.`
        : '';
      
      showSuccessMessage(`Post created successfully!${tagMessage}`, { autoClose: 3000 });
      
      // Navigate back to community
      setTimeout(() => {
        navigate('/community');
      }, 1000);

    } catch (error) {
      console.error('Error creating post:', error);
      showWarningMessage('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (!currentUser) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header - Responsive */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/community" className="flex items-center space-x-2 sm:space-x-3 group">
              <img 
                src="/Images/512X512.png" 
                alt="She Model Tech" 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg"
              />
              <div>
                <h1 className="text-base sm:text-xl font-bold text-pink-600 font-bold">
                  Create Post
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 hidden xs:block">Share with the community</p>
              </div>
            </Link>

            <Link
              to="/community"
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-900 transition-all duration-300 text-sm"
              aria-label="Cancel and return to community"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden sm:inline">Cancel</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          
          {/* Post Form Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-pink-600/10 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              
              {/* Author Info - Responsive */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Your profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base sm:text-lg">
                      {currentUser.firstName && currentUser.lastName 
                        ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase()
                        : (currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()
                      }
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {profilePosterName || currentUser.displayName || currentUser.email}
                    
                  </p>
                  {currentUser.profile?.title && (
                    <p className="text-xs sm:text-sm text-pink-600 truncate">{currentUser.profile.title}</p>
                  )}
                </div>
              </div>

              {/* Title Input - Responsive */}
              <div className="mb-3 sm:mb-4">
                <label htmlFor="title" className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">
                  Title <span className="text-gray-400 text-xs sm:text-sm">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Give your post a title..."
                  maxLength={200}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-colors text-sm sm:text-base"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] sm:text-xs text-gray-400">Make your post stand out</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">{formData.title.length}/200</p>
                </div>
              </div>

              {/* Content Input - Responsive */}
              <div className="mb-3 sm:mb-4">
                <label htmlFor="content" className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">
                  Content *
                </label>
                <MentionTextarea
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  placeholder="What's on your mind? Share your thoughts... Use @ to mention someone"
                  className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-colors resize-none text-sm sm:text-base"
                  rows={8}
                  onMentionSelect={handleMentionSelect}
                  showLinkButton={true}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] sm:text-xs text-gray-400">Tip: Use @ for mentions</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">{formData.content.length}/5000</p>
                </div>
              </div>

              {/* Tagged Users */}
              {taggedUsers.length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <TaggedUsersSmall
                    taggedUsers={taggedUsers}
                    onRemoveTag={handleRemoveTag}
                  />
                </div>
              )}

              {/* Image Upload Section - Responsive */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">
                  Images <span className="text-gray-400 text-xs sm:text-sm">(Optional - Max 4)</span>
                </label>
                
                {/* Drag and Drop Zone - Responsive */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-pink-500 bg-pink-600/10' 
                      : 'border-gray-200 bg-gray-100 hover:border-pink-600/40 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <div className="space-y-2 sm:space-y-3">
                    
                    <div>
                      <p className="text-gray-900 font-medium mb-1 text-sm sm:text-base">
                        Drag and drop images here
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                        or click to browse
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-600/40 rounded-lg text-pink-500 hover:text-orange-200 transition-all duration-300 text-sm"
                      >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Choose Images</span>
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      JPEG, PNG, GIF, WebP • Max 10MB • Up to 4 images
                    </p>
                  </div>
                </div>

                {/* Upload Errors - Responsive */}
                {uploadErrors.length > 0 && (
                  <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 font-medium mb-1.5 sm:mb-2 text-xs sm:text-sm">Upload Errors:</p>
                    <ul className="text-red-300 text-[10px] sm:text-xs space-y-0.5 sm:space-y-1">
                      {uploadErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Image Previews - Responsive Grid */}
                {selectedFiles.length > 0 && (
                  <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={previewUrls[index]} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
                        />
                        
                        {/* Remove Button - Responsive */}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 hover:bg-red-600 text-gray-900 rounded-full flex items-center justify-center transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label={`Remove ${file.name}`}
                        >
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* File Info - Responsive */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white/70 p-1.5 sm:p-2 rounded-b-lg">
                          <p className="text-[10px] sm:text-xs text-gray-900 truncate">{file.name}</p>
                          <p className="text-[9px] sm:text-xs text-gray-400">{formatFileSize(file.size)}</p>
                        </div>

                        {/* Upload Progress */}
                        {uploading && uploadProgress[index] !== undefined && (
                          <div className="absolute inset-0 bg-white flex items-center justify-center rounded-lg">
                            {uploadProgress[index] === -1 ? (
                              <div className="text-red-400 text-center">
                                <div className="text-xl sm:text-2xl mb-1">❌</div>
                                <div className="text-[10px] sm:text-xs">Failed</div>
                              </div>
                            ) : uploadProgress[index] === 100 ? (
                              <div className="text-pink-600 text-center">
                                <div className="text-xl sm:text-2xl mb-1">✅</div>
                                <div className="text-[10px] sm:text-xs">Uploaded</div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-pink-500 mx-auto mb-1.5 sm:mb-2"></div>
                                <div className="text-gray-900 text-[10px] sm:text-xs">Uploading...</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions - Responsive */}
            <div className="p-4 sm:p-6 bg-gray-100 border-t border-pink-600/10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-gray-400 text-xs sm:text-sm">
                  {selectedFiles.length > 0 && (
                    <span className="flex items-center">
                      
                      {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''} attached
                    </span>
                  )}
                </div>

                <div className="flex space-x-2 sm:space-x-3">
                  <Link
                    to="/community"
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-gray-900 rounded-lg font-medium transition-colors text-center text-sm"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || uploading || !formData.content.trim()}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-1.5 sm:mr-2"></div>
                        {uploading ? 'Uploading...' : 'Posting...'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Publish
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitPost;
