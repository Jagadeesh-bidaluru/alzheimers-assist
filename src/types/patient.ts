export type UrgencyLevel = "critical" | "high" | "medium" | "low";
export type SeverityLevel = "severe" | "moderate" | "mild";
export type TreatmentStatus = "diagnosed" | "scheduled" | "in-treatment" | "completed";

export interface Patient {
  id: string;
  name: string;
  diagnosisDate: Date;
  urgency: UrgencyLevel;
  severity: SeverityLevel;
  status: TreatmentStatus;
  daysSinceDiagnosis: number;
  nextAction?: string;
  scheduledDate?: Date;
  notes?: string;
}
