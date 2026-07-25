import { useMemo, useState } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import ChartFilterBar, { ChartSelect } from './ChartFilterBar';

export default function HealthRadar() {
  const full = useDashboardStore((s) => s.data.healthRadar);
  const [focus, setFocus] = useState('all');
  const [showTarget, setShowTarget] = useState('1');

  const data = useMemo(() => {
    if (focus === 'all') return full;
    return full.filter((d) => d.dim === focus);
  }, [full, focus]);

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">各环节健康度对比</h3>
          <p className="text-xs text-[#667085]">
            采购 / 仓储 / 物流 / 交付 / 供应商 · 当前 vs 目标
          </p>
        </div>
        <ChartFilterBar>
          <ChartSelect
            label="环节"
            value={focus}
            onChange={setFocus}
            options={[
              { value: 'all', label: '全部环节' },
              ...full.map((d) => ({ value: d.dim, label: d.dim })),
            ]}
          />
          <ChartSelect
            label="目标线"
            value={showTarget}
            onChange={setShowTarget}
            options={[
              { value: '1', label: '显示' },
              { value: '0', label: '隐藏' },
            ]}
          />
        </ChartFilterBar>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#E4E7EC" />
            <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12, fill: '#667085' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Radar
              name="当前"
              dataKey="score"
              stroke="#1677FF"
              fill="#1677FF"
              fillOpacity={0.35}
            />
            {showTarget === '1' && (
              <Radar
                name="目标"
                dataKey="target"
                stroke="#667085"
                fill="#667085"
                fillOpacity={0.1}
                strokeDasharray="4 4"
              />
            )}
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
