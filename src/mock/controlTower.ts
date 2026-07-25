import type { TowerNode, TowerWarning } from './chemTypes';

/** 全链路 8 节点 */
export const towerNodes: TowerNode[] = [
  {
    key: 'source',
    label: '寻源',
    kpiLabel: '寻源周期',
    kpiValue: '9 天',
    anomalyLevel: '低',
  },
  {
    key: 'procure',
    label: '采购',
    kpiLabel: '采购周期',
    kpiValue: '6 天',
    anomalyLevel: '中',
  },
  {
    key: 'inbound',
    label: '入库',
    kpiLabel: '质检通过率',
    kpiValue: '95.6%',
    anomalyLevel: '低',
  },
  {
    key: 'storage',
    label: '仓储',
    kpiLabel: '库存周转',
    kpiValue: '28 天',
    anomalyLevel: '中',
  },
  {
    key: 'plant',
    label: '厂内物流',
    kpiLabel: '转运准时率',
    kpiValue: '97.1%',
    anomalyLevel: '低',
  },
  {
    key: 'outbound',
    label: '出库',
    kpiLabel: '出库准确率',
    kpiValue: '98.4%',
    anomalyLevel: '低',
  },
  {
    key: 'transport',
    label: '运输',
    kpiLabel: '运输时效',
    kpiValue: '2.4 天',
    anomalyLevel: '高',
  },
  {
    key: 'deliver',
    label: '交付',
    kpiLabel: '交付准时率',
    kpiValue: '91.8%',
    anomalyLevel: '中',
  },
];

export const towerKpiCards = [
  { label: '寻源周期', value: '9', unit: '天', range: '5–15 天' },
  { label: '采购周期', value: '6', unit: '天', range: '3–10 天' },
  { label: '质检通过率', value: '95.6', unit: '%', range: '92–99%' },
  { label: '库存周转天数', value: '28', unit: '天', range: '20–45 天' },
  { label: '厂内转运准时率', value: '97.1', unit: '%', range: '—' },
  { label: '出库准确率', value: '98.4', unit: '%', range: '—' },
  { label: '运输时效', value: '2.4', unit: '天', range: '1–5 天' },
  { label: '交付准时率', value: '91.8', unit: '%', range: '85–98%' },
];

/** 异常热点：环节 × 频率 */
export const towerHeatmap: { stage: string; level: '高' | '中' | '低'; score: number }[] =
  [
    { stage: '寻源', level: '低', score: 1 },
    { stage: '采购', level: '中', score: 2 },
    { stage: '入库', level: '低', score: 1 },
    { stage: '仓储', level: '中', score: 2 },
    { stage: '厂内物流', level: '低', score: 1 },
    { stage: '出库', level: '低', score: 1 },
    { stage: '运输', level: '高', score: 3 },
    { stage: '交付', level: '中', score: 2 },
  ];

export const towerWarnings: TowerWarning[] = [
  {
    id: 'TW-001',
    severity: '高',
    stage: '运输',
    title: '湛江港疏运拥堵，3 车罐车超时风险',
    time: '2026-07-14 09:40',
  },
  {
    id: 'TW-002',
    severity: '高',
    stage: '运输',
    title: '环氧乙烷罐车温湿度超限已升级',
    time: '2026-07-14 08:15',
  },
  {
    id: 'TW-003',
    severity: '中',
    stage: '采购',
    title: '华峰化学 PO-2026-1012 交期可能延后 2 天',
    time: '2026-07-14 07:50',
  },
  {
    id: 'TW-004',
    severity: '中',
    stage: '仓储',
    title: '湛江2号库 丙烯腈 接近安全库存',
    time: '2026-07-13 22:10',
  },
  {
    id: 'TW-005',
    severity: '中',
    stage: '交付',
    title: '立邦涂料投诉色度异议待取样复检',
    time: '2026-07-13 16:30',
  },
  {
    id: 'TW-006',
    severity: '低',
    stage: '入库',
    title: '今日待检批次堆积至 8 批',
    time: '2026-07-13 11:05',
  },
  {
    id: 'TW-007',
    severity: '低',
    stage: '寻源',
    title: '溶剂类询价供应商响应偏慢',
    time: '2026-07-12 15:20',
  },
  {
    id: 'TW-008',
    severity: '低',
    stage: '出库',
    title: '中转库装车排队超过 40 分钟',
    time: '2026-07-12 10:00',
  },
];
