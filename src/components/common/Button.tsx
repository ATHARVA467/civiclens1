import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'admin-primary' | 'admin-secondary' | 'cyber' | 'cyber-outline';
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
      primary: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 active:opacity-90 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      secondary: 'bg-[#0E1726]/80 text-[#F3F4F6] hover:bg-[#162238] hover:border-cyan-500/40 active:bg-[#0E1726] border border-cyan-500/20 shadow-sm backdrop-blur-md',
      outline: 'bg-transparent text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 active:bg-cyan-500/20',
      danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 active:opacity-90 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50 active:bg-slate-800',
      'admin-primary': 'bg-[#8EA8C2] text-[#111A24] font-medium hover:bg-[#9eb8d2] active:bg-[#7d97b0] border border-transparent',
      'admin-secondary': 'bg-[#1C2C3D] text-[#F3F5F6] hover:bg-[#25394e] border border-[#304153]',
      cyber: 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-[0.98] border border-cyan-300/50',
      'cyber-outline': 'bg-cyan-950/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold',
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

