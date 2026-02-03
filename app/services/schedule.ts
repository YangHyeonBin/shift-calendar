import type { Schedule } from "~/types/calendarTypes";
import { supabase } from "~/utils/supabase";

/**
 * 월간 스케줄 조회
 */
export const fetchMonthlySchedule = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate: Date;
  endDate: Date;
}): Promise<Schedule[]> => {
  console.log(startDate, endDate);

  const { data, error } = await supabase
    .from("schedule")
    .select(
      `
            *,
            shift_type:shift_type_id(*)
        `
    )
    .eq("user_id", userId)
    .gte("date", startDate.toISOString())
    .lte("date", endDate.toISOString())
    .order("date");

  if (error) throw error;

  return data;
};

/**
 * 스케줄 저장
 */
export const saveSchedule = async () => {
  //
};
