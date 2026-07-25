import { useMemo, useState } from 'react';
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import ChartFilterBar, { ChartDateInput, ChartSelect } from './ChartFilterBar';

const COLORS = ['#1677FF', '#845EC2', '#FF7D29', '#667085'];

export default function CostAnalysis() {
  const slices = useDashboardStore((s) => s.data.costSlices);
  const trendFull = useDashboardStore((s) => s.data.unitCostTrend);
  const saving = useDashboardStore((s) => s.data.costSavingPct);

  const [range, setRange] = useState('6');
  const [costType, setCostType] = useState('all');
  const [from, setFrom] = useState('2026-02-01');
  const [to, setTo] = useState('2026-07-31');

  const pieData = useMemo(() => {
    if (costType === 'all') return slices;
    return slices.filter((s) => s.name.startsWith(costType));
  }, [slices, costType]);

  const trend = useMemo(() => {
    if (range === 'custom') {
      const fromYm = from.slice(0, 7);
      const toYm = to.slice(0, 7);
      return trendFull.filter((p) => p.ym >= fromYm && p.ym <= toYm);
    }
    const n = Number(range);
    return trendFull.slice(-n);
  }, [trendFull, range, from, to]);

  const rangeLabel =
    range === 'custom'
      ? `${from.slice(0, 7)} ~ ${to.slice(0, 7)}`
      : `近${range}月`;

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">成本构成与趋势</h3>
          <p className="text-xs text-[#667085]">
            运营成本占比 · {rangeLabel}单位成本（万元/吨）
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ChartFilterBar hint="从属于顶部 Master Filter">
            <ChartSelect
              label="成本项"
              value={costType}
              onChange={setCostType}
              options={[
                { value: 'all', label: '全部构成' },
                { value: '采购', label: '采购成本' },
                { value: '物流', label: '物流成本' },
                { value: '仓储', label: '仓储成本' },
                { value: '管理', label: '管理成本' },
              ]}
            />
            <ChartSelect
              label="区间"
              value={range}
              onChange={setRange}
              options={[
                { value: '3', label: '近3月' },
                { value: '6', label: '近6月' },
                { value: '12', label: '近12月' },
                { value: 'custom', label: '自定义' },
              ]}
            />
          </ChartFilterBar>
          {range === 'custom' && (
            <ChartFilterBar>
              <ChartDateInput label="起" value={from} onChange={setFrom} />
              <ChartDateInput label="止" value={to} onChange={setTo} />
            </ChartFilterBar>
          )}
          <div className="text-right">
            <div className="text-[11px] text-[#667085]">成本节省目标完成度</div>
            <div className="text-lg font-semibold text-[#1677FF]">{saving}%</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(v, name) => [`${v ?? '-'} 万元`, String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2">
            {pieData.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1 text-[11px] text-[#667085]">
                <i
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                {s.name} {s.pct}%
              </span>
            ))}
          </div>
        </div>

        <div className="h-52">
          {trend.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-[#667085]">
              所选日期范围内无数据
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#667085' }} />
                <YAxis tick={{ fontSize: 11, fill: '#667085' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line
                  type="monotone"
                  dataKey="unitCost"
                  name="单位成本"
                  stroke="#1677FF"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
