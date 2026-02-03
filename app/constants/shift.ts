export const DEFAULT_SHIFT_TYPES = {
  DAY: "day",
  SWING: "swing",
  GY: "gy",
  OFF: "off",
} as const;

// export type ShiftType = (typeof DEFAULT_SHIFT_TYPES)[keyof typeof DEFAULT_SHIFT_TYPES];

export const DEFAULT_SHIFT_CONFIG = {
  [DEFAULT_SHIFT_TYPES.DAY]: {
    name: "Day",
    shortLabel: "D",
    color: "bg-shift-day",
    textColor: "text-gray-900",
  },
  [DEFAULT_SHIFT_TYPES.SWING]: {
    name: "Swing",
    shortLabel: "S",
    color: "bg-shift-swing",
    textColor: "text-white",
  },
  [DEFAULT_SHIFT_TYPES.GY]: {
    name: "GY",
    shortLabel: "G",
    color: "bg-shift-gy",
    textColor: "text-white",
  },
  [DEFAULT_SHIFT_TYPES.OFF]: {
    name: "휴무",
    shortLabel: "휴",
    color: "bg-shift-off",
    textColor: "text-gray-600",
  },
} as const;
