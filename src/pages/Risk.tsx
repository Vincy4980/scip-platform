import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet';
import {
  altSupplies,
  disasterZones,
  geoRisks,
  riskOverview,
  riskSuppliers,
} from '../mock/global';

const levelStyle = {
  高: 'bg-red-100 text-red-700',
  中: 'bg-amber-100 text-amber-800',
  低: 'bg-slate-100 text-slate-600',
};

export default function Risk() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">供应链风险预警</h2>
        <p className="mt-1 text-sm text-slate-500">
          断供与地缘风险 · 灾害影响 · 替代供应方案
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="高风险供应商" value={riskOverview.highRiskSuppliers} />
        <Card label="断供风险物料" value={riskOverview.shortageSkus} />
        <Card label="地缘风险区域" value={riskOverview.geoRiskRegions} />
        <Card label="灾害影响订单" value={riskOverview.disasterOrders} />
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-3">
          <h3 className="mb-3 font-medium text-slate-800">
            供应商破产 / 停工风险
          </h3>
          <ul className="space-y-2">
            {riskSuppliers.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {s.name}
                  </span>
                  <span className="text-xs text-slate-400">{s.country}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${levelStyle[s.level]}`}
                  >
                    {s.level}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  风险因子：{s.factors.join('、')}
                </div>
                <div className="mt-1 text-xs text-teal-700">建议：{s.action}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="font-medium text-slate-800">自然灾害影响地图</h3>
          </div>
          <div className="h-[320px] p-2">
            <MapContainer
              center={[30, 80]}
              zoom={2}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution="&copy; OSM"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {disasterZones.map((z) => (
                <CircleMarker
                  key={z.id}
                  center={[z.lat, z.lng]}
                  radius={10}
                  pathOptions={{
                    color: '#991b1b',
                    fillColor: '#ef4444',
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    {z.name}（{z.type}）
                    <br />
                    受影响订单 {z.affectedOrders}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">地缘政治风险预警</h3>
          <ul className="space-y-2">
            {geoRisks.map((g) => (
              <li
                key={g.id}
                className="rounded-lg border border-amber-100 bg-amber-50/60 p-3"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-white px-1.5 py-0.5 font-medium text-amber-800 ring-1 ring-amber-200">
                    {g.region}
                  </span>
                  <span className="text-slate-400">{g.time}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800">
                  {g.title}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{g.impact}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">替代供应方案推荐</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="py-1">物料</th>
                  <th className="py-1">主供</th>
                  <th className="py-1">备选</th>
                  <th className="py-1">切换(天)</th>
                  <th className="py-1">成本差</th>
                </tr>
              </thead>
              <tbody>
                {altSupplies.map((a) => (
                  <tr key={a.material} className="border-t border-slate-100">
                    <td className="py-2 font-medium">{a.material}</td>
                    <td className="py-2 text-xs">{a.primary}</td>
                    <td className="py-2 text-xs text-teal-700">{a.alt}</td>
                    <td className="py-2">{a.switchDays}</td>
                    <td
                      className={`py-2 ${
                        a.costDeltaPct > 0 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {a.costDeltaPct > 0 ? '+' : ''}
                      {a.costDeltaPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-800">{value}</div>
    </div>
  );
}
