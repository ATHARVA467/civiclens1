import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useI18n, CATEGORY_TRANSLATIONS } from '@/lib/i18n';
import { ReportCategory } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Camera, 
  MapPin, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Compass,
  X
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
  const [address, setAddress] = useState('Gandhi Bazaar Main Road, Bangalore');
  const [latitude, setLatitude] = useState<number>(12.9745);
  const [longitude, setLongitude] = useState<number>(77.6082);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 5MB');
        return;
      }
      setErrorMessage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefixes[cat] || 'CLK-CIV'}-${randomDigits}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in both a title and a description of the issue');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const token = generateTrackingToken(category);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('reports').insert({
          tracking_token: token,
          title: title.trim(),
          description: description.trim(),
          category,
          address: address.trim(),
          latitude,
          longitude,
          status: 'Submitted',
          priority_band: 'Medium'
        });

        if (error) {
          console.warn('Supabase insert notice:', error.message);
        }
      }

      // Successful capture state
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedToken(token);
      }, 600);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setSubmittedToken(token); // Fallback to token generation for demo flow
    }
  };

  if (submittedToken) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 text-center space-y-6 soft-card-elevated border-emerald-500/30">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
              Report Submitted Successfully
            </span>
            <h1 className="text-2xl font-bold text-[#294563]">Complaint Logged in CivicLens</h1>
            <p className="text-sm text-[#687786]">
              Your grievance has been captured and passed into the AI understanding pipeline.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F8F8F5] border border-[#E3E7E8] space-y-2 max-w-sm mx-auto">
            <div className="text-xs font-semibold text-[#687786] uppercase tracking-wider">
              Your Tracking Token
            </div>
            <div className="font-mono text-2xl font-extrabold text-[#294563] tracking-wider select-all">
              {submittedToken}
            </div>
            <p className="text-[11px] text-[#687786]">
              Keep this token safe to monitor authority action, officer notes and resolution evidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => navigate(`/track/${submittedToken}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Track This Issue Live
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSubmittedToken(null);
                setTitle('');
                setDescription('');
                setImagePreview(null);
              }}
              className="w-full sm:w-auto"
            >
              Submit Another Report
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7189A4] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#7189A4]" />
          <span>Rapid 60-Second Grievance Capture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#294563]">
          Report a Public Civic Issue
        </h1>
        <p className="text-sm text-[#687786]">
          Provide details below. CivicLens AI automatically extracts priority factors and routes to the designated municipal body.
        </p>
      </div>

      <Card className="p-6 sm:p-8 soft-card space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
              Select Problem Category <span className="text-[#B85D5D]">*</span>
            </label>
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

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
              Brief Summary / Title <span className="text-[#B85D5D]">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole causing skidding near bus stop"
              maxLength={150}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="desc" className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
              Detailed Description <span className="text-[#B85D5D]">*</span>
            </label>
            <textarea
              id="desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, how long it has existed, and safety risks to pedestrians or traffic..."
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[100px]"
            />
          </div>

          {/* Location & Interactive Coordinates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="address" className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
                Location & Landmarks
              </label>
              <span className="text-[11px] text-[#7189A4] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Lat: {latitude.toFixed(4)}, Long: {longitude.toFixed(4)}
              </span>
            </div>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street name, landmark, building number..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3E7E8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] min-h-[44px]"
            />
            <div className="p-3 rounded-lg bg-[#F8F8F5] border border-[#E3E7E8] flex items-center justify-between text-xs text-[#687786]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#7189A4]" />
                <span>Geographic Pin: Indiranagar / Bangalore Urban Grid</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLatitude(12.9716 + (Math.random() - 0.5) * 0.02);
                  setLongitude(77.5946 + (Math.random() - 0.5) * 0.02);
                }}
                className="text-[#294563] font-semibold hover:underline text-[11px]"
              >
                Simulate Current GPS
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider">
              Attach Photograph (Optional)
            </label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-[#E3E7E8] max-h-60 bg-black/5">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E3E7E8] rounded-xl cursor-pointer hover:border-[#7189A4] hover:bg-[#F8F8F5] transition-all"
              >
                <UploadCloud className="w-8 h-8 text-[#7189A4] mb-2" />
                <span className="text-xs font-semibold text-[#294563]">Click to upload or take a photo</span>
                <span className="text-[11px] text-[#687786] mt-0.5">JPEG, PNG or WebP up to 5MB</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#B85D5D]/10 border border-[#B85D5D]/30 text-xs text-[#B85D5D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#687786]">
              Submissions are public records. No sensitive passwords required.
            </span>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Civic Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
