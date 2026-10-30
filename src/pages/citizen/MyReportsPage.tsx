import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllReports } from '@/lib/reportsStorage';
import { Report, ReportCategory, ReportStatus } from '@/types';
import { Card } from '@/components/common/Card';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/common/Badges';
import { useI18n } from '@/lib/i18n';
import { 
  FileText, 
  Search, 
  MapPin, 
  ExternalLink, 
  PlusCircle,
  Copy,
  Check,
  RotateCw,
  Radio,
  ChevronLeft
} from 'lucide-react';
import { clsx } from 'clsx';

export const MyReportsPage: React.FC = () => {
  const { t } = useI18n();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const statuses: ('all' | ReportStatus)[] = ['all', 'Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

  useEffect(() => {
    getAllReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const filteredReports = reports.filter((rep) => {
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
      {/* Back & Header */}
      <div className="space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline mb-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Command Overview</span>
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Smart City Grievance Telemetry Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              {t.navMyReports}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live status tracking, cryptographic tokens, and municipal field resolution proof.
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>New Grievance Report</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 cyber-glass-card border-cyan-500/25 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location or token..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-cyan-500/30 text-sm bg-[#070B14]/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[42px]"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap min-h-[36px]',
                  selectedStatus === st
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-[#070B14]/70 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
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
        {loading ? (
          <Card className="p-12 text-center text-slate-400 cyber-glass-card space-y-2">
            <RotateCw className="w-8 h-8 mx-auto text-cyan-400 animate-spin" />
            <p className="text-sm font-mono font-bold text-cyan-300">Loading grievance records...</p>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 cyber-glass-card">
            <FileText className="w-10 h-10 mx-auto text-cyan-400 mb-3 opacity-60" />
            <p className="text-base font-bold font-heading text-white">No complaints found</p>
            <p className="text-xs mt-1 text-slate-400">Try adjusting your search criteria or submit a new civic complaint.</p>
          </Card>
        ) : (
          filteredReports.map((rep) => (
            <Card key={rep.id} className="p-5 cyber-glass-card border-cyan-500/15 hover:border-cyan-400/50 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToken(rep.tracking_token)}
                      title="Click to copy token"
                      className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 px-2 py-0.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{rep.tracking_token}</span>
                      {copiedToken === rep.tracking_token ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-cyan-400" />
                      )}
                    </button>
                    <StatusBadge status={rep.status} isDark={true} />
                    <PriorityBadge priority={rep.priority_band} />
                    <CategoryBadge category={rep.category} />
                  </div>

                  <h3 className="text-base font-bold font-heading text-white">
                    {rep.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {rep.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-slate-300">{rep.address}</span>
                    </span>
                    <span>•</span>
                    <span>Logged {new Date(rep.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <Link
                    to={`/track/${rep.tracking_token}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-300 text-xs font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)] min-h-[40px] w-full transition-all"
                  >
                    <span>Track Live</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
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
