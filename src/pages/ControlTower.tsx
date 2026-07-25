import {
  towerHeatmap,
  towerKpiCards,
  towerNodes,
  towerWarnings,
} from '../mock/controlTower';

const heatColor = {
  高: 'bg-red-500',
  中: 'bg-amber-400',
  低: 'bg-emerald-400',
};

const severityStyle = {
  高: 'border-red-200 bg-red-50 text-red-800',
  中: 'border-amber-200 bg-amber-50 text-amber-900',
  低: 'border-slate-200 bg-slate-50 text-slate-700',
};

export default function ControlTower() {
  const high = towerWarnings.filter((w) => w.severity === '高');
  const mid = towerWarnings.filter((w) => w.severity === '中');
  const low = towerWarnings.filter((w) => w.severity === '低');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">供应链控制塔全域看板</h2>
        <p className="mt-1 text-sm text-slate-500">
          寻源到交付全链路 KPI · 异常热点 · 预警分级
        </p>
      </div>

      {/* 横向全链路时间轴 */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <h3 className="mb-4 font-medium text-slate-800">全链路流程</h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[900px] items-stretch gap-0">
            {towerNodes.map((node, i) => (
              <div key={node.key} className="flex flex-1 items-center">
                <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-3 text-center">
                  <div className="text-sm font-semibold text-slate-800">
                    {node.label}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {node.kpiLabel}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-teal-700">
                    {node.kpiValue}
                  </div>
                  <div
                    className={`mx-auto mt-2 h-1.5 w-8 rounded-full ${heatColor[node.anomalyLevel]}`}
                    title={`异常热度：${node.anomalyLevel}`}
                  />
                </div>
                {i < towerNodes.length - 1 && (
                  <div className="mx-1 shrink-0 text-slate-300">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8 环节 KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {towerKpiCards.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm"
          >
            <div className="text-xs text-slate-500">{k.label}</div>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-2xl font-semibold text-slate-800">
                {k.value}
              </span>
              <span className="mb-0.5 text-xs text-slate-400">{k.unit}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400">参考 {k.range}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        {/* 异常热点图 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="mb-1 font-medium text-slate-800">异常热点图</h3>
          <p className="mb-4 text-xs text-slate-500">
            各环节异常发生频率（高 / 中 / 低）
          </p>
          <div className="grid grid-cols-4 gap-2">
            {towerHeatmap.map((h) => (
              <div
                key={h.stage}
                className="flex flex-col items-center rounded-lg border border-slate-100 p-2"
              >
                <div
                  className={`mb-2 flex h-14 w-full items-end justify-center rounded ${
                    h.level === '高'
                      ? 'bg-red-100'
                      : h.level === '中'
                        ? 'bg-amber-50'
                        : 'bg-emerald-50'
                  }`}
                >
                  <div
                    className={`w-3/5 rounded-t ${heatColor[h.level]}`}
                    style={{ height: `${h.score * 28}%` }}
                  />
                </div>
                <div className="text-[11px] font-medium text-slate-700">
                  {h.stage}
                </div>
                <div className="text-[10px] text-slate-400">{h.level}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-sm ${heatColor['高']}`} /> 高
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-sm ${heatColor['中']}`} /> 中
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-sm ${heatColor['低']}`} /> 低
            </span>
          </div>
        </div>

        {/* 全局预警 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-3">
          <h3 className="mb-3 font-medium text-slate-800">全局预警汇总</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <WarnCol title="高" items={high} />
            <WarnCol title="中" items={mid} />
            <WarnCol title="低" items={low} />
          </div>
        </div>
      </div>
    </div>
  );
}

function WarnCol({
  title,
  items,
}: {
  title: '高' | '中' | '低';
  items: typeof towerWarnings;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">严重程度 · {title}</span>
        <span className="text-slate-400">{items.length}</span>
      </div>
      <ul className="space-y-2">
        {items.map((w) => (
          <li
            key={w.id}
            className={`rounded-lg border p-2.5 text-xs ${severityStyle[w.severity]}`}
          >
            <div className="font-medium">{w.title}</div>
            <div className="mt-1 opacity-70">
              {w.stage} · {w.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
