import React from 'react';
import { Link } from 'react-router-dom';
import { SYNTHETIC_REPORTS, SYNTHETIC_HOTSPOTS, SYNTHETIC_DUPLICATES, SYNTHETIC_DEPARTMENTS } from '@/lib/syntheticData';
import { Card } from '@/components/common/Card';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/common/Badges';
import { 
  Inbox, 
  Flame, 
  CopyCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Building2, 
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const total = SYNTHETIC_REPORTS.length;
  const critical = SYNTHETIC_REPORTS.filter(r => r.priority_band === 'Critical').length;
  const inProgress = SYNTHETIC_REPORTS.filter(r => r.status === 'In Progress').length;
  const resolved = SYNTHETIC_REPORTS.filter(r => r.status === 'Resolved').length;

  // Category counts for Recharts
  const categoryData = [
    { name: 'Drainage', count: 12, fill: '#7189A4' },
    { name: 'Roads', count: 10, fill: '#B9853F' },
    { name: 'Garbage', count: 9, fill: '#7C9B85' },
    { name: 'Lighting', count: 7, fill: '#8EA8C2' },
    { name: 'Water', count: 6, fill: '#4F8665' },
    { name: 'Electrical', count: 3, fill: '#C77A7A' },
    { name: 'Other', count: 3, fill: '#A8B5C1' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            Operational Intelligence & Triage
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Real-time municipal decision engine running on synthetic demonstration dataset.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/intelligence"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#8EA8C2] text-[#111A24] font-semibold text-xs hover:bg-[#9eb8d2] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Action Briefs</span>
          </Link>
          <Link
            to="/admin/map"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1C2C3D] border border-[#304153] text-[#F3F5F6] font-medium text-xs hover:bg-[#25394e] transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#8EA8C2]" />
            <span>Open GIS Map</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="admin" className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A8B5C1] uppercase tracking-wider">Queue Total</span>
            <Inbox className="w-4 h-4 text-[#8EA8C2]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6]">{total}</div>
          <div className="text-[11px] text-[#A8B5C1] mt-1 flex items-center justify-between">
            <span>50 synthetic records</span>
            <span className="text-[#7C9B85] font-mono">100% indexed</span>
          </div>
        </Card>

        <Card variant="admin" className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#C77A7A] uppercase tracking-wider">Critical Hazards</span>
            <AlertTriangle className="w-4 h-4 text-[#C77A7A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#C77A7A]">{critical}</div>
          <div className="text-[11px] text-[#A8B5C1] mt-1">
            Life-safety issues flagged by Gemini AI
          </div>
        </Card>

        <Card variant="admin" className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#D1A15D] uppercase tracking-wider">Duplicate Candidates</span>
            <CopyCheck className="w-4 h-4 text-[#D1A15D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#D1A15D]">{SYNTHETIC_DUPLICATES.length}</div>
          <div className="text-[11px] text-[#A8B5C1] mt-1">
            Pairs above 80% combined similarity
          </div>
        </Card>

        <Card variant="admin" className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#7C9B85] uppercase tracking-wider">Geographic Hotspots</span>
            <Flame className="w-4 h-4 text-[#7C9B85]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#7C9B85]">{SYNTHETIC_HOTSPOTS.length}</div>
          <div className="text-[11px] text-[#A8B5C1] mt-1">
            Clusters requiring cross-dept review
          </div>
        </Card>
      </div>

      {/* Middle Section: Chart & AI Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart */}
        <Card variant="admin" className="p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F3F5F6]">Grievance Distribution by Department</h2>
              <p className="text-xs text-[#A8B5C1]">Active reports categorized across municipal domains</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#172332] text-[#8EA8C2] border border-[#304153]">
              Recharts Engine
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" stroke="#687786" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#A8B5C1" fontSize={12} width={75} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172332',
                    borderColor: '#304153',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F3F5F6'
                  }}
                  itemStyle={{ color: '#F3F5F6' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Action Alert Widget */}
        <Card variant="admin" className="p-5 flex flex-col justify-between space-y-4 border-[#8EA8C2]/40 bg-[#1C2C3D]/90">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8EA8C2] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8EA8C2]" />
                Top AI Action Brief
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C77A7A]/20 text-[#C77A7A] border border-[#C77A7A]/40">
                CRITICAL
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#F3F5F6] leading-snug">
              Gandhi Bazaar Drain Siltation & Road Collapse
            </h3>
            <p className="text-xs text-[#A8B5C1] leading-relaxed">
              8 correlated reports indicate stormwater drain overflow weakening road foundations. Patching asphalt without clearing the main channel will result in recurring cave-ins.
            </p>
            <div className="p-3 rounded-lg bg-[#172332] border border-[#304153] text-xs space-y-1">
              <div className="text-[11px] font-semibold text-[#8EA8C2] uppercase">Recommended Action:</div>
              <div className="text-[#F3F5F6]">
                Dispatch joint inspection team (Drainage + Roads Authority) before approving road repair contract.
              </div>
            </div>
          </div>

          <Link
            to="/admin/intelligence"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#8EA8C2] text-[#111A24] font-semibold text-xs hover:bg-[#9eb8d2] transition-colors"
          >
            <span>Review Full Action Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </div>

      {/* Critical Priority Queue */}
      <Card variant="admin" className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F3F5F6]">Immediate Critical Triage Queue</h2>
            <p className="text-xs text-[#A8B5C1]">Top priority hazards requiring verified department response</p>
          </div>
          <Link
            to="/admin/complaints"
            className="text-xs text-[#8EA8C2] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All 50 Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {SYNTHETIC_REPORTS.filter(r => r.priority_band === 'Critical').slice(0, 4).map((rep) => (
            <div
              key={rep.id}
              className="p-3.5 rounded-lg bg-[#172332] border border-[#304153] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#8EA8C2]/40 transition-colors"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#8EA8C2]">
                    {rep.tracking_token}
                  </span>
                  <StatusBadge status={rep.status} isDark={true} />
                  <PriorityBadge priority={rep.priority_band} isDark={true} />
                  <CategoryBadge category={rep.category} isDark={true} />
                </div>
                <h4 className="text-sm font-semibold text-[#F3F5F6] truncate">
                  {rep.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#A8B5C1]">
                  <MapPin className="w-3.5 h-3.5 text-[#8EA8C2]" />
                  <span className="truncate max-w-sm">{rep.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <Link
                  to={`/track/${rep.tracking_token}`}
                  className="px-3 py-1.5 rounded-md bg-[#1C2C3D] border border-[#304153] text-xs font-medium text-[#F3F5F6] hover:bg-[#25394e] transition-colors"
                >
                  Inspect
                </Link>
                <Link
                  to="/admin/assignments"
                  className="px-3 py-1.5 rounded-md bg-[#8EA8C2] text-[#111A24] text-xs font-semibold hover:bg-[#9eb8d2] transition-colors"
                >
                  Assign Dept
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
