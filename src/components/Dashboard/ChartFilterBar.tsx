import type { ReactNode } from 'react';

export type ChartFilterOption = { value: string; label: string };

/** 图表局部筛选条：挂在 Master Filter 之下、各看板标题旁 */
export default function ChartFilterBar({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {hint && <span className="text-[10px] text-[#98A2B3]">{hint}</span>}
    </div>
  );
}

export function ChartSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ChartFilterOption[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1 text-[11px] text-[#667085]">
      <span className="whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[#D0E4FF] bg-[#F7FBFF] px-2 py-1 text-[11px] font-medium text-[#1D2939] outline-none focus:border-[#1677FF]"
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

export function ChartDateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1 text-[11px] text-[#667085]">
      <span className="whitespace-nowrap">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[#D0E4FF] bg-[#F7FBFF] px-2 py-1 text-[11px] font-medium text-[#1D2939] outline-none focus:border-[#1677FF]"
      />
    </label>
  );
}
