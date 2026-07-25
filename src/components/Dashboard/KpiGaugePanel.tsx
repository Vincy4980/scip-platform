import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';
import { realtimeGauges } from '../../mock/flowCharts';

export default function KpiGaugePanel() {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="font-medium text-[#1D2939]">仪表盘 · 实时 KPI</h3>
        <p className="text-xs text-[#667085]">运营健康度一览（满分 100）</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {realtimeGauges.map((g) => (
          <div key={g.name} className="relative text-center">
            <div className="mx-auto h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="55%"
                  innerRadius="58%"
                  outerRadius="100%"
                  barSize={10}
                  data={[{ ...g, full: 100 }]}
                  startAngle={210}
                  endAngle={-30}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    background={{ fill: '#F2F4F7' }}
                    dataKey="value"
                    cornerRadius={6}
                    fill={g.fill}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-8 text-xl font-semibold text-[#1D2939]">
              {g.value}
              <span className="text-xs font-normal text-[#667085]">%</span>
            </div>
            <div className="mt-1 text-[11px] text-[#667085]">{g.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
