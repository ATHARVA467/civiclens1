import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n, CATEGORY_TRANSLATIONS } from '@/lib/i18n';
import { SYNTHETIC_REPORTS } from '@/lib/syntheticData';
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
  Compass,
  FileText,
  HelpCircle,
  Award,
  BookOpen,
  Users,
  Check,
  ExternalLink,
  Scale,
  Building2,
  PhoneCall,
  MessageSquareQuote
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveAIQuery(searchQuery.trim());
    setIsChatOpen(true);
    // Smooth scroll to chat panel
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

  // 1. Government Service Categories
  const serviceCategories = [
    {
      id: 'welfare',
      name: 'Welfare & Social Security',
      kannada: 'ಕಲ್ಯಾಣ ಮತ್ತು ಸಾಮಾಜಿಕ ಭದ್ರತೆ',
      desc: 'Gruha Lakshmi, Anna Bhagya, pensions, and direct benefit transfers (DBT).',
      icon: <Users className="w-5 h-5 text-[#294563]" />,
      badge: '5 Guarantee Schemes',
      actionPrompt: 'How to check Gruha Lakshmi and Anna Bhagya status?'
    },
    {
      id: 'grievance',
      name: 'Municipal Grievances & Infrastructure',
      kannada: 'ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಮೂಲಸೌಕರ್ಯ',
      desc: 'Road potholes, stormwater drainage, garbage clearing, and streetlights.',
      icon: <Layers className="w-5 h-5 text-[#7189A4]" />,
      badge: 'CivicLens AI Triage',
      actionPrompt: 'Report an open pothole or waterlogging on my road'
    },
    {
      id: 'revenue',
      name: 'Revenue & Land Records',
      kannada: 'ಕಂದಾಯ ಮತ್ತು ಭೂ ದಾಖಲೆಗಳು',
      desc: 'Kaveri 2.0 property registrations, Bhoomi RTC/Pahani, and Khata extracts.',
      icon: <FileText className="w-5 h-5 text-[#7C9B85]" />,
      badge: 'Kaveri 2.0 / Bhoomi',
      actionPrompt: 'How to download Bhoomi RTC and property Encumbrance Certificate?'
    },
    {
      id: 'certificates',
      name: 'Certificates & Nadakacheri',
      kannada: 'ಪ್ರಮಾಣಪತ್ರಗಳು ಮತ್ತು ನಾಡಕಚೇರಿ',
      desc: 'Income certificates, caste certificates, domicile, and residency proofs.',
      icon: <Award className="w-5 h-5 text-[#B9853F]" />,
      badge: '14-Day Sakala SLA',
      actionPrompt: 'Documents required for Income and Caste Certificate'
    },
    {
      id: 'health',
      name: 'Health & Medical Assistance',
      kannada: 'ಆರೋಗ್ಯ ಮತ್ತು ವೈದ್ಯಕೀಯ ನೆರವು',
      desc: 'Ayushman Bharat Arogya Karnataka, primary health centers, and maternal benefits.',
      icon: <ShieldCheck className="w-5 h-5 text-[#4F8665]" />,
      badge: 'Cashless Care',
      actionPrompt: 'How to obtain Ayushman Bharat Arogya Karnataka card?'
    },
    {
      id: 'rights',
      name: 'Citizen Rights & Sakala Services',
      kannada: 'ನಾಗರಿಕ ಹಕ್ಕುಗಳು ಮತ್ತು ಸಕಾಲ ಸೇವೆಗಳು',
      desc: 'Guaranteed delivery deadlines, tracking rights, and statutory appeal procedures.',
      icon: <Scale className="w-5 h-5 text-[#294563]" />,
      badge: 'Statutory Guarantee',
      actionPrompt: 'What are my citizen rights under Karnataka Sakala Act?'
    }
  ];

  // 2. Verified Scheme Discovery Cards
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

  // Live city pulse metrics from demonstration data
  const totalReports = SYNTHETIC_REPORTS.length;
  const resolvedReports = SYNTHETIC_REPORTS.filter(r => r.status === 'Resolved').length;
  const criticalCount = SYNTHETIC_REPORTS.filter(r => r.priority_band === 'Critical').length;
  const inProgressCount = SYNTHETIC_REPORTS.filter(r => r.status === 'In Progress').length;

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

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section — CIVIC CLARITY Style */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E7E9E5] bg-gradient-to-b from-white via-[#F8F8F5]/80 to-[#F8F8F5]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#294563]/10 text-[#294563] text-xs font-semibold tracking-wide border border-[#294563]/15">
            <Compass className="w-3.5 h-3.5 text-[#294563]" />
            <span>CivicLens AI • Karnataka Public Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#294563] tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Government services, made simpler.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-[#687887] max-w-2xl mx-auto leading-relaxed font-normal">
            Understand government services, discover schemes, and get reliable guidance with AI.
          </p>

          {/* Prominent AI Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <Card className="p-2 sm:p-2.5 rounded-2xl border border-[#E7E9E5] shadow-soft-lg bg-white">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center px-3.5 gap-2.5 min-h-[46px]">
                  <Search className="w-5 h-5 text-[#7189A4] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask about Gruha Lakshmi, income certificate, pothole repair..."
                    className="w-full text-sm sm:text-base text-[#253342] placeholder:text-[#687887]/80 bg-transparent focus:outline-none"
                    aria-label="Civic guidance search query"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="sm:w-auto shrink-0 shadow-sm"
                  rightIcon={<Sparkles className="w-4 h-4 text-[#8EA8C2]" />}
                >
                  Ask CivicLens
                </Button>
              </form>
            </Card>

            {/* Suggested Question Chips */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#687887] font-medium hidden sm:inline">Suggested:</span>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('How to apply for Gruha Lakshmi scheme?')}
                className="px-2.5 py-1 rounded-full bg-white border border-[#E7E9E5] text-[#253342] hover:border-[#294563] hover:bg-[#F1F3EF] transition-all"
              >
                Gruha Lakshmi ₹2,000
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('Documents required for Income and Caste certificate')}
                className="px-2.5 py-1 rounded-full bg-white border border-[#E7E9E5] text-[#253342] hover:border-[#294563] hover:bg-[#F1F3EF] transition-all"
              >
                Income Certificate Checklist
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('How to report a hazardous pothole or flooded drain?')}
                className="px-2.5 py-1 rounded-full bg-white border border-[#E7E9E5] text-[#253342] hover:border-[#294563] hover:bg-[#F1F3EF] transition-all"
              >
                Report Pothole / Drainage
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('What are my citizen rights under Karnataka Sakala Act?')}
                className="px-2.5 py-1 rounded-full bg-white border border-[#E7E9E5] text-[#253342] hover:border-[#294563] hover:bg-[#F1F3EF] transition-all"
              >
                Sakala Citizen Rights
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/report')}
              leftIcon={<PlusCircle className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-md"
            >
              Lodge a Civic Complaint
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
              Track Existing Issue
            </Button>
          </div>
        </div>
      </section>

      {/* AI Guidance & Conversation Section (Interactive Drawer / Panel) */}
      <section id="ai-guidance-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#294563]" />
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#294563]">
              AI Civic Guidance Assistant
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-xs font-semibold text-[#294563] hover:underline"
          >
            {isChatOpen ? 'Collapse Chat' : 'Open Full Chat'}
          </button>
        </div>

        {/* Embedded AI Chat Interface */}
        <AIChatGuidance
          initialQuery={activeAIQuery || undefined}
          isEmbedded={true}
        />
      </section>

      {/* Government Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="text-xs font-bold text-[#7189A4] uppercase tracking-widest">
            Streamlined Public Services
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#294563]">
            Government Service Categories
          </h2>
          <p className="text-sm text-[#687887]">
            Find the right department, explore guaranteed service delivery times, and get step-by-step guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCategories.map((category) => (
            <Card
              key={category.id}
              className="p-5 soft-card flex flex-col justify-between hover:border-[#7189A4]/60 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] border border-[#E7E9E5] flex items-center justify-center">
                    {category.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#294563]/10 text-[#294563]">
                    {category.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-heading text-[#294563] group-hover:text-[#1f344b]">
                    {category.name}
                  </h3>
                  {lang === 'kn' && (
                    <div className="text-xs font-medium text-[#7189A4] mt-0.5">
                      {category.kannada}
                    </div>
                  )}
                  <p className="text-xs text-[#687887] leading-relaxed mt-1">
                    {category.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#E7E9E5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSuggestedPrompt(category.actionPrompt)}
                  className="text-xs font-semibold text-[#294563] group-hover:text-[#1f344b] inline-flex items-center gap-1 hover:underline"
                >
                  <span>Explore Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                {category.id === 'grievance' && (
                  <Link
                    to="/report"
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#294563] text-white hover:bg-[#1f344b]"
                  >
                    Lodge Issue
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Scheme Discovery Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold text-[#7189A4] uppercase tracking-widest">
              Direct Welfare & Citizen Benefits
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#294563]">
              Karnataka Scheme Discovery
            </h2>
            <p className="text-sm text-[#687887] mt-1">
              Verify eligibility, document checklists, and guaranteed processing turnaround.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#F1F3EF] border border-[#E7E9E5]">
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('all')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                selectedSchemeCategory === 'all'
                  ? 'bg-white text-[#294563] shadow-soft-sm'
                  : 'text-[#687887] hover:text-[#253342]'
              )}
            >
              All Schemes
            </button>
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('welfare')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                selectedSchemeCategory === 'welfare'
                  ? 'bg-white text-[#294563] shadow-soft-sm'
                  : 'text-[#687887] hover:text-[#253342]'
              )}
            >
              Welfare & Family
            </button>
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('youth')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                selectedSchemeCategory === 'youth'
                  ? 'bg-white text-[#294563] shadow-soft-sm'
                  : 'text-[#687887] hover:text-[#253342]'
              )}
            >
              Youth & Education
            </button>
            <button
              type="button"
              onClick={() => setSelectedSchemeCategory('revenue')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                selectedSchemeCategory === 'revenue'
                  ? 'bg-white text-[#294563] shadow-soft-sm'
                  : 'text-[#687887] hover:text-[#253342]'
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
              className="p-5 soft-card flex flex-col justify-between hover:border-[#7189A4]/60 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#687887]">
                  <span className="font-medium text-[#7189A4]">{scheme.dept}</span>
                  <span className="font-semibold text-[#4F8665] bg-[#7C9B85]/15 px-2 py-0.5 rounded">
                    {scheme.sla}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-[#294563]">
                  {scheme.title}
                </h3>

                <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E7E9E5]">
                  <div className="text-xs font-medium text-[#687887]">Statutory Entitlement:</div>
                  <div className="text-sm font-bold text-[#294563]">{scheme.benefit}</div>
                  <div className="text-[11px] text-[#7189A4]">{scheme.frequency}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#253342]">Eligibility Summary:</div>
                  <p className="text-xs text-[#687887] leading-relaxed">
                    {scheme.eligibility}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#253342]">Mandatory Documents:</div>
                  <div className="flex flex-wrap gap-1">
                    {scheme.documents.map((doc, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E7E9E5] text-[#253342]"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#E7E9E5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSuggestedPrompt(scheme.prompt)}
                  className="text-xs font-semibold text-[#294563] hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7189A4]" />
                  <span>Check Eligibility</span>
                </button>
                <a
                  href="https://sevasindhu.karnataka.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#7189A4] hover:text-[#294563] inline-flex items-center gap-1"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Complaint & Grievance Guidance Section (Preserving CivicLens Engine) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 rounded-2xl bg-[#294563] text-white border-0 shadow-soft-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#8EA8C2] text-xs font-semibold border border-white/15">
                <Compass className="w-3.5 h-3.5" />
                <span>AI-Powered Redressal Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Have a public issue in your ward or village?
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                CivicLens AI transforms scattered citizen complaints into explainable, prioritized civic actions. Take a photo, verify the auto-detected location, and submit in 45 seconds.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/report')}
                  className="bg-white text-[#294563] hover:bg-[#F1F3EF] shadow-md border-0"
                  leftIcon={<PlusCircle className="w-5 h-5 text-[#294563]" />}
                >
                  Lodge Civic Grievance
                </Button>
                <Link
                  to="/admin/overview"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors border border-white/20"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8EA8C2]" />
                  <span>Officer Command Centre</span>
                </Link>
              </div>
            </div>

            {/* Direct Tracking Form Box */}
            <div id="tracking-box" className="lg:col-span-5">
              <Card className="p-5 rounded-2xl bg-white text-[#253342] shadow-soft">
                <form onSubmit={handleTrackSubmit} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#294563] uppercase tracking-wider">
                    <Search className="w-4 h-4 text-[#7189A4]" />
                    <span>Real-Time Grievance Tracker</span>
                  </div>
                  <p className="text-xs text-[#687887]">
                    Enter your 12-character CivicLens tracking token to inspect live resolution progress.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => {
                        setTokenInput(e.target.value);
                        setTokenError('');
                      }}
                      placeholder="e.g. CLK-DRN-8201"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#E7E9E5] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px] uppercase font-mono"
                      aria-label="Tracking Token Input"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="sm:w-auto shrink-0"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Track
                    </Button>
                  </div>
                  {tokenError && (
                    <p className="text-xs text-[#B85D5D] text-left">{tokenError}</p>
                  )}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#687887]">
                    <span>Sample tokens:</span>
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
        </Card>
      </section>

      {/* Citizen Rights & Application Assistance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Sakala Citizen Rights */}
          <Card className="p-6 soft-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#294563] text-white flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#8EA8C2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-[#294563]">
                  Karnataka Sakala Guarantee of Services Act
                </h3>
                <p className="text-xs text-[#687887]">Citizen statutory rights & delay compensations</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-[#253342] leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#4F8665] shrink-0 mt-0.5" />
                <span>
                  <strong>Guaranteed Service Deadlines:</strong> Over 1,025 public services have mandatory timeframes (e.g. 14 days for caste/income certificates).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#4F8665] shrink-0 mt-0.5" />
                <span>
                  <strong>15-Digit GSC Acknowledgment:</strong> Mandatory acknowledgment slip with tracking ID issued upon any government application.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#4F8665] shrink-0 mt-0.5" />
                <span>
                  <strong>₹20/Day Delay Penalty:</strong> Citizens are entitled to compensation if an officer fails to resolve the service within the legal window without cause.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#4F8665] shrink-0 mt-0.5" />
                <span>
                  <strong>Two-Tier Statutory Appeal:</strong> Right to appeal directly to the Competent Officer within 30 days of service delay.
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSuggestedPrompt('What are my citizen rights under Karnataka Sakala Act?')}
                className="text-xs font-semibold text-[#294563] hover:underline inline-flex items-center gap-1"
              >
                <span>Learn more about Sakala appeals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          {/* Card 2: 3-Step Application Assistance */}
          <Card className="p-6 soft-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C9B85] text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-[#294563]">
                  Application Checklist & Assistance
                </h3>
                <p className="text-xs text-[#687887]">Prevent application rejections with pre-verification</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E7E9E5] text-xs space-y-1">
                <div className="font-semibold text-[#294563]">1. Aadhaar-NPCI Bank Seeding</div>
                <p className="text-[#687887]">
                  All Direct Benefit Transfer (DBT) schemes (Gruha Lakshmi, Yuva Nidhi) require your bank account to be actively mapped with NPCI.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E7E9E5] text-xs space-y-1">
                <div className="font-semibold text-[#294563]">2. Ration Card Digitization</div>
                <p className="text-[#687887]">
                  Ensure member details, family head designation, and Aadhaar numbers are updated in the Ahara database.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E7E9E5] text-xs space-y-1">
                <div className="font-semibold text-[#294563]">3. Digital RTC & Mutation Extracts</div>
                <p className="text-[#687887]">
                  For farmer subsidies and land disputes, download certified digitally signed RTC documents via Bhoomi portal.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works — 3-Step Editorial Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold text-[#7189A4] uppercase tracking-widest">
            Simple 3-Step Process
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#294563]">
            How CivicLens Works
          </h2>
          <p className="text-sm text-[#687887]">
            From query to verification to accountable action in three transparent stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 soft-card space-y-3 text-left relative">
            <span className="font-mono text-xs font-extrabold text-[#7189A4]">STEP 01</span>
            <div className="w-12 h-12 rounded-xl bg-[#294563]/10 text-[#294563] flex items-center justify-center">
              <Search className="w-6 h-6 text-[#294563]" />
            </div>
            <h3 className="text-lg font-bold font-heading text-[#294563]">
              Ask or Discover
            </h3>
            <p className="text-xs text-[#687887] leading-relaxed">
              Use our AI guidance search to identify the right government scheme, verify eligibility conditions, or capture a photo of a civic issue.
            </p>
          </Card>

          <Card className="p-6 soft-card space-y-3 text-left relative">
            <span className="font-mono text-xs font-extrabold text-[#7189A4]">STEP 02</span>
            <div className="w-12 h-12 rounded-xl bg-[#7189A4]/15 text-[#7189A4] flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#7189A4]" />
            </div>
            <h3 className="text-lg font-bold font-heading text-[#294563]">
              AI Triage & Verification
            </h3>
            <p className="text-xs text-[#687887] leading-relaxed">
              Gemini AI analyzes imagery, checks document requirements, filters duplicates, and scores severity with 100% explainable metrics.
            </p>
          </Card>

          <Card className="p-6 soft-card space-y-3 text-left relative">
            <span className="font-mono text-xs font-extrabold text-[#7189A4]">STEP 03</span>
            <div className="w-12 h-12 rounded-xl bg-[#7C9B85]/20 text-[#4F8665] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#4F8665]" />
            </div>
            <h3 className="text-lg font-bold font-heading text-[#294563]">
              Accountable Resolution
            </h3>
            <p className="text-xs text-[#687887] leading-relaxed">
              Assigned directly to ward engineers or portal officers. Track live updates until completion with citizen verification before closure.
            </p>
          </Card>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-[#F1F3EF] border border-[#E7E9E5] text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-[#7189A4] uppercase tracking-widest">
              Security & Public Trust
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#294563]">
              Built for Transparency & Public Accountability
            </h2>
            <p className="text-xs sm:text-sm text-[#687887]">
              CivicLens AI is designed to uphold citizen dignity, protect privacy, and accelerate redressal without algorithmic opacity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white border border-[#E7E9E5]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#294563]">{totalReports}</div>
              <div className="text-xs font-semibold text-[#253342] mt-1">Grievances Tracked</div>
              <div className="text-[11px] text-[#687887]">Demonstration registry</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E7E9E5]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#B9853F]">{inProgressCount}</div>
              <div className="text-xs font-semibold text-[#253342] mt-1">Under Active Field Work</div>
              <div className="text-[11px] text-[#687887]">Municipal engineer triage</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E7E9E5]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#B85D5D]">{criticalCount}</div>
              <div className="text-xs font-semibold text-[#253342] mt-1">High Severity Alerts</div>
              <div className="text-[11px] text-[#687887]">Safety hazards flagged</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E7E9E5]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#4F8665]">{resolvedReports}</div>
              <div className="text-xs font-semibold text-[#253342] mt-1">Verified Resolved</div>
              <div className="text-[11px] text-[#687887]">Closed with evidence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Public Reports Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-[#294563]">Recent Civic Redressal Feed</h2>
            <p className="text-xs text-[#687887]">Real-time public grievance resolution tracking</p>
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
                <h3 className="text-sm font-semibold text-[#253342] truncate">
                  {rep.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#687887]">
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
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#E7E9E5] text-xs font-semibold text-[#294563] hover:bg-[#F1F3EF] transition-colors min-h-[38px]"
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
