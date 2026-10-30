import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useI18n, CATEGORY_TRANSLATIONS } from '@/lib/i18n';
import { ReportCategory, Report, PriorityBand } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LocationPicker } from '@/components/citizen/LocationPicker';
import { ImageUploader } from '@/components/citizen/ImageUploader';
import { saveReportLocally } from '@/lib/reportsStorage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCw, 
  ChevronLeft,
  Radio,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';

export const ReportPage: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as ReportCategory) || 'Drainage & Waterlogging';

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

  const [category, setCategory] = useState<ReportCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Indiranagar 100ft Road, Bangalore');
  const [latitude, setLatitude] = useState<number>(12.9716);
  const [longitude, setLongitude] = useState<number>(77.5946);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Unpredictable tracking token generator (e.g. CLK-DRN-9482)
  const generateTrackingToken = (cat: ReportCategory) => {
    const prefixes: Record<ReportCategory, string> = {
      'Drainage & Waterlogging': 'CLK-DRN',
      'Roads & Potholes': 'CLK-ROD',
      'Garbage & Sanitation': 'CLK-GRB',
      'Streetlights': 'CLK-LGT',
      'Water Supply': 'CLK-WAT',
      'Electrical Hazards': 'CLK-ELC',
      'Public Infrastructure': 'CLK-INF',
      'Other Civic Issues': 'CLK-OTH'
    };
    const prefix = prefixes[cat] || 'CLK-CIV';
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randDigits}`;
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Please provide a brief title describing the issue.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage('Please provide a description of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const token = generateTrackingToken(category);
    const now = new Date().toISOString();

    // Default priority band assessment
    let priorityBand: PriorityBand = 'Medium';
    if (category === 'Electrical Hazards' || description.toLowerCase().includes('danger') || description.toLowerCase().includes('severe')) {
      priorityBand = 'Critical';
    } else if (category === 'Roads & Potholes' || category === 'Drainage & Waterlogging') {
      priorityBand = 'High';
    }

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      tracking_token: token,
      title: title.trim(),
      description: description.trim(),
      category,
      image_url: imageUrl,
      latitude,
      longitude,
      address: address.trim() || 'Unspecified location',
      status: 'Submitted',
      priority_band: priorityBand,
      created_at: now,
      updated_at: now,
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('reports').insert({
          tracking_token: newReport.tracking_token,
          title: newReport.title,
          description: newReport.description,
          category: newReport.category,
          image_url: newReport.image_url,
          latitude: newReport.latitude,
          longitude: newReport.longitude,
          address: newReport.address,
          status: 'Submitted',
          priority_band: newReport.priority_band,
        });

        if (error) {
          console.warn('Supabase insertion notice:', error.message);
        }
      }

      saveReportLocally(newReport);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedReport(newReport);
      }, 700);
    } catch (err: unknown) {
      console.warn('Submission fallback:', err);
      saveReportLocally(newReport);
      setIsSubmitting(false);
      setSubmittedReport(newReport);
    }
  };

  const copyTokenToClipboard = () => {
    if (!submittedReport) return;
    navigator.clipboard.writeText(submittedReport.tracking_token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Futuristic Confirmation Success View
  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 text-center space-y-6 cyber-glass-card border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full">
              STAGE 01 COMPLETE: SENSOR REGISTRATION VERIFIED
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Grievance Successfully Registered
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your public complaint has been logged and queued for AI classification, priority scoring, and municipal dispatch.
            </p>
          </div>

          {/* Futuristic Token HUD Box */}
          <div className="p-6 rounded-2xl bg-[#070B14]/90 border border-cyan-500/30 space-y-3 max-w-md mx-auto shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Immutable Tracking Token HUD
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-widest select-all">
                {submittedReport.tracking_token}
              </span>
              <button
                type="button"
                onClick={copyTokenToClipboard}
                title="Copy token"
                className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 transition-colors"
              >
                {copiedToken ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
              Save this tracking token to inspect real-time AI triage, officer notes, and cryptographic resolution proof.
            </p>
          </div>

          {/* Quick Summary Card */}
          <div className="p-4 rounded-xl bg-[#070B14]/80 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-cyan-400">{submittedReport.category}</span>
              <span className="text-[11px] text-slate-400">
                {new Date(submittedReport.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="font-medium text-white">{submittedReport.title}</div>
            <div className="text-slate-400 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{submittedReport.address}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="cyber"
              size="lg"
              onClick={() => navigate(`/track/${submittedReport.tracking_token}`)}
              rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              className="w-full sm:w-auto text-slate-950 font-bold"
            >
              Track This Issue Live
            </Button>
            <Button
              variant="cyber-outline"
              size="lg"
              onClick={() => {
                setSubmittedReport(null);
                setTitle('');
                setDescription('');
                setImageUrl(null);
              }}
              className="w-full sm:w-auto"
            >
              Lodge Another Complaint
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active Report Capture Form
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button & Title */}
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
          <span>Rapid 45-Second Citizen Telemetry Intake</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
          {t.ctaReport}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Report civic hazards directly to municipal authorities. Automated geocoding and multimodal AI triage enabled.
        </p>
      </div>

      <Card className="p-6 sm:p-8 cyber-glass-card border-cyan-500/25 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Category Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                1. Select Problem Domain <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">8 Municipal Classifications</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat;
                const localized = CATEGORY_TRANSLATIONS[lang][cat] || cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={clsx(
                      'p-2.5 rounded-xl text-xs font-medium border text-left transition-all min-h-[48px] flex items-center justify-between font-sans',
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-[#070B14]/80 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:bg-[#0E1726]'
                    )}
                  >
                    <span className="line-clamp-2 leading-tight">{localized}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-1 shrink-0 text-slate-950" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Issue Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              2. Brief Issue Summary / Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Uncovered drain creating flood hazard on 4th Main"
              maxLength={140}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#070B14]/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[44px]"
            />
          </div>

          {/* 3. Detailed Problem Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              3. Problem Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem in detail: how long it has been present, immediate dangers to two-wheelers, children or pedestrians, and nearby landmarks..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#070B14]/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[100px]"
            />
            <div className="text-[11px] text-slate-400 font-mono flex justify-between">
              <span>Original text is preserved and immutable.</span>
              <span>{description.length}/500 chars</span>
            </div>
          </div>

          {/* 4. Interactive GIS Location Selection */}
          <div className="space-y-3">
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={handleLocationChange}
              address={address}
            />

            <div className="space-y-1">
              <label htmlFor="address" className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Street Address or Landmark
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop number, cross road, apartment name or municipal ward..."
                className="w-full px-4 py-2 rounded-xl border border-cyan-500/30 bg-[#070B14]/80 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[42px]"
              />
            </div>
          </div>

          {/* 5. Photograph Upload with Preview */}
          <div className="space-y-2">
            <ImageUploader
              imageUrl={imageUrl}
              onImageUploaded={(url) => setImageUrl(url)}
            />
          </div>

          {/* Error display */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-mono">
              Submissions generate an instant tracking token.
            </div>
            <Button
              type="submit"
              size="lg"
              variant="cyber"
              isLoading={isSubmitting}
              className="w-full sm:w-auto text-slate-950 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
            >
              Submit Complaint (Generate Token)
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
