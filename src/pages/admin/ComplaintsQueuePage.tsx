import React, { useState } from 'react';
import { SYNTHETIC_REPORTS } from '@/lib/syntheticData';
import { Report, ReportCategory, ReportStatus, PriorityBand } from '@/types';
import { Card } from '@/components/common/Card';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/common/Badges';
import { 
  Inbox, 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  X, 
  Clock, 
  RotateCw,
  Building2,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { clsx } from 'clsx';

export const ComplaintsQueuePage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(SYNTHETIC_REPORTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(search.toLowerCase()) ||
      rep.tracking_token.toLowerCase().includes(search.toLowerCase()) ||
      (rep.address && rep.address.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = categoryFilter === 'all' || rep.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || rep.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || rep.priority_band === priorityFilter;

    return matchesSearch && matchesCat && matchesStatus && matchesPriority;
  });

  const updateStatus = (id: string, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            Municipal Complaint Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Complete database of 50 synthetic records across all municipal departments.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#1C2C3D] border border-[#304153] text-[#8EA8C2]">
          Showing {filteredReports.length} of {reports.length} records
        </div>
      </div>

      {/* Filter Controls */}
      <Card variant="admin" className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A8B5C1] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports or token..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6] focus:outline-none focus:border-[#8EA8C2]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6] focus:outline-none focus:border-[#8EA8C2]"
          >
            <option value="all">All Categories</option>
            <option value="Roads & Potholes">Roads & Potholes</option>
            <option value="Drainage & Waterlogging">Drainage & Waterlogging</option>
            <option value="Garbage & Sanitation">Garbage & Sanitation</option>
            <option value="Streetlights">Streetlights</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electrical Hazards">Electrical Hazards</option>
            <option value="Other Civic Issues">Other Civic Issues</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6] focus:outline-none focus:border-[#8EA8C2]"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-[#111A24] border border-[#304153] text-[#F3F5F6] focus:outline-none focus:border-[#8EA8C2]"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card variant="admin" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#172332] text-[#A8B5C1] border-b border-[#304153] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Issue Title & Location</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#304153]/60 text-[#F3F5F6]">
              {filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#172332]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#8EA8C2]">
                    {rep.tracking_token}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-semibold truncate">{rep.title}</div>
                    <div className="text-[11px] text-[#A8B5C1] truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0 text-[#8EA8C2]" />
                      <span>{rep.address}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={rep.category} isDark={true} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={rep.priority_band} isDark={true} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rep.status} isDark={true} />
                  </td>
                  <td className="px-4 py-3 text-[#A8B5C1] whitespace-nowrap">
                    {new Date(rep.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(rep)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#172332] border border-[#304153] hover:bg-[#25394e] text-[#8EA8C2] font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail & Action Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#1C2C3D] border border-[#304153] rounded-2xl p-6 text-[#F3F5F6] space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-2 text-[#A8B5C1] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#8EA8C2] bg-[#111A24] px-2 py-0.5 rounded border border-[#304153]">
                  {selectedReport.tracking_token}
                </span>
                <StatusBadge status={selectedReport.status} isDark={true} />
                <PriorityBadge priority={selectedReport.priority_band} isDark={true} />
              </div>
              <h2 className="text-xl font-bold pt-1">{selectedReport.title}</h2>
            </div>

            <div className="p-4 rounded-xl bg-[#111A24] border border-[#304153] space-y-2 text-xs">
              <div className="font-semibold text-[#8EA8C2]">Citizen Description:</div>
              <p className="text-[#F3F5F6] leading-relaxed">{selectedReport.description}</p>
              <div className="text-[#A8B5C1] flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8EA8C2]" />
                <span>{selectedReport.address} (GPS: {selectedReport.latitude}, {selectedReport.longitude})</span>
              </div>
            </div>

            {/* Quick Status Transition Actions */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#A8B5C1] uppercase tracking-wider">
                Authority Status Workflow
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Verified', 'Assigned', 'In Progress', 'Resolved'] as ReportStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateStatus(selectedReport.id, st)}
                    className={clsx(
                      'p-2.5 rounded-lg text-xs font-medium border text-center transition-all',
                      selectedReport.status === st
                        ? 'bg-[#8EA8C2] text-[#111A24] font-bold border-[#8EA8C2]'
                        : 'bg-[#172332] text-[#A8B5C1] border-[#304153] hover:text-white hover:border-[#8EA8C2]/40'
                    )}
                  >
                    Mark as {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-lg bg-[#304153] text-xs font-medium text-white hover:bg-[#3d5268]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
