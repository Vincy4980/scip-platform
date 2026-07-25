/** 供应链特色图表模拟数据 */

export const goodsSankey = {
  nodes: [
    { name: '供应商发货' },
    { name: '在途运输' },
    { name: '港口/中转入库' },
    { name: '湛江成品仓' },
    { name: '华东调拨' },
    { name: '客户交付' },
    { name: '损耗/退货' },
  ],
  links: [
    { source: 0, target: 1, value: 4200 },
    { source: 1, target: 2, value: 3900 },
    { source: 1, target: 6, value: 300 },
    { source: 2, target: 3, value: 2800 },
    { source: 2, target: 4, value: 1100 },
    { source: 3, target: 5, value: 2400 },
    { source: 4, target: 5, value: 950 },
    { source: 3, target: 6, value: 400 },
  ],
};

export const cashSankey = {
  nodes: [
    { name: '采购付款' },
    { name: '物流运费' },
    { name: '仓储费用' },
    { name: '运营成本池' },
    { name: '销售收入' },
    { name: '毛利留存' },
  ],
  links: [
    { source: 0, target: 3, value: 2500 },
    { source: 1, target: 3, value: 680 },
    { source: 2, target: 3, value: 420 },
    { source: 4, target: 3, value: 5200 },
    { source: 3, target: 5, value: 1600 },
  ],
};

export const realtimeGauges = [
  { name: 'OTD准时率', value: 94.2, fill: '#1677FF' },
  { name: '库存健康度', value: 82, fill: '#00B42A' },
  { name: '运力饱和度', value: 76, fill: '#FF7D29' },
  { name: '质量合格率', value: 96.8, fill: '#845EC2' },
];

/** 采购交付甘特：任务条 */
export const procurementGantt = [
  {
    id: 'G1',
    name: '乙烯 PO-1102',
    supplier: '中石化湛江',
    start: 0,
    duration: 8,
    progress: 1,
    status: '已入库',
  },
  {
    id: 'G2',
    name: '丙烯腈 PO-1108',
    supplier: '万华化学',
    start: 2,
    duration: 10,
    progress: 0.7,
    status: '已发货',
  },
  {
    id: 'G3',
    name: '甲苯 PO-1115',
    supplier: '巴斯夫',
    start: 5,
    duration: 12,
    progress: 0.4,
    status: '已下单',
  },
  {
    id: 'G4',
    name: 'MEK PO-1120',
    supplier: '壳牌化工',
    start: 7,
    duration: 9,
    progress: 0.15,
    status: '待审批',
  },
  {
    id: 'G5',
    name: '催化剂包 PO-1124',
    supplier: '优美科',
    start: 9,
    duration: 14,
    progress: 0.05,
    status: '草稿',
  },
];

export const supplierFunnel = [
  { name: '寻源长名单', value: 120, fill: '#1677FF' },
  { name: '资质初筛', value: 68, fill: '#3B8CFF' },
  { name: '样品/试供', value: 32, fill: '#845EC2' },
  { name: '商务谈判', value: 18, fill: '#FF7D29' },
  { name: '准入签约', value: 9, fill: '#00B42A' },
];

export const GANT_DAYS = [
  'D1',
  'D3',
  'D5',
  'D7',
  'D9',
  'D11',
  'D13',
  'D15',
  'D17',
  'D19',
  'D21',
  'D23',
];
