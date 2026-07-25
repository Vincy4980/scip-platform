import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FLOW_EVENT_LABEL,
  FLOW_NODES,
  statusIndex,
  type FlowEvent,
} from '../workflow/orderMachine';
import { useAuthStore } from '../store/useAuthStore';
import { useFlowStore } from '../store/useFlowStore';

const URGENCY = {
  high: 'bg-[#FFF1F0] text-[#F53F3F]',
  medium: 'bg-[#FFF1E6] text-[#FF7D29]',
  low: 'bg-[#E8F3FF] text-[#1677FF]',
};

export default function ProcessFlow() {
  const user = useAuthStore((s) => s.currentUser);
  const instances = useFlowStore((s) => s.instances);
  const advance = useFlowStore((s) => s.advance);
  const eventsFor = useFlowStore((s) => s.eventsFor);
  const [selectedId, setSelectedId] = useState(instances[0]?.id ?? '');
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('全部');

  const filtered = useMemo(() => {
    if (filter === '全部') return instances;
    return instances.filter((i) => i.status === filter);
  }, [instances, filter]);

  const selected =
    instances.find((i) => i.id === selectedId) ?? filtered[0] ?? null;

  const run = (event: FlowEvent) => {
    if (!selected || !user) return;
    const res = advance(selected.id, event, user.name);
    setToast(res.message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const idx = selected ? statusIndex(selected.status) : -1;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#1D2939]">补货闭环 · BPMN 流程跟踪</h2>
          <p className="mt-1 text-sm text-[#667085]">
            状态机驱动：库存预警 → 申请 → 审批 → 发货 → 到货 → 入库
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <Link
            to="/inventory"
            className="rounded-xl border border-[#D0E4FF] bg-white px-3 py-1.5 text-[#1677FF] hover:bg-[#E8F3FF]"
          >
            去库存发起
          </Link>
          <Link
            to="/orders"
            className="rounded-xl border border-[#E4E7EC] bg-white px-3 py-1.5 text-[#667085] hover:bg-[#F2F4F7]"
          >
            采购订单
          </Link>
          <Link
            to="/warehouse"
            className="rounded-xl border border-[#E4E7EC] bg-white px-3 py-1.5 text-[#667085] hover:bg-[#F2F4F7]"
          >
            仓储入库
          </Link>
        </div>
      </div>

      {toast && (
        <div className="rounded-xl border border-[#D0E4FF] bg-[#E8F3FF] px-3 py-2 text-sm text-[#1677FF]">
          {toast}
        </div>
      )}

      {/* BPMN 风格泳道状态机 */}
      <section className="overflow-x-auto rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-[#1D2939]">流程状态机（BPMN）</h3>
        <div className="flex min-w-[720px] items-stretch gap-0">
          {FLOW_NODES.map((node, i) => {
            const active = idx === i;
            const done = idx > i;
            return (
              <div key={node.id} className="flex flex-1 items-center">
                <div
                  className={`w-full rounded-xl border px-2 py-3 text-center transition ${
                    active
                      ? 'border-[#1677FF] bg-[#E8F3FF] shadow-sm'
                      : done
                        ? 'border-[#00B42A]/40 bg-[#E8FFEA]'
                        : 'border-[#E4E7EC] bg-[#F2F4F7]'
                  }`}
                >
                  <div
                    className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                      active ? 'bg-[#1677FF]' : done ? 'bg-[#00B42A]' : 'bg-[#98A2B3]'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="text-xs font-semibold text-[#1D2939]">{node.label}</div>
                  <div className="mt-0.5 text-[10px] text-[#667085]">{node.role}</div>
                  <div className="mt-1 text-[10px] text-[#98A2B3]">{node.id}</div>
                </div>
                {i < FLOW_NODES.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 w-3 shrink-0 ${
                      done ? 'bg-[#00B42A]' : 'bg-[#D0E4FF]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        {selected && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F2F4F7] pt-3">
            <span className="text-xs text-[#667085]">
              当前单据 {selected.poId} · 状态「{selected.status}」
            </span>
            {eventsFor(selected.id).map((ev) => (
              <button
                key={ev}
                type="button"
                onClick={() => run(ev)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium text-white ${
                  ev === 'REJECT'
                    ? 'bg-[#F53F3F]'
                    : ev === 'APPROVE' || ev === 'PUTAWAY'
                      ? 'bg-[#00B42A]'
                      : 'bg-[#1677FF]'
                }`}
              >
                {FLOW_EVENT_LABEL[ev]}
              </button>
            ))}
            {eventsFor(selected.id).length === 0 && (
              <span className="text-xs text-[#00B42A]">已闭环完成 ✓</span>
            )}
          </div>
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2 rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1D2939]">流程实例</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-[#E4E7EC] bg-[#F2F4F7] px-2 py-1 text-xs"
            >
              {['全部', ...FLOW_NODES.map((n) => n.id)].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <ul className="max-h-[480px] space-y-2 overflow-auto">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selected?.id === item.id
                      ? 'border-[#1677FF] bg-[#E8F3FF]'
                      : 'border-[#E4E7EC] hover:bg-[#F2F4F7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[#1D2939]">{item.materialName}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] ${URGENCY[item.urgency]}`}>
                      {item.urgency}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#667085]">
                    {item.poId} · {item.status} · {item.qty} 吨
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:col-span-3 space-y-4">
          {selected ? (
            <>
              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-[#1D2939]">单据详情</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-[11px] text-[#667085]">流程号</dt>
                    <dd className="font-medium">{selected.id}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#667085]">采购单</dt>
                    <dd className="font-medium">{selected.poId}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#667085]">SKU</dt>
                    <dd className="font-medium">{selected.sku}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#667085]">仓库</dt>
                    <dd className="font-medium">{selected.warehouse}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#667085]">供应商</dt>
                    <dd className="font-medium">{selected.supplierName}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#667085]">ETA</dt>
                    <dd className="font-medium">{selected.eta}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-[#1D2939]">流转轨迹</h3>
                <ol className="space-y-3">
                  {[...selected.history].reverse().map((h, i) => (
                    <li key={`${h.at}-${i}`} className="flex gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1677FF]" />
                      <div>
                        <div className="font-medium text-[#1D2939]">
                          {h.eventLabel}
                          <span className="ml-2 text-xs font-normal text-[#667085]">
                            {h.from} → {h.to}
                          </span>
                        </div>
                        <div className="text-xs text-[#667085]">
                          {h.at} · {h.actor}
                          {h.comment ? ` · ${h.comment}` : ''}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#667085]">
              暂无流程，请从库存水位发起补货申请
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
