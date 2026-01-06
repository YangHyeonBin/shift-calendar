import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { useCalendar } from "~/hooks/useCalendar";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarGrid = () => {
  const { currentDate } = useCalendar();

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
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayOfWeek = day.getDay();

          return (
            <div
              key={day.toISOString()}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm font-medium
                ${!isCurrentMonth ? "text-gray-300" : dayOfWeek === 0 ? "text-red-400" : dayOfWeek === 6 ? "text-blue-400" : "text-gray-700"}
                ${isCurrentMonth ? "bg-gray-100" : ""}
            `}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
