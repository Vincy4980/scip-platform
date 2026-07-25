import { useDashboardStore } from '../../store/useDashboardStore';

const DETAIL: Record<string, { title: string; lines: (d: ReturnType<typeof useDashboardStore.getState>['data']) => string[] }> = {
  health: {
    title: '供应链健康度明细',
    lines: (d) => [
      `综合评分 ${d.kpis.healthScore} 分`,
      ...d.healthRadar.map((r) => `${r.dim}：${r.score} / 目标 ${r.target}`),
      '权重：准时交付 30% · 库存周转 25% · 运输时效 25% · 质量 20%',
    ],
  },
  lead: {
    title: '全链路时效明细',
    lines: (d) => [
      `总周期 ${d.kpis.leadTimeDays} 天`,
      ...d.leadTime.map(
        (r) => `${r.stage}：计划 ${r.planned}d / 实际 ${r.actual}d（达成 ${r.attainment}%）`,
      ),
      `整体达成率 ${d.leadOverallAttainment}%`,
    ],
  },
  cost: {
    title: '运营成本明细',
    lines: (d) => [
      `总成本 ${d.kpis.totalCostWan} 万元 · 预算执行率 ${d.kpis.budgetRate}%`,
      ...d.costSlices.map((c) => `${c.name}：${c.value} 万元（${c.pct}%）`),
      `节省目标完成度 ${d.costSavingPct}%`,
    ],
  },
  capacity: {
    title: '产能利用明细',
    lines: (d) => [
      `综合利用率 ${d.kpis.capacityUtil}%`,
      `瓶颈环节：${d.kpis.capacityBottleneck}`,
      `需求满足率 ${d.fulfillRate}% · 预测准确度 ${d.forecastAccuracy}%`,
      ...d.supplyDemand.slice(-2).map(
        (r) => `${r.month}：供应 ${r.supply}t / 需求 ${r.demand}t`,
      ),
    ],
  },
  quality: {
    title: '质量表现明细',
    lines: (d) => [
      `综合合格率 ${d.kpis.qualityRate}% · 问题 ${d.kpis.qualityIssues} 宗`,
      ...d.qualityBars.map((b) => `${b.name}：${b.rate}%（同比 ${b.yoy >= 0 ? '+' : ''}${b.yoy}%）`),
    ],
  },
};

export default function KpiDetailDrawer() {
  const selected = useDashboardStore((s) => s.selectedKpi);
  const data = useDashboardStore((s) => s.data);
  const setSelected = useDashboardStore((s) => s.setSelectedKpi);

  if (!selected || !DETAIL[selected]) return null;
  const meta = DETAIL[selected];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-900/30"
        aria-label="关闭明细"
        onClick={() => setSelected(null)}
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="font-semibold text-slate-800">{meta.title}</h3>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-50"
          >
            关闭
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {meta.lines(data).map((line, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {line}
            </div>
          ))}
          <p className="pt-2 text-xs text-slate-400">
            控制塔为全局总览；点击异常列表可进入采购 / 库存 / 物流 / 交付等分模块查看明细。
          </p>
        </div>
      </aside>
    </>
  );
}
