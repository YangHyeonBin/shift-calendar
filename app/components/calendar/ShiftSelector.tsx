import { SHIFT_CONFIG, SHIFT_TYPES } from "~/constants/shift";
import { useCalendar } from "~/hooks/useCalendar";

const ShiftSelector = () => {
  const { selectedShift, setSelectedShift, schedule } = useCalendar();

  const scheduleCount = Object.keys(schedule).length;

  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-gray-700 mb-2">
        근무 선택 {scheduleCount > 0 && `· ${scheduleCount}일 입력됨`}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Object.values(SHIFT_TYPES).map((shiftType) => {
          const config = SHIFT_CONFIG[shiftType];
          const isSelected = selectedShift === shiftType;

          return (
            <button
              key={shiftType}
              onClick={() => setSelectedShift(shiftType)}
              className={`
                ${config.color} ${config.textColor}
                font-bold py-3 rounded-xl
                transition-all duration-200 active:scale-95
                flex flex-col items-center gap-1
                ${isSelected ? "ring-4 ring-blue-400 scale-105" : "ring-2 ring-gray-200"}
            `}
            >
              <span className="text-xs">{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftSelector;
