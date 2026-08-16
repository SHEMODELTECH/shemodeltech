// src/components/SkeletonDashboard.jsx
import React from 'react';

const SkeletonDashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-8 sm:pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-gray-900 p-4 sm:p-6">
        <div className="container mx-auto">
          <div className="h-6 sm:h-8 bg-blue-500 rounded w-3/4 sm:w-2/3 mb-2"></div>
          <div className="h-4 sm:h-6 bg-blue-500 rounded w-2/3 sm:w-1/2 opacity-70"></div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        {/* Quick Actions Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="h-5 sm:h-6 bg-gray-300 rounded w-1/2 sm:w-1/3 md:w-1/4 mb-3 sm:mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-10 sm:h-12 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        {/* Career Path Matches Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="h-5 sm:h-6 bg-gray-300 rounded w-2/3 sm:w-1/2 md:w-1/3 mb-4 sm:mb-6"></div>
          
          {/* Bar Chart Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="mb-3 sm:mb-4">
                <div className="flex justify-between mb-2">
                  <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-1/2 sm:w-2/5 md:w-1/3"></div>
                  <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-12 sm:w-14 md:w-16"></div>
                </div>
                <div className="relative h-6 sm:h-7 md:h-8 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full rounded-full bg-gray-300" 
                    style={{ width: `${70 - (item * 15)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          {/* User Profile Summary Skeleton */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-lg">
            <div className="h-5 sm:h-6 md:h-7 bg-gray-300 rounded w-1/2 sm:w-1/3 md:w-1/4 mb-3 sm:mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="mb-3 sm:mb-4">
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/3 sm:w-1/4 mb-1"></div>
                    <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-full sm:w-4/5 md:w-3/4"></div>
                  </div>
                ))}
              </div>
              <div>
                {[1, 2, 3].map((item) => (
                  <div key={item} className="mb-3 sm:mb-4">
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/3 sm:w-1/4 mb-1"></div>
                    <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-full sm:w-4/5 md:w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Complete Analysis Text Skeleton */}
          <div>
            <div className="h-5 sm:h-6 md:h-7 bg-gray-300 rounded w-2/3 sm:w-1/2 md:w-1/3 mb-4 sm:mb-6"></div>
            
            {/* Multiple line paragraphs */}
            {[1, 2, 3].map((section) => (
              <div key={section} className="mb-6 sm:mb-8">
                <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-full sm:w-5/6 md:w-3/4 mb-3 sm:mb-4"></div>
                
                {[1, 2, 3, 4].map((paragraph) => (
                  <div key={paragraph} className="mb-3 sm:mb-4">
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-full mb-1.5 sm:mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-11/12 mb-1.5 sm:mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-full mb-1.5 sm:mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-10/12 sm:w-5/6"></div>
                  </div>
                ))}
                
                {/* Bullet points */}
                {[1, 2, 3].map((bullet) => (
                  <div key={bullet} className="flex mb-2 sm:mb-3">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-gray-300 mr-2 mt-0.5 sm:mt-1 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-full mb-1"></div>
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-11/12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDashboard;
