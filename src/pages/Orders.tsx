import { useMemo, useState, type ReactNode } from 'react';
import { ORDER_STATUS_FLOW, purchaseOrders } from '../mock/purchaseOrders';
import { chemSuppliers } from '../mock/suppliers';
import type { OrderStatus, PurchaseOrder } from '../mock/chemTypes';
import PermissionGate from '../components/PermissionGate';
import { useAuthStore } from '../store/useAuthStore';
import { Modules } from '../types/user';
import { filterDataByRole } from '../utils/permission';

const CATEGORIES = [
  '全部品类',
  '基础化学品',
  '精细化学品',
  '聚合物',
  '溶剂',
  '催化剂',
  '包装材料',
];

const STATUS_OPTIONS: Array<'全部状态' | OrderStatus> = [
  '全部状态',
  ...ORDER_STATUS_FLOW,
];

export default function Orders() {
  const user = useAuthStore((s) => s.currentUser);
  const [supplier, setSupplier] = useState('全部供应商');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('全部状态');
  const [category, setCategory] = useState('全部品类');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-07-14');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');

  const scopedOrders = useMemo(
    () => filterDataByRole(purchaseOrders, user, 'createdBy', Modules.ORDERS),
    [user],
  );

  const filtered = useMemo(() => {
    return scopedOrders.filter((o) => {
      if (supplier !== '全部供应商' && o.supplierName !== supplier) return false;
      if (status !== '全部状态' && o.status !== status) return false;
      if (category !== '全部品类' && o.category !== category) return false;
      if (o.orderDate < dateFrom || o.orderDate > dateTo) return false;
      return true;
    });
  }, [scopedOrders, supplier, status, category, dateFrom, dateTo]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((o) => o.id)));
  };

  const batchAction = (action: string) => {
    if (selected.size === 0) {
      setToast('请先勾选订单');
    } else {
      setToast(`已对 ${selected.size} 笔订单执行「${action}」（演示）`);
      setSelected(new Set());
    }
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">采购订单全生命周期</h2>
          <p className="mt-1 text-sm text-slate-500">
            数据范围按角色过滤
            {user ? ` · 当前 ${user.name}（${user.employeeId}）` : ''}
            {' · '}
            <a href="/process-flow" className="text-[#1677FF] hover:underline">
              补货闭环跟踪
            </a>
          </p>
        </div>
        <PermissionGate module={Modules.ORDERS} action="edit">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => batchAction('合并下单')}
              className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              合并下单
            </button>
            <button
              type="button"
              onClick={() => batchAction('取消订单')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              取消订单
            </button>
          </div>
        </PermissionGate>
      </div>

      {toast && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <label className="flex items-center gap-1 text-xs text-slate-500">
          起始
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1.5 text-sm text-slate-700"
          />
        </label>
        <label className="flex items-center gap-1 text-xs text-slate-500">
          截止
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1.5 text-sm text-slate-700"
          />
        </label>
        <select
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm"
        >
          <option>全部供应商</option>
          {chemSuppliers.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
          }
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="ml-auto self-center text-xs text-slate-400">
          共 {filtered.length} 笔
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 && selected.size === filtered.length
                    }
                    onChange={toggleAll}
                    className="accent-teal-700"
                  />
                </th>
                <th className="px-3 py-2.5 font-medium">订单号</th>
                <th className="px-3 py-2.5 font-medium">供应商</th>
                <th className="px-3 py-2.5 font-medium">品类</th>
                <th className="px-3 py-2.5 font-medium">物料</th>
                <th className="px-3 py-2.5 font-medium">数量(吨)</th>
                <th className="px-3 py-2.5 font-medium">金额(万元)</th>
                <th className="px-3 py-2.5 font-medium">下单日</th>
                <th className="px-3 py-2.5 font-medium">预计到货</th>
                <th className="px-3 py-2.5 font-medium">实际到货</th>
                <th className="px-3 py-2.5 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <OrderRows
                  key={order.id}
                  order={order}
                  expanded={expanded === order.id}
                  selected={selected.has(order.id)}
                  onToggleExpand={() =>
                    setExpanded((id) => (id === order.id ? null : order.id))
                  }
                  onToggleSelect={() => toggleSelect(order.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderRows({
  order,
  expanded,
  selected,
  onToggleExpand,
  onToggleSelect,
}: {
  order: PurchaseOrder;
  expanded: boolean;
  selected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
}) {
  const stepIndex = ORDER_STATUS_FLOW.indexOf(order.status);

  return (
    <>
      <tr
        className="cursor-pointer border-t border-slate-100 hover:bg-slate-50/80"
        onClick={onToggleExpand}
      >
        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="accent-teal-700"
          />
        </td>
        <td className="px-3 py-3 font-medium text-teal-800">{order.id}</td>
        <td className="max-w-[140px] truncate px-3 py-3 text-slate-700">
          {order.supplierName}
        </td>
        <td className="px-3 py-3 text-slate-500">{order.category}</td>
        <td className="px-3 py-3 text-slate-700">{order.materialName}</td>
        <td className="px-3 py-3">{order.qty}</td>
        <td className="px-3 py-3">{order.amount}</td>
        <td className="px-3 py-3 text-slate-500">{order.orderDate}</td>
        <td className="px-3 py-3 text-slate-500">{order.eta}</td>
        <td className="px-3 py-3 text-slate-500">{order.ata ?? '—'}</td>
        <td className="px-3 py-3">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {order.status}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-slate-50 bg-slate-50/50">
          <td colSpan={11} className="px-4 py-4">
            <StatusStepper current={stepIndex} />
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <DetailBlock title="物料清单明细">
                <table className="w-full text-xs">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-1 text-left">SKU</th>
                      <th className="py-1 text-left">名称</th>
                      <th className="py-1 text-right">数量</th>
                      <th className="py-1 text-right">金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.lineItems.map((li) => (
                      <tr key={li.sku} className="border-t border-slate-100">
                        <td className="py-1.5">{li.sku}</td>
                        <td className="py-1.5">{li.name}</td>
                        <td className="py-1.5 text-right">
                          {li.qty} {li.unit}
                        </td>
                        <td className="py-1.5 text-right">{li.amount} 万</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DetailBlock>
              <DetailBlock title="审批记录">
                {order.approvals.length === 0 ? (
                  <p className="text-xs text-slate-400">草稿状态，尚无审批</p>
                ) : (
                  <ul className="space-y-2 text-xs">
                    {order.approvals.map((a, i) => (
                      <li key={i} className="rounded bg-white p-2 ring-1 ring-slate-100">
                        <div className="font-medium text-slate-700">
                          {a.step} · {a.result}
                        </div>
                        <div className="text-slate-400">
                          {a.actor} · {a.time}
                        </div>
                        {a.comment && (
                          <div className="mt-0.5 text-slate-500">{a.comment}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </DetailBlock>
              <DetailBlock title="变更历史">
                {order.changes.length === 0 ? (
                  <p className="text-xs text-slate-400">无变更记录</p>
                ) : (
                  <ul className="space-y-2 text-xs">
                    {order.changes.map((c, i) => (
                      <li key={i} className="rounded bg-white p-2 ring-1 ring-slate-100">
                        <div className="font-medium text-slate-700">
                          {c.field}：{c.from} → {c.to}
                        </div>
                        <div className="text-slate-400">
                          {c.operator} · {c.time}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </DetailBlock>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatusStepper({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {ORDER_STATUS_FLOW.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div
            className={[
              'rounded-full px-2.5 py-1 text-[11px] font-medium',
              i < current
                ? 'bg-teal-100 text-teal-800'
                : i === current
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-400',
            ].join(' ')}
          >
            {s}
          </div>
          {i < ORDER_STATUS_FLOW.length - 1 && (
            <span className="text-slate-300">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <h4 className="mb-2 text-xs font-semibold text-slate-700">{title}</h4>
      {children}
    </div>
  );
}
