import { create } from "zustand";

interface TimeState {
  day: number;
  hour: number;
  minute: number;
  season: "spring" | "summer" | "autumn" | "winter";
  isDaylight: boolean;
  advanceTime: (minutes: number) => void;
  getTimeString: () => string;
  getDateString: () => string;
  getSolarEfficiency: () => number;
}

function getSeason(day: number): "spring" | "summer" | "autumn" | "winter" {
  const dayOfYear = day % 365;
  if (dayOfYear < 90) return "spring";
  if (dayOfYear < 180) return "summer";
  if (dayOfYear < 270) return "autumn";
  return "winter";
}

function isDaytime(hour: number): boolean {
  return hour >= 6 && hour < 18;
}

export const useTimeStore = create<TimeState>()((set, get) => ({
  day: 1,
  hour: 8,
  minute: 0,
  season: "spring",
  isDaylight: true,

  advanceTime: (minutes) => {
    set((state) => {
      let newMinute = state.minute + minutes;
      let newHour = state.hour;
      let newDay = state.day;

      while (newMinute >= 60) {
        newMinute -= 60;
        newHour++;
      }

      while (newHour >= 24) {
        newHour -= 24;
        newDay++;
      }

      return {
        day: newDay,
        hour: newHour,
        minute: newMinute,
        season: getSeason(newDay),
        isDaylight: isDaytime(newHour),
      };
    });
  },

  getTimeString: () => {
    const { hour, minute } = get();
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  },

  getDateString: () => {
    const { day, season } = get();
    const seasonNames = {
      spring: "春季",
      summer: "夏季",
      autumn: "秋季",
      winter: "冬季",
    };
    return `第 ${day} 天 ${seasonNames[season]}`;
  },

  getSolarEfficiency: () => {
    const { hour, season, isDaylight } = get();
    if (!isDaylight) return 0.1;

    const baseEfficiency = 0.8;
    const hourFactor = Math.sin(((hour - 6) / 12) * Math.PI);
    const seasonFactors = {
      spring: 0.9,
      summer: 1.0,
      autumn: 0.85,
      winter: 0.7,
    };

    return baseEfficiency * hourFactor * seasonFactors[season];
  },
}));
