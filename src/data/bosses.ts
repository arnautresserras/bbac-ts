import { Boss } from "../types/boss";

export const BOSS_1: Boss = {
  id: "boss_1",
  name: "The Rookie",
  tier: 1,
  initialStamina: 20,
  maxStamina: 25,
  maxInnings: 3,
  targetRuns: 2,
};

export const MIDDLE_BOSS_POOL: Boss[] = [
  {
    id: "middle_1",
    name: "The Fastballer",
    tier: 1,
    initialStamina: 22,
    maxStamina: 27,
    maxInnings: 4,
    targetRuns: 3,
  },
  {
    id: "middle_2",
    name: "The Curveball King",
    tier: 1,
    initialStamina: 22,
    maxStamina: 28,
    maxInnings: 4,
    targetRuns: 3,
  },
  {
    id: "middle_3",
    name: "The Veteran",
    tier: 2,
    initialStamina: 25,
    maxStamina: 30,
    maxInnings: 5,
    targetRuns: 3,
  },
  {
    id: "middle_4",
    name: "The Sidearm",
    tier: 2,
    initialStamina: 24,
    maxStamina: 29,
    maxInnings: 4,
    targetRuns: 3,
  },
  {
    id: "middle_5",
    name: "The Reliever",
    tier: 1,
    initialStamina: 20,
    maxStamina: 26,
    maxInnings: 4,
    targetRuns: 3,
  },
  {
    id: "middle_6",
    name: "The Ace",
    tier: 2,
    initialStamina: 26,
    maxStamina: 32,
    maxInnings: 5,
    targetRuns: 3,
  },
];

export const BOSS_4: Boss = {
  id: "boss_4",
  name: "The Legend",
  tier: 3,
  initialStamina: 30,
  maxStamina: 35,
  maxInnings: 5,
  targetRuns: 4,
};
