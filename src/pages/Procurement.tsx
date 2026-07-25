import { useMemo, useState } from 'react';
import { countries, globalSuppliers, type GlobalSupplier } from '../mock/global';
import PermissionGate from '../components/PermissionGate';
import { Modules } from '../types/user';

function metricTone(kind: 'onTime' | 'quality' | 'response', value: number) {
  if (kind === 'onTime') {
    if (value >= 95) return 'green';
    if (value >= 90) return 'yellow';
    return 'red';
  }
  if (kind === 'quality') {
    if (value >= 98) return 'green';
    if (value >= 96) return 'yellow';
    return 'red';
  }
  if (value <= 3) return 'green';
  if (value <= 6) return 'yellow';
  return 'red';
}

const toneBadge = {
  green: 'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-700',
} as const;

const categories = [
  '全部品类',
  ...Array.from(new Set(globalSuppliers.map((s) => s.category))),
];

export default function Procurement() {
  const [category, setCategory] = useState('全部品类');
  const [country, setCountry] = useState('全部国家/地区');
  const [onlyAnomaly, setOnlyAnomaly] = useState(false);
  const [selected, setSelected] = useState<GlobalSupplier | null>(null);
  const [problem, setProblem] = useState('');
  const [expectDate, setExpectDate] = useState('2026-07-16');
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const countryOptions = ['全部国家/地区', ...countries.map((c) => c.name)];

  const filtered = useMemo(() => {
    return globalSuppliers
      .filter((s) => (category === '全部品类' ? true : s.category === category))
      .filter((s) =>
        country === '全部国家/地区' ? true : s.hqCountry === country,
      )
      .filter((s) => (onlyAnomaly ? s.anomalies.length > 0 || s.tier === '观察级' || s.tier === '淘汰级' : true))
      .sort((a, b) => a.onTimeRate - b.onTimeRate);
  }, [category, country, onlyAnomaly]);

  const anomalyCount = globalSuppliers.filter(
    (s) => s.anomalies.length > 0 || s.tier === '观察级' || s.tier === '淘汰级',
  ).length;

  const openCollab = (s: GlobalSupplier) => {
    setSelected(s);
    setProblem(
      s.anomalies.length
        ? `全球协同：发现异常（${s.anomalies.join('、')}）。请对齐交期与合规材料（REACH/ISO）。`
        : `希望同步 ${s.hqCountry} 基地产能与交期承诺（${s.globalCapability}）。`,
    );
    setExpectDate('2026-07-16');
    setFileName('');
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">供应商协同看板</h2>
          <p className="mt-1 text-sm text-slate-500">
            全球化筛选 · 总部国家 / 全球供应能力标签
          </p>
        </div>
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
          异常/关注 {anomalyCount}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-xs text-slate-400">品类</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-xs text-slate-400">国家/地区</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm"
          >
            {countryOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={onlyAnomaly}
            onChange={(e) => setOnlyAnomaly(e.target.checked)}
            className="accent-teal-700"
          />
          仅看异常
        </label>
      </div>

      <div className="space-y-3">
        {filtered.slice(0, 24).map((s) => {
          const ot = metricTone('onTime', s.onTimeRate);
          const qa = metricTone('quality', s.qualityRate);
          const rs = metricTone('response', s.responseHours);
          const warn = s.anomalies.length > 0 || s.tier === '观察级' || s.tier === '淘汰级';

          return (
            <article
              key={s.id}
              className={`flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center ${
                warn ? 'border-amber-300' : 'border-slate-200/80'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-800">{s.name}</h3>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-white">
                    {s.hqCountry}
                  </span>
                  <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] text-teal-800 ring-1 ring-teal-200">
                    {s.globalCapability}
                  </span>
                  <span className="text-xs text-slate-400">
                    {s.tier} · ESG {s.esg} · {s.category}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneBadge[ot]}`}>
                    准时 {s.onTimeRate}%
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneBadge[qa]}`}>
                    质量 {s.qualityRate}%
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneBadge[rs]}`}>
                    响应 {s.responseHours}h
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44 sm:items-end">
                {s.anomalies.length > 0 ? (
                  <div className="flex flex-wrap justify-end gap-1">
                    {s.anomalies.map((a) => (
                      <span
                        key={a}
                        className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">无异常</span>
                )}
                <PermissionGate module={Modules.PROCUREMENT} action="edit">
                  <button
                    type="button"
                    onClick={() => openCollab(s)}
                    className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
                  >
                    发起协同
                  </button>
                </PermissionGate>
              </div>
            </article>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="关闭"
            className="absolute inset-0 bg-slate-900/40 animate-fade-in"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">协同流程表单</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selected.name} · {selected.hqCountry}
                  </p>
                </div>
                <button type="button" onClick={() => setSelected(null)}>
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-auto px-5 py-4">
              {submitted ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  全球协同单已创建，已同步至对应时区采购窗口。
                </div>
              ) : (
                <>
                  <textarea
                    rows={5}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={expectDate}
                    onChange={(e) => setExpectDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="file"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
                    className="block w-full text-xs"
                  />
                  {fileName && (
                    <p className="text-xs text-teal-700">已选择：{fileName}</p>
                  )}
                </>
              )}
            </div>
            {!submitted && (
              <div className="border-t px-5 py-4">
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="w-full rounded-lg bg-teal-700 py-2.5 text-sm font-medium text-white"
                >
                  提交协同
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
