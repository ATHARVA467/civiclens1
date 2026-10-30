import React, { useState } from 'react';
import { SYNTHETIC_DUPLICATES, SYNTHETIC_REPORTS } from '@/lib/syntheticData';
import { DuplicateCandidate } from '@/types';
import { Card } from '@/components/common/Card';
import { 
  CopyCheck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Link2, 
  GitMerge, 
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';

export const DuplicatesWorkbenchPage: React.FC = () => {
  const [candidates, setCandidates] = useState<DuplicateCandidate[]>(SYNTHETIC_DUPLICATES);
  const [confirmModalPair, setConfirmModalPair] = useState<DuplicateCandidate | null>(null);

  const handleAction = (id: string, action: 'confirmed' | 'rejected' | 'merged') => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, review_status: action } : c))
    );
    setConfirmModalPair(null);
  };

  const getReport = (id: string) => SYNTHETIC_REPORTS.find((r) => r.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8EA8C2] uppercase tracking-wider">
            <CopyCheck className="w-4 h-4 text-[#8EA8C2]" />
            <span>Semantic Vector Similarity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            Duplicate Detection Workbench
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Weighted model: Text Similarity 60% + Geo Proximity 25% + Category 15%.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#1C2C3D] border border-[#304153] text-[#8EA8C2]">
          {candidates.filter(c => c.review_status === 'pending').length} Pending Reviews
        </div>
      </div>

      {/* Epistemological Rule Notice */}
      <div className="p-4 rounded-xl bg-[#172332] border border-[#304153] text-xs text-[#A8B5C1] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#8EA8C2] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F3F5F6]">Non-Destructive Principle: </strong>
          Citizen complaints are never automatically discarded or deleted. Linking or merging groups records for operational dispatch while preserving each individual citizen's unique tracking token and communication channel.
        </p>
      </div>

      {/* Candidate Pairs Cards */}
      <div className="space-y-6">
        {candidates.map((pair) => {
          const original = getReport(pair.matched_report_id);
          const duplicate = getReport(pair.report_id);

          return (
            <Card key={pair.id} variant="admin-elevated" className="p-6 space-y-5 border-[#304153]">
              {/* Card Header with Score Breakdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#304153] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#111A24] border border-[#304153] font-mono text-sm font-extrabold text-[#8EA8C2]">
                    {pair.combined_score.toFixed(1)}%
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#F3F5F6] flex items-center gap-2">
                      <span>Strong Duplicate Candidate</span>
                      <span className={clsx(
                        'text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border',
                        pair.review_status === 'pending'
                          ? 'bg-[#D1A15D]/20 text-[#D1A15D] border-[#D1A15D]/40'
                          : pair.review_status === 'confirmed'
                            ? 'bg-[#7C9B85]/20 text-[#7C9B85] border-[#7C9B85]/40'
                            : pair.review_status === 'merged'
                              ? 'bg-[#8EA8C2]/20 text-[#8EA8C2] border-[#8EA8C2]/40'
                              : 'bg-[#C77A7A]/20 text-[#C77A7A] border-[#C77A7A]/40'
                      )}>
                        {pair.review_status}
                      </span>
                    </div>
                    <div className="text-xs text-[#A8B5C1]">{pair.notes}</div>
                  </div>
                </div>

                {/* Weighted Breakdown Chips */}
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded bg-[#111A24] border border-[#304153] text-[#A8B5C1]">
                    Text: {pair.semantic_score}% (60%)
                  </span>
                  <span className="px-2 py-1 rounded bg-[#111A24] border border-[#304153] text-[#A8B5C1]">
                    Geo: {pair.geographic_score}% (25%)
                  </span>
                  <span className="px-2 py-1 rounded bg-[#111A24] border border-[#304153] text-[#A8B5C1]">
                    Cat: {pair.category_score}% (15%)
                  </span>
                </div>
              </div>

              {/* Side-by-side Report Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Primary / Earlier Report */}
                <div className="p-4 rounded-xl bg-[#111A24] border border-[#304153] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#7C9B85] uppercase tracking-wider">
                      Initial Report (Target)
                    </span>
                    <span className="font-mono text-xs text-[#8EA8C2]">{original?.tracking_token}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#F3F5F6]">{original?.title}</h4>
                  <p className="text-[#A8B5C1] leading-relaxed">{original?.description}</p>
                  <div className="flex items-center gap-1.5 text-[#8EA8C2] pt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{original?.address}</span>
                  </div>
                </div>

                {/* Duplicate / Candidate Report */}
                <div className="p-4 rounded-xl bg-[#111A24] border border-[#304153] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#D1A15D] uppercase tracking-wider">
                      Candidate Report (Incoming)
                    </span>
                    <span className="font-mono text-xs text-[#8EA8C2]">{duplicate?.tracking_token}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#F3F5F6]">{duplicate?.title}</h4>
                  <p className="text-[#A8B5C1] leading-relaxed">{duplicate?.description}</p>
                  <div className="flex items-center gap-1.5 text-[#8EA8C2] pt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{duplicate?.address}</span>
                  </div>
                </div>
              </div>

              {/* Administrator Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-[#304153]">
                <div className="text-xs text-[#A8B5C1]">
                  Geographic Distance: <strong className="text-[#F3F5F6]">~35 meters apart</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleAction(pair.id, 'rejected')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#111A24] border border-[#304153] hover:border-[#C77A7A] text-[#C77A7A] text-xs font-medium transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Match</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(pair.id, 'confirmed')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#172332] border border-[#304153] hover:border-[#7C9B85] text-[#7C9B85] text-xs font-medium transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Confirm & Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmModalPair(pair)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#8EA8C2] text-[#111A24] text-xs font-bold hover:bg-[#9eb8d2] transition-colors"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>Merge Action Ticket</span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal for Merge */}
      {confirmModalPair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1C2C3D] border border-[#304153] rounded-2xl p-6 text-[#F3F5F6] space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#8EA8C2]/20 border border-[#8EA8C2]/40 text-[#8EA8C2]">
                <GitMerge className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Explicit Merge Confirmation</h3>
                <p className="text-xs text-[#A8B5C1]">Consolidate field action without deleting citizen tracking</p>
              </div>
            </div>

            <p className="text-xs text-[#A8B5C1] leading-relaxed">
              Merging will unify the field dispatch ticket under <strong>{getReport(confirmModalPair.matched_report_id)?.tracking_token}</strong>. Both citizen reporting parties will continue receiving status updates simultaneously.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalPair(null)}
                className="px-3.5 py-2 rounded-lg bg-[#172332] border border-[#304153] text-xs font-medium text-[#A8B5C1] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction(confirmModalPair.id, 'merged')}
                className="px-4 py-2 rounded-lg bg-[#8EA8C2] text-[#111A24] text-xs font-bold hover:bg-[#9eb8d2]"
              >
                Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

