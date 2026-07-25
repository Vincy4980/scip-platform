import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import ChartFilterBar, { ChartSelect } from './ChartFilterBar';

export default function HealthTrend() {
  const full = useDashboardStore((s) => s.data.healthTrend);
  const score = useDashboardStore((s) => s.data.kpis.healthScore);
  const [range, setRange] = useState('30');
  const warn = score < 60;

  const data = useMemo(() => {
    const n = Number(range);
    return full.slice(-n);
  }, [full, range]);

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">供应链健康度趋势</h3>
          <p className="text-xs text-[#667085]">
            近 {data.length} 天综合评分 · 阈值线 80 / 60
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ChartFilterBar>
            <ChartSelect
              label="区间"
              value={range}
              onChange={setRange}
              options={[
                { value: '7', label: '近7天' },
                { value: '14', label: '近14天' },
                { value: '30', label: '近30天' },
                { value: '90', label: '近90天' },
              ]}
            />
          </ChartFilterBar>
          {warn && (
            <span className="rounded-full bg-[#FFF1F0] px-2 py-0.5 text-[11px] font-medium text-[#F53F3F]">
              健康度预警
            </span>
          )}
          {!warn && score < 80 && (
            <span className="rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[11px] font-medium text-[#FF7D29]">
              关注区间
            </span>
          )}
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#667085' }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#667085' }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }}
              formatter={(v) => [`${v ?? '-'} 分`, '健康度']}
            />
            <ReferenceLine
              y={80}
              stroke="#00B42A"
              strokeDasharray="4 4"
              label={{ value: '优秀', fill: '#00B42A', fontSize: 10 }}
            />
            <ReferenceLine
              y={60}
              stroke="#F53F3F"
              strokeDasharray="4 4"
              label={{ value: '及格', fill: '#F53F3F', fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#1677FF"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
