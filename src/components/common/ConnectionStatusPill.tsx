import React, { useState, useEffect } from 'react';
import { checkSupabaseConnection, SupabaseHealth } from '@/lib/supabase';
import { Database, CheckCircle2, AlertTriangle, X, Terminal, Info } from 'lucide-react';
import { clsx } from 'clsx';

export const ConnectionStatusPill: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  const [health, setHealth] = useState<SupabaseHealth | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkSupabaseConnection().then(setHealth);
  }, []);

  if (!health) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all min-h-[34px]',
          health.connected
            ? isDark
              ? 'bg-[#7C9B85]/20 text-[#7C9B85] border-[#7C9B85]/40 hover:bg-[#7C9B85]/30'
              : 'bg-[#4F8665]/15 text-[#376349] border-[#4F8665]/30 hover:bg-[#4F8665]/20'
            : isDark
              ? 'bg-[#D1A15D]/20 text-[#D1A15D] border-[#D1A15D]/40 hover:bg-[#D1A15D]/30'
              : 'bg-[#B9853F]/15 text-[#885d23] border-[#B9853F]/30 hover:bg-[#B9853F]/20'
        )}
        title="View Database & Supabase Status"
      >
        <span
          className={clsx(
            'w-2 h-2 rounded-full animate-pulse',
            health.connected ? 'bg-emerald-500' : 'bg-amber-500'
          )}
        />
        <Database className="w-3.5 h-3.5" />
        <span className="font-medium hidden sm:inline">
          {health.connected ? 'Supabase Connected' : 'Synthetic Data Active'}
        </span>
      </button>

      {/* Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={clsx(
              'w-full max-w-lg rounded-2xl p-6 border shadow-2xl relative animate-in fade-in zoom-in-95 duration-150',
              isDark
                ? 'bg-[#1C2C3D] text-[#F3F5F6] border-[#304153]'
                : 'bg-white text-[#263442] border-[#E3E7E8]'
            )}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className={clsx(
                'absolute top-4 right-4 p-2 rounded-lg transition-colors',
                isDark ? 'hover:bg-[#304153] text-[#A8B5C1]' : 'hover:bg-[#F0F2EF] text-[#687786]'
              )}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={clsx(
                  'p-2.5 rounded-xl border',
                  health.connected
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-600'
                )}
              >
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">CivicLens Database Architecture</h3>
                <p className={clsx('text-xs', isDark ? 'text-[#A8B5C1]' : 'text-[#687786]')}>
                  Phase 1 Environment & Connection Diagnostics
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div
                className={clsx(
                  'p-3.5 rounded-xl border flex items-start gap-3',
                  health.connected
                    ? isDark
                      ? 'bg-[#7C9B85]/10 border-[#7C9B85]/30'
                      : 'bg-[#4F8665]/10 border-[#4F8665]/20'
                    : isDark
                      ? 'bg-[#D1A15D]/10 border-[#D1A15D]/30'
                      : 'bg-[#B9853F]/10 border-[#B9853F]/20'
                )}
              >
                {health.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-sm">
                    {health.connected ? 'Active PostgreSQL Database Connection' : 'Synthetic Data Engine Active'}
                  </div>
                  <p className={clsx('text-xs mt-1 leading-relaxed', isDark ? 'text-[#A8B5C1]' : 'text-[#687786]')}>
                    {health.message}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Database Migrations & Tables Prepared
                </div>
                <div
                  className={clsx(
                    'p-3 rounded-lg border font-mono text-xs space-y-1',
                    isDark ? 'bg-[#111A24] border-[#304153]' : 'bg-[#F8F8F5] border-[#E3E7E8]'
                  )}
                >
                  <div className="text-emerald-500">✓ profiles (roles: citizen, officer, admin)</div>
                  <div className="text-emerald-500">✓ reports (with tracking_token, coordinates)</div>
                  <div className="text-emerald-500">✓ ai_analyses (scores: urgency, impact, priority)</div>
                  <div className="text-emerald-500">✓ report_embeddings (pgvector 768-dim)</div>
                  <div className="text-emerald-500">✓ duplicate_candidates (semantic + geo matching)</div>
                  <div className="text-emerald-500">✓ departments & assignments</div>
                  <div className="text-emerald-500">✓ status_history & audit trails</div>
                  <div className="text-emerald-500">✓ hotspots (spatial clustering)</div>
                  <div className="text-emerald-500">✓ storage bucket: 'report-images'</div>
                </div>
              </div>

              <div
                className={clsx(
                  'p-3 rounded-xl border text-xs',
                  isDark ? 'bg-[#172332] border-[#304153]' : 'bg-[#F0F2EF] border-[#E3E7E8]'
                )}
              >
                <div className="font-semibold mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  To connect your real Supabase instance:
                </div>
                <ol className="list-decimal list-inside space-y-1 opacity-90 pl-1">
                  <li>Copy <code className="font-mono bg-black/10 px-1 rounded">.env.example</code> to <code className="font-mono bg-black/10 px-1 rounded">.env</code></li>
                  <li>Paste your <code className="font-mono bg-black/10 px-1 rounded">VITE_SUPABASE_URL</code> & <code className="font-mono bg-black/10 px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
                  <li>Execute SQL migration in <code className="font-mono bg-black/10 px-1 rounded">supabase/migrations/</code> in Supabase SQL Editor</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium text-xs transition-colors',
                  isDark ? 'bg-[#304153] hover:bg-[#3d5268] text-white' : 'bg-[#294563] hover:bg-[#1f344b] text-white'
                )}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

