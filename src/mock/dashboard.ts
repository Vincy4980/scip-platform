import type {
  CompareType,
  DashboardBundle,
  DashboardFilter,
  ExceptionRow,
  HealthPoint,
  TimeDimension,
} from './dashboardTypes';

const TIME_LABEL: Record<TimeDimension, string> = {
  today: '今天',
  week: '本周',
  month: '本月',
  quarter: '本季度',
  year: '本年',
  custom: '自定义',
};

const COMPARE_LABEL: Record<CompareType, string> = {
  mom: '环比',
  yoy: '同比',
  none: '无对比',
};

export function filterSummary(f: DashboardFilter): string {
  return [
    TIME_LABEL[f.timeDimension],
    f.region === '全部' ? '全部区域' : f.region,
    f.category === '全部' ? '全部品类' : f.category,
    COMPARE_LABEL[f.compareType],
  ].join(' · ');
}

/** 用筛选条件生成确定性扰动因子，便于演示「筛选后数据变化」 */
function factor(f: DashboardFilter): number {
  let x = 1;
  if (f.timeDimension === 'today') x *= 0.96;
  if (f.timeDimension === 'week') x *= 0.98;
  if (f.timeDimension === 'quarter') x *= 1.01;
  if (f.timeDimension === 'year') x *= 1.02;
  if (f.region !== '全部') x *= 0.985;
  if (f.category !== '全部') x *= 0.99;
  if (f.supplierRegion === '中东' || f.supplierRegion === '欧洲') x *= 0.97;
  if (f.warehouseRegion === '海外') x *= 0.98;
  if (f.compareType === 'yoy') x *= 1.005;
  return x;
}

function round(n: number, d = 1) {
  const m = 10 ** d;
  return Math.round(n * m) / m;
}

/** 始终生成近 90 天，图表局部筛选再切片 */
function buildHealthTrend(f: DashboardFilter): HealthPoint[] {
  const fac = factor(f);
  const days = 90;
  const out: HealthPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(2026, 6, 14);
    d.setDate(d.getDate() - i);
    const wobble = Math.sin(i / 3) * 4 + Math.cos(i / 5) * 2;
    const score = Math.min(98, Math.max(68, (82 + wobble) * fac));
    out.push({
      date: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      score: round(score),
    });
  }
  return out;
}

/** 近 12 个月单位成本 */
function buildUnitCostTrend(fac: number) {
  const base = [1.28, 1.25, 1.24, 1.22, 1.2, 1.18, 1.25, 1.2, 1.16, 1.19, 1.17, 1.21];
  const out: { month: string; unitCost: number; ym: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(2026, 6 - (11 - i), 1); // 2025-08 … 2026-07
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    out.push({
      month: `${String(m).padStart(2, '0')}月`,
      unitCost: round(base[i]! * fac, 2),
      ym: `${y}-${String(m).padStart(2, '0')}`,
    });
  }
  return out;
}

function buildSupplyDemand(fac: number) {
  const out: {
    month: string;
    supply: number;
    demand: number;
    forecast: number;
    ym: string;
  }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(2026, 6 - (11 - i), 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const supply = round((7800 + i * 220 + Math.sin(i) * 120) * fac, 0);
    const demand = round((7700 + i * 230 + Math.cos(i) * 100) * fac, 0);
    const forecast = round(demand * (0.97 + (i % 3) * 0.01), 0);
    out.push({
      month: `${String(m).padStart(2, '0')}月`,
      supply,
      demand,
      forecast,
      ym: `${y}-${String(m).padStart(2, '0')}`,
    });
  }
  return out;
}

function buildQualityTrend(fac: number) {
  const rates = [95.2, 95.8, 96.1, 96.4, 96.0, 96.8];
  return rates.map((r, i) => {
    const d = new Date(2026, 6 - (5 - i), 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    return {
      month: `${String(m).padStart(2, '0')}月`,
      rate: round(Math.min(99.5, r * fac), 1),
      ym: `${y}-${String(m).padStart(2, '0')}`,
    };
  });
}

const EXCEPTIONS_BASE: ExceptionRow[] = [
  {
    id: 'EX-01',
    stage: '运输',
    type: '运输超时 / 路线偏离',
    count: 14,
    trend: 'up',
    severity: '高',
    link: '/logistics',
  },
  {
    id: 'EX-02',
    stage: '供应商',
    type: '供应商交期延迟',
    count: 9,
    trend: 'up',
    severity: '高',
    link: '/procurement',
  },
  {
    id: 'EX-03',
    stage: '仓储',
    type: '库存不足 / 安全库存突破',
    count: 12,
    trend: 'flat',
    severity: '中',
    link: '/inventory',
  },
  {
    id: 'EX-04',
    stage: '采购',
    type: '质检不合格 / 单据缺失',
    count: 6,
    trend: 'down',
    severity: '中',
    link: '/orders',
  },
  {
    id: 'EX-05',
    stage: '交付',
    type: '交付延迟 / 客户投诉',
    count: 5,
    trend: 'down',
    severity: '低',
    link: '/delivery',
  },
  {
    id: 'EX-06',
    stage: '质检',
    type: '来料纯度偏低',
    count: 4,
    trend: 'flat',
    severity: '中',
    link: '/warehouse',
  },
];

export function buildDashboardBundle(f: DashboardFilter): DashboardBundle {
  const fac = factor(f);
  const healthTrend = buildHealthTrend(f);
  const healthScore = healthTrend[healthTrend.length - 1]?.score ?? 82;
  const prev = healthTrend[healthTrend.length - 8]?.score ?? healthScore - 2;
  const healthDelta = round(healthScore - prev);

  const procure = round(3.2 * fac);
  const storage = round(4.5 * fac);
  const transport = round(3.8 * (f.region === '海外' ? 1.15 : fac));
  const deliver = round(1.0 * fac);
  const leadTimeDays = round(procure + storage + transport + deliver);

  const compareMul =
    f.compareType === 'none' ? 0 : f.compareType === 'yoy' ? 0.7 : 1;

  const totalCostWan = round(4860 * fac, 0);
  const costSlices = [
    { name: '采购成本', value: round(totalCostWan * 0.52, 0), pct: 52 },
    { name: '物流成本', value: round(totalCostWan * 0.22, 0), pct: 22 },
    { name: '仓储成本', value: round(totalCostWan * 0.18, 0), pct: 18 },
    { name: '管理成本', value: round(totalCostWan * 0.08, 0), pct: 8 },
  ];

  const qualityRate = round(Math.min(99.5, 96.4 * fac), 1);
  const anomalyCount = Math.max(
    8,
    Math.round(23 * (2 - fac) * (f.region === '全部' ? 1 : 0.7)),
  );

  const now = new Date();
  const updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return {
    kpis: {
      healthScore,
      healthDelta: round(healthDelta * compareMul || healthDelta),
      healthSpark: healthTrend.slice(-7).map((p) => p.score),
      leadTimeDays,
      leadTimeDelta: round((-1.8 * fac) * (compareMul || 1), 1),
      leadBreakdown: [
        { label: '采购', days: procure },
        { label: '仓储', days: storage },
        { label: '运输', days: transport },
        { label: '交付', days: deliver },
      ],
      totalCostWan,
      costDelta: round(2.3 * fac * (compareMul || 1), 1),
      budgetRate: round(Math.min(108, 92 + (1 - fac) * 40), 1),
      capacityUtil: round(Math.min(98, 86.5 * fac), 1),
      capacityDelta: round(-0.5 * fac * (compareMul || 1), 1),
      capacityBottleneck:
        f.warehouseRegion === '海外' || f.region === '海外'
          ? '海外仓周转'
          : '湛江装车月台',
      qualityRate,
      qualityDelta: round(1.2 * fac * (compareMul || 1), 1),
      qualityIssues: Math.round(18 * (2 - fac)),
      anomalyCount,
      anomalyDelta: Math.round(2 * (2 - fac) * (compareMul || 1)),
      anomalyBySeverity: [
        { level: '紧急', count: Math.round(anomalyCount * 0.15), color: 'bg-red-500' },
        { level: '高', count: Math.round(anomalyCount * 0.3), color: 'bg-orange-400' },
        { level: '中', count: Math.round(anomalyCount * 0.35), color: 'bg-amber-300' },
        { level: '低', count: Math.round(anomalyCount * 0.2), color: 'bg-sky-400' },
      ],
    },
    healthTrend,
    healthRadar: [
      { dim: '采购', score: round(84 * fac), target: 90 },
      { dim: '仓储', score: round(79 * fac), target: 88 },
      { dim: '物流', score: round(76 * fac), target: 90 },
      { dim: '交付', score: round(88 * fac), target: 92 },
      { dim: '供应商', score: round(82 * fac), target: 90 },
    ],
    leadTime: [
      { stage: '采购周期', planned: 3.0, actual: procure, attainment: round((3.0 / procure) * 100, 1) },
      { stage: '仓储周期', planned: 4.0, actual: storage, attainment: round((4.0 / storage) * 100, 1) },
      { stage: '运输周期', planned: 3.5, actual: transport, attainment: round((3.5 / transport) * 100, 1) },
      { stage: '交付周期', planned: 1.0, actual: deliver, attainment: round((1.0 / deliver) * 100, 1) },
    ],
    leadOverallAttainment: round(91.2 * fac, 1),
    costSlices,
    unitCostTrend: buildUnitCostTrend(fac),
    costSavingPct: round(64 * fac, 0),
    supplyDemand: buildSupplyDemand(fac),
    fulfillRate: round(Math.min(99, 96.8 * fac), 1),
    forecastAccuracy: round(Math.min(98, 91.5 * fac), 1),
    qualityBars: [
      { name: '来料合格率', rate: round(97.2 * fac, 1), yoy: 0.8 },
      { name: '仓储保质率', rate: round(98.5 * fac, 1), yoy: 0.3 },
      { name: '运输完好率', rate: round(96.1 * fac, 1), yoy: -0.4 },
      { name: '交付准确率', rate: round(98.0 * fac, 1), yoy: 1.1 },
    ],
    qualityIssues: [
      { reason: '纯度偏低', count: 8 },
      { reason: '水分超标', count: 6 },
      { reason: '包装破损', count: 5 },
      { reason: '标识不符', count: 3 },
      { reason: '杂质超标', count: 2 },
    ],
    qualityTrend: buildQualityTrend(fac),
    exceptions: EXCEPTIONS_BASE.map((e) => ({
      ...e,
      count: Math.max(1, Math.round(e.count * (2 - fac))),
    })),
    updatedAt,
  };
}

export const defaultDashboardFilter: DashboardFilter = {
  timeDimension: 'month',
  timeGranularity: 'day',
  region: '全部',
  category: '全部',
  supplierRegion: '全部',
  warehouseRegion: '全部',
  compareType: 'mom',
};
