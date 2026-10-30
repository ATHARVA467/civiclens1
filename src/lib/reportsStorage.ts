import { Report, AIAnalysis } from '@/types';
import { SYNTHETIC_REPORTS, SYNTHETIC_ANALYSES } from '@/lib/syntheticData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const LOCAL_STORAGE_KEY = 'civiclens_citizen_reports';

// Load stored local reports (created during this session or saved in localStorage)
export function getStoredUserReports(): Report[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse local stored reports', err);
    return [];
  }
}

// Save a report locally so it is immediately available across the portal
export function saveReportLocally(report: Report): void {
  try {
    const current = getStoredUserReports();
    // Prepend new report
    const updated = [report, ...current.filter(r => r.id !== report.id && r.tracking_token !== report.tracking_token)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save report locally', err);
  }
}

// Get all combined reports (Synthetic + User submitted)
export async function getAllReports(): Promise<Report[]> {
  const localReports = getStoredUserReports();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge Supabase reports with any local un-synced reports
        const supabaseIds = new Set(data.map(r => r.id));
        const merged = [...data, ...localReports.filter(r => !supabaseIds.has(r.id))];
        return merged;
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local + synthetic', err);
    }
  }

  // Fallback: merge synthetic dataset with newly submitted user reports
  const userIds = new Set(localReports.map(r => r.id));
  return [...localReports, ...SYNTHETIC_REPORTS.filter(r => !userIds.has(r.id))];
}

// Get a single report by tracking token
export async function getReportByToken(token: string): Promise<{ report: Report | null; analysis: AIAnalysis | null }> {
  const cleanToken = token.trim().toUpperCase();

  // Check locally first for instant responsiveness
  const localReports = getStoredUserReports();
  const localMatch = localReports.find(r => r.tracking_token.toUpperCase() === cleanToken);
  if (localMatch) {
    return {
      report: localMatch,
      analysis: SYNTHETIC_ANALYSES[localMatch.id] || generateInitialAIAnalysis(localMatch)
    };
  }

  // Check Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, ai_analyses(*)')
        .eq('tracking_token', cleanToken)
        .maybeSingle();

      if (!error && data) {
        const analysis = data.ai_analyses?.[0] || data.ai_analyses || null;
        return {
          report: data,
          analysis
        };
      }
    } catch (err) {
      console.warn('Supabase token query error', err);
    }
  }

  // Check synthetic reports
  const syntheticMatch = SYNTHETIC_REPORTS.find(r => r.tracking_token.toUpperCase() === cleanToken);
  if (syntheticMatch) {
    return {
      report: syntheticMatch,
      analysis: SYNTHETIC_ANALYSES[syntheticMatch.id] || generateInitialAIAnalysis(syntheticMatch)
    };
  }

  return { report: null, analysis: null };
}

// Helper to generate a realistic initial AI analysis for newly submitted reports
export function generateInitialAIAnalysis(report: Report): AIAnalysis {
  const severityByBand = {
    Critical: 'critical' as const,
    High: 'high' as const,
    Medium: 'medium' as const,
    Low: 'low' as const
  };

  const scoresByBand = {
    Critical: { urgency: 92, impact: 88, prio: 89 },
    High: { urgency: 78, impact: 75, prio: 74 },
    Medium: { urgency: 55, impact: 50, prio: 52 },
    Low: { urgency: 28, impact: 30, prio: 30 },
  };

  const scores = scoresByBand[report.priority_band] || scoresByBand.Medium;

  return {
    id: `ana-${report.id}`,
    report_id: report.id,
    category: report.category,
    summary: `${report.category}: ${report.title}`,
    severity: severityByBand[report.priority_band] || 'medium',
    urgency_score: scores.urgency,
    impact_score: scores.impact,
    duration_score: 50,
    recurrence_score: 25,
    priority_score: scores.prio,
    reasoning: [
      'Grievance logged via citizen mobile portal',
      `Category identified as ${report.category}`,
      'Geographic coordinate within municipal boundary',
      'Initial automated triage applied pending officer field review'
    ],
    recommended_action: `Dispatch field inspection team from designated ${report.category} authority.`,
    created_at: report.created_at
  };
}

