import React from 'react';
import { Card } from '@/components/common/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, TrendingUp, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const priorityData = [
    { name: 'Critical', value: 14, color: '#C77A7A' },
    { name: 'High', value: 18, color: '#D1A15D' },
    { name: 'Medium', value: 12, color: '#8EA8C2' },
    { name: 'Low', value: 6, color: '#7C9B85' },
  ];

  const resolutionTrend = [
    { day: 'Day 1', logged: 12, resolved: 3 },
    { day: 'Day 2', logged: 18, resolved: 8 },
    { day: 'Day 3', logged: 25, resolved: 14 },
    { day: 'Day 4', logged: 38, resolved: 22 },
    { day: 'Day 5', logged: 50, resolved: 31 },
  ];

  const departmentPerformance = [
    { name: 'Roads & Infra', active: 10, avgDays: 3.2 },
    { name: 'Water & Sewer', active: 12, avgDays: 2.1 },
    { name: 'Sanitation', active: 9, avgDays: 1.4 },
    { name: 'Electricity', active: 7, avgDays: 1.8 },
    { name: 'Public Works', active: 6, avgDays: 4.5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8EA8C2] uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-[#8EA8C2]" />
            <span>Civic Performance Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            Municipal Resolution Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Aggregate resolution velocity, triage distribution and inter-department SLAs.
          </p>
        </div>
      </div>

      {/* Top 3 KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="admin" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A8B5C1] uppercase tracking-wider">Mean Resolution Velocity</span>
            <Clock className="w-4 h-4 text-[#8EA8C2]" />
          </div>
          <div className="text-3xl font-extrabold text-[#F3F5F6]">2.6 Days</div>
          <p className="text-[11px] text-[#7C9B85] mt-1">↓ 18% improvement from baseline</p>
        </Card>

        <Card variant="admin" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A8B5C1] uppercase tracking-wider">Citizen Redressal Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#7C9B85]" />
          </div>
          <div className="text-3xl font-extrabold text-[#7C9B85]">78.4%</div>
          <p className="text-[11px] text-[#A8B5C1] mt-1">Confirmed with verification photo</p>
        </Card>

        <Card variant="admin" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A8B5C1] uppercase tracking-wider">Duplicate Suppression</span>
            <TrendingUp className="w-4 h-4 text-[#D1A15D]" />
          </div>
          <div className="text-3xl font-extrabold text-[#D1A15D]">100%</div>
          <p className="text-[11px] text-[#A8B5C1] mt-1">4 duplicate clusters deduplicated</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Pie */}
        <Card variant="admin" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F3F5F6]">Priority Band Distribution</h3>
              <p className="text-xs text-[#A8B5C1]">Weighted scoring factor allocation across reports</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172332',
                    borderColor: '#304153',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F3F5F6'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resolution vs Logged Line Chart */}
        <Card variant="admin" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F3F5F6]">Cumulative Ingestion vs Resolution</h3>
              <p className="text-xs text-[#A8B5C1]">5-day demonstration velocity tracking</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#304153" />
                <XAxis dataKey="day" stroke="#A8B5C1" fontSize={11} />
                <YAxis stroke="#A8B5C1" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172332',
                    borderColor: '#304153',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F3F5F6'
                  }}
                />
                <Line type="monotone" dataKey="logged" stroke="#8EA8C2" strokeWidth={2} name="Logged" />
                <Line type="monotone" dataKey="resolved" stroke="#7C9B85" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

