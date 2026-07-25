import { create } from 'zustand';
import type { OrderStatus } from '../mock/chemTypes';
import type { ReplenishmentAdvice } from '../mock/types';
import { purchaseOrders } from '../mock/purchaseOrders';
import {
  FLOW_EVENT_LABEL,
  type FlowEvent,
  availableEvents,
  transition,
} from '../workflow/orderMachine';

export interface FlowHistoryItem {
  at: string;
  from: OrderStatus;
  to: OrderStatus;
  event: FlowEvent;
  eventLabel: string;
  actor: string;
  comment?: string;
}

export interface FlowInstance {
  id: string;
  adviceId?: string;
  poId: string;
  sku: string;
  materialName: string;
  qty: number;
  warehouse: string;
  supplierName: string;
  status: OrderStatus;
  urgency: 'high' | 'medium' | 'low';
  eta: string;
  amount: number;
  history: FlowHistoryItem[];
  createdAt: string;
  createdBy: string;
}

function nowStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')} ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
}

function seedFromOrders(): FlowInstance[] {
  return purchaseOrders.slice(0, 8).map((o, i) => ({
    id: `FLW-${1001 + i}`,
    poId: o.id,
    sku: o.sku,
    materialName: o.materialName,
    qty: o.qty,
    warehouse: i % 2 === 0 ? '湛江2号库' : '湛江1号库',
    supplierName: o.supplierName,
    status: o.status,
    urgency: (['high', 'medium', 'low'] as const)[i % 3],
    eta: o.eta,
    amount: o.amount,
    createdAt: `${o.orderDate} 09:00`,
    createdBy: o.createdBy ?? 'EMP-001',
    history: [
      {
        at: `${o.orderDate} 09:00`,
        from: '草稿',
        to: o.status === '草稿' ? '草稿' : '待审批',
        event: 'SUBMIT',
        eventLabel: FLOW_EVENT_LABEL.SUBMIT,
        actor: '系统种子',
        comment: '历史订单导入闭环',
      },
    ],
  }));
}

interface FlowState {
  instances: FlowInstance[];
  lastCreatedId: string | null;
  createFromAdvice: (
    advice: ReplenishmentAdvice,
    opts: { actor: string; employeeId: string; supplierName?: string },
  ) => FlowInstance;
  advance: (
    id: string,
    event: FlowEvent,
    actor: string,
    comment?: string,
  ) => { ok: boolean; message: string };
  getById: (id: string) => FlowInstance | undefined;
  pendingInbound: () => FlowInstance[];
  eventsFor: (id: string) => FlowEvent[];
}

export const useFlowStore = create<FlowState>((set, get) => ({
  instances: seedFromOrders(),
  lastCreatedId: null,

  createFromAdvice: (advice, opts) => {
    const seq = 2000 + get().instances.length;
    const poId = `PO-2026-${seq}`;
    const id = `FLW-${seq}`;
    const inst: FlowInstance = {
      id,
      adviceId: advice.id,
      poId,
      sku: advice.sku,
      materialName: advice.name,
      qty: advice.suggestQty,
      warehouse: advice.warehouse,
      supplierName: opts.supplierName ?? '首选供应商（自动匹配）',
      status: '草稿',
      urgency: advice.urgency,
      eta: advice.eta,
      amount: Math.round(advice.suggestQty * 1.2 * 10) / 10,
      createdAt: nowStr(),
      createdBy: opts.employeeId,
      history: [
        {
          at: nowStr(),
          from: '草稿',
          to: '草稿',
          event: 'SUBMIT',
          eventLabel: '创建补货申请',
          actor: opts.actor,
          comment: advice.reason,
        },
      ],
    };
    set((s) => ({
      instances: [inst, ...s.instances],
      lastCreatedId: id,
    }));
    return inst;
  },

  advance: (id, event, actor, comment) => {
    const inst = get().instances.find((x) => x.id === id);
    if (!inst) return { ok: false, message: '流程不存在' };
    const next = transition(inst.status, event);
    if (!next) {
      return {
        ok: false,
        message: `当前状态「${inst.status}」无法执行「${FLOW_EVENT_LABEL[event]}」`,
      };
    }
    const item: FlowHistoryItem = {
      at: nowStr(),
      from: inst.status,
      to: next,
      event,
      eventLabel: FLOW_EVENT_LABEL[event],
      actor,
      comment,
    };
    set((s) => ({
      instances: s.instances.map((x) =>
        x.id === id
          ? { ...x, status: next, history: [...x.history, item] }
          : x,
      ),
    }));
    return {
      ok: true,
      message: `${FLOW_EVENT_LABEL[event]}成功 → ${next}`,
    };
  },

  getById: (id) => get().instances.find((x) => x.id === id),

  pendingInbound: () =>
    get().instances.filter((x) => x.status === '已到货' || x.status === '已发货'),

  eventsFor: (id) => {
    const inst = get().getById(id);
    return inst ? availableEvents(inst.status) : [];
  },
}));
