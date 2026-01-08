import { isSameMonth } from "date-fns";
import { useRef, useState, type TouchEvent } from "react";

import { useCalendar } from "./useCalendar";

export const useSwipePaint = () => {
  const { currentDate, selectedShift, setDayShift } = useCalendar();

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
    // e.preventDefault();

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

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
