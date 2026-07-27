/**
 * SCIP Marketplace ↔ SCIP 平台数据对接层（演示）
 * 产品/库存来自 SCIP 物料与库存模块；订单/物流可双向同步。
 */
import { chemMaterials } from './materials';
import type { ChemMaterial } from './chemTypes';

export type StockStatus = 'green' | 'yellow' | 'red';

export interface MarketplaceProduct {
  productId: string;
  productName: string;
  category: string;
  specification: string;
  application: string;
  unit: string;
  sku: string;
  unitPrice: number; // 销售价（Marketplace 展示，非成本价）
  imageHue: number;
  /** 产品展示图 */
  imageUrl: string;
  specs: { label: string; value: string }[];
  usageNotes: string;
  applications: string[];
  updatedAt: string;
  tdsUrl: string;
  sdsUrl: string;
}

export interface MarketplaceInventory {
  productId: string;
  availableStock: number;
  safetyStock: number;
  status: StockStatus;
  warehouse: string;
}

export type InquiryStatus = '待回复' | '已报价' | '已过期' | '已转化';

export interface InquiryLine {
  productId: string;
  productName: string;
  qty: number;
  unit: string;
  expectedDate?: string;
  addressId?: string;
}

export interface InquiryQuote {
  unitPrice: number;
  totalAmount: number;
  validUntil: string;
  note: string;
  quotedAt?: string;
  freightNote?: string;
  paymentTerms?: string;
  salesRep?: string;
  salesPhone?: string;
  /** 分产品报价；缺省时沿用 unitPrice */
  lineQuotes?: { productId: string; unitPrice: number; amount: number }[];
}

export interface MarketplaceInquiry {
  inquiryId: string;
  submittedAt: string;
  status: InquiryStatus;
  lines: InquiryLine[];
  quote?: InquiryQuote;
  /** 客户备注（包装、交期、认证要求等） */
  remark?: string;
  /** 承诺回复时效（小时） */
  replySlaHours?: number;
  scipInquiryRef?: string;
  /** 同步标记：写入 SCIP 询价池 */
  syncedToScip: boolean;
}

export type MarketplaceOrderStatus =
  | '待确认'
  | '已确认'
  | '待发货'
  | '运输中'
  | '待收货'
  | '已完成'
  | '已取消';

export interface MarketplaceOrderLine {
  productId: string;
  productName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface OrderStatusEvent {
  status: string;
  time: string;
  note?: string;
}

export interface MarketplaceOrder {
  orderId: string;
  inquiryId?: string;
  placedAt: string;
  status: MarketplaceOrderStatus;
  lines: MarketplaceOrderLine[];
  totalAmount: number;
  addressLabel: string;
  invoiceTitle: string;
  paymentTerms?: string;
  freightAmount?: number;
  contactPhone?: string;
  remark?: string;
  statusHistory?: OrderStatusEvent[];
  /** 双向同步：客户下单 → SCIP 订单管理 */
  syncedToScip: boolean;
  scipOrderRef?: string;
}

export interface TrackingEvent {
  time: string;
  status: string;
  location: string;
  detail: string;
}

export interface MarketplaceLogistics {
  orderId: string;
  carrier: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  eta: string;
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
  current: { lat: number; lng: number };
  path: [number, number][];
  trackingEvents: TrackingEvent[];
  anomaly?: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  contact: string;
  phone: string;
  province: string;
  city: string;
  detail: string;
  isDefault: boolean;
}

export interface CustomerNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'inquiry' | 'order' | 'account' | 'system';
  link?: string;
}

export interface MarketplaceCustomer {
  companyName: string;
  creditCode: string;
  certified: boolean;
  contactName: string;
  phone: string;
  email: string;
  addresses: CustomerAddress[];
  favorites: string[];
  accountManager: string;
  accountManagerPhone: string;
  creditLimit: number;
  creditUsed: number;
  memberSince: string;
  invoiceType: string;
  invoiceBank: string;
  invoiceAccount: string;
  notifications: CustomerNotification[];
}

const APP_MAP: Record<string, string> = {
  基础化学品: '石化原料 / 中间体合成',
  聚合物: '注塑 / 挤出 / 改性',
  精细化学品: '涂料 / 胶粘剂 / 特种配方',
  溶剂: '清洗 / 稀释 / 反应介质',
  催化剂: '加氢 / 聚合 / 重整工艺',
  包装材料: '危化品包装与转运',
};

function buildSpec(_m: ChemMaterial, i: number) {
  return [
    { label: '外观', value: i % 2 === 0 ? '无色透明液体' : '白色颗粒' },
    { label: '分子量', value: `${90 + (i % 35) * 11}` },
    { label: '密度 (g/cm³)', value: (0.78 + ((i * 17) % 40) / 100).toFixed(2) },
    { label: '熔点 (℃)', value: `${-30 + ((i * 23) % 160)}` },
    { label: '粘度 (mPa·s, 25℃)', value: `${2 + ((i * 7) % 60)}` },
    { label: '纯度', value: i % 3 === 0 ? '≥99.8%' : '≥99.5%' },
  ];
}

const PRODUCT_IMAGES: Record<string, string[]> = {
  聚合物: [
    '/marketplace/products/polymer-1.jpg',
    '/marketplace/products/factory-1.jpg',
    '/marketplace/products/warehouse-1.jpg',
  ],
  精细化学品: [
    '/marketplace/products/lab-1.jpg',
    '/marketplace/products/lab-2.jpg',
    '/marketplace/products/pharma-1.jpg',
    '/marketplace/products/lab-3.jpg',
  ],
  基础化学品: [
    '/marketplace/products/factory-2.jpg',
    '/marketplace/products/energy-1.jpg',
    '/marketplace/products/warehouse-1.jpg',
  ],
  溶剂: [
    '/marketplace/products/solvent-1.jpg',
    '/marketplace/products/lab-4.jpg',
    '/marketplace/products/lab-2.jpg',
  ],
};

function productImageFor(category: string, index: number) {
  const pool = PRODUCT_IMAGES[category] ?? PRODUCT_IMAGES['精细化学品']!;
  return pool[index % pool.length]!;
}

/** 从 SCIP 成品物料主数据派生 Marketplace 产品目录 */
export function syncProductsFromScip(): MarketplaceProduct[] {
  return chemMaterials
    .filter((m) =>
      ['聚合物', '精细化学品', '基础化学品', '溶剂'].includes(m.category),
    )
    .slice(0, 24)
    .map((m, i) => ({
      productId: m.id,
      productName: m.name,
      category: m.category,
      specification: `${m.sku} · 工业级`,
      application: APP_MAP[m.category] ?? '通用工业应用',
      unit: m.unit,
      sku: m.sku,
      // 销售价 = 成本价 * 加成（演示差异化：门户显示销售价）
      unitPrice: Math.round(m.unitPrice * 1000 * 1.18) / 1000,
      imageHue: (i * 37) % 360,
      imageUrl: productImageFor(m.category, i),
      specs: buildSpec(m, i),
      usageNotes:
        '请按 SDS 要求储存于阴凉通风处；装卸遵守危化品操作规程；配伍前确认工艺兼容性。',
      applications: [
        APP_MAP[m.category] ?? '通用工业',
        '配方开发与中试',
        '批量生产备货',
      ],
      updatedAt: `2026-07-${String(10 + (i % 7)).padStart(2, '0')}`,
      tdsUrl: `#tds-${m.id}`,
      sdsUrl: `#sds-${m.id}`,
    }));
}

/** 从 SCIP 库存模块同步可用量与灯色 */
export function syncInventoryFromScip(): MarketplaceInventory[] {
  return chemMaterials.map((m) => ({
    productId: m.id,
    availableStock: m.currentStock,
    safetyStock: m.safetyStock,
    status: m.status,
    warehouse: m.warehouse,
  }));
}

export const marketplaceCategories = [
  { id: '聚合物', label: '聚合物', icon: '⬡', desc: 'PP / PE / ABS / PC' },
  { id: '精细化学品', label: '精细化学品', icon: '◈', desc: '中间体与助剂' },
  { id: '基础化学品', label: '基础化学品', icon: '◉', desc: '烯烃与大宗原料' },
  { id: '溶剂', label: '工业溶剂', icon: '◎', desc: '清洗与反应介质' },
  { id: '催化剂', label: '催化剂', icon: '✦', desc: '加氢 / 聚合' },
  { id: '包装材料', label: '包装材料', icon: '▣', desc: 'IBC / 罐箱配件' },
  { id: '胶粘剂', label: '胶粘剂原料', icon: '◇', desc: '树脂与固化剂' },
  { id: '涂料', label: '涂料原料', icon: '◐', desc: '树脂与颜填料' },
] as const;

export const STOCK_LABEL: Record<StockStatus, string> = {
  green: '充足',
  yellow: '紧张',
  red: '预订',
};

export const STOCK_DOT: Record<StockStatus, string> = {
  green: 'bg-[#00B42A]',
  yellow: 'bg-[#FAAD14]',
  red: 'bg-[#F53F3F]',
};

export const STOCK_TAG: Record<StockStatus, string> = {
  green: 'bg-[#E8FFEA] text-[#00B42A]',
  yellow: 'bg-[#FFF7E6] text-[#D48806]',
  red: 'bg-[#FFF1F0] text-[#F53F3F]',
};

/** 演示用初始询价单 */
export const seedInquiries: MarketplaceInquiry[] = [
  {
    inquiryId: 'INQ-2026-0801',
    submittedAt: '2026-07-12 10:22',
    status: '已报价',
    syncedToScip: true,
    scipInquiryRef: 'SI-2026-4412',
    replySlaHours: 24,
    remark: '需提供 COA；期望华南仓直发，可接受分批发货。',
    lines: [
      {
        productId: 'MAT-005',
        productName: '聚丙烯 PP',
        qty: 40,
        unit: '吨',
        expectedDate: '2026-08-01',
        addressId: 'ADDR-1',
      },
    ],
    quote: {
      unitPrice: 0.97,
      totalAmount: 38800,
      validUntil: '2026-07-25',
      quotedAt: '2026-07-13 09:18',
      note: '含华南仓出库，不含运费；40 吨以上可再议 1%。',
      freightNote: '运费按实际危化专线结算，预估 ¥2,800–3,600',
      paymentTerms: '月结 30 天（已授信）',
      salesRep: '周敏',
      salesPhone: '400-800-SCIP 转 802',
      lineQuotes: [{ productId: 'MAT-005', unitPrice: 0.97, amount: 38800 }],
    },
  },
  {
    inquiryId: 'INQ-2026-0795',
    submittedAt: '2026-07-08 16:40',
    status: '待回复',
    syncedToScip: true,
    scipInquiryRef: 'SI-2026-4388',
    replySlaHours: 24,
    remark: '两品类同批到货；请注明是否可混装。',
    lines: [
      {
        productId: 'MAT-006',
        productName: '聚乙烯 PE',
        qty: 20,
        unit: '吨',
        expectedDate: '2026-07-28',
      },
      {
        productId: 'MAT-021',
        productName: 'ABS 树脂',
        qty: 8,
        unit: '吨',
        expectedDate: '2026-07-28',
      },
    ],
  },
  {
    inquiryId: 'INQ-2026-0788',
    submittedAt: '2026-07-01 09:15',
    status: '已转化',
    syncedToScip: true,
    scipInquiryRef: 'SI-2026-4301',
    replySlaHours: 24,
    remark: '用于注塑改性，需食品接触级说明。',
    lines: [
      {
        productId: 'MAT-022',
        productName: 'PC 聚碳酸酯',
        qty: 5,
        unit: '吨',
        expectedDate: '2026-07-20',
      },
    ],
    quote: {
      unitPrice: 1.95,
      totalAmount: 9750,
      validUntil: '2026-07-10',
      quotedAt: '2026-07-02 11:05',
      note: '已转正式订单 MO-2026-0412',
      paymentTerms: '款到发货',
      salesRep: '周敏',
      salesPhone: '400-800-SCIP 转 802',
      lineQuotes: [{ productId: 'MAT-022', unitPrice: 1.95, amount: 9750 }],
    },
  },
  {
    inquiryId: 'INQ-2026-0760',
    submittedAt: '2026-06-18 14:05',
    status: '已过期',
    syncedToScip: true,
    scipInquiryRef: 'SI-2026-4210',
    replySlaHours: 24,
    remark: '试单 2 吨，后续有稳定采购计划。',
    lines: [
      {
        productId: 'MAT-011',
        productName: '甲苯',
        qty: 2,
        unit: '吨',
        expectedDate: '2026-07-01',
      },
    ],
    quote: {
      unitPrice: 0.76,
      totalAmount: 1520,
      validUntil: '2026-06-28',
      quotedAt: '2026-06-19 10:40',
      note: '报价已过期，可重新提交询价获取最新价。',
      paymentTerms: '款到发货',
      salesRep: '陈凯',
      lineQuotes: [{ productId: 'MAT-011', unitPrice: 0.76, amount: 1520 }],
    },
  },
];

/** 演示用初始客户订单（与 SCIP 订单双向同步） */
export const seedOrders: MarketplaceOrder[] = [
  {
    orderId: 'MO-2026-0412',
    inquiryId: 'INQ-2026-0788',
    placedAt: '2026-07-05 14:20',
    status: '运输中',
    syncedToScip: true,
    scipOrderRef: 'CO-2026-0881',
    addressLabel: '广东深圳 · 南山区科技园南区科苑路 15 号仓库',
    invoiceTitle: '华南精密制造有限公司',
    paymentTerms: '月结 30 天',
    freightAmount: 1860,
    contactPhone: '13800138000',
    remark: '卸货需预约，工作日 9–16 点',
    statusHistory: [
      { status: '待确认', time: '2026-07-05 14:20', note: '客户提交订单' },
      { status: '已确认', time: '2026-07-05 16:05', note: '销售确认库存与交期' },
      { status: '待发货', time: '2026-07-14 18:00', note: '仓库拣配完成' },
      { status: '运输中', time: '2026-07-15 14:20', note: '危化专车已发运' },
    ],
    lines: [
      {
        productId: 'MAT-022',
        productName: 'PC 聚碳酸酯',
        qty: 5,
        unit: '吨',
        unitPrice: 1.95,
        amount: 9750,
      },
    ],
    totalAmount: 9750,
  },
  {
    orderId: 'MO-2026-0398',
    placedAt: '2026-06-28 11:05',
    status: '待收货',
    syncedToScip: true,
    scipOrderRef: 'CO-2026-0850',
    addressLabel: '江苏苏州 · 工业园区物流中心',
    invoiceTitle: '华南精密制造有限公司',
    paymentTerms: '月结 30 天',
    freightAmount: 2200,
    contactPhone: '13800138000',
    statusHistory: [
      { status: '待确认', time: '2026-06-28 11:05' },
      { status: '已确认', time: '2026-06-28 15:30' },
      { status: '待发货', time: '2026-07-12 09:00' },
      { status: '运输中', time: '2026-07-14 12:30' },
      { status: '待收货', time: '2026-07-15 09:00', note: '已抵达园区，等待卸货' },
    ],
    lines: [
      {
        productId: 'MAT-005',
        productName: '聚丙烯 PP',
        qty: 15,
        unit: '吨',
        unitPrice: 0.97,
        amount: 14550,
      },
    ],
    totalAmount: 14550,
  },
  {
    orderId: 'MO-2026-0371',
    placedAt: '2026-06-15 09:40',
    status: '已完成',
    syncedToScip: true,
    scipOrderRef: 'CO-2026-0802',
    addressLabel: '广东东莞 · 松山湖高新区工业北路 8 号',
    invoiceTitle: '华南精密制造有限公司',
    paymentTerms: '款到发货',
    freightAmount: 3100,
    contactPhone: '13700137000',
    statusHistory: [
      { status: '待确认', time: '2026-06-15 09:40' },
      { status: '已确认', time: '2026-06-15 11:00' },
      { status: '待发货', time: '2026-06-18 08:00' },
      { status: '运输中', time: '2026-06-18 14:00' },
      { status: '待收货', time: '2026-06-20 10:00' },
      { status: '已完成', time: '2026-06-20 16:40', note: '客户确认收货' },
    ],
    lines: [
      {
        productId: 'MAT-011',
        productName: '甲苯',
        qty: 30,
        unit: '吨',
        unitPrice: 0.73,
        amount: 21900,
      },
    ],
    totalAmount: 21900,
  },
  {
    orderId: 'MO-2026-0420',
    placedAt: '2026-07-14 08:30',
    status: '待确认',
    syncedToScip: true,
    scipOrderRef: 'CO-2026-0901',
    addressLabel: '广东深圳 · 南山区科技园南区科苑路 15 号仓库',
    invoiceTitle: '华南精密制造有限公司',
    paymentTerms: '月结 30 天',
    freightAmount: 0,
    contactPhone: '13800138000',
    remark: '请优先确认交期后再安排开票',
    statusHistory: [
      { status: '待确认', time: '2026-07-14 08:30', note: '等待销售确认' },
    ],
    lines: [
      {
        productId: 'MAT-006',
        productName: '聚乙烯 PE',
        qty: 10,
        unit: '吨',
        unitPrice: 0.93,
        amount: 9300,
      },
    ],
    totalAmount: 9300,
  },
  {
    orderId: 'MO-2026-0355',
    placedAt: '2026-05-22 13:10',
    status: '已取消',
    syncedToScip: true,
    scipOrderRef: 'CO-2026-0766',
    addressLabel: '广东深圳 · 南山区科技园南区科苑路 15 号仓库',
    invoiceTitle: '华南精密制造有限公司',
    paymentTerms: '款到发货',
    freightAmount: 0,
    contactPhone: '13800138000',
    remark: '客户项目延期，主动取消',
    statusHistory: [
      { status: '待确认', time: '2026-05-22 13:10' },
      { status: '已取消', time: '2026-05-23 09:00', note: '客户申请取消，库存已释放' },
    ],
    lines: [
      {
        productId: 'MAT-021',
        productName: 'ABS 树脂',
        qty: 6,
        unit: '吨',
        unitPrice: 1.42,
        amount: 8520,
      },
    ],
    totalAmount: 8520,
  },
];

export const seedLogistics: Record<string, MarketplaceLogistics> = {
  'MO-2026-0412': {
    orderId: 'MO-2026-0412',
    carrier: '中化物流华南干线',
    vehicleNo: '粤B·8X21危',
    driverName: '刘师傅',
    driverPhone: '138****6621',
    eta: '2026-07-18 16:00',
    from: { name: '湛江1号库', lat: 21.27, lng: 110.36 },
    to: { name: '深圳南山仓', lat: 22.53, lng: 113.93 },
    current: { lat: 22.1, lng: 112.8 },
    path: [
      [21.27, 110.36],
      [21.8, 111.2],
      [22.1, 112.8],
      [22.53, 113.93],
    ],
    trackingEvents: [
      {
        time: '2026-07-15 09:00',
        status: '已出库',
        location: '湛江1号库',
        detail: '质检放行，完成拣配',
      },
      {
        time: '2026-07-15 11:30',
        status: '已装车',
        location: '湛江1号库月台',
        detail: '危化品专车装载完毕',
      },
      {
        time: '2026-07-15 14:20',
        status: '已发运',
        location: '湛江高速入口',
        detail: '驶入 G15 沈海高速',
      },
      {
        time: '2026-07-16 10:15',
        status: '运输中',
        location: '阳江服务区',
        detail: '正常通行，预计明日抵达',
      },
    ],
  },
  'MO-2026-0398': {
    orderId: 'MO-2026-0398',
    carrier: '华东危化专线',
    vehicleNo: '苏E·6K90危',
    driverName: '陈师傅',
    driverPhone: '139****1188',
    eta: '2026-07-17 11:00',
    from: { name: '中转库', lat: 31.23, lng: 121.47 },
    to: { name: '苏州工业园仓', lat: 31.32, lng: 120.72 },
    current: { lat: 31.28, lng: 120.95 },
    path: [
      [31.23, 121.47],
      [31.28, 120.95],
      [31.32, 120.72],
    ],
    trackingEvents: [
      {
        time: '2026-07-14 08:00',
        status: '已出库',
        location: '中转库',
        detail: '出库完成',
      },
      {
        time: '2026-07-14 10:00',
        status: '已装车',
        location: '中转库',
        detail: '装车完毕',
      },
      {
        time: '2026-07-14 12:30',
        status: '已发运',
        location: '上海',
        detail: '发往苏州',
      },
      {
        time: '2026-07-15 09:00',
        status: '已到达',
        location: '苏州工业园仓外围',
        detail: '等待卸货预约',
      },
    ],
    anomaly: '卸货月台排队，预计延迟约 2 小时',
  },
};

export const seedCustomer: MarketplaceCustomer = {
  companyName: '华南精密制造有限公司',
  creditCode: '91440300MA5FXXXX0X',
  certified: true,
  contactName: '林晓',
  phone: '13800138000',
  email: 'linxiao@huanan-precision.com',
  favorites: ['MAT-005', 'MAT-022', 'MAT-006'],
  accountManager: '周敏',
  accountManagerPhone: '400-800-SCIP 转 802',
  creditLimit: 500000,
  creditUsed: 38650,
  memberSince: '2025-11-08',
  invoiceType: '增值税专用发票',
  invoiceBank: '招商银行深圳南山支行',
  invoiceAccount: '7559 **** **** 2188',
  notifications: [
    {
      id: 'N-1',
      title: '询价 INQ-2026-0801 已报价',
      body: '销售周敏已回复报价，有效期至 2026-07-25。可一键转正式订单。',
      time: '2026-07-13 09:20',
      read: false,
      type: 'inquiry',
      link: '/marketplace/inquiry',
    },
    {
      id: 'N-2',
      title: '订单 MO-2026-0412 已发运',
      body: '危化专车粤B·8X21危 已从湛江1号库发运，预计 07-18 抵达南山仓。',
      time: '2026-07-15 14:20',
      read: false,
      type: 'order',
      link: '/marketplace/orders/MO-2026-0412',
    },
    {
      id: 'N-3',
      title: '订单 MO-2026-0398 待收货',
      body: '货物已抵达苏州工业园仓外围，卸货月台排队约 2 小时，请安排收货。',
      time: '2026-07-15 09:05',
      read: true,
      type: 'order',
      link: '/marketplace/orders/MO-2026-0398',
    },
    {
      id: 'N-4',
      title: '企业认证已通过',
      body: '您的企业资质审核已完成，已开通月结授信额度 ¥500,000。',
      time: '2026-06-01 10:00',
      read: true,
      type: 'account',
      link: '/marketplace/account',
    },
    {
      id: 'N-5',
      title: '系统维护通知',
      body: '7 月 20 日 02:00–04:00 将进行短时维护，期间下单与询价可能短暂不可用。',
      time: '2026-07-16 18:00',
      read: true,
      type: 'system',
    },
  ],
  addresses: [
    {
      id: 'ADDR-1',
      label: '深圳南山仓',
      contact: '林晓',
      phone: '13800138000',
      province: '广东',
      city: '深圳',
      detail: '南山区科技园南区科苑路 15 号仓库',
      isDefault: true,
    },
    {
      id: 'ADDR-2',
      label: '东莞松山湖仓',
      contact: '王仓管',
      phone: '13700137000',
      province: '广东',
      city: '东莞',
      detail: '松山湖高新区工业北路 8 号',
      isDefault: false,
    },
  ],
};



