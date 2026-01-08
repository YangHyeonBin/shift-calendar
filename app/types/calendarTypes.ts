import type { ShiftType } from "~/constants/shift";

// 스케줄 타입: { "2025-01-06": "day", "2025-01-07": "swing", ... }
export type Schedule = Record<string, ShiftType>;
