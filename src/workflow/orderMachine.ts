import type { OrderStatus } from '../mock/chemTypes';

/** 补货→采购→入库 全链路状态（与采购订单状态对齐） */
export const FLOW_NODES = [
  { id: '草稿', label: '补货申请', role: '库存/采购员' },
  { id: '待审批', label: '审批中', role: '采购经理' },
  { id: '已下单', label: '已下单', role: '采购员' },
  { id: '已发货', label: '在途运输', role: '供应商/物流' },
  { id: '已到货', label: '到货待入', role: '仓储' },
  { id: '已入库', label: '入库完成', role: '仓储' },
] as const;

export const ORDER_STATUS_FLOW: OrderStatus[] = FLOW_NODES.map((n) => n.id);

export type FlowEvent =
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'SHIP'
  | 'ARRIVE'
  | 'PUTAWAY';

export const FLOW_EVENT_LABEL: Record<FlowEvent, string> = {
  SUBMIT: '提交审批',
  APPROVE: '审批通过',
  REJECT: '驳回修改',
  SHIP: '确认发货',
  ARRIVE: '确认到货',
  PUTAWAY: '确认入库',
};

/** 状态机转移表：event → next status */
const TRANSITIONS: Record<
  OrderStatus,
  Partial<Record<FlowEvent, OrderStatus>>
> = {
  草稿: { SUBMIT: '待审批' },
  待审批: { APPROVE: '已下单', REJECT: '草稿' },
  已下单: { SHIP: '已发货' },
  已发货: { ARRIVE: '已到货' },
  已到货: { PUTAWAY: '已入库' },
  已入库: {},
};

export function canTransition(from: OrderStatus, event: FlowEvent): boolean {
  return Boolean(TRANSITIONS[from]?.[event]);
}

export function transition(
  from: OrderStatus,
  event: FlowEvent,
): OrderStatus | null {
  return TRANSITIONS[from]?.[event] ?? null;
}

export function availableEvents(status: OrderStatus): FlowEvent[] {
  return (Object.keys(TRANSITIONS[status] ?? {}) as FlowEvent[]).filter((e) =>
    canTransition(status, e),
  );
}

export function statusIndex(status: OrderStatus): number {
  return ORDER_STATUS_FLOW.indexOf(status);
}
