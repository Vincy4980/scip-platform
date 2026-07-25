export type AlertLevel = 'critical' | 'warning' | 'info';
export type InventoryStatus = 'green' | 'yellow' | 'red';
export type MetricTone = 'green' | 'yellow' | 'red';
export type SupplierGrade = 'A' | 'B' | 'C';
export type PerformancePeriod = '30d' | '90d' | '180d';
export type AlertHandleStatus = 'pending' | 'processing' | 'escalated' | 'resolved';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  grade: SupplierGrade;
  onTimeRate: number;
  qualityRate: number;
  responseHours: number;
  /** 综合评级：绿正常 / 黄关注 / 红异常 */
  risk: 'normal' | 'attention' | 'critical';
  anomalies: string[];
  contact: string;
  lastOrderDate: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  currentStock: number;
  safetyStock: number;
  maxStock: number;
  status: InventoryStatus;
  shelf: string;
  row: number;
  col: number;
  unit: string;
}

export interface InventoryThresholdRule {
  warehouse: string;
  greenMinPct: number;
  yellowMinPct: number;
  redMaxPct: number;
  safetyDays: number;
  basedOnMonths: number;
}

export interface AlertItem {
  id: string;
  type: string;
  typeKey: string;
  category: string;
  level: AlertLevel;
  title: string;
  description: string;
  shipmentId?: string;
  location?: string;
  lat?: number;
  lng?: number;
  time: string;
  status: AlertHandleStatus;
}

export interface KpiItem {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
  trend: number;
  trendLabel: string;
}

export interface TrendPoint {
  date: string;
  shipments: number;
  onTimeRate: number;
  anomalies: number;
}

export interface ReplenishmentAdvice {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  currentStock: number;
  suggestQty: number;
  eta: string;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface ShipmentTrack {
  id: string;
  vehicle: string;
  from: string;
  to: string;
  status: string;
  hasAnomaly: boolean;
  lat: number;
  lng: number;
  path: [number, number][];
  anomalyLat?: number;
  anomalyLng?: number;
}

export interface NotifyChannels {
  popup: boolean;
  email: boolean;
  wecom: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  threshold: string;
  thresholdValue: number;
  channels: NotifyChannels;
}

export interface AlertCategoryGroup {
  key: string;
  label: string;
  types: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
}

export type AiReplyKind = 'text' | 'table' | 'chart' | 'fallback' | 'clarify';

export interface AiTablePayload {
  columns: string[];
  rows: (string | number)[][];
}

export interface AiChartPoint {
  label: string;
  value: number;
}

export interface AiReplyPayload {
  kind: AiReplyKind;
  text: string;
  source?: string;
  table?: AiTablePayload;
  chart?: AiChartPoint[];
  actions?: { label: string; action: string }[];
  clarifyOptions?: string[];
}
