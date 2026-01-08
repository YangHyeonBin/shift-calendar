import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useRef, useState, type TouchEvent } from "react";

import { SHIFT_CONFIG } from "~/constants/shift";
import { useCalendar } from "~/hooks/useCalendar";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarGrid = () => {
  const { currentDate, selectedShift, setDayShift } = useCalendar();

  //   해당 월 캘린더에 표시할 모든 날짜 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // TODO: 스와이프 로직은 훅으로 분리
  const [isDrawing, setIsDrawing] = useState(false);
  const touchedDates = useRef<Set<string>>(new Set()); // 'yyyy-MM-dd' format

  // 터치 좌표에서 날짜 요소 찾기
  const getDateFromPoint = (x: number, y: number): string | null => {
    const element = document.elementFromPoint(x, y);
    return element?.getAttribute("data-date") || null;
  };

  // 날짜에 근무 적용
  const applyShift = (dateKey: string) => {
    if (touchedDates.current.has(dateKey)) return; // 존재하면,, 삭제하도록 변경?
    touchedDates.current.add(dateKey);

    const date = new Date(dateKey);
    if (isSameMonth(date, currentDate)) {
      setDayShift(date, selectedShift);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    const dateKey = getDateFromPoint(touch.clientX, touch.clientY);

    if (dateKey) {
      setIsDrawing(true);
      touchedDates.current = new Set();
      applyShift(dateKey);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const touch = e.touches[0];
    const dateKey = getDateFromPoint(touch.clientX, touch.clientY);

    if (dateKey) {
      applyShift(dateKey);
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    touchedDates.current.clear();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold py-2 ${
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div
        className="grid grid-cols-7 gap-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "auto" }}
      >
        {days.map((day) => (
          <DayItem
            key={format(day, "yyyy-MM-dd")}
            day={day}
            isCurrentMonth={isSameMonth(day, currentDate)}
          />
        ))}
      </div>
    </div>
  );
};

interface DayItemProps {
  day: Date;
  isCurrentMonth: boolean;
}

const DayItem = ({ day, isCurrentMonth }: DayItemProps) => {
  const { schedule, selectedShift, setDayShift } = useCalendar();

  const dateKey = format(day, "yyyy-MM-dd");
  const shift = schedule[dateKey];
  const shiftConfig = shift ? SHIFT_CONFIG[shift] : null;

  const dayOfWeek = day.getDay();

  return (
    <div
      onClick={() => setDayShift(day, selectedShift)}
      className={`
          aspect-square flex items-center justify-center rounded-xl text-sm font-medium
          ${!isCurrentMonth ? "text-gray-300" : dayOfWeek === 0 ? "text-red-400" : dayOfWeek === 6 ? "text-blue-400" : "text-gray-700"}
          ${isCurrentMonth ? "bg-gray-100" : ""}
          ${shiftConfig ? `${shiftConfig.color} ${shiftConfig.textColor} shadow-md` : ""}
      `}
    >
      {format(day, "d")}
    </div>
  );
};

export default CalendarGrid;
