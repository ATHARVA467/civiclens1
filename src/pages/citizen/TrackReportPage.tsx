import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getReportByToken } from '@/lib/reportsStorage';
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
  RotateCw,
  Copy,
  Check,
  ChevronLeft,
  Share2,
  Calendar,
  Layers,
  Image as ImageIcon,
  Radio,
  Cpu,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';

// Leaflet pin icon for tracking map (cyber styling)
const trackPinIcon = L.divIcon({
  className: 'custom-track-pin',
  html: `
    <div style="
      background: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #FFFFFF;
      box-shadow: 0 0 15px rgba(6,182,212,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #070B14;
      font-weight: bold;
    ">
      •
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const TrackReportPage: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [searchInput, setSearchInput] = useState(token || '');
  const [report, setReport] = useState<Report | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      getReportByToken(token).then(({ report: foundReport, analysis: foundAnalysis }) => {
        setLoading(false);
        if (foundReport) {
          setReport(foundReport);
          setAnalysis(foundAnalysis);
          setNotFound(false);
        } else {
          setReport(null);
          setAnalysis(null);
          setNotFound(true);
        }
      });
    }
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${encodeURIComponent(searchInput.trim().toUpperCase())}`);
    }
  };

  const copyToken = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.tracking_token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lifecycleSteps: ReportStatus[] = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

  const getStepIndex = (status: ReportStatus) => {
    return lifecycleSteps.indexOf(status);
  };

  const currentStepIdx = report ? getStepIndex(report.status) : -1;

  // Timeline events
  const timelineEvents = report
    ? [
        {
          title: 'Citizen Grievance Captured',
          date: new Date(report.created_at).toLocaleString(),
          desc: 'Complaint registered and assigned unique public tracking token with GPS geocode.',
          done: true,
        },
        {
          title: 'Automated AI Understanding & Triage',
          date: new Date(report.created_at).toLocaleString(),
          desc: `Category classified as ${report.category}. Priority Band determined as ${report.priority_band}.`,
          done: currentStepIdx >= 1,
        },
        {
          title: 'Department Jurisdiction Assigned',
          date: currentStepIdx >= 2 ? new Date(report.updated_at).toLocaleString() : 'Pending verification',
          desc: 'Assigned to jurisdictional municipal zonal team with duplicate suppression check.',
          done: currentStepIdx >= 2,
        },
        {
          title: 'Active Field Resolution',
          date: currentStepIdx >= 3 ? new Date(report.updated_at).toLocaleString() : 'Pending dispatch',
          desc: 'Field repair team assigned and site inspection scheduled.',
          done: currentStepIdx >= 3,
        },
        {
          title: 'Resolution Verified & Closed',
          date: currentStepIdx >= 4 ? new Date(report.updated_at).toLocaleString() : 'Awaiting completion',
          desc: 'Resolution photo evidence logged by municipal officer and confirmed under Sakala SLA.',
          done: currentStepIdx >= 4,
        },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Header */}
      <div className="space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline mb-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Command Overview</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Real-Time Grievance Telemetry HUD</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
          {t.ctaTrack}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Real-time cryptographic visibility into municipal triage, priority scoring, and resolution evidence.
        </p>
      </div>

      {/* Token Input Search Box */}
      <Card className="p-4 cyber-glass-card border-cyan-500/25">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.trackPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cyan-500/30 text-sm bg-[#070B14]/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[44px] uppercase font-mono tracking-wider"
            />
          </div>
          <Button type="submit" variant="cyber" className="sm:w-auto shrink-0 text-slate-950 font-bold">
            {t.trackButton}
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono pt-3 border-t border-cyan-500/15 mt-3">
          <span className="text-cyan-400">Sample Demo Tokens:</span>
          {['CLK-DRN-8201', 'CLK-ROD-9101', 'CLK-GRB-7301', 'CLK-WAT-5501'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setSearchInput(st);
                navigate(`/track/${st}`);
              }}
              className="font-mono text-cyan-300 font-semibold underline hover:text-cyan-200"
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {loading && (
        <Card className="p-12 text-center cyber-glass-card space-y-3">
          <RotateCw className="w-8 h-8 mx-auto text-cyan-400 animate-spin" />
          <p className="text-sm font-mono font-bold text-cyan-300">Retrieving encrypted complaint telemetry...</p>
        </Card>
      )}

      {notFound && !loading && (
        <Card className="p-8 text-center cyber-glass-card border-rose-500/40 space-y-3">
          <AlertTriangle className="w-8 h-8 mx-auto text-rose-400" />
          <h2 className="text-lg font-bold text-white font-heading">Tracking Token Not Found</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
            No active civic grievance matched token <code className="text-cyan-300 font-bold">{token}</code>.
            Please verify the number or submit a new grievance.
          </p>
        </Card>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {/* Main Status & Header Card */}
          <Card className="p-6 sm:p-8 cyber-glass-card border-cyan-500/30 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyToken}
                    className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    title="Click to copy tracking token"
                  >
                    <span>{report.tracking_token}</span>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                  <StatusBadge status={report.status} isDark={true} />
                  <PriorityBadge priority={report.priority_band} />
                  <CategoryBadge category={report.category} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white pt-1">
                  {report.title}
                </h2>
              </div>
              <div className="text-xs text-slate-400 font-mono sm:text-right shrink-0">
                <div className="flex items-center gap-1 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Logged {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] text-cyan-400/80 mt-0.5">
                  Last updated {new Date(report.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Futuristic Stepper Progress */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Redressal Lifecycle Stepper
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-4 relative pt-2">
                {lifecycleSteps.map((step, idx) => {
                  const isCompleted = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;
                  return (
                    <div key={step} className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={clsx(
                          'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-all',
                          isCurrent
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] border border-cyan-300'
                            : isCompleted
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-900 text-slate-600 border border-slate-800'
                        )}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <RotateCw className="w-4 h-4 animate-spin-slow text-slate-950" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={clsx(
                          'text-[10px] sm:text-xs font-mono font-medium line-clamp-1',
                          isCurrent
                            ? 'text-cyan-300 font-bold'
                            : isCompleted
                              ? 'text-emerald-400'
                              : 'text-slate-500'
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complaint Content & Map Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cyan-500/20">
              {/* Left Column: Description & Attached Image */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Preserved Citizen Report Description
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#070B14]/80 p-4 rounded-xl border border-slate-800 font-sans">
                    {report.description}
                  </p>
                </div>

                {report.image_url && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Uploaded Photographic Evidence</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-black/40">
                      <img
                        src={report.image_url}
                        alt="Citizen uploaded proof"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Map Pin & Location Details */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Geographic Coordinates & Pin
                  </div>
                  <div className="h-48 w-full rounded-xl overflow-hidden border border-cyan-500/30 relative z-0">
                    <MapContainer
                      center={[report.latitude, report.longitude]}
                      zoom={14}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[report.latitude, report.longitude]} icon={trackPinIcon}>
                        <Popup>
                          <div className="text-xs font-bold p-1 text-slate-900">
                            {report.title}
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{report.address}</span>
                  </div>
                  <div className="font-mono text-[11px] text-cyan-400/80">
                    Lat: {report.latitude.toFixed(5)}, Long: {report.longitude.toFixed(5)}
                  </div>
                </div>

                {/* Assigned Authority Box */}
                <div className="p-4 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-mono font-bold text-xs text-cyan-400">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>Designated Municipal Authority</span>
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {report.category === 'Drainage & Waterlogging' || report.category === 'Water Supply'
                      ? 'Bangalore Water Supply & Sewerage Board (BWSSB)'
                      : report.category === 'Roads & Potholes'
                        ? 'BBMP Major Roads & Infrastructure Division'
                        : report.category === 'Garbage & Sanitation'
                          ? 'BBMP Solid Waste & Sanitation Management'
                          : report.category === 'Streetlights' || report.category === 'Electrical Hazards'
                            ? 'BESCOM Urban Electricity & Distribution'
                            : 'BBMP Public Works & Ward Facilities'}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Jurisdiction assigned automatically based on semantic NLP classification and BBMP boundary mapping.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Decision Intelligence Brief */}
            {analysis && (
              <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Gemini AI Priority Assessment</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    Priority Score: {analysis.priority_score}/100
                  </span>
                </div>

                <div className="text-xs font-bold text-white">
                  {analysis.summary}
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Contributing Decision Factors:
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1 font-mono">
                    {analysis.reasoning.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-xs text-cyan-300 border-t border-cyan-500/20 flex items-start gap-2 font-mono">
                  <span className="font-bold shrink-0">Action Directive:</span>
                  <span>{analysis.recommended_action}</span>
                </div>
              </div>
            )}

            {/* Complete Citizen-Facing Audit Timeline */}
            <div className="space-y-3 pt-4 border-t border-cyan-500/20">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Full Grievance Redressal Audit Trail
              </div>
              <div className="space-y-3 pl-2">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className="mt-1">
                      {event.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={clsx('font-bold', event.done ? 'text-white' : 'text-slate-500')}>
                          {event.title}
                        </span>
                        <span className="text-[11px] text-cyan-400 font-mono">{event.date}</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed font-sans">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
