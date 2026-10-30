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
  Image as ImageIcon
} from 'lucide-react';
import { clsx } from 'clsx';

// Leaflet pin icon for tracking map
const trackPinIcon = L.divIcon({
  className: 'custom-track-pin',
  html: `
    <div style="
      background-color: #294563;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid #FFFFFF;
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
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
          desc: 'Complaint registered and assigned unique public tracking token.',
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
          desc: 'Assigned to jurisdictional municipal zonal team.',
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
          desc: 'Resolution photo evidence logged by municipal officer and confirmed.',
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
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#294563] hover:underline mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#294563]">
          {t.ctaTrack}
        </h1>
        <p className="text-xs sm:text-sm text-[#687786]">
          Real-time visibility into the municipal decision and resolution lifecycle.
        </p>
      </div>

      {/* Token Input Search Box */}
      <Card className="p-4 soft-card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#687786] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.trackPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E3E7E8] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
            />
          </div>
          <Button type="submit" variant="primary" className="sm:w-auto shrink-0">
            {t.trackButton}
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#687786] pt-2">
          <span>Sample demo tokens:</span>
          {['CLK-DRN-8201', 'CLK-ROD-9101', 'CLK-GRB-7301', 'CLK-WAT-5501'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setSearchInput(st);
                navigate(`/track/${st}`);
              }}
              className="font-mono text-[#294563] font-semibold underline hover:text-[#1f344b]"
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {loading && (
        <Card className="p-12 text-center soft-card space-y-3">
          <RotateCw className="w-8 h-8 mx-auto text-[#294563] animate-spin" />
          <p className="text-sm font-semibold text-[#294563]">Retrieving complaint records...</p>
        </Card>
      )}

      {notFound && !loading && (
        <Card className="p-8 text-center soft-card border-[#B85D5D]/40 space-y-3">
          <AlertTriangle className="w-8 h-8 mx-auto text-[#B85D5D]" />
          <h2 className="text-lg font-bold text-[#263442]">Tracking Token Not Found</h2>
          <p className="text-xs text-[#687786] max-w-md mx-auto">
            No active civic grievance matched token <code className="font-mono font-bold">{token}</code>.
            Please verify the number or submit a new grievance.
          </p>
        </Card>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {/* Main Status & Header Card */}
          <Card className="p-6 sm:p-8 soft-card-elevated space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E7E8] pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyToken}
                    className="font-mono text-xs font-extrabold text-[#294563] bg-[#294563]/10 hover:bg-[#294563]/20 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 transition-colors"
                    title="Click to copy tracking token"
                  >
                    <span>{report.tracking_token}</span>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#7189A4]" />}
                  </button>
                  <StatusBadge status={report.status} />
                  <PriorityBadge priority={report.priority_band} />
                  <CategoryBadge category={report.category} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#263442] pt-1">
                  {report.title}
                </h2>
              </div>
              <div className="text-xs text-[#687786] sm:text-right shrink-0">
                <div className="flex items-center gap-1 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-[#7189A4]" />
                  <span>Logged {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] opacity-75 mt-0.5">
                  Last updated {new Date(report.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#263442] uppercase tracking-wider">
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

            {/* Complaint Content & Map Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E3E7E8]">
              {/* Left Column: Description & Attached Image */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#263442] uppercase tracking-wider">
                    Preserved Citizen Report Description
                  </div>
                  <p className="text-xs sm:text-sm text-[#263442] leading-relaxed bg-[#F8F8F5] p-4 rounded-xl border border-[#E3E7E8]">
                    {report.description}
                  </p>
                </div>

                {report.image_url && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#263442] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#294563]" />
                      <span>Uploaded Photographic Evidence</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-[#E3E7E8] bg-black/5">
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
                  <div className="text-xs font-bold text-[#263442] uppercase tracking-wider">
                    Geographic Coordinates & Pin
                  </div>
                  <div className="h-48 w-full rounded-xl overflow-hidden border border-[#E3E7E8] relative z-0">
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
                          <div className="text-xs font-bold p-1">
                            {report.title}
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="text-xs text-[#687786] flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7189A4] shrink-0" />
                    <span>{report.address}</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#7189A4]">
                    Lat: {report.latitude.toFixed(5)}, Long: {report.longitude.toFixed(5)}
                  </div>
                </div>

                {/* Assigned Authority Box */}
                <div className="p-4 rounded-xl bg-white border border-[#E3E7E8] shadow-soft-sm space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#294563]">
                    <Building2 className="w-4 h-4 text-[#7189A4]" />
                    <span>Designated Municipal Authority</span>
                  </div>
                  <div className="text-xs font-semibold text-[#263442]">
                    {report.category === 'Drainage & Waterlogging' || report.category === 'Water Supply'
                      ? 'Water Supply & Sewerage Board'
                      : report.category === 'Roads & Potholes'
                        ? 'Roads & Infrastructure Authority'
                        : report.category === 'Garbage & Sanitation'
                          ? 'Solid Waste & Sanitation Management'
                          : report.category === 'Streetlights' || report.category === 'Electrical Hazards'
                            ? 'Urban Electricity & Distribution'
                            : 'Public Works & Urban Facilities'}
                  </div>
                  <p className="text-[11px] text-[#687786] leading-relaxed">
                    Jurisdiction assigned automatically based on semantic analysis and municipal boundary mapping.
                  </p>
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
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#294563] text-white">
                    Priority Score: {analysis.priority_score}/100
                  </span>
                </div>

                <div className="text-xs font-bold text-[#263442]">
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

            {/* Complete Citizen-Facing Audit Timeline */}
            <div className="space-y-3 pt-4 border-t border-[#E3E7E8]">
              <div className="text-xs font-bold text-[#263442] uppercase tracking-wider">
                Full Grievance Redressal Audit Trail
              </div>
              <div className="space-y-3 pl-2">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className="mt-1">
                      {event.done ? (
                        <CheckCircle2 className="w-4 h-4 text-[#4F8665]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#E3E7E8] bg-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E3E7E8]" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={clsx('font-bold', event.done ? 'text-[#263442]' : 'text-[#687786]')}>
                          {event.title}
                        </span>
                        <span className="text-[11px] text-[#7189A4]">{event.date}</span>
                      </div>
                      <p className="text-[#687786] leading-relaxed">{event.desc}</p>
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
