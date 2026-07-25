import { useMemo, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';
import {
  alertCategoryGroups,
  alerts,
  defaultAlertRules,
  shipments,
} from '../mock/data';
import {
  crossBorderAlertTypes,
  shippingRoutes,
} from '../mock/global';
import type { AlertHandleStatus, AlertRule, NotifyChannels } from '../mock/types';
import PermissionGate from '../components/PermissionGate';
import { useAuthStore } from '../store/useAuthStore';
import { Modules } from '../types/user';
import { isReadOnly } from '../utils/permission';

const statusLabel: Record<AlertHandleStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  escalated: '已升级',
  resolved: '已关闭',
};

const statusStyle: Record<AlertHandleStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-sky-100 text-sky-700',
  escalated: 'bg-red-100 text-red-700',
  resolved: 'bg-slate-100 text-slate-500',
};

const crossBorderMock = [
  {
    id: 'XBA-01',
    type: '清关延误',
    title: '釜山→上海 ABS 批次查验超时',
    time: '2026-07-14 08:10',
    status: 'pending' as AlertHandleStatus,
  },
  {
    id: 'XBA-02',
    type: '单证不齐',
    title: '鹿特丹进口缺少原产地证',
    time: '2026-07-13 19:40',
    status: 'processing' as AlertHandleStatus,
  },
  {
    id: 'XBA-03',
    type: '贸易合规风险',
    title: 'CBAM 申报材料待补齐',
    time: '2026-07-13 11:20',
    status: 'escalated' as AlertHandleStatus,
  },
];

export default function Logistics() {
  const user = useAuthStore((s) => s.currentUser);
  const readOnly = isReadOnly(user, Modules.LOGISTICS);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rules, setRules] = useState<AlertRule[]>(defaultAlertRules);
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [mapMode, setMapMode] = useState<'domestic' | 'global'>('domestic');

  const activeAlerts = useMemo(
    () =>
      alerts
        .filter((a) => a.status !== 'resolved')
        .filter((a) =>
          categoryFilter === '全部' ? true : a.category === categoryFilter,
        ),
    [categoryFilter],
  );

  const anomalyPoints = useMemo(
    () => shipments.filter((s) => s.hasAnomaly && s.anomalyLat != null),
    [],
  );

  const updateChannel = (
    id: string,
    key: keyof NotifyChannels,
    value: boolean,
  ) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, channels: { ...r.channels, [key]: value } } : r,
      ),
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">运输在途监控</h2>
          <p className="mt-1 text-sm text-slate-500">
            国内 GPS · 全球海运航线 · 跨境告警扩展
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-sm">
            <button
              type="button"
              onClick={() => setMapMode('domestic')}
              className={`rounded-md px-3 py-1.5 ${
                mapMode === 'domestic' ? 'bg-teal-700 text-white' : 'text-slate-600'
              }`}
            >
              国内视图
            </button>
            <button
              type="button"
              onClick={() => setMapMode('global')}
              className={`rounded-md px-3 py-1.5 ${
                mapMode === 'global' ? 'bg-teal-700 text-white' : 'text-slate-600'
              }`}
            >
              全球视图
            </button>
          </div>
          <PermissionGate module={Modules.LOGISTICS} action="edit">
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              告警规则配置
            </button>
          </PermissionGate>
        </div>
      </div>

      {readOnly && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          客服视角：可查看轨迹，不可配置告警规则或操作告警。
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter('全部')}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            categoryFilter === '全部'
              ? 'bg-teal-700 text-white'
              : 'bg-white text-slate-600 ring-1 ring-slate-200'
          }`}
        >
          全部
        </button>
        {alertCategoryGroups.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setCategoryFilter(g.label)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              categoryFilter === g.label
                ? 'bg-teal-700 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {g.label}
          </button>
        ))}
        <span className="self-center text-[11px] text-slate-400">
          跨境扩展：{crossBorderAlertTypes.join(' / ')}
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm xl:col-span-3">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="font-medium text-slate-800">
              {mapMode === 'domestic' ? '国内在途 GPS' : '全球海运航线'}
            </h3>
            <p className="text-xs text-slate-500">
              {mapMode === 'domestic'
                ? '绿点车辆 · 红点异常闪烁'
                : '马士基 / MSC / 中远海运航线模拟'}
            </p>
          </div>
          <div className="h-[440px] p-3">
            {mapMode === 'domestic' ? (
              <MapContainer
                key="domestic"
                center={[31.2, 119.8]}
                zoom={7}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution="&copy; OSM"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {shipments.map((s) => (
                  <Polyline
                    key={`${s.id}-path`}
                    positions={s.path}
                    pathOptions={{
                      color: s.hasAnomaly ? '#dc2626' : '#0d9488',
                      weight: 3,
                      opacity: 0.8,
                    }}
                  />
                ))}
                {shipments.map((s) => (
                  <CircleMarker
                    key={`${s.id}-v`}
                    center={[s.lat, s.lng]}
                    radius={7}
                    pathOptions={{
                      color: '#0f766e',
                      fillColor: '#14b8a6',
                      fillOpacity: 0.95,
                    }}
                  >
                    <Popup>
                      {s.id} {s.from}→{s.to}
                    </Popup>
                  </CircleMarker>
                ))}
                {anomalyPoints.map((s) => (
                  <CircleMarker
                    key={`${s.id}-a`}
                    center={[s.anomalyLat!, s.anomalyLng!]}
                    radius={10}
                    className="anomaly-pulse"
                    pathOptions={{
                      color: '#991b1b',
                      fillColor: '#ef4444',
                      fillOpacity: 0.85,
                    }}
                  />
                ))}
              </MapContainer>
            ) : (
              <MapContainer
                key="global"
                center={[20, 60]}
                zoom={2}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution="&copy; OSM"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {shippingRoutes.map((r) => (
                  <Polyline
                    key={r.id}
                    positions={r.path}
                    pathOptions={{
                      color: r.mode === '多式联运' ? '#d97706' : '#0369a1',
                      weight: 3,
                      opacity: 0.85,
                      dashArray: r.mode === '多式联运' ? '8 6' : undefined,
                    }}
                  />
                ))}
                {shippingRoutes.map((r) => (
                  <CircleMarker
                    key={`${r.id}-end`}
                    center={r.path[r.path.length - 1]}
                    radius={6}
                    pathOptions={{
                      color: '#0f766e',
                      fillColor: '#14b8a6',
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>
                      <div className="text-xs">
                        <div className="font-semibold">{r.id}</div>
                        {r.from} → {r.to}
                        <br />
                        {r.mode} · {r.days} 天 · {r.carrier}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            )}
          </div>
          {mapMode === 'global' && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3">
              {shippingRoutes.map((r) => (
                <span
                  key={r.id}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600"
                >
                  {r.from}→{r.to} · {r.days}天 · {r.carrier}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="mb-3 font-medium text-slate-800">异常告警列表</h3>
          <ul className="max-h-[200px] space-y-2 overflow-auto pr-1">
            {activeAlerts.slice(0, 8).map((alert) => (
              <li
                key={alert.id}
                className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] ring-1 ring-slate-200">
                    {alert.type}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] ${statusStyle[alert.status]}`}
                  >
                    {statusLabel[alert.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-800">{alert.title}</p>
                <div className="mt-1 text-[11px] text-slate-400">{alert.time}</div>
              </li>
            ))}
          </ul>
          <h4 className="mb-2 mt-4 text-xs font-semibold text-slate-600">
            跨境专项告警
          </h4>
          <ul className="space-y-2">
            {crossBorderMock.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-violet-100 bg-violet-50/50 p-3"
              >
                <div className="flex gap-2">
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] text-violet-800 ring-1 ring-violet-200">
                    {a.type}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] ${statusStyle[a.status]}`}
                  >
                    {statusLabel[a.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-800">{a.title}</p>
                <div className="mt-1 text-[11px] text-slate-400">{a.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {rulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setRulesOpen(false)}
            aria-label="关闭"
          />
          <div className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex justify-between">
              <h3 className="font-semibold">告警规则配置</h3>
              <button type="button" onClick={() => setRulesOpen(false)}>
                ✕
              </button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="py-2">启用</th>
                  <th className="py-2">规则</th>
                  <th className="py-2">阈值</th>
                  <th className="py-2">弹窗</th>
                  <th className="py-2">邮件</th>
                  <th className="py-2">企微</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-t border-slate-100">
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() =>
                          setRules((prev) =>
                            prev.map((r) =>
                              r.id === rule.id
                                ? { ...r, enabled: !r.enabled }
                                : r,
                            ),
                          )
                        }
                        className="accent-teal-700"
                      />
                    </td>
                    <td className="py-2">{rule.name}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={rule.thresholdValue}
                        onChange={(e) =>
                          setRules((prev) =>
                            prev.map((r) =>
                              r.id === rule.id
                                ? {
                                    ...r,
                                    thresholdValue: Number(e.target.value) || 0,
                                  }
                                : r,
                            ),
                          )
                        }
                        className="w-16 rounded border px-1"
                      />
                    </td>
                    {(['popup', 'email', 'wecom'] as const).map((ch) => (
                      <td key={ch} className="py-2">
                        <input
                          type="checkbox"
                          checked={rule.channels[ch]}
                          onChange={(e) =>
                            updateChannel(rule.id, ch, e.target.checked)
                          }
                          className="accent-teal-700"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-slate-400">
              跨境规则建议同步启用：清关延误、单证不齐、贸易合规风险。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
