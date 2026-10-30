import React, { useState } from 'react';
import { SYNTHETIC_DUPLICATES, SYNTHETIC_REPORTS } from '@/lib/syntheticData';
import { DuplicateCandidate } from '@/types';
import { Card } from '@/components/common/Card';
import { evaluateDuplicatePair } from '@/lib/duplicateEngine';
import { 
  CopyCheck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Link2, 
  GitMerge, 
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  Calculator
} from 'lucide-react';
import { clsx } from 'clsx';

export const DuplicatesWorkbenchPage: React.FC = () => {
  const [candidates, setCandidates] = useState<DuplicateCandidate[]>(SYNTHETIC_DUPLICATES);
  const [confirmModalPair, setConfirmModalPair] = useState<DuplicateCandidate | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'all'>('pending');

  const handleAction = (id: string, action: 'confirmed' | 'rejected' | 'merged') => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, review_status: action } : c))
    );
    setConfirmModalPair(null);
  };

  const getReport = (id: string) => SYNTHETIC_REPORTS.find((r) => r.id === id);

  const filteredCandidates = candidates.filter((c) => {
    if (activeTab === 'pending') return c.review_status === 'pending';
    if (activeTab === 'resolved') return c.review_status !== 'pending';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8EA8C2] uppercase tracking-wider">
            <CopyCheck className="w-4 h-4 text-[#8EA8C2]" />
            <span>Semantic Vector Similarity & Geo-Clustering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F6] tracking-tight">
            Duplicate Detection Workbench
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5C1] mt-1">
            Weighted Model: Text Similarity 60% + Geographic Proximity 25% + Category Compatibility 15%.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-[#172332] border border-[#304153]">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'pending'
                ? 'bg-[#8EA8C2] text-[#111A24]'
                : 'text-[#A8B5C1] hover:text-white'
            )}
          >
            Pending ({candidates.filter(c => c.review_status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resolved')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'resolved'
                ? 'bg-[#8EA8C2] text-[#111A24]'
                : 'text-[#A8B5C1] hover:text-white'
            )}
          >
            Reviewed ({candidates.filter(c => c.review_status !== 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'all'
                ? 'bg-[#8EA8C2] text-[#111A24]'
                : 'text-[#A8B5C1] hover:text-white'
            )}
          >
            All ({candidates.length})
          </button>
        </div>
      </div>

      {/* Non-Destructive Invariance Notice */}
      <div className="p-4 rounded-xl bg-[#172332] border border-[#304153] text-xs text-[#A8B5C1] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#8EA8C2] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F3F5F6]">Non-Destructive Citizen Invariance: </strong>
          No citizen complaint is ever deleted or discarded. Confirming or merging duplicate pairs establishes an operational parent-child dispatch link, allowing municipal crews to service the site once while keeping both reporting citizens updated in real time.
        </p>
      </div>

      {/* Candidate Pairs Cards */}
      <div className="space-y-6">
        {filteredCandidates.length === 0 ? (
          <Card variant="admin" className="p-12 text-center text-[#A8B5C1] space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#7C9B85]" />
            <h3 className="text-base font-bold text-[#F3F5F6]">All Duplicate Candidates Reviewed</h3>
            <p className="text-xs">No pending duplicate pairs requiring administrator triage at this time.</p>
          </Card>
        ) : (
          filteredCandidates.map((pair) => {
            const original = getReport(pair.matched_report_id);
            const duplicate = getReport(pair.report_id);

            return (
              <Card key={pair.id} variant="admin-elevated" className="p-6 space-y-5 border-[#304153]">
                {/* Card Header with Score Breakdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#304153] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#111A24] border border-[#304153] font-mono text-base font-extrabold text-[#8EA8C2] flex flex-col items-center">
                      <span>{pair.combined_score.toFixed(1)}%</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#A8B5C1] font-sans">Match</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#F3F5F6] flex items-center gap-2">
                        <span>
                          {pair.combined_score >= 80 ? 'Strong Duplicate Candidate' : 'Possible Correlation Candidate'}
                        </span>
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
                      <div className="text-xs text-[#A8B5C1] mt-0.5">{pair.notes}</div>
                    </div>
                  </div>

                  {/* Weighted Breakdown Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-[#111A24] border border-[#304153] text-[#A8B5C1]">
                      Text: <strong className="text-[#F3F5F6]">{pair.semantic_score}%</strong> (60%)
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#111A24] border border-[#304153] text-[#A8B5C1]">
                      Geo: <strong className="text-[#F3F5F6]">{pair.geographic_score}%</strong> (25%)
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#111A24] border border-[#304153] text-[#A8B5C1]">
                      Cat: <strong className="text-[#F3F5F6]">{pair.category_score}%</strong> (15%)
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
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{original?.address}</span>
                    </div>
                    <div className="text-[10px] text-[#A8B5C1] pt-1">
                      Logged {original?.created_at ? new Date(original.created_at).toLocaleString() : ''}
                    </div>
                  </div>

                  {/* Duplicate / Candidate Report */}
                  <div className="p-4 rounded-xl bg-[#111A24] border border-[#304153] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D1A15D] uppercase tracking-wider">
                        Candidate Duplicate Report (Incoming)
                      </span>
                      <span className="font-mono text-xs text-[#8EA8C2]">{duplicate?.tracking_token}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#F3F5F6]">{duplicate?.title}</h4>
                    <p className="text-[#A8B5C1] leading-relaxed">{duplicate?.description}</p>
                    <div className="flex items-center gap-1.5 text-[#8EA8C2] pt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{duplicate?.address}</span>
                    </div>
                    <div className="text-[10px] text-[#A8B5C1] pt-1">
                      Logged {duplicate?.created_at ? new Date(duplicate.created_at).toLocaleString() : ''}
                    </div>
                  </div>
                </div>

                {/* Administrator Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#304153]">
                  <div className="text-xs text-[#A8B5C1] flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#8EA8C2]" />
                    <span>Combined Score: ({pair.semantic_score} × 0.6) + ({pair.geographic_score} × 0.25) + ({pair.category_score} × 0.15)</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleAction(pair.id, 'rejected')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#111A24] border border-[#304153] hover:border-[#C77A7A] text-[#C77A7A] text-xs font-medium transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Candidate</span>
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
          })
        )}
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
