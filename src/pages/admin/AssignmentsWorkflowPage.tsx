import React, { useState } from 'react';
import { SYNTHETIC_DEPARTMENTS, SYNTHETIC_REPORTS } from '@/lib/syntheticData';
import { Department, Report } from '@/types';
import { Card } from '@/components/common/Card';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/common/Badges';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { clsx } from 'clsx';

export const AssignmentsWorkflowPage: React.FC = () => {
  const [departments] = useState<Department[]>(SYNTHETIC_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-roads');
  const [selectedOfficer, setSelectedOfficer] = useState<string>('Officer Ramesh K.');
  const [notes, setNotes] = useState<string>('');
  const [assignedReports, setAssignedReports] = useState<Record<string, string>>({
    'rep-drain-01': 'dept-water',
    'rep-road-01': 'dept-roads',
    'rep-garb-01': 'dept-sanitation',
    'rep-lite-01': 'dept-electrical',
  });
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeReports = SYNTHETIC_REPORTS.slice(0, 10);

  const handleAssign = (reportId: string) => {
    setAssignedReports((prev) => ({
      ...prev,
      [reportId]: selectedDeptId,
    }));

    const dept = departments.find(d => d.id === selectedDeptId);
    setSuccessToast(`Report assigned to ${dept?.name} with lead ${selectedOfficer}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8EA8C2] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#8EA8C2]" />
            <span>Inter-Agency Municipal Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            Department Assignment Board
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Dispatch complaints to authorized zonal authorities and record assignment notes.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-[#7C9B85]/20 border border-[#7C9B85]/40 text-xs text-[#7C9B85] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const count = Object.values(assignedReports).filter(d => d === dept.id).length;
          const isSelected = selectedDeptId === dept.id;

          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDeptId(dept.id)}
              className={clsx(
                'p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2',
                isSelected
                  ? 'bg-[#1C2C3D] border-[#8EA8C2] shadow-admin-card ring-1 ring-[#8EA8C2]'
                  : 'bg-[#172332] border-[#304153] hover:bg-[#1C2C3D]/80'
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#111A24] text-[#8EA8C2] border border-[#304153]">
                    {dept.code}
                  </span>
                  <span className="text-xs font-mono text-[#A8B5C1]">{count} Active</span>
                </div>
                <h3 className="text-sm font-bold text-[#F3F5F6] mt-2">{dept.name}</h3>
                <p className="text-xs text-[#A8B5C1] mt-1 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="text-[11px] text-[#8EA8C2] pt-2 border-t border-[#304153]/50 flex items-center justify-between">
                <span>{dept.contact_email}</span>
                {isSelected && <span className="text-xs font-bold">Selected</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Assignment Queue */}
      <Card variant="admin" className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#F3F5F6]">Pending Assignment Dispatch Queue</h2>
            <p className="text-xs text-[#A8B5C1]">Assign designated lead officer and department jurisdiction</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A8B5C1]">Lead Officer:</span>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6] focus:outline-none"
            >
              <option value="Officer Ramesh K.">Officer Ramesh K. (Senior AEE)</option>
              <option value="Officer Sneha Rao">Officer Sneha Rao (Zonal Health Inspector)</option>
              <option value="Officer Anoop S.">Officer Anoop S. (Sub-Division Eng.)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {activeReports.map((rep) => {
            const currentDeptId = assignedReports[rep.id];
            const currentDept = departments.find(d => d.id === currentDeptId);

            return (
              <div
                key={rep.id}
                className="p-4 rounded-xl bg-[#172332] border border-[#304153] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8EA8C2]">
                      {rep.tracking_token}
                    </span>
                    <PriorityBadge priority={rep.priority_band} isDark={true} />
                    <CategoryBadge category={rep.category} isDark={true} />
                    <StatusBadge status={rep.status} isDark={true} />
                  </div>
                  <h4 className="text-sm font-bold text-[#F3F5F6]">{rep.title}</h4>
                  <p className="text-xs text-[#A8B5C1] line-clamp-1">{rep.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  {currentDept ? (
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[#7C9B85] flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Assigned to {currentDept.code}</span>
                      </div>
                      <div className="text-[11px] text-[#A8B5C1]">{currentDept.name}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-[#D1A15D] italic">Unassigned</span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAssign(rep.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8EA8C2] text-[#111A24] font-bold text-xs hover:bg-[#9eb8d2] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
