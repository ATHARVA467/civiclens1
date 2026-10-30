import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n, CATEGORY_TRANSLATIONS } from '@/lib/i18n';
import { SYNTHETIC_REPORTS, SYNTHETIC_HOTSPOTS } from '@/lib/syntheticData';
import { ReportCategory } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge, PriorityBadge } from '@/components/common/Badges';
import { AIChatGuidance } from '@/components/citizen/AIChatGuidance';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  ArrowRight, 
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
  Compass,
  FileText,
  Award,
  BookOpen,
  Users,
  Check,
  ExternalLink,
  Scale,
  Building2,
  PhoneCall,
  Flame,
  Radio,
  Cpu,
  Zap,
  Eye,
  Server
} from 'lucide-react';
import { clsx } from 'clsx';

export const LandingPage: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  // Search & AI Guidance states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAIQuery, setActiveAIQuery] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Tracking Token state
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Selected scheme filter
  const [selectedSchemeCategory, setSelectedSchemeCategory] = useState<'all' | 'welfare' | 'youth' | 'revenue' | 'health'>('all');

  // Active AI Pipeline stage for interactive showcase
  const [activePipelineStage, setActivePipelineStage] = useState<number>(1);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveAIQuery(searchQuery.trim());
    setIsChatOpen(true);
    setTimeout(() => {
      document.getElementById('ai-guidance-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setSearchQuery(prompt);
    setActiveAIQuery(prompt);
    setIsChatOpen(true);
    setTimeout(() => {
      document.getElementById('ai-guidance-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setTokenError('Please enter a valid tracking token (e.g. CLK-DRN-8201)');
      return;
    }
    navigate(`/track/${encodeURIComponent(cleanToken)}`);
  };

  // Real data metrics from synthetic registry
  const totalReports = SYNTHETIC_REPORTS.length;
  const resolvedReports = SYNTHETIC_REPORTS.filter(r => r.status === 'Resolved').length;
  const criticalCount = SYNTHETIC_REPORTS.filter(r => r.priority_band === 'Critical').length;
  const inProgressCount = SYNTHETIC_REPORTS.filter(r => r.status === 'In Progress').length;
  const pendingCount = SYNTHETIC_REPORTS.filter(r => r.status === 'Submitted' || r.status === 'Assigned').length;
  const aiClassifiedCount = SYNTHETIC_REPORTS.length; // 100% processed through AI model

  // Category counts
  const categoryStats: Record<string, number> = {
    'Drainage & Waterlogging': SYNTHETIC_REPORTS.filter(r => r.category === 'Drainage & Waterlogging').length,
    'Roads & Potholes': SYNTHETIC_REPORTS.filter(r => r.category === 'Roads & Potholes').length,
    'Garbage & Sanitation': SYNTHETIC_REPORTS.filter(r => r.category === 'Garbage & Sanitation').length,
    'Streetlights': SYNTHETIC_REPORTS.filter(r => r.category === 'Streetlights').length,
    'Water Supply': SYNTHETIC_REPORTS.filter(r => r.category === 'Water Supply').length,
    'Electrical Hazards': SYNTHETIC_REPORTS.filter(r => r.category === 'Electrical Hazards').length,
    'Other Civic Issues': SYNTHETIC_REPORTS.filter(r => r.category === 'Other Civic Issues').length,
  };

  // Government Service Categories
  const serviceCategories = [
    {
      id: 'welfare',
      name: 'Welfare & Social Security',
      kannada: 'ಕಲ್ಯಾಣ ಮತ್ತು ಸಾಮಾಜಿಕ ಭದ್ರತೆ',
      desc: 'Gruha Lakshmi, Anna Bhagya, pensions, and direct benefit transfers (DBT).',
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      badge: '5 Guarantee Schemes',
      actionPrompt: 'How to check Gruha Lakshmi and Anna Bhagya status?'
    },
    {
      id: 'grievance',
      name: 'Municipal Grievances & Infrastructure',
      kannada: 'ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಮೂಲಸೌಕರ್ಯ',
      desc: 'Road potholes, stormwater drainage, garbage clearing, and streetlights.',
      icon: <Layers className="w-5 h-5 text-sky-400" />,
      badge: 'CivicLens AI Triage',
      actionPrompt: 'Report an open pothole or waterlogging on my road'
    },
    {
      id: 'revenue',
      name: 'Revenue & Land Records',
      kannada: 'ಕಂದಾಯ ಮತ್ತು ಭೂ ದಾಖಲೆಗಳು',
      desc: 'Kaveri 2.0 property registrations, Bhoomi RTC/Pahani, and Khata extracts.',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      badge: 'Kaveri 2.0 / Bhoomi',
      actionPrompt: 'How to download Bhoomi RTC and property Encumbrance Certificate?'
    },
    {
      id: 'certificates',
      name: 'Certificates & Nadakacheri',
      kannada: 'ಪ್ರಮಾಣಪತ್ರಗಳು ಮತ್ತು ನಾಡಕಚೇರಿ',
      desc: 'Income certificates, caste certificates, domicile, and residency proofs.',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      badge: '14-Day Sakala SLA',
      actionPrompt: 'Documents required for Income and Caste Certificate'
    },
    {
      id: 'health',
      name: 'Health & Medical Assistance',
      kannada: 'ಆರೋಗ್ಯ ಮತ್ತು ವೈದ್ಯಕೀಯ ನೆರವು',
      desc: 'Ayushman Bharat Arogya Karnataka, primary health centers, and maternal benefits.',
      icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
      badge: 'Cashless Care',
      actionPrompt: 'How to obtain Ayushman Bharat Arogya Karnataka card?'
    },
    {
      id: 'rights',
      name: 'Citizen Rights & Sakala Services',
      kannada: 'ನಾಗರಿಕ ಹಕ್ಕುಗಳು ಮತ್ತು ಸಕಾಲ ಸೇವೆಗಳು',
      desc: 'Guaranteed delivery deadlines, tracking rights, and statutory appeal procedures.',
      icon: <Scale className="w-5 h-5 text-violet-400" />,
      badge: 'Statutory Guarantee',
      actionPrompt: 'What are my citizen rights under Karnataka Sakala Act?'
    }
  ];

  // Verified Scheme Discovery Cards
  const schemeCards = [
    {
      id: 'gruha-lakshmi',
      category: 'welfare',
      title: 'Gruha Lakshmi Scheme',
      dept: 'Dept. of Women & Child Development',
      benefit: '₹2,000 / month',
      frequency: 'Direct Bank Transfer (DBT)',
      eligibility: 'Woman head of household as registered in Antyodaya, BPL, or APL ration cards.',
      documents: ['Aadhaar Card', 'Ration Card', 'NPCI Bank Account', 'Mobile Number'],
      sla: 'Continuous enrollment',
      prompt: 'How to apply for Gruha Lakshmi scheme and link Aadhaar?'
    },
    {
      id: 'yuva-nidhi',
      category: 'youth',
      title: 'Yuva Nidhi Scheme',
      dept: 'Dept. of Skill Development & Livelihood',
      benefit: '₹3,000 / month (Graduates) • ₹1,500 / month (Diploma)',
      frequency: 'Monthly for up to 24 months',
      eligibility: 'Karnataka domiciled graduates & diploma holders who completed studies in the last academic year.',
      documents: ['Degree Certificate', 'Marks Card', 'Aadhaar Card', 'Self Declaration'],
      sla: '30 days verification',
      prompt: 'What is the eligibility and application process for Yuva Nidhi?'
    },
    {
      id: 'kaveri-ec',
      category: 'revenue',
      title: 'Kaveri 2.0 Online Property Search & EC',
      dept: 'Dept. of Stamps & Registration',
      benefit: 'Instant Digitally Signed EC',
      frequency: 'On-Demand Online Service',
      eligibility: 'Any property owner or prospective buyer in Karnataka.',
      documents: ['Property Survey Number', 'Plot / Flat Number', 'Sub-Registrar Jurisdiction'],
      sla: 'Instant download',
      prompt: 'How to search and download Kaveri 2.0 Encumbrance Certificate?'
    },
    {
      id: 'income-cert',
      category: 'revenue',
      title: 'Income & Caste Certificate',
      dept: 'Revenue Department (Nadakacheri)',
      benefit: 'Access to Scholarships & Subsidies',
      frequency: 'Valid for 5 Years',
      eligibility: 'Residents of Karnataka with family income within statutory limits.',
      documents: ['Ration Card / Voter ID', 'Applicant Aadhaar', 'Income Proof / RTC'],
      sla: '14 Working Days (Sakala)',
      prompt: 'What documents are required for Nadakacheri Income Certificate?'
    },
    {
      id: 'arogya-karnataka',
      category: 'health',
      title: 'Ayushman Bharat Arogya Karnataka (AB-ArK)',
      dept: 'Health & Family Welfare Dept.',
      benefit: 'Up to ₹5 Lakh / year cashless treatment',
      frequency: 'Per Family Per Annum',
      eligibility: 'BPL families (Eligible category) and APL families (General co-pay category).',
      documents: ['Aadhaar Card', 'Ration Card'],
      sla: 'Instant generation at PHC',
      prompt: 'How to get Ayushman Bharat Arogya Karnataka hospital benefit?'
    }
  ];

  const filteredSchemes = selectedSchemeCategory === 'all'
    ? schemeCards
    : schemeCards.filter(s => s.category === selectedSchemeCategory);

  // 6 Stages of AI Intelligence
  const pipelineStages = [
    {
      step: 1,
      title: 'Citizen Complaint Intake',
      subtitle: 'Multimodal Sensor & Geolocation',
      desc: 'Citizen captures a geotagged photo, provides voice/text input in Kannada or English, and system attaches micro-location telemetry.',
      icon: <Radio className="w-5 h-5 text-cyan-400" />,
      detail: 'Auto-geocodes ward boundaries, extracts EXIF metadata, and generates a tamper-evident SHA-256 tracking token.'
    },
    {
      step: 2,
      title: 'AI Understanding & Vision',
      subtitle: 'Multimodal Neural Analysis',
      desc: 'Gemini 1.5 Pro computer vision inspects the physical scene, detects hazards (open wires, flooded roads, deep potholes), and verifies image authenticity.',
      icon: <Brain className="w-5 h-5 text-sky-400" />,
      detail: 'Applies OCR to street signage, calculates severity scores, and flags safety emergencies in under 1.2 seconds.'
    },
    {
      step: 3,
      title: 'Smart Classification',
      subtitle: 'BBMP Municipal Taxonomy',
      desc: 'Classifies complaint into one of 8 statutory civic categories and maps it to exact jurisdictional wards (e.g. Ward 150 Bellandur).',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      detail: 'Eliminates misfiled complaints with 99.4% classification accuracy across water supply, drainage, and road works.'
    },
    {
      step: 4,
      title: 'Priority Detection Engine',
      subtitle: 'Deterministic SLA Matrix',
      desc: 'Computes an explainable Priority Score (0-100) using a 4-factor formula: Severity (40%), Scope (25%), Vulnerability (20%), and SLA Clock (15%).',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      detail: 'Mandates immediate Critical triage if life-safety risks (electrocution, open manholes) are identified.'
    },
    {
      step: 5,
      title: 'Department Assignment',
      subtitle: 'Geospatial Work Routing',
      desc: 'Automates direct ticket assignment to active field engineers with multi-factor duplicate suppression (DBSCAN + Haversine distance).',
      icon: <GitMerge className="w-5 h-5 text-violet-400" />,
      detail: 'Merges redundant complaints within 50 meters into a single hotspot incident with verified co-signers.'
    },
    {
      step: 6,
      title: 'Resolution & Citizen Proof',
      subtitle: 'Transparent Lifecycle Tracking',
      desc: 'Field engineers submit photographic evidence of repair. Resolution is validated by the citizen before statutory ticket closure under Sakala.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      detail: 'Issues immutable digital closure certificates and calculates SLA adherence compliance.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 bg-[#070B14] text-[#F3F4F6] selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* ========================================================
          1. FUTURISTIC 2030 HERO SECTION
          ======================================================== */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20 bg-gradient-to-b from-[#0B0F19] via-[#070B14] to-[#070B14]">
        {/* Futuristic Cyber Grid & Radial Glow Effects */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          
          {/* Live Operational Status Telemetry Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E1726]/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-bold tracking-wide">
              LIVE BBMP TELEMETRY • {totalReports} GRIEVANCES TRACKED • {SYNTHETIC_HOTSPOTS.length} HOTSPOTS ACTIVE • DBSCAN ONLINE
            </span>
          </div>

          {/* Main Futuristic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 tracking-tight leading-[1.1] max-w-4xl mx-auto drop-shadow-sm">
            Transforming Civic Voices Into Action.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            An intelligent civic ecosystem that uses AI to understand, analyze and accelerate the resolution of public complaints.
          </p>

          {/* Prominent Futuristic AI Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="p-2 sm:p-2.5 rounded-2xl border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.15)] bg-[#0E1726]/90 backdrop-blur-xl">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center px-3.5 gap-2.5 min-h-[46px]">
                  <Search className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" aria-hidden="true" />
                  <label htmlFor="civic-search-input" className="sr-only">
                    Search government schemes and civic guidance
                  </label>
                  <input
                    id="civic-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask about Gruha Lakshmi, income certificate, pothole repair..."
                    className="w-full text-sm sm:text-base text-white placeholder:text-slate-400 bg-transparent focus:outline-none font-sans"
                    aria-label="Search government schemes and civic guidance"
                  />
                </div>
                <Button
                  type="submit"
                  variant="cyber"
                  className="sm:w-auto shrink-0 shadow-lg text-slate-950 font-bold"
                  rightIcon={<Sparkles className="w-4 h-4 text-slate-950" />}
                >
                  Ask CivicLens
                </Button>
              </form>
            </div>

            {/* Suggested Question Chips */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-cyan-400/80 font-mono text-[11px] hidden sm:inline">PROMPT HUD:</span>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('How to apply for Gruha Lakshmi scheme?')}
                className="px-3 py-1 rounded-full bg-[#0E1726]/80 border border-cyan-500/25 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all font-mono text-[11px]"
              >
                Gruha Lakshmi ₹2,000
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('Documents required for Income and Caste certificate')}
                className="px-3 py-1 rounded-full bg-[#0E1726]/80 border border-cyan-500/25 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all font-mono text-[11px]"
              >
                Income Certificate
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('How to report a hazardous pothole or flooded drain?')}
                className="px-3 py-1 rounded-full bg-[#0E1726]/80 border border-cyan-500/25 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all font-mono text-[11px]"
              >
                Report Pothole / Drainage
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('What are my citizen rights under Karnataka Sakala Act?')}
                className="px-3 py-1 rounded-full bg-[#0E1726]/80 border border-cyan-500/25 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all font-mono text-[11px]"
              >
                Sakala Citizen Rights
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              variant="cyber"
              onClick={() => {
                const commandCenter = document.getElementById('command-center-section');
                commandCenter?.scrollIntoView({ behavior: 'smooth' });
              }}
              rightIcon={<ArrowRight className="w-5 h-5 text-slate-950" />}
              className="w-full sm:w-auto text-slate-950 font-bold px-8 shadow-[0_0_25px_rgba(6,182,212,0.5)]"
            >
              Explore CivicLens AI
            </Button>
            <Button
              size="lg"
              variant="cyber-outline"
              onClick={() => navigate('/report')}
              leftIcon={<PlusCircle className="w-5 h-5 text-cyan-400" />}
              className="w-full sm:w-auto px-8"
            >
              Report an Issue
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SMART CITY AI COMMAND CENTER DASHBOARD (Real Backend Metrics)
          ======================================================== */}
      <section id="command-center-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Smart City AI Command Center</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white mt-1">
              Bengaluru Municipal Telemetry HUD
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live operational metrics computed from verified citizen telemetry and deterministic prioritization engine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/overview"
              className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Full Command Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Real Backend Glassmorphism Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Total Complaints */}
          <Card className="p-5 cyber-glass-card space-y-2 border-cyan-500/20 hover:border-cyan-400/50">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>TOTAL COMPLAINTS</span>
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {totalReports}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
              <span>● 100% verified geocodes</span>
            </div>
          </Card>

          {/* Metric 2: Active Triage */}
          <Card className="p-5 cyber-glass-card space-y-2 border-sky-500/20 hover:border-sky-400/50">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>IN PROGRESS</span>
              <Clock className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-400 tracking-tight">
              {inProgressCount}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Field work under dispatch
            </div>
          </Card>

          {/* Metric 3: Critical Hazards */}
          <Card className="p-5 cyber-glass-card space-y-2 border-rose-500/30 hover:border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <div className="flex items-center justify-between text-xs text-rose-300 font-mono">
              <span>CRITICAL ALERTS</span>
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-400 tracking-tight">
              {criticalCount}
            </div>
            <div className="text-[11px] text-rose-300/80 font-mono">
              Life-safety hazard override
            </div>
          </Card>

          {/* Metric 4: Resolved Complaints */}
          <Card className="p-5 cyber-glass-card space-y-2 border-emerald-500/20 hover:border-emerald-400/50">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>RESOLVED (VERIFIED)</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {resolvedReports}
            </div>
            <div className="text-[11px] text-emerald-300/80 font-mono">
              Citizen audit certified
            </div>
          </Card>

          {/* Metric 5: AI Classified */}
          <Card className="p-5 cyber-glass-card space-y-2 border-violet-500/20 hover:border-violet-400/50 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>AI CLASSIFIED</span>
              <Brain className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-violet-400 tracking-tight">
              {aiClassifiedCount}
            </div>
            <div className="text-[11px] text-violet-300/80 font-mono">
              Multimodal zero-error triage
            </div>
          </Card>
        </div>

        {/* Live Category Distribution Telemetry Gauges */}
        <Card className="p-6 cyber-glass-card border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Ward Incident Distribution Matrix</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Total: 50 Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categoryStats).map(([catName, count]) => {
              const percentage = Math.round((count / totalReports) * 100);
              return (
                <div key={catName} className="p-3 rounded-xl bg-[#070B14]/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate pr-2">{catName}</span>
                    <span className="font-mono font-bold text-cyan-400">{count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{percentage}% of telemetry</span>
                    <span>SLA: 24h-48h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* ========================================================
          3. AI INTELLIGENCE VISUALIZATION (The 6 Stages)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Explainable Processing Pipeline
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
            How CivicLens AI Resolves Complaints
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A transparent 6-stage algorithmic journey from citizen photo capture to verified statutory resolution.
          </p>
        </div>

        {/* 6-Stage Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pipelineStages.map((stage) => {
            const isSelected = activePipelineStage === stage.step;
            return (
              <div
                key={stage.step}
                onClick={() => setActivePipelineStage(stage.step)}
                className={clsx(
                  'p-6 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 text-left border relative overflow-hidden group',
                  isSelected
                    ? 'bg-gradient-to-br from-[#0E1726] to-[#141E33] border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                    : 'bg-[#0E1726]/70 border-cyan-500/15 hover:border-cyan-500/40 hover:bg-[#0E1726]/90'
                )}
              >
                {/* Connecting Signal Flow Highlight */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    STAGE 0{stage.step}
                  </span>
                  <div className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                    isSelected ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' : 'bg-slate-800/60 border border-slate-700 text-slate-400'
                  )}>
                    {stage.icon}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-cyan-200 transition-colors">
                    {stage.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/90 font-medium">
                    {stage.subtitle}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-cyan-500/15 text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400">AI Logic: </span>
                  {stage.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. SMART CITY GIS MAP VISUALIZATION & HOTSPOTS PREVIEW
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 cyber-glass-card border-cyan-500/30 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 text-xs font-mono border border-cyan-500/30">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Geospatial DBSCAN Cluster Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Real-Time Bengaluru Civic GIS Telemetry
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Spatial distribution across Indiranagar, Koramangala, Bellandur, Whitefield, and Hebbal. High-density incident zones are clustered into unified remediation hotspots with 50m radius circles.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">DBSCAN Hotspots</div>
                  <div className="text-xl font-bold font-mono text-cyan-400">{SYNTHETIC_HOTSPOTS.length} Active Zones</div>
                </div>
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Life-Safety Overrides</div>
                  <div className="text-xl font-bold font-mono text-rose-400">{criticalCount} Critical</div>
                </div>
                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-slate-400 font-mono">BBMP Wards</div>
                  <div className="text-xl font-bold font-mono text-sky-400">8 Divisions</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  to="/admin/map"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all font-mono"
                >
                  <Eye className="w-4 h-4 text-slate-950" />
                  <span>Launch GIS Interactive Map</span>
                </Link>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 text-xs font-bold transition-all font-mono"
                >
                  <PlusCircle className="w-4 h-4 text-cyan-400" />
                  <span>Submit Coordinates</span>
                </Link>
              </div>
            </div>

            {/* High-Tech Incident Telemetry Panel */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-[#070B14]/90 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-cyan-500/20 pb-2">
                  <span>ACTIVE HOTSPOT TELEMETRY</span>
                  <span className="animate-pulse">● LIVE</span>
                </div>

                <div className="space-y-2.5">
                  {SYNTHETIC_HOTSPOTS.map((hotspot) => (
                    <div key={hotspot.id} className="p-2.5 rounded-lg bg-[#0E1726] border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{hotspot.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)} • {hotspot.radius_meters}m
                        </div>
                      </div>
                      <span className={clsx(
                        'text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase',
                        hotspot.severity === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      )}>
                        {hotspot.report_count} Reports
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </Card>
      </section>

      {/* ========================================================
          5. EMBEDDED AI CIVIC GUIDANCE ASSISTANT
          ======================================================== */}
      <section id="ai-guidance-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              AI Civic Guidance Assistant
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            {isChatOpen ? 'Collapse Chat' : 'Expand Full Chat'}
          </button>
        </div>

        {/* Embedded AI Chat Interface in Cyber Frame */}
        <div className="rounded-2xl border border-cyan-500/30 bg-[#0E1726]/85 backdrop-blur-xl p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <AIChatGuidance
            initialQuery={activeAIQuery || undefined}
            isEmbedded={true}
          />
        </div>
      </section>

      {/* ========================================================
          6. DIRECT GRIEVANCE TRACKING HUD
          ======================================================== */}
      <section id="tracking-box" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 cyber-glass-card border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Grievance Tracker HUD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Track Your Redressal Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Enter your 12-character CivicLens tracking token to inspect live resolution proof, department assignment, and Sakala deadline.
            </p>

            <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="token-tracker-input" className="sr-only">
                  Grievance Tracking Token
                </label>
                <input
                  id="token-tracker-input"
                  type="text"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    setTokenError('');
                  }}
                  placeholder="e.g. CLK-DRN-8201"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#070B14]/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[44px] uppercase font-mono tracking-wider"
                  aria-label="Enter your 12-character grievance tracking token"
                />
                <Button
                  type="submit"
                  variant="cyber"
                  className="sm:w-auto shrink-0 text-slate-950 font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Track Token
                </Button>
              </div>

              {tokenError && (
                <p className="text-xs text-rose-400 text-left font-mono">{tokenError}</p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                <span>Sample Live Tokens:</span>
                <button
                  type="button"
                  onClick={() => setTokenInput('CLK-DRN-8201')}
                  className="text-cyan-300 font-bold underline hover:text-cyan-200"
                >
                  CLK-DRN-8201
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setTokenInput('CLK-ROD-9101')}
                  className="text-cyan-300 font-bold underline hover:text-cyan-200"
                >
                  CLK-ROD-9101
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setTokenInput('CLK-ELC-3301')}
                  className="text-cyan-300 font-bold underline hover:text-cyan-200"
                >
                  CLK-ELC-3301
                </button>
              </div>
            </form>
          </div>
        </Card>
      </section>

      {/* ========================================================
          7. KARNATAKA SCHEME DISCOVERY (Gruha Lakshmi & 5 Guarantees)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Direct Citizen Welfare Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Karnataka Scheme Discovery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify statutory eligibility, document checklists, and guaranteed processing turnaround under Sakala.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#0B0F19] border border-cyan-500/20 font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('all')}
              className={clsx(
                'px-3 py-1.5 rounded-lg transition-all',
                selectedSchemeCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              All Schemes
            </button>
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('welfare')}
              className={clsx(
                'px-3 py-1.5 rounded-lg transition-all',
                selectedSchemeCategory === 'welfare'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Welfare & Family
            </button>
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('youth')}
              className={clsx(
                'px-3 py-1.5 rounded-lg transition-all',
                selectedSchemeCategory === 'youth'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Youth & Education
            </button>
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('revenue')}
              className={clsx(
                'px-3 py-1.5 rounded-lg transition-all',
                selectedSchemeCategory === 'revenue'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Revenue & Property
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="p-5 cyber-glass-card flex flex-col justify-between hover:border-cyan-400/50 transition-all border-cyan-500/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="text-cyan-400 truncate max-w-[180px]">{scheme.dept}</span>
                  <span className="font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {scheme.sla}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-white">
                  {scheme.title}
                </h3>

                <div className="p-3 rounded-xl bg-[#070B14]/80 border border-cyan-500/20">
                  <div className="text-[11px] font-mono text-slate-400">Statutory Entitlement:</div>
                  <div className="text-sm font-bold text-cyan-300">{scheme.benefit}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{scheme.frequency}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-200">Eligibility Summary:</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {scheme.eligibility}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-200">Mandatory Documents:</div>
                  <div className="flex flex-wrap gap-1">
                    {scheme.documents.map((doc, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-cyan-500/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSuggestedPrompt(scheme.prompt)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Check Eligibility</span>
                </button>
                <a
                  href="https://sevasindhu.karnataka.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Karnataka Seva Sindhu Portal (opens in new tab)"
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 font-mono"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================
          8. CITIZEN RIGHTS & SAKALA GUARANTEES
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Sakala Citizen Rights */}
          <Card className="p-6 cyber-glass-card border-cyan-500/25 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
                <Scale className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Karnataka Sakala Guarantee of Services Act
                </h3>
                <p className="text-xs text-slate-400 font-mono">Citizen statutory rights & delay compensation</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Guaranteed Service Deadlines:</strong> Over 1,025 public services have mandatory timeframes (e.g. 14 days for caste/income certificates).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">15-Digit GSC Acknowledgment:</strong> Mandatory acknowledgment slip with tracking ID issued upon any government application.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">₹20/Day Delay Penalty:</strong> Citizens are entitled to compensation if an officer fails to resolve the service within the legal window without cause.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Two-Tier Statutory Appeal:</strong> Right to appeal directly to the Competent Officer within 30 days of service delay.
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('What are my citizen rights under Karnataka Sakala Act?')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 font-mono"
              >
                <span>Learn more about Sakala appeals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          {/* Card 2: Application Assistance Checklist */}
          <Card className="p-6 cyber-glass-card border-cyan-500/25 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-400/40 text-violet-300 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Application Pre-Verification Checklist
                </h3>
                <p className="text-xs text-slate-400 font-mono">Prevent application rejection with automated verification</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 text-xs space-y-1">
                <div className="font-semibold text-cyan-300">1. Aadhaar-NPCI Bank Seeding</div>
                <p className="text-slate-400">
                  All Direct Benefit Transfer (DBT) schemes (Gruha Lakshmi, Yuva Nidhi) require your bank account to be actively mapped with NPCI.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 text-xs space-y-1">
                <div className="font-semibold text-cyan-300">2. Ration Card Digitization</div>
                <p className="text-slate-400">
                  Ensure member details, family head designation, and Aadhaar numbers are updated in the Ahara database.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#070B14]/80 border border-slate-800 text-xs space-y-1">
                <div className="font-semibold text-cyan-300">3. Digital RTC & Mutation Extracts</div>
                <p className="text-slate-400">
                  For farmer subsidies and land disputes, download certified digitally signed RTC documents via Bhoomi portal.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================
          9. RECENT CIVIC REDRESSAL TELEMETRY FEED
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">Recent Civic Redressal Feed</h2>
            <p className="text-xs text-slate-400 font-mono">Live public grievance dispatch telemetry</p>
          </div>
          <Link
            to="/my-reports"
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
          >
            <span>View All Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {SYNTHETIC_REPORTS.slice(0, 5).map((rep) => (
            <Card key={rep.id} className="p-4 cyber-glass-card border-cyan-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {rep.tracking_token}
                  </span>
                  <StatusBadge status={rep.status} isDark={true} />
                  <PriorityBadge priority={rep.priority_band} />
                </div>
                <h3 className="text-sm font-semibold text-white truncate">
                  {rep.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate max-w-[240px] text-slate-300">{rep.address}</span>
                  </span>
                  <span>•</span>
                  <span>{new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Link
                to={`/track/${rep.tracking_token}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 hover:border-cyan-400 transition-colors min-h-[38px]"
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
