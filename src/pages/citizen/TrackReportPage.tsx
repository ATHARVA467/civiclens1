import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SYNTHETIC_REPORTS, SYNTHETIC_ANALYSES, SYNTHETIC_DEPARTMENTS } from '@/lib/syntheticData';
import { Report, AIAnalysis, ReportStatus } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/common/Badges';
import { useI18n } from '@/lib/i18n';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  RotateCw,
  FileText
} from 'lucide-react';
import { clsx } from 'clsx';

export const TrackReportPage: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [searchInput, setSearchInput] = useState(token || '');
  const [report, setReport] = useState<Report | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (token) {
      const foundReport = SYNTHETIC_REPORTS.find(
        (r) => r.tracking_token.toUpperCase() === token.toUpperCase()
      );
      if (foundReport) {
        setReport(foundReport);
        setAnalysis(SYNTHETIC_ANALYSES[foundReport.id] || null);
        setNotFound(false);
      } else {
        setReport(null);
        setAnalysis(null);
        setNotFound(true);
      }
    }
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const lifecycleSteps: ReportStatus[] = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

  const getStepIndex = (status: ReportStatus) => {
    return lifecycleSteps.indexOf(status);
  };

  const currentStepIdx = report ? getStepIndex(report.status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Header */}
      <div className="space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#294563] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#294563]">
          Civic Complaint Tracker
        </h1>
        <p className="text-sm text-[#687786]">
          Real-time visibility into the municipal decision and resolution lifecycle.
        </p>
      </div>

      {/* Token Input Box */}
      <Card className="p-4 soft-card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#687786] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter tracking token (e.g. CLK-DRN-8201)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E3E7E8] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
            />
          </div>
          <Button type="submit" variant="primary" className="sm:w-auto shrink-0">
            Search
          </Button>
        </form>
      </Card>

      {notFound && (
        <Card className="p-8 text-center soft-card border-[#B85D5D]/40 space-y-3">
          <AlertTriangle className="w-8 h-8 mx-auto text-[#B85D5D]" />
          <h2 className="text-lg font-bold text-[#263442]">Tracking Token Not Found</h2>
          <p className="text-xs text-[#687786] max-w-md mx-auto">
            No active civic grievance matched token <code className="font-mono font-bold">{token}</code>.
            Please verify the number or check your submission email.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchInput('CLK-DRN-8201');
                navigate('/track/CLK-DRN-8201');
              }}
              className="text-xs font-bold text-[#294563] underline"
            >
              Try sample complaint CLK-DRN-8201
            </button>
          </div>
        </Card>
      )}

      {report && (
        <div className="space-y-6">
          {/* Main Status & Header Card */}
          <Card className="p-6 sm:p-8 soft-card-elevated space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E7E8] pb-5">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-[#294563] bg-[#294563]/10 px-2.5 py-1 rounded-md">
                    {report.tracking_token}
                  </span>
                  <StatusBadge status={report.status} />
                  <PriorityBadge priority={report.priority_band} />
                  <CategoryBadge category={report.category} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#263442] pt-1">
                  {report.title}
                </h2>
              </div>
              <div className="text-xs text-[#687786] sm:text-right shrink-0">
                <div>Logged on {new Date(report.created_at).toLocaleString()}</div>
                <div className="text-[11px] opacity-75">Last status check: Just now</div>
              </div>
            </div>

            {/* Lifecycle Stepper */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#263442] uppercase tracking-wider">
                Resolution Lifecycle Progress
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-4 relative pt-2">
                {lifecycleSteps.map((step, idx) => {
                  const isCompleted = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;
                  return (
                    <div key={step} className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={clsx(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                          isCurrent
                            ? 'bg-[#294563] text-white ring-4 ring-[#294563]/20 shadow-sm'
                            : isCompleted
                              ? 'bg-[#4F8665] text-white'
                              : 'bg-[#F0F2EF] text-[#687786] border border-[#E3E7E8]'
                        )}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <RotateCw className="w-4 h-4 animate-spin-slow" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={clsx(
                          'text-[10px] sm:text-xs font-medium line-clamp-1',
                          isCurrent
                            ? 'text-[#294563] font-bold'
                            : isCompleted
                              ? 'text-[#4F8665]'
                              : 'text-[#687786]'
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complaint Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E3E7E8]">
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#263442] uppercase tracking-wider">
                  Citizen Report Details
                </div>
                <p className="text-sm text-[#263442] leading-relaxed bg-[#F8F8F5] p-4 rounded-xl border border-[#E3E7E8]">
                  {report.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#687786]">
                  <MapPin className="w-4 h-4 text-[#7189A4] shrink-0" />
                  <span>{report.address} (Coordinates: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)})</span>
                </div>
              </div>

              {/* Department & Operational Assignment */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#263442] uppercase tracking-wider">
                  Assigned Authority
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E3E7E8] shadow-soft-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#294563]">
                    <Building2 className="w-4 h-4 text-[#7189A4]" />
                    <span>Roads & Infrastructure Authority</span>
                  </div>
                  <p className="text-xs text-[#687786] leading-relaxed">
                    Division jurisdiction assigned based on semantic classification and municipal GIS boundaries.
                  </p>
                  <div className="text-[11px] text-[#4F8665] font-medium pt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Officer acknowledged receipt & scheduled site inspection</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Decision Intelligence Brief */}
            {analysis && (
              <div className="p-5 rounded-xl bg-[#294563]/5 border border-[#294563]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#294563] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#7189A4]" />
                    <span>Gemini AI Priority Assessment</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#294563] text-white">
                    Score {analysis.priority_score}/100
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#263442]">
                  {analysis.summary}
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#687786] uppercase tracking-wider">
                    Contributing Decision Factors:
                  </div>
                  <ul className="list-disc list-inside text-xs text-[#263442] space-y-1 pl-1">
                    {analysis.reasoning.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-xs text-[#294563] border-t border-[#294563]/10 flex items-start gap-2">
                  <span className="font-bold shrink-0">Action Directive:</span>
                  <span>{analysis.recommended_action}</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
