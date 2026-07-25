import type {
  CustomerComplaint,
  CustomerOrder,
  DeliveryException,
} from './chemTypes';
import { chemMaterials } from './materials';

const CUSTOMERS = [
  '立邦涂料（中国）',
  '华为技术有限公司',
  '比亚迪股份有限公司',
  '中国石化销售公司',
  '三棵树涂料股份',
  '万华化学终端客户',
  '中海油销售广东',
  '吉利汽车采购中心',
  '宁德时代新能源',
  '金发科技改性材料',
  '华润涂料',
  '陶氏化学亚太客户',
  '上海瀚森化工',
  '广州立邦工厂',
  '深圳比亚迪材料分司',
  '佛山美涂士涂料',
  '东莞华润包装',
  '珠海中富包装',
  '江苏扬农下游客户',
  '青岛海尔材料公司',
];

const DELIVERY_STATUSES: CustomerOrder['status'][] = [
  '待交付',
  '运输中',
  '已签收',
  '异常',
];

/** 20 条客户交付订单 */
export const customerOrders: CustomerOrder[] = Array.from({ length: 20 }, (_, i) => {
  const mat = chemMaterials[i % chemMaterials.length];
  const onTime = 80 + (i * 7) % 20;
  const intact = 85 + (i * 5) % 15;
  const response = 82 + (i * 9) % 18;
  return {
    id: `CO-2026-${String(2001 + i)}`,
    customerName: CUSTOMERS[i],
    product: mat.name,
    qty: Math.round((5 + (i * 13) % 200) * 10) / 10,
    deliveryDate: `2026-07-${String(8 + (i % 10)).padStart(2, '0')}`,
    status: DELIVERY_STATUSES[i % 4],
    onTimeRate: onTime,
    intactRate: intact,
    responseRate: response,
  };
});

export const deliveryExceptions: DeliveryException[] = [
  {
    id: 'DEX-001',
    type: '延迟',
    orderId: 'CO-2026-2004',
    customerName: '中国石化销售公司',
    time: '2026-07-13 16:20',
    status: '处理中',
    description: '高速管制导致罐车晚到 6 小时',
  },
  {
    id: 'DEX-002',
    type: '破损',
    orderId: 'CO-2026-2008',
    customerName: '吉利汽车采购中心',
    time: '2026-07-12 10:05',
    status: '已闭环',
    description: 'IBC 桶外观刮擦，内货完好，已换桶重发',
  },
  {
    id: 'DEX-003',
    type: '错发',
    orderId: 'CO-2026-2012',
    customerName: '上海瀚森化工',
    time: '2026-07-11 09:40',
    status: '待处理',
    description: '批次标签与发货单品级不符',
  },
  {
    id: 'DEX-004',
    type: '延迟',
    orderId: 'CO-2026-2016',
    customerName: '佛山美涂士涂料',
    time: '2026-07-10 18:30',
    status: '处理中',
    description: '客户月台拥堵，排队超时',
  },
  {
    id: 'DEX-005',
    type: '破损',
    orderId: 'CO-2026-2003',
    customerName: '比亚迪股份有限公司',
    time: '2026-07-09 14:15',
    status: '已闭环',
    description: '装卸碰撞致外包装变形',
  },
];

export const customerComplaints: CustomerComplaint[] = [
  {
    id: 'CMP-2026-011',
    type: '交付延迟',
    time: '2026-07-13 11:00',
    status: '处理中',
    closeDays: null,
    customerName: '中国石化销售公司',
    content: '承诺窗口内未完成卸货',
  },
  {
    id: 'CMP-2026-010',
    type: '包装破损',
    time: '2026-07-11 15:30',
    status: '已闭环',
    closeDays: 2,
    customerName: '吉利汽车采购中心',
    content: '到货 IBC 外观破损投诉',
  },
  {
    id: 'CMP-2026-009',
    type: '单据差错',
    time: '2026-07-10 09:10',
    status: '已闭环',
    closeDays: 1,
    customerName: '上海瀚森化工',
    content: '随货质检单版本错误',
  },
  {
    id: 'CMP-2026-008',
    type: '品质异议',
    time: '2026-07-08 16:45',
    status: '待处理',
    closeDays: null,
    customerName: '立邦涂料（中国）',
    content: '色度偏离合同指标',
  },
  {
    id: 'CMP-2026-007',
    type: '服务态度',
    time: '2026-07-07 10:20',
    status: '已闭环',
    closeDays: 3,
    customerName: '华润涂料',
    content: '现场协调响应慢',
  },
  {
    id: 'CMP-2026-006',
    type: '错发混料',
    time: '2026-07-05 13:55',
    status: '处理中',
    closeDays: null,
    customerName: '广州立邦工厂',
    content: '疑似批次混装',
  },
];
