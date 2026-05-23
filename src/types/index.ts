export type Role = 'dev' | 'qa' | 'pm' | 'design';
export type SprintPhase = 'start' | 'mid' | 'end';
export type StatusClass = 'ok' | 'warn' | 'danger';

export interface FormState {
  role: Role;
  sprintLen: number;
  sprintPhase: SprintPhase;
  activeTasks: number;
  storyPoints: number;
  capacity: number;
  absDays: number;
  unplanned: number;
  blockers: number;
  techDebt: number;
  codeReview: number;
  activeToggles: Set<string>;
}

export interface Recommendation {
  type: StatusClass;
  icon: string;
  text: string;
}

export interface FactorBreakdown {
  key: string;
  val: string;
  pct: number;
  max: number;
  color: string;
}

export interface WorkloadResult {
  score: number;
  color: string;
  statusIcon: string;
  statusText: string;
  statusClass: StatusClass;
  factors: FactorBreakdown[];
  recommendations: Recommendation[];
}
