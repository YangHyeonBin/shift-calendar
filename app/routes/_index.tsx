import LoginPage from "~/components/auth/LoginPage";
import CalendarGrid from "~/components/calendar/CalendarGrid";
import MonthNavigation from "~/components/calendar/MonthNavigation";
import { AppLayout } from "~/components/layout/AppLayout";
import { useAuth } from "~/providers/AuthProvider";
import { CalendarProvider } from "~/providers/CalendarProvider";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <CalendarProvider>
      <AppLayout>
        <MonthNavigation />
        <CalendarGrid />
      </AppLayout>
    </CalendarProvider>
  );
}
