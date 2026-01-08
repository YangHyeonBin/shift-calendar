import { SHIFT_CONFIG, SHIFT_TYPES } from "~/constants/shift";
import { useCalendar } from "~/hooks/useCalendar";

const ShiftSelector = () => {
  const { selectedShift, setSelectedShift, schedule, clearSchedule } = useCalendar();

  const scheduleCount = Object.keys(schedule).length;

  const handleSave = () => {
    // TODO: DB 연동 후 구현
    alert(`근무 스케줄 등록 완료 (${scheduleCount}일)`);
  };

  const handleClear = () => {
    if (scheduleCount === 0) return;
    if (confirm("입력한 스케줄을 모두 초기화할까요?")) {
      clearSchedule();
    }
  };

  return (
    <div className="bg-white p-4 shadow-sm">
      {/* 액션 버튼 */}
      <div className="flex justify-end gap-2 mb-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={scheduleCount === 0}
          className={`
            px-3 py-2 rounded-lg font-medium text-xs
            transition-all duration-200 active:scale-95
            ${
              scheduleCount > 0
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          초기화
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={scheduleCount === 0}
          className={`
            px-4 py-2 rounded-lg font-medium text-xs
            transition-all duration-200 active:scale-95
            ${
              scheduleCount > 0
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          저장
        </button>
      </div>

      {/* 근무 선택 */}
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
              type="button"
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
