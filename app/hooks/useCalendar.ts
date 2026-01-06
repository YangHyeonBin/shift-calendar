import { useContext } from "react";

import { CalendarContext } from "~/providers/CalendarProvider";

export function useCalendar() {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }

  return context;
}
