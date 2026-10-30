import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'admin' | 'admin-elevated' | 'cyber';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#0E1726]/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.36)] text-[#F3F4F6]',
    elevated: 'bg-[#111A2E]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.15)] text-[#F3F4F6]',
    subtle: 'bg-[#0B0F19]/80 border border-slate-800 rounded-2xl text-[#94A3B8]',
    admin: 'bg-[#1C2C3D] border border-[#304153] rounded-2xl text-[#F3F5F6]',
    'admin-elevated': 'bg-[#1C2C3D] border border-[#304153] rounded-2xl shadow-admin-card text-[#F3F5F6]',
    cyber: 'bg-gradient-to-br from-[#0E1726]/90 via-[#0B0F19]/90 to-[#141E33]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.2)] rounded-2xl text-[#F3F4F6]',
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

