import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import ChartFilterBar, { ChartSelect } from './ChartFilterBar';

export default function LeadTimeAnalysis() {
  const rows = useDashboardStore((s) => s.data.leadTime);
  const overall = useDashboardStore((s) => s.data.leadOverallAttainment);
  const [stage, setStage] = useState('all');
  const [metric, setMetric] = useState<'days' | 'attainment'>('days');

  const filtered = useMemo(() => {
    if (stage === 'all') return rows;
    return rows.filter((r) => r.stage.startsWith(stage));
  }, [rows, stage]);

  const avgAttain =
    filtered.length === 0
      ? overall
      : Math.round(
          (filtered.reduce((s, r) => s + r.attainment, 0) / filtered.length) * 10,
        ) / 10;

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">全链路时效分析</h3>
          <p className="text-xs text-[#667085]">
            {metric === 'days' ? '计划 vs 实际周期（天）' : '各环节时效达成率（%）'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ChartFilterBar>
            <ChartSelect
              label="环节"
              value={stage}
              onChange={setStage}
              options={[
                { value: 'all', label: '全部' },
                { value: '采购', label: '采购' },
                { value: '仓储', label: '仓储' },
                { value: '运输', label: '运输' },
                { value: '交付', label: '交付' },
              ]}
            />
            <ChartSelect
              label="指标"
              value={metric}
              onChange={(v) => setMetric(v as 'days' | 'attainment')}
              options={[
                { value: 'days', label: '计划/实际' },
                { value: 'attainment', label: '达成率' },
              ]}
            />
          </ChartFilterBar>
          <div className="text-right">
            <div className="text-[11px] text-[#667085]">时效达成率</div>
            <div className="text-lg font-semibold text-[#1677FF]">{avgAttain}%</div>
          </div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filtered} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
            <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#667085' }} />
            <YAxis tick={{ fontSize: 11, fill: '#667085' }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {metric === 'days' ? (
              <>
                <Bar dataKey="planned" name="计划" fill="#667085" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="实际" fill="#1677FF" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <Bar
                dataKey="attainment"
                name="达成率%"
                fill="#1677FF"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {filtered.map((r) => (
          <div key={r.stage} className="rounded-lg bg-[#F2F4F7] px-2 py-1.5 text-center">
            <div className="text-[10px] text-[#667085]">{r.stage.replace('周期', '')}</div>
            <div className="text-sm font-medium text-[#1D2939]">{r.attainment}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
