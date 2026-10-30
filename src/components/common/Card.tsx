import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'admin' | 'admin-elevated';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-[#E7E9E5] rounded-2xl shadow-soft',
    elevated: 'bg-white border border-[#E7E9E5] rounded-2xl shadow-soft-lg',
    subtle: 'bg-[#F8F8F5] border border-[#E7E9E5] rounded-2xl shadow-soft-sm',
    admin: 'bg-[#1C2C3D] border border-[#304153] rounded-2xl text-[#F3F5F6]',
    'admin-elevated': 'bg-[#1C2C3D] border border-[#304153] rounded-2xl shadow-admin-card text-[#F3F5F6]',
  };

  return (
    <div
      className={clsx(
        'transition-all duration-200',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

