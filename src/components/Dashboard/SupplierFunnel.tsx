import {
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { supplierFunnel } from '../../mock/flowCharts';

export default function SupplierFunnel() {
  const conversion =
    supplierFunnel[0] && supplierFunnel[supplierFunnel.length - 1]
      ? Math.round(
          (supplierFunnel[supplierFunnel.length - 1]!.value /
            supplierFunnel[0]!.value) *
            1000,
        ) / 10
      : 0;

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h3 className="font-medium text-[#1D2939]">漏斗图 · 供应商筛选转化</h3>
          <p className="text-xs text-[#667085]">寻源长名单 → 准入签约</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-[#667085]">整体转化率</div>
          <div className="text-lg font-semibold text-[#1677FF]">{conversion}%</div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Funnel dataKey="value" data={supplierFunnel} isAnimationActive>
              <LabelList
                position="right"
                fill="#1D2939"
                stroke="none"
                dataKey="name"
                fontSize={11}
              />
              {supplierFunnel.map((e, i) => (
                <Cell key={i} fill={e.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
