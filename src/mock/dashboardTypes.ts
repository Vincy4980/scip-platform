export type TimeDimension =
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom';

export type TimeGranularity = 'day' | 'week' | 'month' | 'quarter';
export type CompareType = 'mom' | 'yoy' | 'none';

export interface DashboardFilter {
  timeDimension: TimeDimension;
  timeGranularity: TimeGranularity;
  region: string;
  category: string;
  supplierRegion: string;
  warehouseRegion: string;
  compareType: CompareType;
}

export interface HealthPoint {
  date: string;
  score: number;
}

export interface RadarDim {
  dim: string;
  score: number;
  target: number;
}

export interface LeadTimeRow {
  stage: string;
  planned: number;
  actual: number;
  attainment: number;
}

export interface CostSlice {
  name: string;
  value: number;
  pct: number;
}

export interface UnitCostPoint {
  month: string;
  unitCost: number;
  /** yyyy-mm，供局部日期筛选 */
  ym: string;
}

export interface SupplyDemandPoint {
  month: string;
  supply: number;
  demand: number;
  forecast: number;
  ym: string;
}

export interface QualityBar {
  name: string;
  rate: number;
  yoy: number;
}

export interface QualityTrendPoint {
  month: string;
  rate: number;
  ym: string;
}

export interface QualityIssue {
  reason: string;
  count: number;
}

export interface ExceptionRow {
  id: string;
  stage: string;
  type: string;
  count: number;
  trend: 'up' | 'down' | 'flat';
  severity: '高' | '中' | '低';
  link: string;
}

export interface DashboardKpis {
  healthScore: number;
  healthDelta: number;
  healthSpark: number[];
  leadTimeDays: number;
  leadTimeDelta: number;
  leadBreakdown: { label: string; days: number }[];
  totalCostWan: number;
  costDelta: number;
  budgetRate: number;
  capacityUtil: number;
  capacityDelta: number;
  capacityBottleneck: string;
  qualityRate: number;
  qualityDelta: number;
  qualityIssues: number;
  anomalyCount: number;
  anomalyDelta: number;
  anomalyBySeverity: { level: string; count: number; color: string }[];
}

export interface DashboardBundle {
  kpis: DashboardKpis;
  healthTrend: HealthPoint[];
  healthRadar: RadarDim[];
  leadTime: LeadTimeRow[];
  leadOverallAttainment: number;
  costSlices: CostSlice[];
  unitCostTrend: UnitCostPoint[];
  costSavingPct: number;
  supplyDemand: SupplyDemandPoint[];
  fulfillRate: number;
  forecastAccuracy: number;
  qualityBars: QualityBar[];
  qualityIssues: QualityIssue[];
  qualityTrend: QualityTrendPoint[];
  exceptions: ExceptionRow[];
  updatedAt: string;
}
