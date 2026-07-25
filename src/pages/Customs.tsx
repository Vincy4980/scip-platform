import { useMemo, useState } from 'react';
import {
  CUSTOMS_STAGES,
  customsShipments,
  documentChecklist,
  dutyTable,
  incoterms,
  licenseItems,
} from '../mock/global';

export default function Customs() {
  const [incoterm, setIncoterm] = useState('CIF');
  const [hs, setHs] = useState('29291010');
  const [origin, setOrigin] = useState('中国');
  const [dest, setDest] = useState('荷兰');
  const [value, setValue] = useState(1000000);

  const term = incoterms.find((t) => t.code === incoterm) ?? incoterms[0];
  const dutyRate = dutyTable[hs] ?? dutyTable.default;
  const duty = Math.round(value * dutyRate);
  const vatApprox = Math.round((value + duty) * 0.13);
  const totalTax = duty + vatApprox;

  const docsMissing = useMemo(
    () => documentChecklist.filter((d) => !d.ready),
    [],
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">跨境物流与关务管理</h2>
        <p className="mt-1 text-sm text-slate-500">
          在途追踪 · 报关时间线 · 贸易术语 · 关税测算 · 单证与许可证
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="font-medium text-slate-800">全球在途货物</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2">货运单</th>
                <th className="px-3 py-2">货物</th>
                <th className="px-3 py-2">起运港</th>
                <th className="px-3 py-2">目的港</th>
                <th className="px-3 py-2">ETA</th>
                <th className="px-3 py-2">运输状态</th>
                <th className="px-3 py-2">报关阶段</th>
              </tr>
            </thead>
            <tbody>
              {customsShipments.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-3 font-medium text-teal-800">{s.id}</td>
                  <td className="px-3 py-3">{s.cargo}</td>
                  <td className="px-3 py-3">{s.fromPort}</td>
                  <td className="px-3 py-3">{s.toPort}</td>
                  <td className="px-3 py-3 text-slate-500">{s.eta}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <CustomsStepper current={s.customsStage} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">贸易术语 Incoterms</h3>
          <select
            value={incoterm}
            onChange={(e) => setIncoterm(e.target.value)}
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {incoterms.map((t) => (
              <option key={t.code} value={t.code}>
                {t.code} · {t.name}
              </option>
            ))}
          </select>
          <ul className="space-y-2 text-sm text-slate-600">
            {term.costs.map((c) => (
              <li key={c} className="rounded-lg bg-slate-50 px-3 py-2">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">关税计算器</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs text-slate-500">
              HS 编码
              <input
                value={hs}
                onChange={(e) => setHs(e.target.value)}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              货值 (USD)
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              原产国
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              目的国
              <input
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
              />
            </label>
          </div>
          <div className="mt-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-900">
            <div>
              {origin} → {dest} · 税率 {(dutyRate * 100).toFixed(1)}%
            </div>
            <div className="mt-1">预估关税 USD {duty.toLocaleString()}</div>
            <div>预估增值税(示意13%) USD {vatApprox.toLocaleString()}</div>
            <div className="mt-1 font-semibold">
              综合税费 USD {totalTax.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-slate-800">单证清单看板</h3>
            <span className="text-xs text-red-600">缺失 {docsMissing.length}</span>
          </div>
          <div className="max-h-72 space-y-2 overflow-auto">
            {documentChecklist.map((d) => (
              <div
                key={d.id}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  d.ready
                    ? 'border-slate-100 bg-slate-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <span>
                  {d.shipmentId} · {d.type}
                </span>
                <span
                  className={`text-xs font-medium ${
                    d.ready ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {d.ready ? '已齐备' : '缺失'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">许可证到期提醒</h3>
          <ul className="space-y-2">
            {licenseItems.map((l) => {
              const urgent = l.daysLeft <= 30;
              return (
                <li
                  key={l.id}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    urgent
                      ? 'border-red-300 bg-red-50 text-red-900'
                      : 'border-slate-100 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-medium">{l.name}</div>
                  <div className="mt-0.5 text-xs opacity-80">
                    有效期至 {l.expiry} · 剩余 {l.daysLeft} 天
                    {urgent ? ' · 即将到期' : ''}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CustomsStepper({
  current,
}: {
  current: (typeof CUSTOMS_STAGES)[number];
}) {
  const idx = CUSTOMS_STAGES.indexOf(current);
  return (
    <div className="flex flex-wrap items-center gap-1">
      {CUSTOMS_STAGES.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] ${
              i < idx
                ? 'bg-teal-100 text-teal-800'
                : i === idx
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-400'
            }`}
          >
            {s}
          </span>
          {i < CUSTOMS_STAGES.length - 1 && (
            <span className="text-[10px] text-slate-300">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
