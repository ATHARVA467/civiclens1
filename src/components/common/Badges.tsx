import React from 'react';
import { clsx } from 'clsx';
import { ReportStatus, PriorityBand, ReportCategory } from '@/types';
import { useI18n } from '@/lib/i18n';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  XCircle, 
  ShieldAlert,
  Flame,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: ReportStatus; isDark?: boolean; className?: string }> = ({
  status,
  isDark = false,
  className
}) => {
  const { getStatusName } = useI18n();

  const getStyle = () => {
    switch (status) {
      case 'Submitted':
        return isDark
          ? 'bg-[#304153]/60 text-[#A8B5C1] border-[#304153]'
          : 'bg-[#F0F2EF] text-[#687786] border-[#E3E7E8]';
      case 'Verified':
        return isDark
          ? 'bg-[#7189A4]/20 text-[#8EA8C2] border-[#7189A4]/40'
          : 'bg-[#7189A4]/15 text-[#294563] border-[#7189A4]/30';
      case 'Assigned':
        return isDark
          ? 'bg-[#D1A15D]/20 text-[#D1A15D] border-[#D1A15D]/40'
          : 'bg-[#B9853F]/15 text-[#8f642a] border-[#B9853F]/30';
      case 'In Progress':
        return isDark
          ? 'bg-[#8EA8C2]/20 text-[#8EA8C2] border-[#8EA8C2]/40'
          : 'bg-[#294563]/10 text-[#294563] border-[#294563]/25';
      case 'Resolved':
        return isDark
          ? 'bg-[#7C9B85]/20 text-[#7C9B85] border-[#7C9B85]/40'
          : 'bg-[#4F8665]/15 text-[#3a674d] border-[#4F8665]/30';
      case 'Rejected':
        return isDark
          ? 'bg-[#C77A7A]/20 text-[#C77A7A] border-[#C77A7A]/40'
          : 'bg-[#B85D5D]/15 text-[#B85D5D] border-[#B85D5D]/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'Submitted': return <Clock className="w-3.5 h-3.5 mr-1" />;
      case 'Verified': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'Assigned': return <Clock className="w-3.5 h-3.5 mr-1" />;
      case 'In Progress': return <RotateCw className="w-3.5 h-3.5 mr-1 animate-spin-slow" />;
      case 'Resolved': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'Rejected': return <XCircle className="w-3.5 h-3.5 mr-1" />;
      default: return null;
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border',
        getStyle(),
        className
      )}
    >
      {getIcon()}
      {getStatusName(status)}
    </span>
  );
};

export const PriorityBadge: React.FC<{
  priority: PriorityBand;
  score?: number;
  isDark?: boolean;
  className?: string;
}> = ({ priority, score, isDark = false, className }) => {
  const { getPriorityName } = useI18n();

  const getStyle = () => {
    switch (priority) {
      case 'Critical':
        return isDark
          ? 'bg-[#C77A7A]/25 text-[#f09e9e] border-[#C77A7A]/50'
          : 'bg-[#B85D5D]/15 text-[#9a4242] border-[#B85D5D]/30';
      case 'High':
        return isDark
          ? 'bg-[#D1A15D]/25 text-[#f3c88a] border-[#D1A15D]/50'
          : 'bg-[#B9853F]/15 text-[#986827] border-[#B9853F]/30';
      case 'Medium':
        return isDark
          ? 'bg-[#7189A4]/25 text-[#a6bfd8] border-[#7189A4]/50'
          : 'bg-[#7189A4]/15 text-[#294563] border-[#7189A4]/30';
      case 'Low':
        return isDark
          ? 'bg-[#7C9B85]/25 text-[#a8c9b1] border-[#7C9B85]/50'
          : 'bg-[#4F8665]/15 text-[#3b6b4e] border-[#4F8665]/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (priority) {
      case 'Critical': return <Flame className="w-3.5 h-3.5 mr-1" />;
      case 'High': return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      case 'Medium': return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      case 'Low': return <HelpCircle className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border',
        getStyle(),
        className
      )}
    >
      {getIcon()}
      <span>{getPriorityName(priority)}</span>
      {typeof score === 'number' && (
        <span className="ml-1.5 opacity-80 font-mono text-[11px]">({Math.round(score)})</span>
      )}
    </span>
  );
};

export const CategoryBadge: React.FC<{
  category: ReportCategory;
  isDark?: boolean;
  className?: string;
}> = ({ category, isDark = false, className }) => {
  const { getCategoryName } = useI18n();

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-normal rounded-md border',
        isDark
          ? 'bg-[#172332] text-[#A8B5C1] border-[#304153]'
          : 'bg-[#F0F2EF] text-[#263442] border-[#E3E7E8]',
        className
      )}
    >
      {getCategoryName(category)}
    </span>
  );
};
