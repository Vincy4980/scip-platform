import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

const icon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

export default function MarketplaceTracking() {
  const { orderId } = useParams();
  const logistics = useMarketplaceStore((s) =>
    orderId ? s.logistics[orderId] : undefined,
  );
  const order = useMarketplaceStore((s) =>
    s.orders.find((o) => o.orderId === orderId),
  );

  useEffect(() => {
    // ensure leaflet default icon path not required
  }, []);

  const center = useMemo(() => {
    if (!logistics) return [22.3, 113] as [number, number];
    return [logistics.current.lat, logistics.current.lng] as [number, number];
  }, [logistics]);

  if (!logistics) {
    return (
      <div className="mp-card p-8 text-center text-[var(--mp-muted)]">
        暂无该订单的物流轨迹
        {orderId && (
          <div className="mt-2">
            <Link to={`/marketplace/orders/${orderId}`} className="text-[var(--mp-orange)]">
              返回订单
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">物流追踪</h1>
          <p className="mt-1 text-sm text-[var(--mp-muted)]">
            {logistics.orderId}
            {order ? ` · ${order.status}` : ''} · 数据来自 SCIP 物流模块
          </p>
        </div>
        <Link to={`/marketplace/orders/${logistics.orderId}`} className="mp-btn-ghost !text-xs">
          返回订单
        </Link>
      </div>

      <div className="mp-card overflow-hidden" style={{ height: 360 }}>
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[logistics.from.lat, logistics.from.lng]}
            icon={icon('#1677FF')}
          >
            <Popup>起点 · {logistics.from.name}</Popup>
          </Marker>
          <Marker
            position={[logistics.to.lat, logistics.to.lng]}
            icon={icon('#00B42A')}
          >
            <Popup>终点 · {logistics.to.name}</Popup>
          </Marker>
          <Marker
            position={[logistics.current.lat, logistics.current.lng]}
            icon={icon('#FF7D29')}
          >
            <Popup>当前位置 · {logistics.vehicleNo}</Popup>
          </Marker>
          <Polyline
            positions={logistics.path.map(([lat, lng]) => [lat, lng] as [number, number])}
            pathOptions={{ color: '#FF7D29', weight: 3, opacity: 0.85 }}
          />
        </MapContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="mp-card space-y-2 p-4 text-sm">
          <h2 className="font-semibold">物流信息</h2>
          <p>承运商：{logistics.carrier}</p>
          <p>车牌号：{logistics.vehicleNo}</p>
          <p>
            司机：{logistics.driverName} · {logistics.driverPhone}
          </p>
          <p>预计到达：{logistics.eta}</p>
          <p className="text-xs text-[var(--mp-muted)]">
            {logistics.from.name} → {logistics.to.name}
          </p>
        </section>

        {logistics.anomaly ? (
          <section className="mp-card border-[#FFD0D0] bg-[#FFF1F0] p-4 text-sm">
            <h2 className="font-semibold text-[#F53F3F]">异常通知</h2>
            <p className="mt-2 text-[#667085]">{logistics.anomaly}</p>
          </section>
        ) : (
          <section className="mp-card bg-[#E8FFEA] p-4 text-sm">
            <h2 className="font-semibold text-[#00B42A]">运行正常</h2>
            <p className="mt-2 text-[var(--mp-muted)]">当前无运输异常。</p>
          </section>
        )}
      </div>

      <section className="mp-card p-4">
        <h2 className="text-sm font-semibold">事件时间线</h2>
        <ol className="relative mt-4 space-y-4 border-l-2 border-[#FFE4CC] pl-4">
          {logistics.trackingEvents.map((ev) => (
            <li key={`${ev.time}-${ev.status}`} className="relative text-sm">
              <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-[var(--mp-orange)]" />
              <div className="font-medium">{ev.status}</div>
              <div className="text-xs text-[var(--mp-muted)]">
                {ev.time} · {ev.location}
              </div>
              <div className="text-xs text-[var(--mp-muted)]">{ev.detail}</div>
            </li>
          ))}
          <li className="relative text-sm text-[var(--mp-muted)]">
            <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-[#E4E7EC]" />
            待更新：已签收
          </li>
        </ol>
      </section>
    </div>
  );
}
