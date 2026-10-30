import React, { useState } from 'react';
import { SYNTHETIC_DEPARTMENTS, SYNTHETIC_REPORTS } from '@/lib/syntheticData';
import { Department, Report, ReportStatus } from '@/types';
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
  Send,
  Calendar,
  FileCheck2,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

export const AssignmentsWorkflowPage: React.FC = () => {
  const [departments] = useState<Department[]>(SYNTHETIC_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-roads');
  const [selectedOfficer, setSelectedOfficer] = useState<string>('Officer Ramesh K.');
  const [targetDate, setTargetDate] = useState<string>('2026-11-04');
  const [internalNotes, setInternalNotes] = useState<string>('');
  
  const [assignedReports, setAssignedReports] = useState<Record<string, { deptId: string; officer: string; notes?: string; targetDate?: string }>>({
    'rep-drain-01': { deptId: 'dept-water', officer: 'Officer Sneha Rao', notes: 'Jetting unit dispatched', targetDate: '2026-10-31' },
    'rep-road-01': { deptId: 'dept-roads', officer: 'Officer Ramesh K.', notes: 'Cold asphalt patch crew assigned', targetDate: '2026-11-01' },
    'rep-garb-01': { deptId: 'dept-sanitation', officer: 'Officer Anoop S.', notes: 'Compactor bin clearance shift increased', targetDate: '2026-10-30' },
    'rep-lite-01': { deptId: 'dept-electrical', officer: 'Officer Ramesh K.', notes: 'High-mast crane scheduled', targetDate: '2026-11-02' },
  });

  const [activeModalReport, setActiveModalReport] = useState<Report | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeReports = SYNTHETIC_REPORTS.slice(0, 12);

  const handleDispatch = (report: Report) => {
    setAssignedReports((prev) => ({
      ...prev,
      [report.id]: {
        deptId: selectedDeptId,
        officer: selectedOfficer,
        notes: internalNotes || 'Standard operational dispatch',
        targetDate: targetDate,
      },
    }));

    const dept = departments.find(d => d.id === selectedDeptId);
    setSuccessToast(`Report ${report.tracking_token} dispatched to ${dept?.name} (Lead: ${selectedOfficer})`);
    setActiveModalReport(null);
    setInternalNotes('');
    setTimeout(() => setSuccessToast(null), 3500);
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
            Department Assignment & Status Workflow
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Dispatch complaints to authorized zonal authorities, record field notes, and monitor completion SLAs.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-[#7C9B85]/20 border border-[#7C9B85]/40 text-xs text-[#7C9B85] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Department Workload Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const count = Object.values(assignedReports).filter(d => d.deptId === dept.id).length;
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
                  <span className="text-xs font-mono text-[#A8B5C1]">{count} Active Tickets</span>
                </div>
                <h3 className="text-sm font-bold text-[#F3F5F6] mt-2">{dept.name}</h3>
                <p className="text-xs text-[#A8B5C1] mt-1 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="text-[11px] text-[#8EA8C2] pt-2 border-t border-[#304153]/50 flex items-center justify-between">
                <span>{dept.contact_email}</span>
                {isSelected && <span className="text-xs font-bold text-[#7C9B85]">Active Selection</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Assignment Queue Table */}
      <Card variant="admin" className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#F3F5F6]">Pending Assignment Dispatch Queue</h2>
            <p className="text-xs text-[#A8B5C1]">Assign designated lead officer, SLA target date, and department jurisdiction</p>
          </div>
        </div>

        <div className="space-y-3">
          {activeReports.map((rep) => {
            const currentAssignment = assignedReports[rep.id];
            const currentDept = currentAssignment ? departments.find(d => d.id === currentAssignment.deptId) : null;

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
                  {currentAssignment && currentAssignment.notes && (
                    <div className="text-[11px] text-[#7C9B85] pt-0.5">
                      <strong>Internal Note:</strong> {currentAssignment.notes} (Target: {currentAssignment.targetDate})
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  {currentDept ? (
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[#7C9B85] flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Assigned to {currentDept.code}</span>
                      </div>
                      <div className="text-[11px] text-[#A8B5C1]">{currentAssignment.officer}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-[#D1A15D] italic">Unassigned</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveModalReport(rep)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8EA8C2] text-[#111A24] font-bold text-xs hover:bg-[#9eb8d2] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{currentDept ? 'Re-assign' : 'Dispatch'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Dispatch Modal */}
      {activeModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1C2C3D] border border-[#304153] rounded-2xl p-6 text-[#F3F5F6] space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveModalReport(null)}
              className="absolute top-4 right-4 p-2 text-[#A8B5C1] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-[#8EA8C2]">
                {activeModalReport.tracking_token}
              </span>
              <h3 className="text-lg font-bold">{activeModalReport.title}</h3>
              <p className="text-xs text-[#A8B5C1]">{activeModalReport.address}</p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#A8B5C1] uppercase text-[11px]">
                  Target Department
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6]"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#A8B5C1] uppercase text-[11px]">
                    Lead Executive Officer
                  </label>
                  <select
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6]"
                  >
                    <option value="Officer Ramesh K.">Officer Ramesh K. (Senior AEE)</option>
                    <option value="Officer Sneha Rao">Officer Sneha Rao (Zonal Health Inspector)</option>
                    <option value="Officer Anoop S.">Officer Anoop S. (Sub-Division Eng.)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-[#A8B5C1] uppercase text-[11px]">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#A8B5C1] uppercase text-[11px]">
                  Internal Operational Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Requires mechanical backhoe loader; notify local traffic division before closing lane..."
                  className="w-full px-3 py-2 rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalReport(null)}
                className="px-3.5 py-2 rounded-lg bg-[#172332] border border-[#304153] text-xs font-medium text-[#A8B5C1] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDispatch(activeModalReport)}
                className="px-4 py-2 rounded-lg bg-[#8EA8C2] text-[#111A24] text-xs font-bold hover:bg-[#9eb8d2]"
              >
                Confirm Dispatch Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
