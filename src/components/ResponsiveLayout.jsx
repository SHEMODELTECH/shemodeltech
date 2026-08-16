// src/components/ResponsiveLayout.jsx
// Responsive layout wrapper component for She Model Tech

import React from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveLayout Component
 * 
 * Provides consistent responsive layout structure across pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} props.maxWidth - Maximum width constraint ('sm', 'md', 'lg', 'xl', '2xl', 'full')
 * @param {boolean} props.noPadding - Disable default padding
 * @param {boolean} props.centerContent - Center content vertically
 * @param {string} props.className - Additional CSS classes
 */
const ResponsiveLayout = ({
  children,
  maxWidth = 'xl',
  noPadding = false,
  centerContent = false,
  className = '',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = noPadding 
    ? '' 
    : 'px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6 lg:py-8';

  const centerClasses = centerContent 
    ? 'min-h-screen flex flex-col justify-center' 
    : '';

  return (
    <div className={`w-full ${centerClasses}`}>
      <div 
        className={`
          ${maxWidthClasses[maxWidth] || maxWidthClasses.xl}
          ${paddingClasses}
          mx-auto
          ${className}
        `.trim()}
      >
        {children}
      </div>
    </div>
  );
};

ResponsiveLayout.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  noPadding: PropTypes.bool,
  centerContent: PropTypes.bool,
  className: PropTypes.string,
};

export default ResponsiveLayout;


/**
 * PageHeader Component
 * 
 * Responsive page header with title and optional actions
 */
export const PageHeader = ({ 
  title, 
  subtitle, 
  actions,
  className = '' 
}) => {
  return (
    <div className={`mb-6 sm:mb-8 md:mb-10 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
};


/**
 * ResponsiveGrid Component
 * 
 * Responsive grid layout with common patterns
 */
export const ResponsiveGrid = ({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'base',
  className = '' 
}) => {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3 md:gap-4',
    base: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8',
  };

  // Static mappings so Tailwind JIT can detect all class names at build time
  const baseColsMap = {
    1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3',
    4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6',
  };
  const mdColsMap = {
    1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3',
    4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6',
  };
  const lgColsMap = {
    1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6',
  };
  const xlColsMap = {
    1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6',
  };

  const gridCols = [
    baseColsMap[columns.sm || 1] || 'grid-cols-1',
    columns.md ? mdColsMap[columns.md] || '' : '',
    columns.lg ? lgColsMap[columns.lg] || '' : '',
    columns.xl ? xlColsMap[columns.xl] || '' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid ${gridCols} ${gapClasses[gap] || gapClasses.base} ${className}`}>
      {children}
    </div>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
  gap: PropTypes.oneOf(['sm', 'base', 'lg']),
  className: PropTypes.string,
};


/**
 * ResponsiveCard Component
 * 
 * Responsive card with glassmorphism effect
 */
export const ResponsiveCard = ({ 
  children, 
  variant = 'base',
  hoverable = false,
  className = '' 
}) => {
  const variantClasses = {
    sm: 'p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl',
    base: 'p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl',
    lg: 'p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl',
  };

  const hoverClasses = hoverable 
    ? 'cursor-pointer' 
    : '';

  return (
    <div 
      className={`
        bg-gray-100 border border-gray-200
        ${variantClasses[variant] || variantClasses.base}
        ${hoverClasses}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};

ResponsiveCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['sm', 'base', 'lg']),
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};


/**
 * ResponsiveStack Component
 * 
 * Vertical or horizontal stack with responsive direction
 */
export const ResponsiveStack = ({
  children,
  direction = 'vertical',
  spacing = 'base',
  responsive = true,
  className = ''
}) => {
  const spacingClasses = {
    sm: 'gap-2 sm:gap-3',
    base: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8',
  };

  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  const responsiveClass = responsive && direction === 'horizontal'
    ? 'flex-col md:flex-row'
    : directionClasses[direction];

  return (
    <div className={`flex ${responsiveClass} ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

ResponsiveStack.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  spacing: PropTypes.oneOf(['sm', 'base', 'lg']),
  responsive: PropTypes.bool,
  className: PropTypes.string,
};


/**
 * MobileMenu Component
 * 
 * Responsive mobile menu wrapper
 */
export const MobileMenu = ({ 
  isOpen, 
  onClose, 
  children,
  position = 'right'
}) => {
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-500 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div 
        className={`
          fixed top-0 ${positionClasses[position]} bottom-0
          w-64 sm:w-80
          bg-gray-100 border-l border-gray-200
          z-50 md:hidden
          transform transition-transform duration-300
          overflow-y-auto
          p-6
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-900 hover:text-gray-600"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mt-12">
          {children}
        </div>
      </div>
    </>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['left', 'right']),
};
