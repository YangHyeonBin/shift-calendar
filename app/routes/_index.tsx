import CalendarGrid from "~/components/calendar/CalendarGrid";
import MonthNavigation from "~/components/calendar/MonthNavigation";
import { AppLayout } from "~/components/layout/AppLayout";
import { CalendarProvider } from "~/providers/CalendarProvider";

export default function Home() {
  return (
    <CalendarProvider>
      <AppLayout>
        <MonthNavigation />
        <CalendarGrid />
      </AppLayout>
    </CalendarProvider>
  );
}
