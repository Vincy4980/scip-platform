import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import ChartFilterBar, { ChartSelect } from './ChartFilterBar';

export default function QualityAnalysis() {
  const bars = useDashboardStore((s) => s.data.qualityBars);
  const issues = useDashboardStore((s) => s.data.qualityIssues);
  const qualityTrend = useDashboardStore((s) => s.data.qualityTrend);

  const [stage, setStage] = useState('all');
  const [topN, setTopN] = useState('5');
  const [period, setPeriod] = useState('3');

  const filteredBars = useMemo(() => {
    if (stage === 'all') return bars;
    return bars.filter((b) => b.name.includes(stage));
  }, [bars, stage]);

  const issueTop = useMemo(() => {
    const n = Number(topN);
    return [...issues].sort((a, b) => b.count - a.count).slice(0, n);
  }, [issues, topN]);

  const trend = useMemo(
    () => qualityTrend.slice(-Number(period)),
    [qualityTrend, period],
  );

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">质量表现分析</h3>
          <p className="text-xs text-[#667085]">各环节合格率 · 问题 TOP · 合格率趋势</p>
        </div>
        <ChartFilterBar>
          <ChartSelect
            label="环节"
            value={stage}
            onChange={setStage}
            options={[
              { value: 'all', label: '全部环节' },
              { value: '来料', label: '来料' },
              { value: '仓储', label: '仓储' },
              { value: '运输', label: '运输' },
              { value: '交付', label: '交付' },
            ]}
          />
          <ChartSelect
            label="TOP"
            value={topN}
            onChange={setTopN}
            options={[
              { value: '3', label: 'TOP3' },
              { value: '5', label: 'TOP5' },
            ]}
          />
          <ChartSelect
            label="趋势"
            value={period}
            onChange={setPeriod}
            options={[
              { value: '3', label: '近3月' },
              { value: '6', label: '近6月' },
            ]}
          />
        </ChartFilterBar>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-medium text-[#667085]">环节质量</div>
          <div className="space-y-2">
            {filteredBars.map((b) => (
              <div key={b.name}>
                <div className="mb-0.5 flex justify-between text-xs">
                  <span className="text-[#1D2939]">{b.name}</span>
                  <span className="text-[#667085]">
                    {b.rate}%{' '}
                    <span className={b.yoy >= 0 ? 'text-[#00B42A]' : 'text-[#F53F3F]'}>
                      {b.yoy >= 0 ? '↑' : '↓'}
                      {Math.abs(b.yoy)}%
                    </span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F2F4F7]">
                  <div
                    className="h-full rounded-full bg-[#1677FF]"
                    style={{ width: `${b.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-28">
            <div className="mb-1 text-xs font-medium text-[#667085]">合格率趋势</div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={trend}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#667085' }} />
                <YAxis domain={[90, 100]} hide />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="合格率"
                  stroke="#00B42A"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-56">
          <div className="mb-1 text-xs font-medium text-[#667085]">问题分类 TOP{topN}</div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              layout="vertical"
              data={issueTop}
              margin={{ top: 0, right: 12, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#667085' }} />
              <YAxis
                type="category"
                dataKey="reason"
                width={72}
                tick={{ fontSize: 11, fill: '#667085' }}
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" name="次数" fill="#FF7D29" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
