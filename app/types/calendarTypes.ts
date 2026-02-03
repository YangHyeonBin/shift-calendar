import type { Tables } from "./database.types";

// UI 표시용 스케줄 타입: (key: date (ex) "2025-01-06", "2025-01-07")
export type ScheduleMap = Record<string, ScheduleEntry>;
export type ScheduleEntry = {
  shiftType: ShiftType;
  status: ScheduleStatus;
  id?: string; // DB 저장 후 생김
  naverEventId?: string; // 네이버 캘린더 동기화 후 생김
};

type ScheduleStatus =
  | "pending" // 로컬에서 선택만 함
  | "saving" // DB 저장 중
  | "saved" // DB 저장 완료 (동기화 안 함 or 동기화 OFF인 유저)
  | "syncing" // 네이버 동기화 중
  | "synced" // 동기화 완료
  | "sync_failed"; // 동기화 실패

type ScheduleRow = Tables<"schedules">;
export type Schedule = Omit<ScheduleRow, "created_at"> & {
  shift_type: ShiftType;
};

type ShiftTypeRow = Tables<"shift_types">;
export type ShiftType = Omit<ShiftTypeRow, "created_at">;
