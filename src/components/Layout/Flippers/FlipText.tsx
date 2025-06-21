type FlipTextProps = {
  text: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  fontWeight?: 'normal' | 'bold';
  hoverColor?: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
};

const FlipText = ({
  text,
  size = 'md',
  className = '',
  isActive = false,
  isDisabled = false,
  variant = 'default',
  fontWeight = 'normal',
  hoverColor = 'red',
}: FlipTextProps) => {
  
  // Size configurations
  const sizeClasses = {
    xs: 'text-xs tracking-[1px]',
    sm: 'text-sm tracking-[2px]',
    md: 'text-base tracking-[3px]',
    lg: 'text-lg tracking-[4px]',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  // Color configurations
  const colorClasses = {
    red: {
      active: 'text-red-500',
      hover: 'text-red-500',
      inactive: 'text-white'
    },
    blue: {
      active: 'text-blue-500',
      hover: 'text-blue-500',
      inactive: 'text-white'
    },
    green: {
      active: 'text-green-500',
      hover: 'text-green-500',
      inactive: 'text-white'
    },
    purple: {
      active: 'text-purple-500',
      hover: 'text-purple-500',
      inactive: 'text-white'
    },
    yellow: {
      active: 'text-yellow-500',
      hover: 'text-yellow-500',
      inactive: 'text-white'
    }
  };

  // Variant configurations
  const variantClasses = {
    default: 'bg-transparent',
    outline: `border-2 ${isActive ? `border-${hoverColor}-500` : 'border-white'} hover:border-${hoverColor}-500`,
    ghost: `hover:bg-${hoverColor}-500 hover:bg-opacity-10`
  };

  const colors = colorClasses[hoverColor];

  return (
    <div 
      className={`
        group cursor-pointer relative uppercase flex items-center justify-left
        overflow-hidden transition-all duration-300 font-${fontWeight} pointer-small
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed ' : ''}
        ${className}
      `}
    >
      {/* Original text (visible by default) */}
      <p className={`
        group-hover:opacity-0 group-hover:-translate-y-full 
        absolute translate-y-0 transition-all duration-300 ease-out
        ${isActive ? colors.active : colors.inactive}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        whitespace-nowrap
        align-left
      `}>
        {text}
      </p>
      
      {/* Hover text (slides up from bottom) */}
      <p className={`
        group-hover:translate-y-0 group-hover:opacity-100 
        absolute translate-y-full opacity-0 transition-all duration-300 ease-out
        ${colors.hover}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        whitespace-nowrap
        align-left
      `}>
        {text}
      </p>
      
      {/* Invisible text for maintaining container size */}
      <p className="invisible whitespace-nowrap">
        {text}
      </p>
    </div>
  );
};
export default FlipText;