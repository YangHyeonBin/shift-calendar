export const SHIFT_TYPES = {
  DAY: "day",
  SWING: "swing",
  GY: "gy",
  OFF: "off",
} as const;

export type ShiftType = (typeof SHIFT_TYPES)[keyof typeof SHIFT_TYPES];

export const SHIFT_CONFIG = {
  [SHIFT_TYPES.DAY]: {
    label: "Day",
    shortLabel: "D",
    color: "bg-shift-day",
    textColor: "text-gray-900",
  },
  [SHIFT_TYPES.SWING]: {
    label: "Swing",
    shortLabel: "S",
    color: "bg-shift-swing",
    textColor: "text-white",
  },
  [SHIFT_TYPES.GY]: {
    label: "GY",
    shortLabel: "G",
    color: "bg-shift-gy",
    textColor: "text-white",
  },
  [SHIFT_TYPES.OFF]: {
    label: "휴무",
    shortLabel: "휴",
    color: "bg-shift-off",
    textColor: "text-gray-600",
  },
} as const;
