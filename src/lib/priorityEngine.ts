import { SeverityLevel, PriorityBand } from '@/types';

export interface PriorityBreakdown {
  priorityScore: number; // 0-100
  priorityBand: PriorityBand;
  severityScore: number; // 0-100
  impactScore: number;   // 0-100
  durationScore: number; // 0-100
  recurrenceScore: number; // 0-100
  formulaExplanation: string;
  contributingFactors: string[];
  recommendedAction: string;
}

/**
 * Deterministic Explainable Priority Calculation (Section 8)
 *
 * Formula:
 * Priority = (Severity × 0.35) + (Impact × 0.30) + (Duration × 0.20) + (Recurrence × 0.15)
 *
 * Priority Bands:
 * 80–100: Critical
 * 60–79: High
 * 35–59: Medium
 * 0–34: Low
 */
export function calculatePriorityScore(params: {
  severity: SeverityLevel | number; // 'critical' | 'high' | 'medium' | 'low' or 0-100
  impactScore: number;              // 0-100
  durationDays?: number;            // days issue has persisted
  durationScore?: number;           // 0-100 normalized
  recurringReportCount?: number;    // number of repeated complaints in area
  recurrenceScore?: number;         // 0-100 normalized
  isLifeSafetyHazard?: boolean;     // explicit hazard flag
}): PriorityBreakdown {
  // 1. Normalize Severity (0 - 100)
  let severityScore = 50;
  if (typeof params.severity === 'number') {
    severityScore = Math.min(100, Math.max(0, params.severity));
  } else {
    switch (params.severity) {
      case 'critical': severityScore = 95; break;
      case 'high': severityScore = 75; break;
      case 'medium': severityScore = 50; break;
      case 'low': severityScore = 25; break;
    }
  }

  // 2. Normalize Public Impact (0 - 100)
  const impactScore = Math.min(100, Math.max(0, params.impactScore));

  // 3. Normalize Duration (0 - 100)
  let durationScore = 50;
  if (typeof params.durationScore === 'number') {
    durationScore = Math.min(100, Math.max(0, params.durationScore));
  } else if (typeof params.durationDays === 'number') {
    // 1 day = 20, 3 days = 50, 7 days = 75, 14+ days = 100
    if (params.durationDays >= 14) durationScore = 100;
    else if (params.durationDays >= 7) durationScore = 80;
    else if (params.durationDays >= 3) durationScore = 55;
    else if (params.durationDays >= 1) durationScore = 35;
    else durationScore = 20;
  }

  // 4. Normalize Recurrence (0 - 100)
  let recurrenceScore = 0;
  if (typeof params.recurrenceScore === 'number') {
    recurrenceScore = Math.min(100, Math.max(0, params.recurrenceScore));
  } else if (typeof params.recurringReportCount === 'number') {
    // 1 report = 10, 3 reports = 50, 5+ reports = 90
    if (params.recurringReportCount >= 5) recurrenceScore = 95;
    else if (params.recurringReportCount >= 3) recurrenceScore = 65;
    else if (params.recurringReportCount >= 2) recurrenceScore = 40;
    else recurrenceScore = 15;
  }

  // 5. Deterministic Weighted Formula
  let weightedScore = 
    (severityScore * 0.35) +
    (impactScore * 0.30) +
    (durationScore * 0.20) +
    (recurrenceScore * 0.15);

  // Safety-critical override guardrail:
  // "Safety-critical hazards must be reviewed even if the report has no duplicates."
  if (params.isLifeSafetyHazard && weightedScore < 80) {
    weightedScore = Math.max(weightedScore, 82);
  }

  const finalScore = Math.round(weightedScore * 10) / 10;

  // 6. Assign Priority Band
  let priorityBand: PriorityBand = 'Low';
  if (finalScore >= 80) {
    priorityBand = 'Critical';
  } else if (finalScore >= 60) {
    priorityBand = 'High';
  } else if (finalScore >= 35) {
    priorityBand = 'Medium';
  } else {
    priorityBand = 'Low';
  }

  // 7. Explanations & Contributing Factors
  const contributingFactors: string[] = [];
  if (severityScore >= 80) {
    contributingFactors.push(`High Safety Severity (${severityScore}/100, 35% weight): Threat to bodily integrity, structural stability, or high-speed collision risk.`);
  } else {
    contributingFactors.push(`Baseline Severity (${severityScore}/100, 35% weight): Moderate physical hazard or inconvenience.`);
  }

  if (impactScore >= 70) {
    contributingFactors.push(`Broad Public Impact (${impactScore}/100, 30% weight): Major transit corridor, commercial district, or school perimeter affected.`);
  } else {
    contributingFactors.push(`Localized Impact (${impactScore}/100, 30% weight): Neighborhood lane or secondary thoroughfare.`);
  }

  if (durationScore >= 60) {
    contributingFactors.push(`Prolonged Issue Duration (${durationScore}/100, 20% weight): Stagnation or unaddressed defect for multiple days.`);
  }

  if (recurrenceScore >= 50) {
    contributingFactors.push(`Cluster Recurrence (${recurrenceScore}/100, 15% weight): Multiple corroborating grievances recorded in proximity.`);
  }

  let recommendedAction = 'Schedule standard departmental inspection within 5 business days.';
  if (priorityBand === 'Critical') {
    recommendedAction = 'Immediate dispatch: place safety barricades and deploy emergency repair crew within 2 to 4 hours.';
  } else if (priorityBand === 'High') {
    recommendedAction = 'Expedited triage: dispatch field investigation team within 24 hours.';
  } else if (priorityBand === 'Medium') {
    recommendedAction = 'Include in upcoming weekly municipal maintenance cycle.';
  }

  const formulaExplanation = `Priority (${finalScore}) = (${severityScore} × 0.35) + (${impactScore} × 0.30) + (${durationScore} × 0.20) + (${recurrenceScore} × 0.15)`;

  return {
    priorityScore: finalScore,
    priorityBand,
    severityScore,
    impactScore,
    durationScore,
    recurrenceScore,
    formulaExplanation,
    contributingFactors,
    recommendedAction,
  };
}
