/** 化工场景扩展类型 */

export type ChemCategory =
  | '基础化学品'
  | '精细化学品'
  | '聚合物'
  | '溶剂'
  | '催化剂'
  | '包装材料';

export type ChemRegion = '广东' | '江苏' | '浙江' | '山东' | '上海';

export type ChemWarehouse = '湛江1号库' | '湛江2号库' | '中转库';

export type OrderStatus =
  | '草稿'
  | '待审批'
  | '已下单'
  | '已发货'
  | '已到货'
  | '已入库';

export type DeliveryStatus = '待交付' | '运输中' | '已签收' | '异常';

export type ComplaintStatus = '待处理' | '处理中' | '已闭环';

export type AlertSeverity = '高' | '中' | '低';

export interface ChemSupplier {
  id: string;
  name: string;
  category: ChemCategory;
  region: ChemRegion;
  onTimeRate: number;
  qualityRate: number;
  /** 响应时效评分 1-5 */
  responseScore: number;
  grade: 'A' | 'B' | 'C';
  contact: string;
}

export interface ChemMaterial {
  id: string;
  sku: string;
  name: string;
  category: ChemCategory;
  unit: '吨' | '千克' | '升';
  currentStock: number;
  safetyStock: number;
  status: 'green' | 'yellow' | 'red';
  warehouse: ChemWarehouse;
  unitPrice: number;
}

export interface TransportAlert {
  id: string;
  type: string;
  typeKey: string;
  category: '时效类' | '路线类' | '环境/货况类' | '人车/单证类';
  vehicleNo: string;
  location: string;
  lat: number;
  lng: number;
  time: string;
  status: '待处理' | '处理中' | '已升级' | '已解决';
  severity: AlertSeverity;
  description: string;
}

export interface OrderLineItem {
  sku: string;
  name: string;
  qty: number;
  unit: string;
  amount: number;
}

export interface ApprovalRecord {
  step: string;
  actor: string;
  result: string;
  time: string;
  comment?: string;
}

export interface ChangeHistory {
  field: string;
  from: string;
  to: string;
  operator: string;
  time: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  category: ChemCategory;
  materialName: string;
  sku: string;
  qty: number;
  amount: number;
  orderDate: string;
  eta: string;
  ata: string | null;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  approvals: ApprovalRecord[];
  changes: ChangeHistory[];
  /** 创建人工号，用于 dataScope=self */
  createdBy?: string;
}

export interface WarehouseStats {
  totalCapacity: number;
  usedCapacity: number;
  utilizationRate: number;
  inboundToday: number;
  outboundToday: number;
}

export interface AgeBucket {
  label: string;
  tons: number;
  pct: number;
}

export interface QcBatch {
  id: string;
  supplierName: string;
  materialName: string;
  arrivalDate: string;
  status: '待检' | '检验中' | '已完成';
  warehouse: ChemWarehouse;
  qty: number;
}

export interface QcRejectReason {
  reason: string;
  count: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  product: string;
  qty: number;
  deliveryDate: string;
  status: DeliveryStatus;
  onTimeRate: number;
  intactRate: number;
  responseRate: number;
}

export interface DeliveryException {
  id: string;
  type: '延迟' | '破损' | '错发';
  orderId: string;
  customerName: string;
  time: string;
  status: '待处理' | '处理中' | '已闭环';
  description: string;
}

export interface CustomerComplaint {
  id: string;
  type: string;
  time: string;
  status: ComplaintStatus;
  closeDays: number | null;
  customerName: string;
  content: string;
}

export interface TowerNode {
  key: string;
  label: string;
  kpiLabel: string;
  kpiValue: string;
  anomalyLevel: '高' | '中' | '低';
}

export interface TowerWarning {
  id: string;
  severity: AlertSeverity;
  stage: string;
  title: string;
  time: string;
}
