import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../../store/useDashboardStore';

function formatDelta(v: number, unit = '%') {
  const arrow = v > 0 ? '↑' : v < 0 ? '↓' : '→';
  return `${arrow}${Math.abs(v)}${unit}`;
}

export default function KpiCards() {
  const kpis = useDashboardStore((s) => s.data.kpis);
  const compare = useDashboardStore((s) => s.filters.compareType);
  const setSelectedKpi = useDashboardStore((s) => s.setSelectedKpi);
  const navigate = useNavigate();

  const healthColor =
    kpis.healthScore >= 80
      ? 'text-[#00B42A]'
      : kpis.healthScore >= 60
        ? 'text-[#FF7D29]'
        : 'text-[#F53F3F]';

  const cards = [
    {
      key: 'health',
      title: '供应链健康度',
      value: kpis.healthScore,
      unit: '分',
      valueClass: healthColor,
      delta: formatDelta(kpis.healthDelta),
      deltaGood: kpis.healthDelta >= 0,
      hint: '准时30% + 周转25% + 运输25% + 质量20%',
      spark: kpis.healthSpark as number[] | null,
      footer: null as ReactNode,
    },
    {
      key: 'lead',
      title: '全链路时效',
      value: kpis.leadTimeDays,
      unit: '天',
      valueClass: 'text-slate-800',
      delta: formatDelta(kpis.leadTimeDelta),
      deltaGood: kpis.leadTimeDelta <= 0,
      hint: kpis.leadBreakdown.map((b) => `${b.label}${b.days}d`).join(' + '),
      spark: null,
      footer: null,
    },
    {
      key: 'cost',
      title: '总运营成本',
      value: kpis.totalCostWan.toLocaleString(),
      unit: '万元',
      valueClass: 'text-slate-800',
      delta: formatDelta(kpis.costDelta),
      deltaGood: kpis.costDelta <= 0,
      hint: `预算执行率 ${kpis.budgetRate}%`,
      spark: null,
      footer: null,
    },
    {
      key: 'capacity',
      title: '产能利用率',
      value: kpis.capacityUtil,
      unit: '%',
      valueClass: 'text-slate-800',
      delta: formatDelta(kpis.capacityDelta),
      deltaGood: kpis.capacityDelta >= 0,
      hint: `瓶颈：${kpis.capacityBottleneck}`,
      spark: null,
      footer: null,
    },
    {
      key: 'quality',
      title: '综合质量合格率',
      value: kpis.qualityRate,
      unit: '%',
      valueClass: 'text-slate-800',
      delta: formatDelta(kpis.qualityDelta),
      deltaGood: kpis.qualityDelta >= 0,
      hint: `质量问题 ${kpis.qualityIssues} 宗`,
      spark: null,
      footer: null,
    },
    {
      key: 'anomaly',
      title: '异常事件数',
      value: kpis.anomalyCount,
      unit: '条',
      valueClass: 'text-slate-800',
      delta: `${kpis.anomalyDelta > 0 ? '↑' : kpis.anomalyDelta < 0 ? '↓' : '→'}${Math.abs(kpis.anomalyDelta)}条`,
      deltaGood: kpis.anomalyDelta <= 0,
      hint: null,
      spark: null,
      footer: (
        <div className="mt-2 flex flex-wrap gap-1">
          {kpis.anomalyBySeverity.map((s) => (
            <span
              key={s.level}
              className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600"
            >
              <i className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
              {s.level} {s.count}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => {
            if (c.key === 'anomaly') navigate('/logistics');
            else setSelectedKpi(c.key);
          }}
          className="rounded-2xl border border-[#E4E7EC] bg-white p-4 text-left shadow-sm transition hover:border-[#1677FF] hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm text-slate-500">{c.title}</div>
            {compare !== 'none' && (
              <span
                className={`text-xs font-medium ${
                  c.deltaGood ? 'text-[#00B42A]' : 'text-[#F53F3F]'
                }`}
              >
                {c.delta}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-end gap-1">
            <span className={`text-3xl font-semibold tracking-tight ${c.valueClass}`}>
              {c.value}
            </span>
            <span className="mb-1 text-sm text-slate-400">{c.unit}</span>
          </div>
          {c.hint && (
            <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{c.hint}</p>
          )}
          {c.spark && (
            <div className="mt-2 flex h-8 items-end gap-0.5">
              {c.spark.map((v, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-[#1677FF]/70"
                  style={{ height: `${Math.max(8, ((v - 60) / 40) * 100)}%` }}
                />
              ))}
            </div>
          )}
          {c.footer}
        </button>
      ))}
    </div>
  );
}
