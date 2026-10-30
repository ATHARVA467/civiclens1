import React from 'react';
import { SYNTHETIC_HOTSPOTS } from '@/lib/syntheticData';
import { Card } from '@/components/common/Card';
import { 
  Sparkles, 
  Flame, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const IntelligenceBriefsPage: React.FC = () => {
  const briefs = [
    {
      id: 'brief-01',
      title: 'Gandhi Bazaar Arterial Drainage Failure & Subgrade Erosion',
      dominantCategory: 'Drainage & Waterlogging',
      correlatedCategory: 'Roads & Potholes',
      relatedReportCount: 8,
      location: 'Gandhi Bazaar Market Circle & 4th Cross (350m radius)',
      highestPriority: 'Critical (Manhole cover dislodged in standing floodwater)',
      patternDescription:
        'Eight spatially correlated complaints over a 48-hour window document recurrent stormwater surcharge accompanied by localized road subsidence. Water stagnation precedes surface bitumen crumbling.',
      potentialImpact:
        'Impaired pedestrian commerce, electrocution risk from submerged vendor conduits, vehicular axle damage, and accelerated basement seepage in adjacent commercial premises.',
      recommendedInvestigation:
        'Execute a coordinated dual-agency intervention: Water Supply & Sewerage Board must desilt the primary underground conduit before Roads Authority applies subgrade compaction.',
      confidence: 'High (0.88 semantic & geographic correlation)',
      limitationNotice:
        'Causal sequence between drain obstruction and asphalt failure is an algorithmic hypothesis; requires ground validation by assistant executive engineer.',
      status: 'Action Required',
      urgency: 'Critical'
    },
    {
      id: 'brief-02',
      title: 'Indiranagar 100ft Road Flyover Ramp Structural Pothole Cluster',
      dominantCategory: 'Roads & Potholes',
      correlatedCategory: 'Traffic Safety',
      relatedReportCount: 5,
      location: 'Indiranagar 100ft Flyover down ramp descent (200m radius)',
      highestPriority: 'Critical (7-inch crater directly on vehicle wheel track)',
      patternDescription:
        'Concentrated wheel-track potholes appearing exclusively along the decelerating lane descending the flyover. Reports indicate sudden braking and dangerous swerving into incoming traffic lanes.',
      potentialImpact:
        'Elevated hazard of two-wheeler rider ejection, multiple-car pileups during peak commute hours, and severe wheel rim fractures.',
      recommendedInvestigation:
        'Place high-intensity reflective barrier cones immediately. Deploy mobile rapid asphalt repair unit for cold-mix compaction within 3 hours.',
      confidence: 'Very High (0.94 report clustering score)',
      limitationNotice:
        'Photographic reports suggest expansion joint leakage may be saturating the sub-base beneath the bitumen layer.',
      status: 'Dispatched',
      urgency: 'Critical'
    },
    {
      id: 'brief-03',
      title: 'Brigade Road Promenade Sanitation Saturation',
      dominantCategory: 'Garbage & Sanitation',
      correlatedCategory: 'Public Health',
      relatedReportCount: 6,
      location: 'Brigade Road Promenade shopping corridor (250m radius)',
      highestPriority: 'High (Decomposing commercial waste blocking pedestrian thoroughfare)',
      patternDescription:
        'Daily waste output from fast-food establishments consistently exceeds capacity of installed compactor bins by 2:00 PM, spilling onto pedestrian sidewalks.',
      potentialImpact:
        'Rodent infestation, severe public pedestrian nuisance, blockage of roadside gutter grates during rain, negative tourist impact.',
      recommendedInvestigation:
        'Transition from once-daily morning clearance to thrice-daily collection shifts. Issue mandatory wet waste segregation notices to food merchants.',
      confidence: 'High (0.84 cluster density)',
      limitationNotice:
        'Bin fill-sensor data not integrated; inference derived from citizen timestamp distributions.',
      status: 'Reviewing',
      urgency: 'High'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8EA8C2] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#8EA8C2]" />
            <span>AI Decision Support System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            AI Action Briefs
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Synthesized multi-complaint intelligence briefs designed for departmental leadership.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/map"
            className="px-3.5 py-2 rounded-lg bg-[#1C2C3D] border border-[#304153] text-[#F3F5F6] text-xs font-medium hover:bg-[#25394e] transition-colors"
          >
            Correlate on GIS Map
          </Link>
        </div>
      </div>

      {/* Epistemological Transparency Notice */}
      <div className="p-4 rounded-xl bg-[#172332] border border-[#304153] flex items-start gap-3 text-xs text-[#A8B5C1]">
        <Info className="w-5 h-5 text-[#8EA8C2] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[#F3F5F6]">Human-in-the-Loop Decision Guardrail:</span>
          <p className="leading-relaxed">
            AI Action Briefs aggregate multiple individual citizen grievances into cluster hypotheses. They highlight probable shared root causes to prevent siloed or temporary fixes. All recommendations require verification by authorized engineers before municipal expenditure.
          </p>
        </div>
      </div>

      {/* Briefs Cards */}
      <div className="space-y-6">
        {briefs.map((b) => (
          <Card key={b.id} variant="admin-elevated" className="p-6 space-y-5 border-[#304153]">
            {/* Brief Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#304153] pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#111A24] text-[#8EA8C2] border border-[#304153]">
                    {b.id.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C77A7A]/20 text-[#C77A7A] border border-[#C77A7A]/40">
                    {b.urgency}
                  </span>
                  <span className="text-xs text-[#A8B5C1] bg-[#172332] px-2 py-0.5 rounded border border-[#304153]">
                    {b.relatedReportCount} Correlated Reports
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#F3F5F6] pt-1">
                  {b.title}
                </h2>
              </div>
              <div className="text-xs text-[#A8B5C1] flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#8EA8C2]" />
                <span>{b.location}</span>
              </div>
            </div>

            {/* Pattern & Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#111A24] border border-[#304153] space-y-2">
                <div className="font-semibold text-[#8EA8C2] uppercase tracking-wider text-[11px]">
                  Detected Spatial & Temporal Pattern
                </div>
                <p className="text-[#F3F5F6] leading-relaxed">{b.patternDescription}</p>
                <div className="pt-2 text-[11px] text-[#A8B5C1] border-t border-[#304153]/50">
                  <span className="font-semibold text-[#F3F5F6]">Peak Hazard: </span>
                  {b.highestPriority}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111A24] border border-[#304153] space-y-2">
                <div className="font-semibold text-[#D1A15D] uppercase tracking-wider text-[11px]">
                  Public Impact & Hazard Escalation
                </div>
                <p className="text-[#F3F5F6] leading-relaxed">{b.potentialImpact}</p>
                <div className="pt-2 text-[11px] text-[#A8B5C1] border-t border-[#304153]/50">
                  <span className="font-semibold text-[#F3F5F6]">Statistical Confidence: </span>
                  {b.confidence}
                </div>
              </div>
            </div>

            {/* Recommended Investigation & Limitation */}
            <div className="p-4 rounded-xl bg-[#172332] border border-[#304153] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#7C9B85] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7C9B85]" />
                  <span>Prescribed Cross-Department Investigation Directive</span>
                </div>
                <span className="text-[10px] font-mono text-[#A8B5C1]">Joint Inter-Agency</span>
              </div>
              <p className="text-[#F3F5F6] text-sm leading-relaxed">{b.recommendedInvestigation}</p>
              <div className="text-[11px] text-[#A8B5C1] italic pt-1 border-t border-[#304153]/60">
                Limitation: {b.limitationNotice}
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#A8B5C1]">
                Status: <strong className="text-[#F3F5F6]">{b.status}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/complaints"
                  className="px-3.5 py-1.5 rounded-lg bg-[#1C2C3D] border border-[#304153] text-xs font-medium text-[#F3F5F6] hover:bg-[#25394e]"
                >
                  View Related Complaints
                </Link>
                <Link
                  to="/admin/assignments"
                  className="px-3.5 py-1.5 rounded-lg bg-[#8EA8C2] text-[#111A24] text-xs font-bold hover:bg-[#9eb8d2]"
                >
                  Issue Directive
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

