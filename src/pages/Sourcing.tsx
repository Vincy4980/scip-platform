import { useMemo, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import {
  admissionSteps,
  costCompareRows,
  globalSuppliers,
  supplierRiskRadar,
  suppliersByAdmissionStep,
} from '../mock/global';
import type { SupplierTier } from '../mock/global';

const tierStyle: Record<SupplierTier, string> = {
  战略级: 'border-amber-300 bg-amber-50 text-amber-900',
  优选级: 'border-sky-300 bg-sky-50 text-sky-900',
  合格级: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  观察级: 'border-yellow-300 bg-yellow-50 text-yellow-900',
  淘汰级: 'border-red-300 bg-red-50 text-red-900',
};

const tiers: SupplierTier[] = ['战略级', '优选级', '合格级', '观察级', '淘汰级'];

export default function Sourcing() {
  const [step, setStep] = useState<(typeof admissionSteps)[number]>('正式准入');

  const tierCounts = useMemo(() => {
    return tiers.map((t) => ({
      tier: t,
      count: globalSuppliers.filter((s) => s.tier === t).length,
    }));
  }, []);

  const byCountry = useMemo(() => {
    const map = new Map<string, { lat: number; lng: number; count: number }>();
    globalSuppliers.forEach((s) => {
      const cur = map.get(s.hqCountry);
      if (cur) cur.count += 1;
      else map.set(s.hqCountry, { lat: s.lat, lng: s.lng, count: 1 });
    });
    return [...map.entries()];
  }, []);

  const radarData = [
    { dim: '政治风险', value: supplierRiskRadar.political },
    { dim: '汇率风险', value: supplierRiskRadar.fx },
    { dim: '物流风险', value: supplierRiskRadar.logistics },
    { dim: '质量风险', value: supplierRiskRadar.quality },
    { dim: '财务风险', value: supplierRiskRadar.finance },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">全球供应商寻源</h2>
        <p className="mt-1 text-sm text-slate-500">
          全球分布 · 准入流程 · 分级管理 · 风险雷达 · 落地成本对比
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm xl:col-span-3">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="font-medium text-slate-800">世界供应商分布</h3>
            <p className="text-xs text-slate-500">静态底图标注 · 按国家聚合</p>
          </div>
          <div className="h-[360px] p-3">
            <MapContainer
              center={[25, 40]}
              zoom={2}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution="&copy; OSM"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {byCountry.map(([country, info]) => (
                <CircleMarker
                  key={country}
                  center={[info.lat, info.lng]}
                  radius={6 + info.count}
                  pathOptions={{
                    color: '#0f766e',
                    fillColor: '#14b8a6',
                    fillOpacity: 0.75,
                  }}
                >
                  <Popup>
                    {country} · {info.count} 家供应商
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-slate-800">供应商分级</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {tierCounts.map((t) => (
                <div
                  key={t.tier}
                  className={`rounded-lg border px-3 py-2 ${tierStyle[t.tier]}`}
                >
                  <div className="text-xs font-medium">{t.tier}</div>
                  <div className="text-xl font-semibold">{t.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-slate-800">风险雷达（5维）</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="风险指数"
                    dataKey="value"
                    stroke="#0d9488"
                    fill="#14b8a6"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-medium text-slate-800">供应商准入流程</h3>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {admissionSteps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  step === s
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
              {i < admissionSteps.length - 1 && (
                <span className="text-slate-300">→</span>
              )}
            </div>
          ))}
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {suppliersByAdmissionStep[step].map((name) => (
            <li
              key={name}
              className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="font-medium text-slate-800">全球采购成本对比（万元/批）</h3>
          <p className="text-xs text-slate-500">报价 + 关税 + 物流 = 落地总成本</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2">供应商</th>
                <th className="px-3 py-2">国家</th>
                <th className="px-3 py-2">物料</th>
                <th className="px-3 py-2">报价</th>
                <th className="px-3 py-2">关税</th>
                <th className="px-3 py-2">物流</th>
                <th className="px-3 py-2">总成本</th>
              </tr>
            </thead>
            <tbody>
              {[...costCompareRows]
                .sort((a, b) => a.totalCny - b.totalCny)
                .map((r) => (
                  <tr key={r.supplierId} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-800">{r.supplierName}</td>
                    <td className="px-3 py-2">{r.country}</td>
                    <td className="px-3 py-2">{r.material}</td>
                    <td className="px-3 py-2">{r.quoteCny}</td>
                    <td className="px-3 py-2">{r.dutyCny}</td>
                    <td className="px-3 py-2">{r.logisticsCny}</td>
                    <td className="px-3 py-2 font-semibold text-teal-700">{r.totalCny}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
