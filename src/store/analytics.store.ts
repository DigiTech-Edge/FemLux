import { create } from "zustand";
import { TimeRange } from "@/types/analytics";

interface AnalyticsState {
  timePeriod: TimeRange;
  setTimePeriod: (period: TimeRange) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  timePeriod: "last30days",
  setTimePeriod: (period) => set({ timePeriod: period }),
}));
