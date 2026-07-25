/** 全球化数据接口与模拟数据 */

export interface Country {
  name: string;
  code: string;
  continent: string;
  currency: string;
  utcOffset: number;
  mainPorts: string[];
  lat: number;
  lng: number;
}

export type SupplierTier = '战略级' | '优选级' | '合格级' | '观察级' | '淘汰级';
export type EsgGrade = 'A' | 'B' | 'C' | 'D';

export interface GlobalSupplier {
  id: string;
  name: string;
  hqCountry: string;
  continent: string;
  category: string;
  foundedYear: number;
  employees: number;
  revenueUsdBn: number;
  onTimeRate: number;
  qualityRate: number;
  responseHours: number;
  isoCerts: string[];
  reachCompliant: boolean;
  esg: EsgGrade;
  coopYears: number;
  tier: SupplierTier;
  globalCapability: string;
  lat: number;
  lng: number;
  anomalies: string[];
}

export interface GlobalMaterial {
  id: string;
  sku: string;
  name: string;
  nameZh: string;
  category: string;
  unit: '吨' | '千克' | '升';
  originCountry: string;
  producer: string;
  hsCode: string;
  hazardClass: string;
}

export interface GlobalWarehouse {
  id: string;
  name: string;
  country: string;
  city: string;
  type: '枢纽' | '中转' | '保税' | '战略';
  capacityTons: number;
  utilizationPct: number;
  lat: number;
  lng: number;
  stockTons: number;
}

export interface ShippingRoute {
  id: string;
  from: string;
  to: string;
  mode: '海运' | '铁路' | '多式联运';
  days: number;
  viaCountries: string[];
  carrier: string;
  path: [number, number][];
}

export interface FxRate {
  pair: string;
  rate: number;
  base: string;
  quote: string;
}

export interface FxTrendPoint {
  date: string;
  USD: number;
  EUR: number;
  JPY: number;
  KRW: number;
  SGD: number;
}

export interface CostCompareRow {
  supplierId: string;
  supplierName: string;
  country: string;
  quoteCny: number;
  dutyCny: number;
  logisticsCny: number;
  totalCny: number;
  material: string;
}

export interface CustomsShipment {
  id: string;
  cargo: string;
  fromPort: string;
  toPort: string;
  eta: string;
  status: '已装船' | '在途' | '待清关' | '已放行';
  customsStage: '申报中' | '查验中' | '已放行' | '已结关';
  hsCode: string;
  valueUsd: number;
  origin: string;
  dest: string;
}

export interface DocumentItem {
  id: string;
  shipmentId: string;
  type: '商业发票' | '装箱单' | '提单' | '原产地证' | '保险单';
  ready: boolean;
}

export interface LicenseItem {
  id: string;
  name: string;
  expiry: string;
  daysLeft: number;
}

export interface FinanceOverview {
  apTotalCny: number;
  arTotalCny: number;
  lcInTransitCny: number;
  financingBalanceCny: number;
}

export interface ApArItem {
  id: string;
  party: string;
  type: 'AP' | 'AR';
  amountCny: number;
  currency: string;
  amountOrig: number;
  aging: '30天内' | '60天内' | '90天+';
  dueDate: string;
}

export interface LetterOfCredit {
  id: string;
  bank: string;
  beneficiary: string;
  amountOrig: number;
  currency: string;
  amountCny: number;
  issueDate: string;
  expiry: string;
  status: '待审' | '已开立' | '已交单' | '已付款';
}

export interface CarbonBreakdown {
  name: string;
  value: number;
  pct: number;
}

export interface ComplianceReport {
  id: string;
  name: string;
  expiry: string;
  downloadReady: boolean;
}

export interface RiskSupplier {
  id: string;
  name: string;
  country: string;
  level: '高' | '中' | '低';
  factors: string[];
  action: string;
}

export interface GeoRisk {
  id: string;
  region: string;
  title: string;
  impact: string;
  time: string;
}

export interface AltSupply {
  material: string;
  primary: string;
  alt: string;
  switchDays: number;
  costDeltaPct: number;
}

export interface DisasterZone {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  affectedOrders: number;
}

export interface IncotermInfo {
  code: string;
  name: string;
  costs: string[];
}

export interface SupplierRiskRadar {
  political: number;
  fx: number;
  logistics: number;
  quality: number;
  finance: number;
}

/* ===================== 数据 ===================== */

export const countries: Country[] = [
  {
    name: '中国',
    code: 'CN',
    continent: '亚洲',
    currency: 'CNY',
    utcOffset: 8,
    mainPorts: ['上海港', '宁波舟山港', '深圳港', '湛江港'],
    lat: 31.23,
    lng: 121.47,
  },
  {
    name: '德国',
    code: 'DE',
    continent: '欧洲',
    currency: 'EUR',
    utcOffset: 1,
    mainPorts: ['汉堡港', '不来梅港'],
    lat: 53.55,
    lng: 9.99,
  },
  {
    name: '美国',
    code: 'US',
    continent: '北美',
    currency: 'USD',
    utcOffset: -6,
    mainPorts: ['休斯顿港', '洛杉矶港'],
    lat: 29.76,
    lng: -95.37,
  },
  {
    name: '日本',
    code: 'JP',
    continent: '亚洲',
    currency: 'JPY',
    utcOffset: 9,
    mainPorts: ['东京港', '横滨港'],
    lat: 35.45,
    lng: 139.65,
  },
  {
    name: '韩国',
    code: 'KR',
    continent: '亚洲',
    currency: 'KRW',
    utcOffset: 9,
    mainPorts: ['釜山港', '仁川港'],
    lat: 35.1,
    lng: 129.04,
  },
  {
    name: '沙特',
    code: 'SA',
    continent: '亚洲',
    currency: 'SAR',
    utcOffset: 3,
    mainPorts: ['吉达港', '达曼港'],
    lat: 21.49,
    lng: 39.19,
  },
  {
    name: '荷兰',
    code: 'NL',
    continent: '欧洲',
    currency: 'EUR',
    utcOffset: 1,
    mainPorts: ['鹿特丹港', '阿姆斯特丹港'],
    lat: 51.92,
    lng: 4.48,
  },
  {
    name: '新加坡',
    code: 'SG',
    continent: '亚洲',
    currency: 'SGD',
    utcOffset: 8,
    mainPorts: ['新加坡港'],
    lat: 1.26,
    lng: 103.83,
  },
  {
    name: '马来西亚',
    code: 'MY',
    continent: '亚洲',
    currency: 'MYR',
    utcOffset: 8,
    mainPorts: ['巴生港', '丹戎帕拉帕斯港'],
    lat: 3.0,
    lng: 101.4,
  },
  {
    name: '比利时',
    code: 'BE',
    continent: '欧洲',
    currency: 'EUR',
    utcOffset: 1,
    mainPorts: ['安特卫普港', '泽布吕赫港'],
    lat: 51.22,
    lng: 4.4,
  },
  {
    name: '瑞士',
    code: 'CH',
    continent: '欧洲',
    currency: 'CHF',
    utcOffset: 1,
    mainPorts: ['巴塞尔莱茵港'],
    lat: 47.56,
    lng: 7.59,
  },
  {
    name: '英国',
    code: 'GB',
    continent: '欧洲',
    currency: 'GBP',
    utcOffset: 0,
    mainPorts: ['南安普顿港', '费利克斯托港'],
    lat: 50.9,
    lng: -1.4,
  },
];

const countryCoord = Object.fromEntries(
  countries.map((c) => [c.name, { lat: c.lat, lng: c.lng, continent: c.continent }]),
);

const DOMESTIC_NAMES = [
  '中石化湛江东兴石化',
  '茂名石油化工公司',
  '万华化学集团',
  '华峰化学股份',
  '金发科技股份',
  '浙江龙盛集团',
  '桐昆集团股份',
  '恒力石化股份',
  '荣盛石化股份',
  '盛虹控股集团',
  '中科炼化（湛江）',
  '上海华谊集团',
  '江苏扬农化工',
  '浙江卫星石化',
  '山东齐鲁石化',
  '中海壳牌石化（惠州）',
  '南通星辰合成材料',
  '淄博齐翔腾达',
  '广东新会美达锦纶',
  '珠海中富工业包装',
];

const OVERSEAS: { name: string; country: string; category: string }[] = [
  { name: 'BASF SE', country: '德国', category: '精细化学品' },
  { name: 'Dow Chemical', country: '美国', category: '基础化学品' },
  { name: 'ExxonMobil Chemical', country: '美国', category: '基础化学品' },
  { name: 'SABIC', country: '沙特', category: '聚合物' },
  { name: 'LG Chem', country: '韩国', category: '聚合物' },
  { name: 'Mitsubishi Chemical', country: '日本', category: '精细化学品' },
  { name: 'INEOS', country: '英国', category: '基础化学品' },
  { name: 'LyondellBasell', country: '荷兰', category: '聚合物' },
  { name: 'Evonik Industries', country: '德国', category: '特殊化学品' },
  { name: 'DSM-Firmenich', country: '荷兰', category: '精细化学品' },
  { name: 'Celanese', country: '美国', category: '特殊化学品' },
  { name: 'Eastman Chemical', country: '美国', category: '特殊化学品' },
  { name: 'Solvay', country: '比利时', category: '特殊化学品' },
  { name: 'Toray Industries', country: '日本', category: '聚合物' },
  { name: 'Asahi Kasei', country: '日本', category: '聚合物' },
  { name: 'Sumitomo Chemical', country: '日本', category: '精细化学品' },
  { name: 'Bayer MaterialScience', country: '德国', category: '聚合物' },
  { name: 'Henkel Adhesive Tech', country: '德国', category: '特殊化学品' },
  { name: 'Clariant', country: '瑞士', category: '特殊化学品' },
  { name: 'Givaudan', country: '瑞士', category: '精细化学品' },
  { name: 'Petronas Chemicals', country: '马来西亚', category: '基础化学品' },
  { name: 'Shell Chemicals', country: '荷兰', category: '基础化学品' },
  { name: 'Covestro', country: '德国', category: '聚合物' },
  { name: 'Huntsman', country: '美国', category: '精细化学品' },
  { name: 'Formosa Plastics', country: '美国', category: '聚合物' },
  { name: 'LANXESS', country: '德国', category: '特殊化学品' },
  { name: 'Mitsui Chemicals', country: '日本', category: '精细化学品' },
  { name: 'Hanwha Solutions', country: '韩国', category: '基础化学品' },
  { name: 'Arkema', country: '比利时', category: '特殊化学品' },
  { name: 'Braskem Asia', country: '新加坡', category: '聚合物' },
];

const TIERS: SupplierTier[] = ['战略级', '优选级', '合格级', '观察级', '淘汰级'];
const ESG: EsgGrade[] = ['A', 'B', 'C', 'D'];

function buildSupplier(
  i: number,
  name: string,
  country: string,
  category: string,
  domestic: boolean,
): GlobalSupplier {
  const coord = countryCoord[country] ?? { lat: 0, lng: 0, continent: '亚洲' };
  const onTime = 80 + ((i * 7) % 20);
  const quality = 85 + ((i * 5) % 15);
  const tier =
    onTime >= 95 && quality >= 98
      ? '战略级'
      : onTime >= 92
        ? '优选级'
        : onTime >= 88
          ? '合格级'
          : onTime >= 84
            ? '观察级'
            : '淘汰级';
  return {
    id: domestic ? `GS-CN-${String(i + 1).padStart(2, '0')}` : `GS-OV-${String(i + 1).padStart(2, '0')}`,
    name,
    hqCountry: country,
    continent: coord.continent,
    category,
    foundedYear: domestic ? 1978 + (i % 30) : 1920 + (i % 80),
    employees: domestic ? 2000 + i * 800 : 5000 + i * 1200,
    revenueUsdBn: Math.round((domestic ? 1.2 + i * 0.4 : 8 + i * 1.3) * 10) / 10,
    onTimeRate: Math.round(onTime * 10) / 10,
    qualityRate: Math.round(quality * 10) / 10,
    responseHours: Math.round((1.5 + (i % 8) * 0.7) * 10) / 10,
    isoCerts: ['ISO9001', ...(i % 2 === 0 ? ['ISO14001'] : []), ...(i % 3 === 0 ? ['ISO45001'] : [])],
    reachCompliant: !domestic || i % 4 !== 0,
    esg: ESG[i % 4],
    coopYears: 1 + (i % 12),
    tier: TIERS.includes(tier) ? tier : '合格级',
    globalCapability: domestic
      ? i % 3 === 0
        ? '亚太供应'
        : '国内供应'
      : i % 2 === 0
        ? '全球多基地'
        : '区域供应',
    lat: coord.lat + (i % 5) * 0.15,
    lng: coord.lng + (i % 4) * 0.2,
    anomalies: onTime < 88 ? ['交付波动'] : quality < 92 ? ['质量关注'] : [],
  };
}

const domesticSuppliers = DOMESTIC_NAMES.map((name, i) =>
  buildSupplier(
    i,
    name,
    '中国',
    ['基础化学品', '聚合物', '精细化学品', '特殊化学品', '包装材料'][i % 5],
    true,
  ),
);

const overseasSuppliers = OVERSEAS.map((o, i) =>
  buildSupplier(i, o.name, o.country, o.category, false),
);

/** 50 家全球供应商 */
export const globalSuppliers: GlobalSupplier[] = [
  ...domesticSuppliers,
  ...overseasSuppliers,
];

const MATERIAL_SEED: {
  name: string;
  nameZh: string;
  category: string;
  unit: GlobalMaterial['unit'];
  origin: string;
  producer: string;
  hs: string;
  hazard: string;
}[] = [
  { name: 'Ethylene', nameZh: '乙烯', category: '基础化学品', unit: '吨', origin: '中国', producer: '中科炼化', hs: '29012100', hazard: '2.1' },
  { name: 'Propylene', nameZh: '丙烯', category: '基础化学品', unit: '吨', origin: '沙特', producer: 'SABIC', hs: '29012200', hazard: '2.1' },
  { name: 'Butadiene', nameZh: '丁二烯', category: '基础化学品', unit: '吨', origin: '韩国', producer: 'LG Chem', hs: '29012400', hazard: '2.1' },
  { name: 'Styrene', nameZh: '苯乙烯', category: '基础化学品', unit: '吨', origin: '美国', producer: 'LyondellBasell', hs: '29025000', hazard: '3' },
  { name: 'Methanol', nameZh: '甲醇', category: '基础化学品', unit: '吨', origin: '马来西亚', producer: 'Petronas', hs: '29051100', hazard: '3' },
  { name: 'MEG', nameZh: '乙二醇', category: '基础化学品', unit: '吨', origin: '沙特', producer: 'SABIC', hs: '29053100', hazard: '无' },
  { name: 'Benzene', nameZh: '纯苯', category: '基础化学品', unit: '吨', origin: '中国', producer: '恒力石化', hs: '29022000', hazard: '3' },
  { name: 'Toluene', nameZh: '甲苯', category: '基础化学品', unit: '吨', origin: '韩国', producer: 'Hanwha', hs: '29023000', hazard: '3' },
  { name: 'Xylene', nameZh: '二甲苯', category: '基础化学品', unit: '吨', origin: '新加坡', producer: 'ExxonMobil', hs: '29024100', hazard: '3' },
  { name: 'PP Homopolymer', nameZh: '聚丙烯 PP', category: '聚合物', unit: '吨', origin: '中国', producer: '金发科技', hs: '39021000', hazard: '无' },
  { name: 'HDPE', nameZh: '聚乙烯 PE', category: '聚合物', unit: '吨', origin: '美国', producer: 'Dow', hs: '39012000', hazard: '无' },
  { name: 'PVC Resin', nameZh: '聚氯乙烯 PVC', category: '聚合物', unit: '吨', origin: '中国', producer: '中石化', hs: '39041000', hazard: '无' },
  { name: 'GPPS', nameZh: '聚苯乙烯 PS', category: '聚合物', unit: '吨', origin: '日本', producer: 'Asahi Kasei', hs: '39031900', hazard: '无' },
  { name: 'ABS Resin', nameZh: 'ABS树脂', category: '聚合物', unit: '吨', origin: '韩国', producer: 'LG Chem', hs: '39033000', hazard: '无' },
  { name: 'PC Resin', nameZh: '聚碳酸酯 PC', category: '聚合物', unit: '吨', origin: '德国', producer: 'Covestro', hs: '39074000', hazard: '无' },
  { name: 'PA66', nameZh: '尼龙 PA66', category: '聚合物', unit: '吨', origin: '美国', producer: 'Celanese', hs: '39081000', hazard: '无' },
  { name: 'POM', nameZh: '聚甲醛 POM', category: '聚合物', unit: '吨', origin: '德国', producer: 'BASF SE', hs: '39071000', hazard: '无' },
  { name: 'Acrylic Acid', nameZh: '丙烯酸', category: '精细化学品', unit: '吨', origin: '中国', producer: '卫星石化', hs: '29161100', hazard: '8' },
  { name: 'Acrylonitrile', nameZh: '丙烯腈', category: '精细化学品', unit: '吨', origin: '日本', producer: 'Asahi Kasei', hs: '29261000', hazard: '3+6.1' },
  { name: 'Ethylene Oxide', nameZh: '环氧乙烷', category: '精细化学品', unit: '吨', origin: '荷兰', producer: 'Shell', hs: '29101000', hazard: '2.3' },
  { name: 'Propylene Oxide', nameZh: '环氧丙烷', category: '精细化学品', unit: '吨', origin: '美国', producer: 'Dow', hs: '29102000', hazard: '3' },
  { name: 'MDI', nameZh: 'MDI', category: '精细化学品', unit: '吨', origin: '中国', producer: '万华化学', hs: '29291010', hazard: '6.1' },
  { name: 'TDI', nameZh: 'TDI', category: '精细化学品', unit: '吨', origin: '德国', producer: 'Covestro', hs: '29291020', hazard: '6.1' },
  { name: 'Caprolactam', nameZh: '己内酰胺', category: '精细化学品', unit: '吨', origin: '中国', producer: '巨化', hs: '29337100', hazard: '无' },
  { name: 'Aniline', nameZh: '苯胺', category: '精细化学品', unit: '吨', origin: '中国', producer: '万华化学', hs: '29214100', hazard: '6.1' },
  { name: 'Nitrobenzene', nameZh: '硝基苯', category: '精细化学品', unit: '吨', origin: '比利时', producer: 'INEOS', hs: '29042000', hazard: '6.1' },
  { name: 'Ziegler Catalyst', nameZh: '齐格勒催化剂', category: '特殊化学品', unit: '千克', origin: '德国', producer: 'BASF SE', hs: '38151200', hazard: '4.2' },
  { name: 'Antioxidant 1010', nameZh: '抗氧剂 1010', category: '特殊化学品', unit: '千克', origin: '瑞士', producer: 'Clariant', hs: '38123000', hazard: '无' },
  { name: 'Surfactant LAS', nameZh: '表面活性剂 LAS', category: '特殊化学品', unit: '吨', origin: '中国', producer: '赞宇科技', hs: '34021100', hazard: '无' },
  { name: 'Plasticizer DOP', nameZh: '增塑剂 DOP', category: '特殊化学品', unit: '吨', origin: '韩国', producer: 'LG Chem', hs: '29173200', hazard: '无' },
  { name: 'UV Stabilizer', nameZh: '光稳定剂', category: '特殊化学品', unit: '千克', origin: '德国', producer: 'BASF SE', hs: '38122000', hazard: '无' },
  { name: 'Flame Retardant', nameZh: '阻燃剂', category: '特殊化学品', unit: '吨', origin: '美国', producer: 'Albemarle', hs: '38249999', hazard: '9' },
];

/** 扩展至约 60 SKU */
export const globalMaterials: GlobalMaterial[] = Array.from({ length: 60 }, (_, i) => {
  const seed = MATERIAL_SEED[i % MATERIAL_SEED.length];
  const variant = Math.floor(i / MATERIAL_SEED.length);
  const suffix = variant === 0 ? '' : ` G${variant + 1}`;
  return {
    id: `GM-${String(i + 1).padStart(3, '0')}`,
    sku: `BASF-GL-${String(1000 + i)}`,
    name: `${seed.name}${suffix}`,
    nameZh: `${seed.nameZh}${suffix ? ` 规格${variant + 1}` : ''}`,
    category: seed.category,
    unit: seed.unit,
    originCountry: seed.origin,
    producer: seed.producer,
    hsCode: seed.hs,
    hazardClass: seed.hazard,
  };
});

export const globalWarehouses: GlobalWarehouse[] = [
  { id: 'WH-ZJ1', name: '湛江1号库', country: '中国', city: '湛江', type: '枢纽', capacityTons: 20000, utilizationPct: 68, lat: 21.19, lng: 110.4, stockTons: 13600 },
  { id: 'WH-ZJ2', name: '湛江2号库', country: '中国', city: '湛江', type: '战略', capacityTons: 15000, utilizationPct: 72, lat: 21.22, lng: 110.38, stockTons: 10800 },
  { id: 'WH-SH', name: '上海中转库', country: '中国', city: '上海', type: '中转', capacityTons: 12000, utilizationPct: 61, lat: 31.35, lng: 121.6, stockTons: 7320 },
  { id: 'WH-NB', name: '宁波库', country: '中国', city: '宁波', type: '中转', capacityTons: 10000, utilizationPct: 55, lat: 29.87, lng: 121.55, stockTons: 5500 },
  { id: 'WH-TJ', name: '天津库', country: '中国', city: '天津', type: '中转', capacityTons: 9000, utilizationPct: 48, lat: 38.98, lng: 117.7, stockTons: 4320 },
  { id: 'WH-GZ', name: '广州库', country: '中国', city: '广州', type: '中转', capacityTons: 8000, utilizationPct: 58, lat: 23.1, lng: 113.45, stockTons: 4640 },
  { id: 'WH-RTM', name: '鹿特丹枢纽仓', country: '荷兰', city: '鹿特丹', type: '枢纽', capacityTons: 18000, utilizationPct: 63, lat: 51.92, lng: 4.48, stockTons: 11340 },
  { id: 'WH-HOU', name: '休斯顿战略仓', country: '美国', city: '休斯顿', type: '战略', capacityTons: 16000, utilizationPct: 57, lat: 29.76, lng: -95.37, stockTons: 9120 },
  { id: 'WH-SIN', name: '新加坡亚太分拨中心', country: '新加坡', city: '新加坡', type: '枢纽', capacityTons: 14000, utilizationPct: 70, lat: 1.26, lng: 103.83, stockTons: 9800 },
  { id: 'WH-HAM', name: '汉堡保税仓', country: '德国', city: '汉堡', type: '保税', capacityTons: 11000, utilizationPct: 52, lat: 53.55, lng: 9.99, stockTons: 5720 },
  { id: 'WH-PUS', name: '釜山中转仓', country: '韩国', city: '釜山', type: '中转', capacityTons: 9000, utilizationPct: 49, lat: 35.1, lng: 129.04, stockTons: 4410 },
];

export const shippingRoutes: ShippingRoute[] = [
  {
    id: 'RT-SEA-01',
    from: '上海',
    to: '鹿特丹',
    mode: '海运',
    days: 35,
    viaCountries: ['中国', '新加坡', '埃及', '荷兰'],
    carrier: '马士基 Maersk',
    path: [
      [31.23, 121.47],
      [1.26, 103.83],
      [30.0, 32.5],
      [51.92, 4.48],
    ],
  },
  {
    id: 'RT-SEA-02',
    from: '宁波',
    to: '休斯顿',
    mode: '海运',
    days: 30,
    viaCountries: ['中国', '巴拿马', '美国'],
    carrier: '中远海运 COSCO',
    path: [
      [29.87, 121.55],
      [22.3, 114.2],
      [9.0, -79.5],
      [29.76, -95.37],
    ],
  },
  {
    id: 'RT-SEA-03',
    from: '新加坡',
    to: '汉堡',
    mode: '海运',
    days: 28,
    viaCountries: ['新加坡', '印度', '埃及', '德国'],
    carrier: '地中海航运 MSC',
    path: [
      [1.26, 103.83],
      [18.9, 72.8],
      [30.0, 32.5],
      [53.55, 9.99],
    ],
  },
  {
    id: 'RT-SEA-04',
    from: '深圳',
    to: '安特卫普',
    mode: '海运',
    days: 32,
    viaCountries: ['中国', '新加坡', '埃及', '比利时'],
    carrier: '马士基 Maersk',
    path: [
      [22.55, 114.1],
      [1.26, 103.83],
      [30.0, 32.5],
      [51.22, 4.4],
    ],
  },
  {
    id: 'RT-MLT-01',
    from: '湛江',
    to: '鹿特丹',
    mode: '多式联运',
    days: 38,
    viaCountries: ['中国', '新加坡', '荷兰'],
    carrier: '中远海运 + 中铁',
    path: [
      [21.19, 110.4],
      [31.23, 121.47],
      [1.26, 103.83],
      [51.92, 4.48],
    ],
  },
];

export const fxRates: FxRate[] = [
  { pair: 'USD/CNY', rate: 7.25, base: 'USD', quote: 'CNY' },
  { pair: 'EUR/CNY', rate: 7.85, base: 'EUR', quote: 'CNY' },
  { pair: 'JPY/CNY', rate: 0.048, base: 'JPY', quote: 'CNY' },
  { pair: 'KRW/CNY', rate: 0.0055, base: 'KRW', quote: 'CNY' },
  { pair: 'SGD/CNY', rate: 5.4, base: 'SGD', quote: 'CNY' },
];

export const fxTrend30d: FxTrendPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 5, 15);
  d.setDate(d.getDate() + i);
  const wobble = Math.sin(i / 4) * 0.04;
  return {
    date: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    USD: Math.round((7.22 + wobble + (i % 5) * 0.008) * 1000) / 1000,
    EUR: Math.round((7.8 + wobble * 1.2 + (i % 4) * 0.01) * 1000) / 1000,
    JPY: Math.round((0.047 + wobble * 0.002) * 10000) / 10000,
    KRW: Math.round((0.0054 + wobble * 0.0002) * 100000) / 100000,
    SGD: Math.round((5.35 + wobble * 0.5) * 1000) / 1000,
  };
});

export const admissionSteps = ['资质审核', '样品测试', '小批量试产', '正式准入'] as const;

export const suppliersByAdmissionStep: Record<(typeof admissionSteps)[number], string[]> = {
  资质审核: globalSuppliers.filter((_, i) => i % 5 === 0).map((s) => s.name).slice(0, 6),
  样品测试: globalSuppliers.filter((_, i) => i % 5 === 1).map((s) => s.name).slice(0, 5),
  小批量试产: globalSuppliers.filter((_, i) => i % 5 === 2).map((s) => s.name).slice(0, 4),
  正式准入: globalSuppliers.filter((s) => s.tier === '战略级' || s.tier === '优选级').map((s) => s.name).slice(0, 8),
};

export const supplierRiskRadar: SupplierRiskRadar = {
  political: 62,
  fx: 71,
  logistics: 55,
  quality: 38,
  finance: 48,
};

export const costCompareRows: CostCompareRow[] = [
  { supplierId: 'GS-OV-01', supplierName: 'BASF SE', country: '德国', quoteCny: 820, dutyCny: 48, logisticsCny: 95, totalCny: 963, material: 'POM' },
  { supplierId: 'GS-OV-04', supplierName: 'SABIC', country: '沙特', quoteCny: 680, dutyCny: 52, logisticsCny: 110, totalCny: 842, material: 'MEG' },
  { supplierId: 'GS-OV-05', supplierName: 'LG Chem', country: '韩国', quoteCny: 750, dutyCny: 40, logisticsCny: 55, totalCny: 845, material: 'ABS' },
  { supplierId: 'GS-CN-03', supplierName: '万华化学集团', country: '中国', quoteCny: 710, dutyCny: 0, logisticsCny: 28, totalCny: 738, material: 'MDI' },
  { supplierId: 'GS-OV-02', supplierName: 'Dow Chemical', country: '美国', quoteCny: 780, dutyCny: 60, logisticsCny: 105, totalCny: 945, material: 'HDPE' },
  { supplierId: 'GS-OV-08', supplierName: 'LyondellBasell', country: '荷兰', quoteCny: 760, dutyCny: 45, logisticsCny: 88, totalCny: 893, material: 'Styrene' },
];

export const customsShipments: CustomsShipment[] = [
  { id: 'CS-001', cargo: 'MDI', fromPort: '青岛', toPort: '鹿特丹', eta: '2026-08-18', status: '在途', customsStage: '申报中', hsCode: '29291010', valueUsd: 2.4e6, origin: '中国', dest: '荷兰' },
  { id: 'CS-002', cargo: 'ABS树脂', fromPort: '釜山', toPort: '上海', eta: '2026-07-20', status: '待清关', customsStage: '查验中', hsCode: '39033000', valueUsd: 1.1e6, origin: '韩国', dest: '中国' },
  { id: 'CS-003', cargo: 'POM', fromPort: '汉堡', toPort: '上海', eta: '2026-07-16', status: '已放行', customsStage: '已放行', hsCode: '39071000', valueUsd: 0.86e6, origin: '德国', dest: '中国' },
  { id: 'CS-004', cargo: 'MEG', fromPort: '达曼', toPort: '湛江', eta: '2026-07-28', status: '已装船', customsStage: '申报中', hsCode: '29053100', valueUsd: 3.2e6, origin: '沙特', dest: '中国' },
  { id: 'CS-005', cargo: 'PC 树脂', fromPort: '安特卫普', toPort: '宁波', eta: '2026-07-22', status: '待清关', customsStage: '查验中', hsCode: '39074000', valueUsd: 1.55e6, origin: '比利时', dest: '中国' },
  { id: 'CS-006', cargo: '乙二醇', fromPort: '新加坡', toPort: '休斯顿', eta: '2026-08-05', status: '在途', customsStage: '申报中', hsCode: '29053100', valueUsd: 2.0e6, origin: '新加坡', dest: '美国' },
  { id: 'CS-007', cargo: '阻燃剂', fromPort: '休斯顿', toPort: '上海', eta: '2026-07-15', status: '已放行', customsStage: '已结关', hsCode: '38249999', valueUsd: 0.42e6, origin: '美国', dest: '中国' },
  { id: 'CS-008', cargo: '催化剂', fromPort: '鹿特丹', toPort: '新加坡', eta: '2026-07-30', status: '在途', customsStage: '申报中', hsCode: '38151200', valueUsd: 0.95e6, origin: '荷兰', dest: '新加坡' },
];

export const CUSTOMS_STAGES = ['申报中', '查验中', '已放行', '已结关'] as const;

export const documentChecklist: DocumentItem[] = customsShipments.flatMap((s, i) =>
  (['商业发票', '装箱单', '提单', '原产地证', '保险单'] as const).map((type, j) => ({
    id: `DOC-${s.id}-${j}`,
    shipmentId: s.id,
    type,
    ready: !((i + j) % 7 === 0),
  })),
);

export const licenseItems: LicenseItem[] = [
  { id: 'LIC-01', name: '危险化学品经营许可证', expiry: '2026-08-10', daysLeft: 27 },
  { id: 'LIC-02', name: '两用物项出口许可证（环氧乙烷）', expiry: '2026-07-25', daysLeft: 11 },
  { id: 'LIC-03', name: '海关AEO高级认证', expiry: '2027-03-01', daysLeft: 230 },
  { id: 'LIC-04', name: 'REACH 预注册确认函', expiry: '2026-09-15', daysLeft: 63 },
  { id: 'LIC-05', name: '进口兽药/添加剂兼用批件', expiry: '2026-07-20', daysLeft: 6 },
];

export const dutyTable: Record<string, number> = {
  '29291010': 0.065,
  '39033000': 0.065,
  '39071000': 0.065,
  '29053100': 0.055,
  '39074000': 0.065,
  '38249999': 0.08,
  '38151200': 0.04,
  default: 0.06,
};

export const financeOverview: FinanceOverview = {
  apTotalCny: 18650,
  arTotalCny: 12480,
  lcInTransitCny: 5320,
  financingBalanceCny: 2780,
};

export const apArItems: ApArItem[] = [
  { id: 'AP-01', party: 'BASF SE', type: 'AP', amountCny: 1850, currency: 'EUR', amountOrig: 235.7, aging: '30天内', dueDate: '2026-07-28' },
  { id: 'AP-02', party: 'SABIC', type: 'AP', amountCny: 3200, currency: 'USD', amountOrig: 441.4, aging: '60天内', dueDate: '2026-08-15' },
  { id: 'AP-03', party: 'LG Chem', type: 'AP', amountCny: 980, currency: 'USD', amountOrig: 135.2, aging: '30天内', dueDate: '2026-07-22' },
  { id: 'AP-04', party: '万华化学集团', type: 'AP', amountCny: 2100, currency: 'CNY', amountOrig: 2100, aging: '90天+', dueDate: '2026-06-30' },
  { id: 'AR-01', party: '立邦涂料（中国）', type: 'AR', amountCny: 1560, currency: 'CNY', amountOrig: 1560, aging: '30天内', dueDate: '2026-07-25' },
  { id: 'AR-02', party: 'Covestro Asia', type: 'AR', amountCny: 2400, currency: 'EUR', amountOrig: 305.7, aging: '60天内', dueDate: '2026-08-10' },
  { id: 'AR-03', party: '比亚迪材料', type: 'AR', amountCny: 890, currency: 'CNY', amountOrig: 890, aging: '90天+', dueDate: '2026-06-18' },
  { id: 'AR-04', party: 'DSM-Firmenich', type: 'AR', amountCny: 1120, currency: 'EUR', amountOrig: 142.7, aging: '30天内', dueDate: '2026-07-30' },
];

export const lettersOfCredit: LetterOfCredit[] = [
  { id: 'LC-2026-081', bank: '中国银行法兰克福分行', beneficiary: 'BASF SE', amountOrig: 2.5e6, currency: 'EUR', amountCny: 1962.5, issueDate: '2026-06-01', expiry: '2026-09-01', status: '已开立' },
  { id: 'LC-2026-082', bank: '工行新加坡分行', beneficiary: 'SABIC', amountOrig: 3.1e6, currency: 'USD', amountCny: 2247.5, issueDate: '2026-06-12', expiry: '2026-08-20', status: '已交单' },
  { id: 'LC-2026-083', bank: '建行上海分行', beneficiary: 'LG Chem', amountOrig: 1.2e6, currency: 'USD', amountCny: 870, issueDate: '2026-07-01', expiry: '2026-10-01', status: '待审' },
  { id: 'LC-2026-084', bank: '汇丰银行香港', beneficiary: 'Dow Chemical', amountOrig: 1.8e6, currency: 'USD', amountCny: 1305, issueDate: '2026-05-20', expiry: '2026-07-20', status: '已付款' },
  { id: 'LC-2026-085', bank: '中行鹿特丹分行', beneficiary: 'LyondellBasell', amountOrig: 0.95e6, currency: 'EUR', amountCny: 745.8, issueDate: '2026-07-05', expiry: '2026-11-05', status: '已开立' },
];

export const carbonTotal = 42860;
export const carbonBreakdown: CarbonBreakdown[] = [
  { name: '采购', value: 12858, pct: 30 },
  { name: '生产', value: 10715, pct: 25 },
  { name: '物流', value: 15001, pct: 35 },
  { name: '仓储', value: 4286, pct: 10 },
];

export const wasteMetrics = {
  recycleRate: 86.5,
  harmlessRate: 98.2,
  reductionTargetPct: 100,
  reductionDonePct: 64,
};

export const complianceReports: ComplianceReport[] = [
  { id: 'R-CSRD', name: '欧盟 CSRD 报告 2025', expiry: '2026-12-31', downloadReady: true },
  { id: 'R-CNESG', name: '中国企业 ESG 报告 2025', expiry: '2026-06-30', downloadReady: true },
  { id: 'R-REACH', name: 'REACH 合规声明', expiry: '2026-09-30', downloadReady: true },
  { id: 'R-ISO14', name: 'ISO14001 环境管理体系证书', expiry: '2027-04-15', downloadReady: false },
];

export const carbonTarget = {
  year: 2030,
  reductionPct: 30,
  currentPct: 14.8,
};

export const riskOverview = {
  highRiskSuppliers: 7,
  shortageSkus: 12,
  geoRiskRegions: 5,
  disasterOrders: 9,
};

export const riskSuppliers: RiskSupplier[] = [
  { id: 'RS-1', name: '广东新会美达锦纶', country: '中国', level: '高', factors: ['产能检修', '交付波动'], action: '启动备选双供，锁定 30 天安全库存' },
  { id: 'RS-2', name: 'INEOS', country: '比利时', level: '中', factors: ['能源成本上升'], action: '协商季度价公式，切换部分量至国内' },
  { id: 'RS-3', name: 'SABIC', country: '沙特', level: '中', factors: ['红海运费波动'], action: '改道好望角冗余排船' },
  { id: 'RS-4', name: 'Clariant', country: '德国', level: '低', factors: ['汇率波动'], action: '锁定远期购汇' },
  { id: 'RS-5', name: '苏州安利化工', country: '中国', level: '高', factors: ['环保限产传闻'], action: '立即样试 2 家替代溶剂厂' },
];

export const disasterZones: DisasterZone[] = [
  { id: 'DZ-1', name: '南海热带风暴影响区', type: '台风', lat: 20.5, lng: 112.0, affectedOrders: 4 },
  { id: 'DZ-2', name: '日本西南地震警戒', type: '地震', lat: 33.0, lng: 131.5, affectedOrders: 2 },
  { id: 'DZ-3', name: '欧洲中部洪水带', type: '洪水', lat: 50.5, lng: 7.0, affectedOrders: 3 },
];

export const geoRisks: GeoRisk[] = [
  { id: 'GR-1', region: '欧盟', title: 'CBAM 过渡期申报加严', impact: '出口欧洲聚合物需补报隐含碳', time: '2026-07-10' },
  { id: 'GR-2', region: '美国', title: '反倾销日落复审', impact: '部分 MEG 品类税率或上调', time: '2026-07-08' },
  { id: 'GR-3', region: '中东', title: '航道保险附加费上涨', impact: 'CIF 中东航线成本 +8%', time: '2026-07-06' },
  { id: 'GR-4', region: '东盟', title: '原产地累积规则更新', impact: 'FORM E 填制口径调整', time: '2026-07-02' },
];

export const altSupplies: AltSupply[] = [
  { material: 'ABS树脂', primary: 'LG Chem', alt: '金发科技股份', switchDays: 21, costDeltaPct: 3.5 },
  { material: 'MEG', primary: 'SABIC', alt: '恒力石化股份', switchDays: 28, costDeltaPct: -1.2 },
  { material: 'POM', primary: 'BASF SE', alt: 'Celanese', switchDays: 35, costDeltaPct: 6.8 },
  { material: 'MDI', primary: '万华化学集团', alt: 'Covestro', switchDays: 40, costDeltaPct: 8.2 },
];

export const incoterms: IncotermInfo[] = [
  { code: 'FOB', name: '离岸价', costs: ['卖方：装船前费用', '买方：海运+保险+进口关税'] },
  { code: 'CIF', name: '成本+保险+运费', costs: ['卖方：货价+运费+保险至目的港', '买方：卸货+进口清关关税'] },
  { code: 'EXW', name: '工厂交货', costs: ['卖方：出厂货价', '买方：提货后全部物流与关税'] },
  { code: 'DDP', name: '完税后交货', costs: ['卖方：运抵买方门点且含关税', '买方：卸货与内陆短驳'] },
  { code: 'DAP', name: '目的地交货', costs: ['卖方：运至指定地点（不含税）', '买方：进口清关与关税'] },
  { code: 'CFR', name: '成本加运费', costs: ['卖方：货价+运费至目的港', '买方：保险+清关关税'] },
];

export const crossBorderAlertTypes = ['清关延误', '单证不齐', '贸易合规风险'] as const;

export const financeTypes = ['保理', '订单融资', '库存融资'] as const;
