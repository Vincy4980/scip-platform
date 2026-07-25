import { useDashboardStore } from '../../store/useDashboardStore';
import type {
  CompareType,
  TimeDimension,
  TimeGranularity,
} from '../../mock/dashboardTypes';

const TIME_OPTS: { value: TimeDimension; label: string }[] = [
  { value: 'today', label: '今天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '本年' },
  { value: 'custom', label: '自定义' },
];

const GRAN_OPTS: { value: TimeGranularity; label: string }[] = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'quarter', label: '季度' },
];

const COMPARE_OPTS: { value: CompareType; label: string }[] = [
  { value: 'mom', label: '环比' },
  { value: 'yoy', label: '同比' },
  { value: 'none', label: '无对比' },
];

export default function DashboardFilters() {
  const filters = useDashboardStore((s) => s.filters);
  const summary = useDashboardStore((s) => s.summary);
  const setFilters = useDashboardStore((s) => s.setFilters);
  const resetFilters = useDashboardStore((s) => s.resetFilters);
  const refresh = useDashboardStore((s) => s.refresh);
  const updatedAt = useDashboardStore((s) => s.data.updatedAt);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#1D2939]">Master Filter · 全局筛选</h3>
          <p className="text-xs text-[#667085]">
            当前：{summary} · 下方各图表另有局部筛选
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>更新于 {updatedAt}</span>
          <button
            type="button"
            onClick={refresh}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-slate-600 hover:bg-slate-50"
          >
            刷新
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg px-2.5 py-1 text-slate-500 hover:bg-slate-50"
          >
            重置
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Select
          label="时间维度"
          value={filters.timeDimension}
          options={TIME_OPTS}
          onChange={(v) => setFilters({ timeDimension: v as TimeDimension })}
        />
        <Select
          label="时间粒度"
          value={filters.timeGranularity}
          options={GRAN_OPTS}
          onChange={(v) => setFilters({ timeGranularity: v as TimeGranularity })}
        />
        <Select
          label="区域维度"
          value={filters.region}
          options={strOpts(['全部', '湛江', '上海', '宁波', '天津', '海外'])}
          onChange={(v) => setFilters({ region: v })}
        />
        <Select
          label="产品品类"
          value={filters.category}
          options={strOpts([
            '全部',
            '基础化学品',
            '精细化学品',
            '聚合物',
            '溶剂',
            '催化剂',
            '包装材料',
          ])}
          onChange={(v) => setFilters({ category: v })}
        />
        <Select
          label="供应商区域"
          value={filters.supplierRegion}
          options={strOpts(['全部', '国内', '欧洲', '北美', '东南亚', '中东'])}
          onChange={(v) => setFilters({ supplierRegion: v })}
        />
        <Select
          label="仓库区域"
          value={filters.warehouseRegion}
          options={strOpts(['全部', '华南', '华东', '华北', '海外'])}
          onChange={(v) => setFilters({ warehouseRegion: v })}
        />
        <Select
          label="对比维度"
          value={filters.compareType}
          options={COMPARE_OPTS}
          onChange={(v) => setFilters({ compareType: v as CompareType })}
        />
      </div>
    </div>
  );
}

function strOpts(list: string[]) {
  return list.map((v) => ({ value: v, label: v }));
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-[11px] text-slate-400">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[#E4E7EC] bg-[#F2F4F7] px-2 py-1.5 text-sm text-[#1D2939] outline-none focus:border-[#1677FF]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
