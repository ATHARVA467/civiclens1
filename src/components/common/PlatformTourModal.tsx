import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  Brain, 
  GitMerge, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Flame,
  Building2,
  CopyCheck
} from 'lucide-react';
import { clsx } from 'clsx';

export const PlatformTourModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stage: 'STAGE 1: CAPTURE',
      title: 'Frictionless 45-Second Grievance Capture',
      icon: <Camera className="w-6 h-6 text-[#294563]" />,
      route: '/report',
      routeLabel: 'Open Report Form',
      description:
        'Citizens log public complaints without cumbersome account setup. Features interactive Leaflet GPS pin placement, 5MB image verification, and unpredictable tracking token generation.',
      highlights: [
        'Interactive OpenStreetMap click-to-pin location selector',
        'Mobile client-side camera integration with JPEG/PNG/WebP validation',
        'Generates unique token e.g. CLK-DRN-8201',
        'Original citizen complaint preserved without destructive overwrite'
      ]
    },
    {
      stage: 'STAGE 2: UNDERSTAND',
      title: 'Server-Side Gemini AI & Explainable Priority',
      icon: <Brain className="w-6 h-6 text-[#7189A4]" />,
      route: '/track/CLK-DRN-8201',
      routeLabel: 'Inspect Sample AI Analysis',
      description:
        'Privileged AI operations run via Supabase Edge Functions with zero key exposure in the frontend. Gemini analyzes imagery and description to compute deterministic priority scores.',
      highlights: [
        'Deterministic formula: (Severity × 0.35) + (Impact × 0.30) + (Duration × 0.20) + (Recurrence × 0.15)',
        'Four transparent priority bands: Critical (80-100), High (60-79), Medium (35-59), Low (0-34)',
        'Safety-critical hazards prioritized even without duplicate volume',
        'Clear reasoning bullet points and recommended actions'
      ]
    },
    {
      stage: 'STAGE 3: REVEAL',
      title: 'Semantic Duplicate Detection & DBSCAN Hotspots',
      icon: <GitMerge className="w-6 h-6 text-[#7C9B85]" />,
      route: '/admin/duplicates',
      routeLabel: 'Open Duplicate Workbench',
      description:
        'Prevents redundant work orders by correlating grievances through a multi-factor weighted model and spatial clustering.',
      highlights: [
        'Weighted similarity: Text Similarity 60% + Geo Proximity 25% + Category 15%',
        'Haversine geodesic distance mapped to proximity score',
        'Non-destructive merging: both citizen tokens remain active',
        'DBSCAN spatial clustering reveals recurring infrastructure failures'
      ]
    },
    {
      stage: 'STAGE 4: ACT',
      title: 'Inter-Agency Municipal Dispatch Board',
      icon: <Layers className="w-6 h-6 text-[#B9853F]" />,
      route: '/admin/assignments',
      routeLabel: 'Open Dispatch Board',
      description:
        'Zonal officers assign lead engineers, specify target completion dates, and log internal progress notes across 5 specialized municipal bodies.',
      highlights: [
        'Jurisdiction routing: Roads, Water & Sewer, Sanitation, Electricity, Public Works',
        'Lead executive officer assignment and SLA date scheduling',
        'Internal work notes and field directives',
        'Real-time status transitions with audit history'
      ]
    },
    {
      stage: 'STAGE 5: RESOLVE',
      title: 'Citizen Redressal Audit Trail & Closure Evidence',
      icon: <CheckCircle2 className="w-6 h-6 text-[#4F8665]" />,
      route: '/admin/analytics',
      routeLabel: 'View Analytics & SLAs',
      description:
        'Ensures accountability through photo evidence verification before ticket closure and transparent citizen status history.',
      highlights: [
        'Citizen-facing timeline showing date-stamped status transitions',
        'Resolution evidence photographic documentation',
        'Performance metrics: mean resolution velocity and duplicate suppression rate',
        'Bilingual English and Kannada (ಕನ್ನಡ) accessibility'
      ]
    }
  ];

  const active = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 text-[#263442] shadow-2xl relative border border-[#E3E7E8]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#687786] hover:text-[#263442] hover:bg-[#F0F2EF] rounded-lg transition-colors"
          aria-label="Close Tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#E3E7E8] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#7189A4] bg-[#F0F2EF] px-2.5 py-1 rounded-md">
              {active.stage}
            </span>
            <span className="text-xs text-[#687786]">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-all',
                  currentStep === idx ? 'w-6 bg-[#294563]' : 'bg-[#E3E7E8] hover:bg-[#7189A4]'
                )}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E3E7E8] shadow-soft-sm shrink-0">
              {active.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#294563]">{active.title}</h2>
              <p className="text-xs text-[#687786]">Lifecycle stage overview</p>
            </div>
          </div>

          <p className="text-sm text-[#263442] leading-relaxed bg-[#F8F8F5] p-4 rounded-xl border border-[#E3E7E8]">
            {active.description}
          </p>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#294563] uppercase tracking-wider">
              Technical & Architectural Highlights:
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#263442]">
              {active.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#F0F2EF]/60 border border-[#E3E7E8]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4F8665] shrink-0 mt-0.5" />
                  <span className="leading-snug">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-6 mt-6 border-t border-[#E3E7E8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(active.route);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#294563] hover:underline"
          >
            <span>{active.routeLabel}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#7189A4]" />
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[#E3E7E8] text-xs font-semibold text-[#263442] hover:bg-[#F8F8F5] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-[#294563] text-white text-xs font-semibold hover:bg-[#1f344b]"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-[#4F8665] text-white text-xs font-semibold hover:bg-[#3a674d]"
              >
                <span>Complete Tour</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
