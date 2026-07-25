import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  qcBatches,
  qcRejectReasons,
  qcTodayPassRate,
  warehouseAgeBuckets,
  warehouseStats,
} from '../mock/warehouse';
import type { QcBatch } from '../mock/chemTypes';
import { useAuthStore } from '../store/useAuthStore';
import { useFlowStore } from '../store/useFlowStore';

export default function Warehouse() {
  const user = useAuthStore((s) => s.currentUser);
  const instances = useFlowStore((s) => s.instances);
  const advance = useFlowStore((s) => s.advance);
  const [batches, setBatches] = useState(qcBatches);
  const [toast, setToast] = useState('');

  const inbound = instances.filter(
    (x) => x.status === '已到货' || x.status === '已发货',
  );

  const startQc = (id: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === id && b.status === '待检' ? { ...b, status: '检验中' } : b,
      ),
    );
    setToast(`已开始质检：${id}`);
    window.setTimeout(() => setToast(''), 1800);
  };

  const confirmArrive = (flowId: string) => {
    if (!user) return;
    const res = advance(flowId, 'ARRIVE', user.name, '仓储确认到货');
    setToast(res.message);
    window.setTimeout(() => setToast(''), 2000);
  };

  const confirmPutaway = (flowId: string) => {
    if (!user) return;
    const res = advance(flowId, 'PUTAWAY', user.name, '扫码入库完成');
    setToast(res.message);
    window.setTimeout(() => setToast(''), 2000);
  };

  const pending = batches.filter((b) => b.status !== '已完成');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">智能仓储看板</h2>
        <p className="mt-1 text-sm text-slate-500">
          湛江基地库容 · 库龄结构 · 化工入库质检协同
        </p>
      </div>

      {toast && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      {inbound.length > 0 && (
        <section className="rounded-2xl border border-[#D0E4FF] bg-[#F7FBFF] p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1D2939]">
              闭环待入 / 在途收货（{inbound.length}）
            </h3>
            <Link to="/process-flow" className="text-xs text-[#1677FF] hover:underline">
              打开流程跟踪 →
            </Link>
          </div>
          <ul className="space-y-2">
            {inbound.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-medium text-[#1D2939]">
                    {item.materialName} · {item.qty} 吨
                  </div>
                  <div className="text-[11px] text-[#667085]">
                    {item.poId} · {item.status} · {item.warehouse} · ETA {item.eta}
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.status === '已发货' && (
                    <button
                      type="button"
                      onClick={() => confirmArrive(item.id)}
                      className="rounded-lg bg-[#1677FF] px-3 py-1.5 text-xs font-medium text-white"
                    >
                      确认到货
                    </button>
                  )}
                  {item.status === '已到货' && (
                    <button
                      type="button"
                      onClick={() => confirmPutaway(item.id)}
                      className="rounded-lg bg-[#00B42A] px-3 py-1.5 text-xs font-medium text-white"
                    >
                      确认入库
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="总库容"
          value={(warehouseStats.totalCapacity / 10000).toFixed(1)}
          unit="万吨"
        />
        <Stat
          label="库容使用率"
          value={warehouseStats.utilizationRate}
          unit="%"
        />
        <Stat
          label="当日入库量"
          value={warehouseStats.inboundToday}
          unit="吨"
        />
        <Stat
          label="当日出库量"
          value={warehouseStats.outboundToday}
          unit="吨"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="font-medium text-slate-800">库龄分析</h3>
          <p className="mb-3 text-xs text-slate-500">
            当前在库 {warehouseStats.usedCapacity.toLocaleString()} 吨分布
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseAgeBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={48} />
                <Tooltip
                  formatter={(v) => [`${v} 吨`, '库存量']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="tons" name="吨" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
            {warehouseAgeBuckets.map((b) => (
              <span key={b.label}>
                {b.label} {b.pct}%
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-1 font-medium text-slate-800">质检结果面板</h3>
          <div className="mb-4 flex items-end gap-2">
            <span className="text-3xl font-semibold text-teal-700">
              {qcTodayPassRate}%
            </span>
            <span className="mb-1 text-xs text-slate-500">今日合格率</span>
          </div>
          <p className="mb-2 text-xs font-medium text-slate-600">
            不合格原因 TOP5
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qcRejectReasons} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="reason"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" name="批次数" fill="#0369a1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-slate-800">入库质检队列</h3>
          <span className="text-xs text-slate-400">
            待办 {pending.length} / 总计 {batches.length} 批
          </span>
        </div>
        <ul className="divide-y divide-slate-100">
          {batches.map((b) => (
            <QcRow key={b.id} batch={b} onStart={() => startQc(b.id)} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-semibold text-slate-800">{value}</span>
        <span className="mb-1 text-sm text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function QcRow({
  batch,
  onStart,
}: {
  batch: QcBatch;
  onStart: () => void;
}) {
  const style =
    batch.status === '待检'
      ? 'bg-amber-100 text-amber-800'
      : batch.status === '检验中'
        ? 'bg-sky-100 text-sky-700'
        : 'bg-emerald-100 text-emerald-700';

  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-800">
            {batch.materialName}
          </span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${style}`}>
            {batch.status}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-slate-500">
          {batch.id} · {batch.supplierName} · {batch.warehouse} · 到货{' '}
          {batch.arrivalDate} · {batch.qty} 吨
        </div>
      </div>
      <button
        type="button"
        disabled={batch.status !== '待检'}
        onClick={onStart}
        className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        开始质检
      </button>
    </li>
  );
}
