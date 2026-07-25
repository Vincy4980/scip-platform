import { useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { cashSankey, goodsSankey } from '../../mock/flowCharts';
import ChartFilterBar, { ChartSelect } from './ChartFilterBar';

export default function FlowSankey() {
  const [mode, setMode] = useState<'goods' | 'cash'>('goods');
  const data = mode === 'goods' ? goodsSankey : cashSankey;

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">桑基图 · 供应链流量</h3>
          <p className="text-xs text-[#667085]">
            {mode === 'goods' ? '货物流（吨）' : '资金流（万元）'}端到端分流
          </p>
        </div>
        <ChartFilterBar>
          <ChartSelect
            label="流向"
            value={mode}
            onChange={(v) => setMode(v as 'goods' | 'cash')}
            options={[
              { value: 'goods', label: '货物流' },
              { value: 'cash', label: '资金流' },
            ]}
          />
        </ChartFilterBar>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            nodePadding={28}
            nodeWidth={12}
            linkCurvature={0.5}
            margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
          >
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              formatter={(v) => [
                `${v ?? '-'} ${mode === 'goods' ? '吨' : '万元'}`,
                '流量',
              ]}
            />
          </Sankey>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
