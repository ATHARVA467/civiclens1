import React from 'react';
import { SYNTHETIC_HOTSPOTS } from '@/lib/syntheticData';
import { Card } from '@/components/common/Card';
import { Flame, MapPin, AlertTriangle, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HotspotsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7C9B85] uppercase tracking-wider">
            <Flame className="w-4 h-4 text-[#7C9B85]" />
            <span>Spatial Density & Clustering (DBSCAN)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            Geographic Hotspots & Clusters
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Algorithmic spatial concentration analysis grouping repetitive civic failures.
          </p>
        </div>

        <Link
          to="/admin/map"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#8EA8C2] text-[#111A24] font-bold text-xs hover:bg-[#9eb8d2] transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span>View Overlay on GIS Map</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SYNTHETIC_HOTSPOTS.map((h) => (
          <Card key={h.id} variant="admin-elevated" className="p-5 flex flex-col justify-between space-y-4 border-[#304153]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#8EA8C2] bg-[#111A24] px-2 py-0.5 rounded border border-[#304153]">
                  {h.radius_meters}m Radius
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#C77A7A]/20 text-[#C77A7A] border border-[#C77A7A]/40 uppercase">
                  {h.severity}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F3F5F6] leading-snug">
                {h.name}
              </h3>

              <div className="text-xs text-[#A8B5C1] space-y-1">
                <div>Primary Domain: <strong className="text-[#F3F5F6]">{h.dominant_category}</strong></div>
                <div>Grievance Density: <strong className="text-[#8EA8C2]">{h.report_count} clustered complaints</strong></div>
              </div>

              <p className="text-xs text-[#F3F5F6] bg-[#111A24] p-3 rounded-lg border border-[#304153] leading-relaxed">
                {h.ai_brief_summary}
              </p>

              <div className="text-xs text-[#A8B5C1] space-y-1 border-t border-[#304153] pt-2">
                <span className="font-semibold text-[#7C9B85] uppercase text-[10px]">Intervention Directive:</span>
                <p className="leading-snug">{h.recommended_intervention}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#304153]">
              <Link
                to="/admin/intelligence"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#172332] border border-[#304153] text-xs font-medium text-[#8EA8C2] hover:bg-[#25394e] transition-colors"
              >
                <span>Read Full AI Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
