import { create } from 'zustand';
import {
  buildDashboardBundle,
  defaultDashboardFilter,
  filterSummary,
} from '../mock/dashboard';
import type { DashboardBundle, DashboardFilter } from '../mock/dashboardTypes';

interface DashboardState {
  filters: DashboardFilter;
  data: DashboardBundle;
  summary: string;
  autoRefresh: boolean;
  selectedKpi: string | null;
  setFilters: (patch: Partial<DashboardFilter>) => void;
  resetFilters: () => void;
  refresh: () => void;
  setSelectedKpi: (key: string | null) => void;
  setAutoRefresh: (v: boolean) => void;
}

function compute(filters: DashboardFilter) {
  return {
    data: buildDashboardBundle(filters),
    summary: filterSummary(filters),
  };
}

const initial = compute(defaultDashboardFilter);

export const useDashboardStore = create<DashboardState>((set, get) => ({
  filters: { ...defaultDashboardFilter },
  data: initial.data,
  summary: initial.summary,
  autoRefresh: true,
  selectedKpi: null,

  setFilters: (patch) => {
    const filters = { ...get().filters, ...patch };
    const next = compute(filters);
    set({ filters, ...next });
  },

  resetFilters: () => {
    const filters = { ...defaultDashboardFilter };
    set({ filters, ...compute(filters) });
  },

  refresh: () => {
    set({ ...compute(get().filters) });
  },

  setSelectedKpi: (key) => set({ selectedKpi: key }),
  setAutoRefresh: (v) => set({ autoRefresh: v }),
}));
