// CIVICLENS AI — Domain Types & Interfaces

export type ReportCategory =
  | 'Roads & Potholes'
  | 'Drainage & Waterlogging'
  | 'Garbage & Sanitation'
  | 'Streetlights'
  | 'Water Supply'
  | 'Electrical Hazards'
  | 'Public Infrastructure'
  | 'Other Civic Issues';

export type ReportStatus =
  | 'Submitted'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type PriorityBand = 'Critical' | 'High' | 'Medium' | 'Low';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  tracking_token: string;
  user_id?: string | null;
  title: string;
  description: string;
  category: ReportCategory;
  image_url?: string | null;
  latitude: number;
  longitude: number;
  address?: string | null;
  status: ReportStatus;
  priority_band: PriorityBand;
  created_at: string;
  updated_at: string;
}

export interface AIAnalysis {
  id: string;
  report_id: string;
  category: ReportCategory;
  summary: string;
  severity: SeverityLevel;
  urgency_score: number; // 0-100
  impact_score: number;  // 0-100
  duration_score: number; // 0-100
  recurrence_score: number; // 0-100
  priority_score: number; // 0-100 deterministic weighted score
  reasoning: string[];
  recommended_action: string;
  created_at: string;
}

export interface DuplicateCandidate {
  id: string;
  report_id: string;
  matched_report_id: string;
  semantic_score: number; // 0-100
  geographic_score: number; // 0-100
  category_score: number; // 0-100
  combined_score: number; // 0-100
  review_status: 'pending' | 'confirmed' | 'rejected' | 'merged';
  notes?: string;
  created_at: string;
  report?: Report;
  matched_report?: Report;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  contact_email?: string;
}

export interface Assignment {
  id: string;
  report_id: string;
  department_id: string;
  assigned_to?: string | null;
  assigned_by?: string | null;
  assigned_at: string;
  target_resolution_date?: string;
  internal_notes?: string;
  department?: Department;
}

export interface StatusHistoryItem {
  id: string;
  report_id: string;
  old_status?: ReportStatus | null;
  new_status: ReportStatus;
  note?: string;
  changed_by?: string | null;
  resolution_evidence_url?: string | null;
  created_at: string;
}

export interface Hotspot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  report_count: number;
  dominant_category: ReportCategory;
  severity: SeverityLevel;
  ai_brief_summary?: string;
  recommended_intervention?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'citizen' | 'officer' | 'admin';
  phone?: string;
  language_pref: 'en' | 'kn';
  created_at: string;
}

export type Language = 'en' | 'kn';
