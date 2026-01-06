import { addMonths, subMonths } from "date-fns";
import { createContext, useState, type ReactNode } from "react";

interface CalendarContextType {
  currentDate: Date;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider = ({ children }: CalendarProviderProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <CalendarContext.Provider value={{ currentDate, goToPrevMonth, goToNextMonth, goToToday }}>
      {children}
    </CalendarContext.Provider>
  );
};
