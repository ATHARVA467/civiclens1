import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n, CATEGORY_TRANSLATIONS } from '@/lib/i18n';
import { SYNTHETIC_REPORTS } from '@/lib/syntheticData';
import { ReportCategory } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge, PriorityBadge } from '@/components/common/Badges';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  MapPin, 
  Brain, 
  GitMerge, 
  CheckCircle2, 
  ShieldCheck, 
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setTokenError('Please enter a valid tracking token');
      return;
    }
    navigate(`/track/${encodeURIComponent(cleanToken)}`);
  };

  const categories: ReportCategory[] = [
    'Roads & Potholes',
    'Drainage & Waterlogging',
    'Garbage & Sanitation',
    'Streetlights',
    'Water Supply',
    'Electrical Hazards',
    'Public Infrastructure',
    'Other Civic Issues'
  ];

  // Calculate live city pulse metrics from demonstration data
  const totalReports = SYNTHETIC_REPORTS.length;
  const resolvedReports = SYNTHETIC_REPORTS.filter(r => r.status === 'Resolved').length;
  const criticalCount = SYNTHETIC_REPORTS.filter(r => r.priority_band === 'Critical').length;
  const inProgressCount = SYNTHETIC_REPORTS.filter(r => r.status === 'In Progress').length;

  const pipelineSteps = [
    {
      num: '01',
      key: 'stepCapture',
      title: t.stepCapture,
      icon: <Camera className="w-5 h-5 text-[#294563]" />,
      desc: 'Mobile-friendly photo upload, geo-location tagging, and 45-second submission.'
    },
    {
      num: '02',
      key: 'stepUnderstand',
      title: t.stepUnderstand,
      icon: <Brain className="w-5 h-5 text-[#7189A4]" />,
      desc: 'Gemini AI analyzes imagery, extracts severity factors, and standardizes descriptions.'
    },
    {
      num: '03',
      key: 'stepReveal',
      title: t.stepReveal,
      icon: <GitMerge className="w-5 h-5 text-[#7C9B85]" />,
      desc: 'Detects semantic duplicates, clusters geographic hotspots, and reveals underlying causes.'
    },
    {
      num: '04',
      key: 'stepAct',
      title: t.stepAct,
      icon: <Layers className="w-5 h-5 text-[#B9853F]" />,
      desc: 'Automates department assignment and queues tasks based on explainable priority scores.'
    },
    {
      num: '05',
      key: 'stepResolve',
      title: t.stepResolve,
      icon: <CheckCircle2 className="w-5 h-5 text-[#4F8665]" />,
      desc: 'Municipal officers upload resolution evidence; citizens verify before closure.'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#E3E7E8] bg-gradient-to-b from-white to-[#F8F8F5]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#294563]/10 text-[#294563] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#294563]" />
            <span>{t.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#294563] tracking-tight leading-tight max-w-4xl mx-auto">
            {t.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-[#687786] max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/report')}
              leftIcon={<PlusCircle className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-md"
            >
              {t.ctaReport}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                const element = document.getElementById('tracking-box');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              leftIcon={<Search className="w-5 h-5 text-[#7189A4]" />}
              className="w-full sm:w-auto"
            >
              {t.ctaTrack}
            </Button>
          </div>

          {/* Direct Tracking Token Box */}
          <div id="tracking-box" className="pt-6 max-w-xl mx-auto">
            <Card className="p-4 sm:p-5 soft-card">
              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#294563] uppercase tracking-wider">
                  <Search className="w-4 h-4 text-[#7189A4]" />
                  <span>Track Complaint in Real-Time</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value);
                      setTokenError('');
                    }}
                    placeholder={t.trackPlaceholder}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[#E3E7E8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] focus:border-transparent min-h-[44px]"
                    aria-label="Tracking Token Input"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="sm:w-auto shrink-0"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {t.trackButton}
                  </Button>
                </div>
                {tokenError && (
                  <p className="text-xs text-[#B85D5D] text-left">{tokenError}</p>
                )}
                <div className="flex items-center gap-2 text-[11px] text-[#687786] pt-1">
                  <span>Try sample tokens:</span>
                  <button
                    type="button"
                    onClick={() => setTokenInput('CLK-DRN-8201')}
                    className="font-mono text-[#294563] font-semibold underline hover:text-[#1f344b]"
                  >
                    CLK-DRN-8201
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setTokenInput('CLK-ROD-9101')}
                    className="font-mono text-[#294563] font-semibold underline hover:text-[#1f344b]"
                  >
                    CLK-ROD-9101
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setTokenInput('CLK-ELC-3301')}
                    className="font-mono text-[#294563] font-semibold underline hover:text-[#1f344b]"
                  >
                    CLK-ELC-3301
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Real-Time City Pulse Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5 soft-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#687786] uppercase tracking-wider">Reports Logged</span>
              <Activity className="w-4 h-4 text-[#7189A4]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#294563]">{totalReports}</div>
            <p className="text-[11px] text-[#687786] mt-1">Live synthetic demonstration dataset</p>
          </Card>

          <Card className="p-4 sm:p-5 soft-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#687786] uppercase tracking-wider">In Progress</span>
              <Clock className="w-4 h-4 text-[#B9853F]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#B9853F]">{inProgressCount}</div>
            <p className="text-[11px] text-[#687786] mt-1">Under active municipal field resolution</p>
          </Card>

          <Card className="p-4 sm:p-5 soft-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#687786] uppercase tracking-wider">Critical Triage</span>
              <TrendingUp className="w-4 h-4 text-[#B85D5D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#B85D5D]">{criticalCount}</div>
            <p className="text-[11px] text-[#687786] mt-1">AI-flagged safety hazards</p>
          </Card>

          <Card className="p-4 sm:p-5 soft-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#687786] uppercase tracking-wider">Verified Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-[#4F8665]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#4F8665]">{resolvedReports}</div>
            <p className="text-[11px] text-[#687786] mt-1">Closed with citizen confirmation</p>
          </Card>
        </div>
      </section>

      {/* The 5-Step Civic Action Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold text-[#7189A4] uppercase tracking-widest">
            Explainable Redressal Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#294563]">
            {t.processTitle}
          </h2>
          <p className="text-sm text-[#687786]">
            {t.processSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineSteps.map((step, idx) => (
            <Card key={step.num} className="p-5 soft-card flex flex-col justify-between relative group hover:border-[#7189A4]/60 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#7189A4]">
                    STEP {step.num}
                  </span>
                  <div className="p-2 rounded-lg bg-[#F8F8F5] border border-[#E3E7E8]">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#294563]">{step.title}</h3>
                <p className="text-xs text-[#687786] leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E3E7E8]/60 text-[10px] font-semibold text-[#7189A4] flex items-center justify-between">
                <span>Phase {idx + 1} Pipeline</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Civic Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#294563]">{t.categoriesTitle}</h2>
            <p className="text-xs sm:text-sm text-[#687786]">{t.categoriesSubtitle}</p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#294563] hover:underline"
          >
            <span>Start a custom report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = SYNTHETIC_REPORTS.filter(r => r.category === cat).length;
            const localizedName = CATEGORY_TRANSLATIONS[lang][cat] || cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => navigate(`/report?category=${encodeURIComponent(cat)}`)}
                className="text-left p-4 rounded-xl border border-[#E3E7E8] bg-white shadow-soft-sm hover:shadow-soft hover:border-[#7189A4]/60 transition-all group flex flex-col justify-between min-h-[110px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#294563] group-hover:text-[#1f344b]">
                      {localizedName}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F0F2EF] text-[#687786]">
                      {count}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#687786] line-clamp-2">
                    Click to lodge an issue under this municipal division.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-medium text-[#7189A4] group-hover:text-[#294563]">
                  <span>Submit report</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Public Reports Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#294563]">Recent Civic Activity</h2>
            <p className="text-xs text-[#687786]">Real-time public grievance resolution tracking</p>
          </div>
          <Link
            to="/my-reports"
            className="text-xs font-semibold text-[#294563] hover:underline flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {SYNTHETIC_REPORTS.slice(0, 5).map((rep) => (
            <Card key={rep.id} className="p-4 soft-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#294563] bg-[#294563]/10 px-2 py-0.5 rounded">
                    {rep.tracking_token}
                  </span>
                  <StatusBadge status={rep.status} />
                  <PriorityBadge priority={rep.priority_band} />
                </div>
                <h3 className="text-sm font-semibold text-[#263442] truncate">
                  {rep.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#687786]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7189A4]" />
                    <span className="truncate max-w-[240px]">{rep.address}</span>
                  </span>
                  <span>•</span>
                  <span>{new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Link
                to={`/track/${rep.tracking_token}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#E3E7E8] text-xs font-semibold text-[#294563] hover:bg-[#F0F2EF] transition-colors min-h-[38px]"
              >
                <span>Track Details</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

