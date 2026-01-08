import { createContext, useMemo, useState, type ReactNode } from "react";
import { addMonths, format, subMonths } from "date-fns";

import { SHIFT_TYPES, type ShiftType } from "~/constants/shift";
import type { Schedule } from "~/types/calendarTypes";

interface CalendarContextType {
  // 월 네비게이션
  currentDate: Date;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;

  // 근무 선택
  selectedShift: ShiftType;
  setSelectedShift: (shift: ShiftType) => void;

  // 스케줄 관리
  schedule: Schedule;
  setDayShift: (date: Date, shift: ShiftType) => void;
  clearSchedule: () => void;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider = ({ children }: CalendarProviderProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState<ShiftType>(SHIFT_TYPES.DAY);
  const [schedule, setSchedule] = useState<Schedule>({});

  const actions = useMemo(
    () => ({
      goToPrevMonth: () => setCurrentDate((prev) => subMonths(prev, 1)),
      goToNextMonth: () => setCurrentDate((prev) => addMonths(prev, 1)),
      goToToday: () => setCurrentDate(new Date()),

      setDayShift: (date: Date, shift: ShiftType) => {
        const key = format(date, "yyyy-MM-dd");
        setSchedule((prev) => {
          // 이미 존재하면 토글
          if (prev[key] === shift) {
            const newSchedule = { ...prev };
            delete newSchedule[key];
            return newSchedule;
          }

          return { ...prev, [key]: shift };
        });
      },
      clearSchedule: () => setSchedule({}),
    }),
    []
  );

  const value = useMemo(
    () => ({
      currentDate,
      selectedShift,
      setSelectedShift,
      schedule,
      ...actions,
    }),
    [currentDate, selectedShift, schedule, actions]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};
