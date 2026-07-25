import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../../store/useDashboardStore';
import ChartFilterBar, { ChartSelect } from './ChartFilterBar';

const TREND: Record<'up' | 'down' | 'flat', { label: string; className: string }> = {
  up: { label: '↑ 上升', className: 'text-[#F53F3F]' },
  down: { label: '↓ 下降', className: 'text-[#00B42A]' },
  flat: { label: '→ 平稳', className: 'text-[#667085]' },
};

const SEV: Record<string, string> = {
  高: 'bg-[#FFF1F0] text-[#F53F3F]',
  中: 'bg-[#FFF1E6] text-[#FF7D29]',
  低: 'bg-[#E8F3FF] text-[#1677FF]',
};

export default function TopExceptions() {
  const rows = useDashboardStore((s) => s.data.exceptions);
  const [severity, setSeverity] = useState('全部');
  const [stage, setStage] = useState('全部');
  const [trend, setTrend] = useState('全部');

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (severity !== '全部' && r.severity !== severity) return false;
      if (stage !== '全部' && r.stage !== stage) return false;
      if (trend !== '全部' && r.trend !== trend) return false;
      return true;
    });
  }, [rows, severity, stage, trend]);

  const top = filtered.slice().sort((a, b) => b.count - a.count).slice(0, 5);
  const stages = ['全部', ...Array.from(new Set(rows.map((r) => r.stage)))];

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">异常环节 TOP5</h3>
          <p className="text-xs text-[#667085]">按异常次数排序 · 支持钻取到业务模块</p>
        </div>
        <ChartFilterBar>
          <ChartSelect
            label="严重程度"
            value={severity}
            onChange={setSeverity}
            options={['全部', '高', '中', '低'].map((s) => ({ value: s, label: s }))}
          />
          <ChartSelect
            label="环节"
            value={stage}
            onChange={setStage}
            options={stages.map((s) => ({ value: s, label: s }))}
          />
          <ChartSelect
            label="趋势"
            value={trend}
            onChange={setTrend}
            options={[
              { value: '全部', label: '全部' },
              { value: 'up', label: '上升' },
              { value: 'down', label: '下降' },
              { value: 'flat', label: '平稳' },
            ]}
          />
        </ChartFilterBar>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs text-[#667085]">
            <tr>
              <th className="pb-2 font-medium">环节</th>
              <th className="pb-2 font-medium">异常类型</th>
              <th className="pb-2 font-medium">次数</th>
              <th className="pb-2 font-medium">趋势</th>
              <th className="pb-2 font-medium">严重程度</th>
              <th className="pb-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {top.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-[#667085]">
                  当前筛选条件下暂无异常
                </td>
              </tr>
            ) : (
              top.map((r) => (
                <tr key={r.id} className="border-t border-[#F2F4F7]">
                  <td className="py-2.5 font-medium text-[#1D2939]">{r.stage}</td>
                  <td className="py-2.5 text-[#667085]">{r.type}</td>
                  <td className="py-2.5 font-semibold text-[#1D2939]">{r.count}</td>
                  <td className={`py-2.5 text-xs ${TREND[r.trend].className}`}>
                    {TREND[r.trend].label}
                  </td>
                  <td className="py-2.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] ${SEV[r.severity]}`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <Link
                      to={r.link}
                      className="rounded-lg border border-[#D0E4FF] px-2 py-1 text-xs text-[#1677FF] hover:bg-[#E8F3FF]"
                    >
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
