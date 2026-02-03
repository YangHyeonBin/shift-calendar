import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { DEFAULT_SHIFT_CONFIG } from "~/constants/shift";
import { useCalendar } from "~/hooks/useCalendar";
import { useSwipePaint } from "~/hooks/useSwipePaint";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarGrid = () => {
  const { currentDate } = useCalendar();
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipePaint();

  //   해당 월 캘린더에 표시할 모든 날짜 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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
        className="grid grid-cols-7 gap-1 touch-none" // 스와이프 동작을 위해 스크롤 등 터치 액션 막음
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
  const { schedule } = useCalendar();

  const dateKey = format(day, "yyyy-MM-dd");
  const shiftEntry = schedule[dateKey];
  const shiftConfig = shiftEntry?.shiftType ? DEFAULT_SHIFT_CONFIG[shiftEntry.shiftType] : null;

  const dayOfWeek = day.getDay();

  return (
    <div
      data-date={dateKey}
      className={`
          aspect-square flex items-center justify-center rounded-xl text-sm font-medium
          select-none
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
