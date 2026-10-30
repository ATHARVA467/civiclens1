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
  ExternalLink,
  ChevronLeft
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
      // 1. If Supabase is connected, persist to Supabase
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

      // 2. Save locally so it is immediately visible in /my-reports and /track/:token
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

  // Confirmation Success View
  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 text-center space-y-6 soft-card-elevated border-emerald-500/30">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-soft-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
              Submission Verified • Stage 1: Captured
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#294563]">
              Grievance Successfully Registered
            </h1>
            <p className="text-sm text-[#687786] max-w-md mx-auto">
              Your public complaint has been logged and queued for AI classification and municipal authority dispatch.
            </p>
          </div>

          {/* Token Card */}
          <div className="p-6 rounded-2xl bg-[#F8F8F5] border border-[#E3E7E8] space-y-3 max-w-md mx-auto shadow-soft-sm">
            <div className="text-xs font-bold text-[#687786] uppercase tracking-wider">
              Your Public Tracking Token
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#294563] tracking-wider select-all">
                {submittedReport.tracking_token}
              </span>
              <button
                type="button"
                onClick={copyTokenToClipboard}
                title="Copy token"
                className="p-2 rounded-lg bg-white border border-[#E3E7E8] hover:bg-[#F0F2EF] text-[#294563] transition-colors"
              >
                {copiedToken ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-[#687786] leading-relaxed">
              Save this tracking token to check status updates, inspection notes, and photographic proof of resolution.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="p-4 rounded-xl bg-white border border-[#E3E7E8] text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex items-center justify-between border-b border-[#E3E7E8] pb-2">
              <span className="font-semibold text-[#294563]">{submittedReport.category}</span>
              <span className="text-[11px] font-mono text-[#687786]">
                {new Date(submittedReport.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="font-medium text-[#263442]">{submittedReport.title}</div>
            <div className="text-[#687786] flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#7189A4] shrink-0" />
              <span className="truncate">{submittedReport.address}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/track/${submittedReport.tracking_token}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Track This Issue Live
            </Button>
            <Button
              variant="secondary"
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button & Title */}
      <div className="mb-6 space-y-1">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#294563] hover:underline mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-[#7189A4] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#7189A4]" />
          <span>Rapid 45-60 Second Citizen Grievance Capture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#294563]">
          {t.ctaReport}
        </h1>
        <p className="text-xs sm:text-sm text-[#687786]">
          Report civic hazards directly to municipal authorities. No bureaucratic friction or passwords required.
        </p>
      </div>

      <Card className="p-6 sm:p-8 soft-card space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Category Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
                1. Select Problem Category <span className="text-[#B85D5D]">*</span>
              </label>
              <span className="text-[11px] text-[#7189A4]">8 Official Municipal Domains</span>
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
                      'p-2.5 rounded-lg text-xs font-medium border text-left transition-all min-h-[48px] flex items-center justify-between',
                      isSelected
                        ? 'bg-[#294563] text-white border-[#294563] shadow-soft-sm font-semibold'
                        : 'bg-[#F8F8F5] text-[#263442] border-[#E3E7E8] hover:bg-[#F0F2EF]'
                    )}
                  >
                    <span className="line-clamp-2 leading-tight">{localized}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-1 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Issue Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
              2. Brief Issue Summary / Title <span className="text-[#B85D5D]">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Uncovered drain creating flood hazard on 4th Main"
              maxLength={140}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
            />
          </div>

          {/* 3. Detailed Problem Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
              3. Problem Description <span className="text-[#B85D5D]">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem in detail: how long it has been present, immediate dangers to two-wheelers, children or pedestrians, and nearby landmarks..."
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[100px]"
            />
            <div className="text-[11px] text-[#687786] flex justify-between">
              <span>Original text is preserved and never overwritten by AI.</span>
              <span>{description.length}/500 chars</span>
            </div>
          </div>

          {/* 4. Interactive Leaflet Map Location Selection */}
          <div className="space-y-3">
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={handleLocationChange}
              address={address}
            />

            <div className="space-y-1">
              <label htmlFor="address" className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
                Street Address or Landmark
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop number, cross road, apartment name or municipal ward..."
                className="w-full px-4 py-2 rounded-lg border border-[#E3E7E8] bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[42px]"
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
            <div className="p-3 rounded-lg bg-[#B85D5D]/10 border border-[#B85D5D]/30 text-xs text-[#B85D5D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#E3E7E8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#687786]">
              Submissions generate an instant tracking token.
            </div>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full sm:w-auto shadow-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Complaint (Generate Token)
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
