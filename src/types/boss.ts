export interface Boss {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  initialStamina: number;
  maxStamina: number;
  maxInnings: number;
  targetRuns: number;
}
