import { useMemo, useState } from 'react';
import { GANT_DAYS, procurementGantt } from '../../mock/flowCharts';
import ChartFilterBar, { ChartSelect } from './ChartFilterBar';

const STATUS_COLOR: Record<string, string> = {
  已入库: '#00B42A',
  已到货: '#1677FF',
  已发货: '#3B8CFF',
  已下单: '#845EC2',
  待审批: '#FF7D29',
  草稿: '#98A2B3',
};

export default function DeliveryGantt() {
  const [status, setStatus] = useState('全部');

  const rows = useMemo(() => {
    if (status === '全部') return procurementGantt;
    return procurementGantt.filter((r) => r.status === status);
  }, [status]);

  const maxDay = 24;

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-[#1D2939]">甘特图 · 采购交付期</h3>
          <p className="text-xs text-[#667085]">订单计划窗口与完成进度</p>
        </div>
        <ChartFilterBar>
          <ChartSelect
            label="状态"
            value={status}
            onChange={setStatus}
            options={[
              { value: '全部', label: '全部' },
              ...Object.keys(STATUS_COLOR).map((s) => ({ value: s, label: s })),
            ]}
          />
        </ChartFilterBar>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div
            className="mb-1 grid gap-1 text-[10px] text-[#667085]"
            style={{ gridTemplateColumns: '160px 1fr' }}
          >
            <div />
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${GANT_DAYS.length}, 1fr)` }}
            >
              {GANT_DAYS.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid items-center gap-1"
                style={{ gridTemplateColumns: '160px 1fr' }}
              >
                <div className="truncate text-xs text-[#1D2939]">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-[10px] text-[#667085]">{row.supplier}</div>
                </div>
                <div className="relative h-8 rounded-lg bg-[#F2F4F7]">
                  <div
                    className="absolute top-1 bottom-1 rounded-md"
                    style={{
                      left: `${(row.start / maxDay) * 100}%`,
                      width: `${(row.duration / maxDay) * 100}%`,
                      background: `${STATUS_COLOR[row.status]}33`,
                      border: `1px solid ${STATUS_COLOR[row.status]}`,
                    }}
                    title={`${row.status} · 进度 ${Math.round(row.progress * 100)}%`}
                  >
                    <div
                      className="h-full rounded-md"
                      style={{
                        width: `${row.progress * 100}%`,
                        background: STATUS_COLOR[row.status],
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
