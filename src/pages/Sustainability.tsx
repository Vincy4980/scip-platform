import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  carbonBreakdown,
  carbonTarget,
  carbonTotal,
  complianceReports,
  globalSuppliers,
  wasteMetrics,
} from '../mock/global';

const COLORS = ['#0d9488', '#0369a1', '#d97706', '#64748b'];

export default function Sustainability() {
  const esgBuckets = (['A', 'B', 'C', 'D'] as const).map((g) => {
    const count = globalSuppliers.filter((s) => s.esg === g).length;
    return {
      grade: g,
      count,
      pct: Math.round((count / globalSuppliers.length) * 1000) / 10,
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">可持续供应链 ESG</h2>
        <p className="mt-1 text-sm text-slate-500">
          碳足迹 · 绿色供应商 · 废弃物 · 合规报告 · 2030 减碳目标
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="font-medium text-slate-800">碳足迹总览</h3>
          <div className="mt-2 text-3xl font-semibold text-slate-800">
            {carbonTotal.toLocaleString()}
            <span className="ml-1 text-sm font-normal text-slate-400">吨 CO₂e</span>
          </div>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carbonBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {carbonBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v} t`, String(n)]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            {carbonBreakdown.map((b, i) => (
              <li key={b.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: COLORS[i] }}
                />
                {b.name} {b.pct}%
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 xl:col-span-3">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-slate-800">绿色供应商占比（ESG）</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {esgBuckets.map((b) => (
                <div
                  key={b.grade}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center"
                >
                  <div className="text-xs text-slate-500">评级 {b.grade}</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-800">
                    {b.count}
                  </div>
                  <div className="text-xs text-teal-700">{b.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-slate-800">废弃物管理</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="回收利用率" value={`${wasteMetrics.recycleRate}%`} />
              <Metric label="无害化处理率" value={`${wasteMetrics.harmlessRate}%`} />
              <Metric
                label="减量目标完成度"
                value={`${wasteMetrics.reductionDonePct}%`}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-slate-800">
              碳减排目标进度（{carbonTarget.year} 年减碳 {carbonTarget.reductionPct}%）
            </h3>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>当前完成 {carbonTarget.currentPct}%</span>
              <span>目标 {carbonTarget.reductionPct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{
                  width: `${(carbonTarget.currentPct / carbonTarget.reductionPct) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-medium text-slate-800">合规报告列表</h3>
        <ul className="divide-y divide-slate-100">
          {complianceReports.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div>
                <div className="text-sm font-medium text-slate-800">{r.name}</div>
                <div className="text-xs text-slate-400">有效期至 {r.expiry}</div>
              </div>
              <button
                type="button"
                disabled={!r.downloadReady}
                className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400"
              >
                {r.downloadReady ? '下载' : '生成中'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-800">{value}</div>
    </div>
  );
}
