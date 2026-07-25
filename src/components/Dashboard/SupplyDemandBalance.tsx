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

export default function SupplyDemandBalance() {
  const full = useDashboardStore((s) => s.data.supplyDemand);
  const fulfill = useDashboardStore((s) => s.data.fulfillRate);
  const accuracy = useDashboardStore((s) => s.data.forecastAccuracy);
  const [range, setRange] = useState('6');
  const [showForecast, setShowForecast] = useState('1');

  const data = useMemo(() => full.slice(-Number(range)), [full, range]);

  const localFulfill = useMemo(() => {
    if (!data.length) return fulfill;
    const s = data.reduce((a, r) => a + r.supply, 0);
    const d = data.reduce((a, r) => a + r.demand, 0);
    return d === 0 ? fulfill : Math.round(Math.min(100, (s / d) * 100) * 10) / 10;
  }, [data, fulfill]);

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[#1D2939]">供需平衡分析</h3>
          <p className="text-xs text-[#667085]">近{range}月供应量 vs 需求量（吨）</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ChartFilterBar>
            <ChartSelect
              label="区间"
              value={range}
              onChange={setRange}
              options={[
                { value: '3', label: '近3月' },
                { value: '6', label: '近6月' },
                { value: '12', label: '近12月' },
              ]}
            />
            <ChartSelect
              label="预测"
              value={showForecast}
              onChange={setShowForecast}
              options={[
                { value: '1', label: '显示预测' },
                { value: '0', label: '隐藏预测' },
              ]}
            />
          </ChartFilterBar>
          <div className="flex gap-4 text-right">
            <div>
              <div className="text-[11px] text-[#667085]">需求满足率</div>
              <div className="text-lg font-semibold text-[#1677FF]">{localFulfill}%</div>
            </div>
            <div>
              <div className="text-[11px] text-[#667085]">预测准确度</div>
              <div className="text-lg font-semibold text-[#1D2939]">{accuracy}%</div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#667085' }} />
            <YAxis tick={{ fontSize: 11, fill: '#667085' }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="supply" name="供应量" fill="#1677FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="demand" name="需求量" fill="#FF7D29" radius={[4, 4, 0, 0]} />
            {showForecast === '1' && (
              <Bar dataKey="forecast" name="预测需求" fill="#667085" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
