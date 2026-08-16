// src/components/community/ImageGallery.jsx - She Model Tech Image Gallery - FULLY RESPONSIVE

import React, { useState, useEffect } from 'react';

/**
 * Image Gallery Component for She Model Tech
 * Displays up to 4 images in a grid, with lightbox for full-size viewing
 * NO VIDEO SUPPORT - Images only
 * Fully responsive for all screen sizes
 */
const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (imageUrl, index) => {
    console.log('Opening lightbox:', { imageUrl, index, images });
    if (!imageUrl || !images || !images[index]) {
      console.error('Invalid image data:', { imageUrl, index, images });
      return;
    }
    
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    console.log('Closing lightbox');
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!images || images.length === 0) return;
    
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;
    
    console.log('Navigating to image:', { direction, newIndex, total: images.length });
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]?.url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateImage('next');
    if (e.key === 'ArrowLeft') navigateImage('prev');
  };

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, currentImageIndex]);

  if (!images || images.length === 0) {
    console.log('No images provided');
    return null;
  }

  const validImages = images.filter(img => img && img.url);
  if (validImages.length === 0) {
    console.log('No valid images found');
    return null;
  }

  console.log('Rendering gallery with', validImages.length, 'images');

  const displayImages = validImages.slice(0, 4);

  return (
    <>
      <div className="mt-2 xs:mt-3 sm:mt-4 mb-2 xs:mb-3 sm:mb-4">
        {displayImages.length === 1 ? (
          <div className="relative group">
            <img 
              src={displayImages[0].url} 
              alt={displayImages[0].filename || "Post image"}
              className="w-full max-h-48 xs:max-h-64 sm:max-h-96 object-cover rounded-lg xs:rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Single image clicked:', displayImages[0].url);
                openLightbox(displayImages[0].url, 0);
              }}
              loading="lazy"
              style={{ 
                pointerEvents: 'auto',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1
              }}
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-gray-100 transition-colors duration-300 rounded-lg xs:rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
              <div className="bg-gray-500 text-gray-900 px-2 xs:px-3 py-1 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium">
                Click to view full size
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1 xs:gap-1.5 sm:gap-2">
            {displayImages.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image.url} 
                  alt={image.filename || `Image ${index + 1}`}
                  className="w-full h-24 xs:h-32 sm:h-40 md:h-48 object-cover rounded-md xs:rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Image clicked:', { url: image.url, index });
                    openLightbox(image.url, index);
                  }}
                  loading="lazy"
                  style={{ 
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                {index === 3 && validImages.length > 4 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-md xs:rounded-lg text-gray-900 font-bold text-base xs:text-lg sm:text-xl cursor-pointer hover:bg-gray-500 transition-colors"
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         openLightbox(image.url, index);
                       }}>
                    +{validImages.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for Full-Size Image Viewing */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-white/90 z-[200] flex items-center justify-center p-2 xs:p-3 sm:p-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Lightbox overlay clicked');
            closeLightbox();
          }}
          style={{ 
            pointerEvents: 'auto',
            zIndex: 201
          }}
        >
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-md xs:rounded-lg shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Lightbox image clicked (no action)');
              }}
              onError={(e) => {
                console.error('Failed to load image:', selectedImage);
                closeLightbox();
              }}
              style={{ 
                pointerEvents: 'auto',
                zIndex: 201
              }}
            />
            
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked');
                closeLightbox();
              }}
              className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 bg-gray-500 hover:bg-white/70 active:bg-white text-gray-900 rounded-full w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-bold transition-colors z-10"
              aria-label="Close lightbox"
              title="Close (Esc)"
              style={{ 
                pointerEvents: 'auto',
                zIndex: 201
              }}
            >
              &times;
            </button>

            {/* Navigation Buttons */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Previous button clicked');
                    navigateImage('prev');
                  }}
                  className="absolute left-2 xs:left-3 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-500 hover:bg-white/70 active:bg-white text-gray-900 rounded-full w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-bold transition-colors"
                  aria-label="Previous image"
                  title="Previous image (Left Arrow)"
                  style={{ 
                    pointerEvents: 'auto',
                    zIndex: 201
                  }}
                >
                  &lsaquo;
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Next button clicked');
                    navigateImage('next');
                  }}
                  className="absolute right-2 xs:right-3 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-500 hover:bg-white/70 active:bg-white text-gray-900 rounded-full w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-bold transition-colors"
                  aria-label="Next image"
                  title="Next image (Right Arrow)"
                  style={{ 
                    pointerEvents: 'auto',
                    zIndex: 201
                  }}
                >
                  &rsaquo;
                </button>
              </>
            )}

            {/* Image Counter */}
            {validImages.length > 1 && (
              <div className="absolute bottom-12 xs:bottom-14 sm:bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-500 text-gray-900 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium">
                {currentImageIndex + 1} of {validImages.length}
              </div>
            )}

            {/* Image Info */}
            <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4 bg-gray-500 text-gray-900 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg text-[10px] xs:text-xs sm:text-sm max-w-24 xs:max-w-32 sm:max-w-48 md:max-w-64">
              <div className="truncate">
                {validImages[currentImageIndex]?.filename || `Image ${currentImageIndex + 1}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
