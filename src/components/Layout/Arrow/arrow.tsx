import React from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ChevronArrowWithTailProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: Size;
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

export const ChevronArrowWithTail: React.FC<ChevronArrowWithTailProps> = ({ direction = 'right', size = 'lg', className = '', onClick, isDisabled }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const strokeWidth = {
    sm: 1,
    md: 1,
    lg: 1,
    xl: 1
  };

  const rotationClass = {
    right: 'rotate-0',
    left: 'rotate-180',
    up: '-rotate-90',
    down: 'rotate-90'
  };

  // Get tail size based on arrow size
  const getTailLength = () => {
    switch(size) {
      case 'sm': return `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:w-5.5 group-hover:h-5.5'}`;
      case 'md': return `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:w-6 group-hover:h-6'}`;
      case 'lg': return `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:w-9 group-hover:h-9'}`;
      case 'xl': return `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:w-11 group-hover:h-11'}`;
      default: return `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:w-5 group-hover:h-5'}`;
    }
  };

  // Tail positioning and animation based on direction
  const getTailConfig = () => {
    const tailLength = getTailLength();
    const tailWidth = `${strokeWidth[size] + 1}px`;
    
    switch(direction) {
      case 'right':
        return {
          position: 'left-0 top-1/2 -translate-y-1/2',
          size: `h-[${tailWidth}] ${tailLength.split(' ')[0]} w-0`,
          movement: `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:translate-x-1'}`
        };
      case 'left':
        return {
          position: 'right-0 top-1/2 -translate-y-1/2',
          size: `h-[${tailWidth}] ${tailLength.split(' ')[0]} w-0`,
          movement: `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:-translate-x-1'}`
        };
      case 'up':
        return {
          position: 'bottom-0 left-1/2 -translate-x-1/2',
          size: `w-[${tailWidth}] ${tailLength.split(' ')[1]} h-0`,
          movement: `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:-translate-y-1'}`
        };
      case 'down':
        return {
          position: 'top-0 left-1/2 -translate-x-1/2',
          size: `w-[${tailWidth}] ${tailLength.split(' ')[1]} h-0`,
          movement: `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:translate-y-1'}`
        };
      default:
        return {
          position: 'left-0 top-1/2 -translate-y-1/2',
          size: `h-[${tailWidth}] ${tailLength.split(' ')[0]} w-0`,
          movement: `${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:translate-x-1'}`
        };
    }
  };

  const tailConfig = getTailConfig();

  return (
    <div className={`relative inline-flex items-center justify-center cursor-pointer group ${className} ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`} style={{ padding: '4px' }} onClick={onClick}>
      {/* Tail that appears on hover - positioned behind arrow */}
      <div className={`absolute ${tailConfig.position} ${tailConfig.size} bg-white ${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:bg-red-500'} transition-all duration-300 ease-in-out z-0`} />
      
      {/* Chevron Arrow */}
      <div className={`${sizeClasses[size]} ${rotationClass[direction]} transition-all duration-300 ease-in-out ${tailConfig.movement} relative z-10`} >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className={`w-full h-full transition-colors duration-300 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'group-hover:text-red-500'}`}
          strokeWidth={strokeWidth[size]}
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  );
};
