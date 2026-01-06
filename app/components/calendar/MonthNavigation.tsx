import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { useCalendar } from "~/hooks/useCalendar";

const MonthNavigation = () => {
  const { currentDate, goToPrevMonth, goToNextMonth, goToToday } = useCalendar();

  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={goToPrevMonth} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        ←
      </button>

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "yyyy년 M월", { locale: ko })}
        </h2>

        <button
          onClick={goToToday}
          className="text-cs bg-gray-100 px-2 py-1 rounded-md text-gray-600 hover:bg-gray-200"
        >
          오늘
        </button>
      </div>

      <button onClick={goToNextMonth} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        →
      </button>
    </div>
  );
};

export default MonthNavigation;
