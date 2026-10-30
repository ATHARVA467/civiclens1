import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SYNTHETIC_REPORTS } from '@/lib/syntheticData';
import { ReportCategory, ReportStatus } from '@/types';
import { Card } from '@/components/common/Card';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/common/Badges';
import { useI18n } from '@/lib/i18n';
import { 
  FileText, 
  Search, 
  Filter, 
  MapPin, 
  ExternalLink, 
  PlusCircle,
  Copy,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';

export const MyReportsPage: React.FC = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const statuses: ('all' | ReportStatus)[] = ['all', 'Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

  const filteredReports = SYNTHETIC_REPORTS.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.tracking_token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.address && rep.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || rep.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7189A4] uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#7189A4]" />
            <span>Citizen Grievance Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#294563]">
            {t.navMyReports}
          </h1>
          <p className="text-sm text-[#687786]">
            Track status transitions, authority responses, and field resolution updates.
          </p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#294563] text-white font-medium text-sm hover:bg-[#1f344b] shadow-soft-sm min-h-[44px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Report</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 soft-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#687786] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location or token..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E3E7E8] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[42px]"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap min-h-[36px]',
                  selectedStatus === st
                    ? 'bg-[#294563] text-white border-[#294563] font-semibold'
                    : 'bg-[#F8F8F5] text-[#687786] border-[#E3E7E8] hover:bg-[#F0F2EF]'
                )}
              >
                {st === 'all' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center text-[#687786] soft-card">
            <FileText className="w-10 h-10 mx-auto text-[#7189A4] mb-3 opacity-60" />
            <p className="text-base font-semibold text-[#294563]">No complaints found</p>
            <p className="text-xs mt-1">Try adjusting your search criteria or submit a new civic complaint.</p>
          </Card>
        ) : (
          filteredReports.map((rep) => (
            <Card key={rep.id} className="p-5 soft-card hover:border-[#7189A4]/50 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToken(rep.tracking_token)}
                      title="Click to copy token"
                      className="font-mono text-xs font-bold text-[#294563] bg-[#294563]/10 hover:bg-[#294563]/20 px-2 py-0.5 rounded inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{rep.tracking_token}</span>
                      {copiedToken === rep.tracking_token ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#7189A4]" />
                      )}
                    </button>
                    <StatusBadge status={rep.status} />
                    <PriorityBadge priority={rep.priority_band} />
                    <CategoryBadge category={rep.category} />
                  </div>

                  <h3 className="text-base font-bold text-[#263442]">
                    {rep.title}
                  </h3>

                  <p className="text-xs text-[#687786] line-clamp-2 leading-relaxed">
                    {rep.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#687786] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7189A4]" />
                      <span>{rep.address}</span>
                    </span>
                    <span>•</span>
                    <span>Logged {new Date(rep.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <Link
                    to={`/track/${rep.tracking_token}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#294563] text-white hover:bg-[#1f344b] text-xs font-semibold shadow-soft-sm min-h-[40px] w-full"
                  >
                    <span>Track Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
