import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'admin-primary' | 'admin-secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm min-h-[36px]',
      md: 'h-11 px-5 text-base min-h-[44px]', // 44px min touch target
      lg: 'h-13 px-7 text-lg min-h-[48px]',
    };

    const variantClasses = {
      primary: 'bg-[#294563] text-white hover:bg-[#1f344b] active:bg-[#18293b] border border-transparent shadow-sm',
      secondary: 'bg-[#F8F8F5] text-[#263442] hover:bg-[#F0F2EF] active:shadow-inner border border-[#E3E7E8] shadow-soft-sm',
      outline: 'bg-transparent text-[#294563] border border-[#7189A4]/40 hover:bg-[#7189A4]/10 active:bg-[#7189A4]/20',
      danger: 'bg-[#B85D5D] text-white hover:bg-[#a34e4e] active:bg-[#8f4242] border border-transparent',
      ghost: 'bg-transparent text-[#263442] hover:bg-[#E3E7E8]/50 active:bg-[#E3E7E8]',
      'admin-primary': 'bg-[#8EA8C2] text-[#111A24] font-medium hover:bg-[#9eb8d2] active:bg-[#7d97b0] border border-transparent',
      'admin-secondary': 'bg-[#1C2C3D] text-[#F3F5F6] hover:bg-[#25394e] border border-[#304153]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294563] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
