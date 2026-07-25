import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { MarketplaceOrder, MarketplaceOrderStatus } from '../../mock/scipData';
import { SyncBadge, formatMoney } from '../components/ProductCard';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

const ORDER_TAG: Record<MarketplaceOrderStatus, string> = {
  待确认: 'bg-[#FFF7E6] text-[#D48806]',
  已确认: 'bg-[#E8F3FF] text-[#1677FF]',
  待发货: 'bg-[#F3E8FF] text-[#845EC2]',
  运输中: 'bg-[#E8F3FF] text-[#1677FF]',
  待收货: 'bg-[#FFF1E6] text-[#FF7D29]',
  已完成: 'bg-[#E8FFEA] text-[#00B42A]',
  已取消: 'bg-[#F2F4F7] text-[#667085]',
};

const FLOW: MarketplaceOrderStatus[] = [
  '待确认',
  '已确认',
  '待发货',
  '运输中',
  '待收货',
  '已完成',
];

const QUICK: Array<{
  id: '全部' | '待处理' | '在途' | '已完成' | MarketplaceOrderStatus;
  label: string;
}> = [
  { id: '全部', label: '全部' },
  { id: '待处理', label: '待处理' },
  { id: '在途', label: '在途 / 待收' },
  { id: '已完成', label: '已完成' },
  { id: '已取消', label: '已取消' },
];

function matchFilter(
  o: MarketplaceOrder,
  filter: (typeof QUICK)[number]['id'],
) {
  if (filter === '全部') return true;
  if (filter === '待处理') return o.status === '待确认' || o.status === '已确认' || o.status === '待发货';
  if (filter === '在途') return o.status === '运输中' || o.status === '待收货';
  return o.status === filter;
}

function nextAction(o: MarketplaceOrder) {
  if (o.status === '待确认') return { label: '等待卖家确认', primary: false };
  if (o.status === '运输中' || o.status === '待收货')
    return { label: '确认收货', primary: true, track: true };
  if (o.status === '已完成') return { label: '再次采购', primary: false, again: true };
  if (o.status === '已取消') return { label: '重新下单', primary: false, again: true };
  return { label: '查看进度', primary: false };
}

function OrderStepper({ status }: { status: MarketplaceOrderStatus }) {
  if (status === '已取消') {
    return (
      <div className="rounded-lg bg-[#F2F4F7] px-3 py-2 text-xs text-[var(--mp-muted)]">
        订单已取消
      </div>
    );
  }
  const idx = FLOW.indexOf(status);
  return (
    <ol className="flex flex-wrap gap-1.5">
      {FLOW.map((s, i) => {
        const done = i <= idx;
        const current = i === idx;
        return (
          <li
            key={s}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              current
                ? 'bg-[var(--mp-orange)] text-white'
                : done
                  ? 'bg-[var(--mp-orange-soft)] text-[var(--mp-orange-deep)]'
                  : 'bg-[#F2F4F7] text-[#98A2B3]'
            }`}
          >
            {s}
          </li>
        );
      })}
    </ol>
  );
}

export default function MarketplaceOrders() {
  const orders = useMarketplaceStore((s) => s.orders);
  const confirmReceipt = useMarketplaceStore((s) => s.confirmReceipt);
  const [filter, setFilter] = useState<(typeof QUICK)[number]['id']>('全部');
  const [q, setQ] = useState('');

  const stats = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => matchFilter(o, '待处理')).length,
      transit: orders.filter((o) => matchFilter(o, '在途')).length,
      done: orders.filter((o) => o.status === '已完成').length,
    }),
    [orders],
  );

  const filtered = orders.filter((o) => {
    if (!matchFilter(o, filter)) return false;
    if (!q.trim()) return true;
    const key = q.trim().toLowerCase();
    return (
      o.orderId.toLowerCase().includes(key) ||
      (o.scipOrderRef?.toLowerCase().includes(key) ?? false) ||
      o.lines.some((l) => l.productName.toLowerCase().includes(key))
    );
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">我的订单</h1>
        <p className="mt-1 text-sm text-[var(--mp-muted)]">
          跟踪履约进度 · 与 SCIP 单号双向同步
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '全部', value: stats.all, id: '全部' as const },
          { label: '待处理', value: stats.pending, id: '待处理' as const },
          { label: '在途 / 待收', value: stats.transit, id: '在途' as const },
          { label: '已完成', value: stats.done, id: '已完成' as const },
        ].map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`mp-card p-3 text-left transition ${
              filter === c.id ? 'border-[#FFC9A0] ring-1 ring-[#FFC9A0]' : ''
            }`}
          >
            <div className="text-xs text-[var(--mp-muted)]">{c.label}</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--mp-ink)]">{c.value}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {QUICK.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`mp-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜订单号 / 产品 / SCIP 单号"
          className="mp-input ml-auto max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mp-card px-4 py-12 text-center">
          <p className="text-sm text-[var(--mp-muted)]">没有符合条件的订单</p>
          <Link to="/marketplace/products" className="mp-btn-primary mt-4 inline-flex !text-xs">
            去选品询价
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const action = nextAction(o);
            const title =
              o.lines.length === 1
                ? o.lines[0].productName
                : `${o.lines[0].productName} 等 ${o.lines.length} 项`;
            return (
              <article key={o.orderId} className="mp-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/marketplace/orders/${o.orderId}`}
                        className="font-semibold text-[var(--mp-orange-deep)] hover:underline"
                      >
                        {o.orderId}
                      </Link>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${ORDER_TAG[o.status]}`}
                      >
                        {o.status}
                      </span>
                      <SyncBadge synced={o.syncedToScip} />
                    </div>
                    <p className="mt-1 text-sm font-medium text-[var(--mp-ink)]">{title}</p>
                    <p className="mt-0.5 text-xs text-[var(--mp-muted)]">
                      下单 {o.placedAt}
                      {o.scipOrderRef ? ` · SCIP ${o.scipOrderRef}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold">{formatMoney(o.totalAmount)}</div>
                    {o.paymentTerms && (
                      <div className="text-[11px] text-[var(--mp-muted)]">{o.paymentTerms}</div>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <OrderStepper status={o.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--mp-border)] pt-3">
                  <Link
                    to={`/marketplace/orders/${o.orderId}`}
                    className="mp-btn-ghost !py-1.5 !text-xs"
                  >
                    订单详情
                  </Link>
                  {(o.status === '运输中' || o.status === '待收货') && (
                    <Link
                      to={`/marketplace/tracking/${o.orderId}`}
                      className="mp-btn-ghost !py-1.5 !text-xs"
                    >
                      物流追踪
                    </Link>
                  )}
                  {action.primary && (
                    <button
                      type="button"
                      className="mp-btn-primary !py-1.5 !text-xs"
                      onClick={() => confirmReceipt(o.orderId)}
                    >
                      确认收货
                    </button>
                  )}
                  {action.again && (
                    <Link
                      to="/marketplace/products"
                      className="mp-btn-primary !py-1.5 !text-xs"
                    >
                      {action.label}
                    </Link>
                  )}
                  <span className="ml-auto text-xs text-[var(--mp-muted)]">
                    {o.addressLabel.length > 28
                      ? `${o.addressLabel.slice(0, 28)}…`
                      : o.addressLabel}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MarketplaceOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMarketplaceStore((s) =>
    s.orders.find((o) => o.orderId === orderId),
  );
  const logistics = useMarketplaceStore((s) =>
    orderId ? s.logistics[orderId] : undefined,
  );
  const confirmReceipt = useMarketplaceStore((s) => s.confirmReceipt);

  if (!order) {
    return (
      <div className="mp-card p-8 text-center text-[var(--mp-muted)]">
        订单不存在 ·{' '}
        <Link to="/marketplace/orders" className="text-[var(--mp-orange)]">
          返回列表
        </Link>
      </div>
    );
  }

  const freight = order.freightAmount ?? 0;
  const grand = order.totalAmount + freight;

  return (
    <div className="space-y-5">
      <nav className="text-xs text-[var(--mp-muted)]">
        <Link to="/marketplace/orders" className="hover:text-[var(--mp-orange)]">
          我的订单
        </Link>{' '}
        / {order.orderId}
      </nav>

      <div className="mp-card p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">{order.orderId}</h1>
            <p className="mt-1 text-sm text-[var(--mp-muted)]">
              下单于 {order.placedAt}
              {order.inquiryId ? (
                <>
                  {' '}
                  · 来自询价{' '}
                  <Link
                    to="/marketplace/inquiry"
                    className="text-[var(--mp-orange)] hover:underline"
                  >
                    {order.inquiryId}
                  </Link>
                </>
              ) : null}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_TAG[order.status]}`}
              >
                {order.status}
              </span>
              <SyncBadge synced={order.syncedToScip} />
              {order.scipOrderRef && (
                <Link
                  to="/delivery"
                  className="rounded-full bg-[#E8F3FF] px-2 py-0.5 text-xs font-medium text-[#1677FF] hover:underline"
                >
                  SCIP {order.scipOrderRef}
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(order.status === '运输中' || order.status === '待收货') && (
              <>
                <Link
                  to={`/marketplace/tracking/${order.orderId}`}
                  className="mp-btn-ghost !text-xs"
                >
                  物流追踪
                </Link>
                <button
                  type="button"
                  className="mp-btn-primary !text-xs"
                  onClick={() => {
                    confirmReceipt(order.orderId);
                    navigate('/marketplace/orders');
                  }}
                >
                  确认收货
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <OrderStepper status={order.status} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="mp-card overflow-hidden lg:col-span-2">
          <h2 className="border-b border-[var(--mp-border)] px-4 py-3 text-sm font-semibold">
            产品清单
          </h2>
          <ul className="divide-y divide-[var(--mp-border)]">
            {order.lines.map((l) => (
              <li key={l.productId} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/marketplace/products/${l.productId}`}
                    className="font-medium hover:text-[var(--mp-orange)]"
                  >
                    {l.productName}
                  </Link>
                  <div className="text-xs text-[var(--mp-muted)]">
                    {l.qty} {l.unit} · ¥{l.unitPrice}/单位
                  </div>
                </div>
                <div className="font-semibold">{formatMoney(l.amount)}</div>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-[var(--mp-border)] bg-[#FAF8F6] px-4 py-3 text-sm">
            <div className="flex justify-between text-[var(--mp-muted)]">
              <span>货款合计</span>
              <span>{formatMoney(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[var(--mp-muted)]">
              <span>运费</span>
              <span>{freight > 0 ? formatMoney(freight) : '待结算 / 含在合同'}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold">
              <span>应付合计</span>
              <span className="text-[var(--mp-orange-deep)]">{formatMoney(grand)}</span>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="mp-card space-y-2 p-4 text-sm">
            <h2 className="font-semibold">配送与联系</h2>
            <p className="text-[var(--mp-muted)]">{order.addressLabel}</p>
            {order.contactPhone && (
              <p className="text-xs text-[var(--mp-muted)]">收货电话 {order.contactPhone}</p>
            )}
            {order.remark && (
              <p className="rounded-lg bg-[#FAF8F6] px-2 py-1.5 text-xs text-[var(--mp-muted)]">
                备注：{order.remark}
              </p>
            )}
          </section>
          <section className="mp-card space-y-2 p-4 text-sm">
            <h2 className="font-semibold">结算与发票</h2>
            <p className="text-[var(--mp-muted)]">抬头：{order.invoiceTitle}</p>
            <p className="text-[var(--mp-muted)]">
              账期：{order.paymentTerms ?? '按合同约定'}
            </p>
          </section>
        </div>
      </div>

      {order.statusHistory && order.statusHistory.length > 0 && (
        <section className="mp-card p-4">
          <h2 className="text-sm font-semibold">履约时间线</h2>
          <ol className="relative mt-4 space-y-4 border-l-2 border-[#FFE4CC] pl-4">
            {[...order.statusHistory].reverse().map((ev) => (
              <li key={`${ev.status}-${ev.time}`} className="relative text-sm">
                <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-[var(--mp-orange)]" />
                <div className="font-medium">{ev.status}</div>
                <div className="text-xs text-[var(--mp-muted)]">{ev.time}</div>
                {ev.note && <div className="text-xs text-[var(--mp-muted)]">{ev.note}</div>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {logistics && (
        <section className="mp-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">物流信息</h2>
            <Link
              to={`/marketplace/tracking/${order.orderId}`}
              className="text-xs font-medium text-[var(--mp-orange)]"
            >
              打开地图追踪 →
            </Link>
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <p className="text-[var(--mp-muted)]">承运：{logistics.carrier}</p>
            <p className="text-[var(--mp-muted)]">车牌：{logistics.vehicleNo}</p>
            <p className="text-[var(--mp-muted)]">
              司机：{logistics.driverName} · {logistics.driverPhone}
            </p>
            <p className="text-[var(--mp-muted)]">预计送达：{logistics.eta}</p>
          </div>
          {logistics.anomaly && (
            <p className="mt-3 rounded-lg bg-[#FFF7E6] px-3 py-2 text-xs text-[#D48806]">
              异常提醒：{logistics.anomaly}
            </p>
          )}
          <ol className="relative mt-4 space-y-3 border-l-2 border-[#FFE4CC] pl-4">
            {logistics.trackingEvents.map((ev) => (
              <li key={ev.time} className="relative text-sm">
                <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-[var(--mp-orange)]" />
                <div className="font-medium">{ev.status}</div>
                <div className="text-xs text-[var(--mp-muted)]">
                  {ev.time} · {ev.location}
                </div>
                <div className="text-xs text-[var(--mp-muted)]">{ev.detail}</div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
