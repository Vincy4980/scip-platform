import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { InquiryStatus, MarketplaceInquiry } from '../../mock/scipData';
import { SyncBadge, formatMoney } from '../components/ProductCard';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

const STATUS_STYLE: Record<InquiryStatus, string> = {
  待回复: 'bg-[#FFF7E6] text-[#D48806]',
  已报价: 'bg-[#E8F3FF] text-[#1677FF]',
  已过期: 'bg-[#F2F4F7] text-[#667085]',
  已转化: 'bg-[#E8FFEA] text-[#00B42A]',
};

const FILTERS: Array<{ id: '全部' | InquiryStatus; label: string }> = [
  { id: '全部', label: '全部' },
  { id: '待回复', label: '待回复' },
  { id: '已报价', label: '可转单' },
  { id: '已转化', label: '已转单' },
  { id: '已过期', label: '已过期' },
];

function daysLeft(validUntil?: string) {
  if (!validUntil) return null;
  const end = new Date(`${validUntil}T23:59:59`);
  const diff = Math.ceil((end.getTime() - Date.now()) / 86400000);
  return diff;
}

function InquiryCard({
  inq,
  open,
  onToggle,
  onConvert,
}: {
  inq: MarketplaceInquiry;
  open: boolean;
  onToggle: () => void;
  onConvert: () => void;
}) {
  const left = daysLeft(inq.quote?.validUntil);
  const primaryName = inq.lines[0]?.productName ?? '—';
  const more = inq.lines.length > 1 ? ` 等 ${inq.lines.length} 项` : '';

  return (
    <article className="mp-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-[#FFFBF7]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--mp-orange-deep)]">{inq.inquiryId}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[inq.status]}`}
            >
              {inq.status}
            </span>
            <SyncBadge synced={inq.syncedToScip} />
          </div>
          <p className="mt-1 truncate text-sm text-[var(--mp-ink)]">
            {primaryName}
            {more}
          </p>
          <p className="mt-1 text-xs text-[var(--mp-muted)]">
            提交 {inq.submittedAt}
            {inq.scipInquiryRef ? ` · SCIP ${inq.scipInquiryRef}` : ''}
            {inq.status === '待回复' && inq.replySlaHours
              ? ` · 预计 ${inq.replySlaHours}h 内报价`
              : ''}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {inq.quote ? (
            <>
              <div className="text-sm font-semibold">{formatMoney(inq.quote.totalAmount)}</div>
              {inq.status === '已报价' && left !== null && (
                <div
                  className={`mt-0.5 text-[11px] ${left <= 3 ? 'text-[#F53F3F]' : 'text-[var(--mp-muted)]'}`}
                >
                  {left >= 0 ? `报价剩 ${left} 天` : '已过有效期'}
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-[var(--mp-muted)]">等待报价</div>
          )}
          <div className="mt-2 text-xs text-[var(--mp-orange)]">{open ? '收起 ▲' : '展开 ▼'}</div>
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-[var(--mp-border)] bg-[#FAF8F6] px-4 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--mp-muted)]">
              询价明细
            </div>
            <ul className="mt-2 space-y-2">
              {inq.lines.map((l) => {
                const lq = inq.quote?.lineQuotes?.find((q) => q.productId === l.productId);
                return (
                  <li
                    key={l.productId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 text-sm"
                  >
                    <div>
                      <div className="font-medium">{l.productName}</div>
                      <div className="text-xs text-[var(--mp-muted)]">
                        {l.qty} {l.unit}
                        {l.expectedDate ? ` · 期望到货 ${l.expectedDate}` : ''}
                      </div>
                    </div>
                    {lq && (
                      <div className="text-right text-xs">
                        <div>¥{lq.unitPrice}/单位</div>
                        <div className="font-semibold text-[var(--mp-ink)]">
                          {formatMoney(lq.amount)}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {inq.remark && (
            <div className="rounded-xl border border-[var(--mp-border)] bg-white px-3 py-2 text-sm">
              <span className="text-[var(--mp-muted)]">客户备注：</span>
              {inq.remark}
            </div>
          )}

          {inq.quote ? (
            <div className="rounded-xl border border-[#D0E4FF] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#1677FF]">报价详情</div>
                  <p className="mt-1 text-xs text-[var(--mp-muted)]">
                    {inq.quote.quotedAt ? `报价于 ${inq.quote.quotedAt}` : ''}
                    {inq.quote.validUntil ? ` · 有效至 ${inq.quote.validUntil}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{formatMoney(inq.quote.totalAmount)}</div>
                  {inq.quote.paymentTerms && (
                    <div className="text-xs text-[var(--mp-muted)]">{inq.quote.paymentTerms}</div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-[var(--mp-muted)]">{inq.quote.note}</p>
              {inq.quote.freightNote && (
                <p className="mt-1 text-xs text-[var(--mp-muted)]">运费：{inq.quote.freightNote}</p>
              )}
              {inq.quote.salesRep && (
                <p className="mt-2 text-xs text-[var(--mp-muted)]">
                  销售顾问 {inq.quote.salesRep}
                  {inq.quote.salesPhone ? ` · ${inq.quote.salesPhone}` : ''}
                </p>
              )}
              {inq.status === '已报价' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="mp-btn-primary !text-xs" onClick={onConvert}>
                    接受报价并转订单
                  </button>
                  <Link to="/marketplace/products" className="mp-btn-ghost !text-xs">
                    继续选品
                  </Link>
                </div>
              )}
              {inq.status === '已过期' && (
                <Link to="/marketplace/products" className="mp-btn-primary mt-3 inline-flex !text-xs">
                  重新询价拿新价
                </Link>
              )}
              {inq.status === '已转化' && inq.quote.note.includes('MO-') && (
                <Link
                  to="/marketplace/orders"
                  className="mt-3 inline-block text-xs font-medium text-[var(--mp-orange)]"
                >
                  查看对应订单 →
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#FFC9A0] bg-white px-4 py-3 text-sm text-[var(--mp-muted)]">
              已同步 SCIP 销售池，顾问正在核对库存与交期。通常 {inq.replySlaHours ?? 24}{' '}
              小时内回复；紧急需求可拨打 400-800-SCIP。
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function MarketplaceInquiry() {
  const navigate = useNavigate();
  const inquiries = useMarketplaceStore((s) => s.inquiries);
  const cart = useMarketplaceStore((s) => s.cart);
  const removeFromCart = useMarketplaceStore((s) => s.removeFromCart);
  const updateCartQty = useMarketplaceStore((s) => s.updateCartQty);
  const submitInquiry = useMarketplaceStore((s) => s.submitInquiry);
  const convertInquiryToOrder = useMarketplaceStore((s) => s.convertInquiryToOrder);
  const loggedIn = useMarketplaceStore((s) => s.loggedIn);
  const [filter, setFilter] = useState<'全部' | InquiryStatus>('全部');
  const [openId, setOpenId] = useState<string | null>(
    inquiries.find((i) => i.status === '已报价')?.inquiryId ?? inquiries[0]?.inquiryId ?? null,
  );
  const [remark, setRemark] = useState('');
  const [msg, setMsg] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { 全部: inquiries.length };
    for (const s of ['待回复', '已报价', '已转化', '已过期'] as InquiryStatus[]) {
      c[s] = inquiries.filter((i) => i.status === s).length;
    }
    return c;
  }, [inquiries]);

  const filtered = inquiries.filter((i) => (filter === '全部' ? true : i.status === filter));

  const submitCart = () => {
    if (!loggedIn) {
      navigate('/marketplace/auth');
      return;
    }
    if (!cart.length) return;
    const id = submitInquiry(cart, remark);
    setMsg(`询价单 ${id} 已提交，销售将在 24 小时内回复`);
    setRemark('');
    setOpenId(id);
    setFilter('待回复');
  };

  const convert = (inquiryId: string) => {
    const orderId = convertInquiryToOrder(inquiryId);
    if (orderId) {
      setMsg(`已转为订单 ${orderId}`);
      navigate(`/marketplace/orders/${orderId}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">询价管理</h1>
          <p className="mt-1 text-sm text-[var(--mp-muted)]">
            选品入篮 → 提交询价 → 查看报价 → 一键转单
          </p>
        </div>
        <Link to="/marketplace/products" className="mp-btn-primary">
          去产品中心选品
        </Link>
      </div>

      {msg && (
        <div className="rounded-xl bg-[var(--mp-orange-soft)] px-4 py-2.5 text-sm text-[var(--mp-orange-deep)]">
          {msg}
        </div>
      )}

      {/* 询价篮 */}
      <section className="mp-card p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">询价篮 · {cart.length} 项待提交</h2>
          {cart.length > 0 && (
            <span className="text-xs text-[var(--mp-muted)]">提交后清空，并可继续加购新品</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[var(--mp-border)] bg-[#FAF8F6] px-4 py-8 text-center">
            <p className="text-sm text-[var(--mp-muted)]">询价篮是空的</p>
            <p className="mt-1 text-xs text-[var(--mp-muted)]">
              在产品详情页点击「加入询价」即可在这里统一提交
            </p>
            <Link to="/marketplace/products" className="mp-btn-primary mt-4 inline-flex !text-xs">
              浏览产品
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-3 space-y-2">
              {cart.map((c) => (
                <li
                  key={c.productId}
                  className="flex flex-wrap items-center gap-3 rounded-xl bg-[#FAF8F6] px-3 py-2.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{c.productName}</div>
                    <div className="text-xs text-[var(--mp-muted)]">
                      {c.expectedDate ? `期望到货 ${c.expectedDate}` : '交期待确认'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="h-7 w-7 rounded-lg border border-[var(--mp-border)] bg-white text-sm"
                      onClick={() => updateCartQty(c.productId, c.qty - 1)}
                      aria-label="减少"
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center text-sm font-medium">
                      {c.qty} {c.unit}
                    </span>
                    <button
                      type="button"
                      className="h-7 w-7 rounded-lg border border-[var(--mp-border)] bg-white text-sm"
                      onClick={() => updateCartQty(c.productId, c.qty + 1)}
                      aria-label="增加"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-[var(--mp-muted)] hover:text-red-500"
                    onClick={() => removeFromCart(c.productId)}
                  >
                    移除
                  </button>
                </li>
              ))}
            </ul>
            <label className="mt-3 block text-xs text-[var(--mp-muted)]">
              备注（选填：包装、认证、交期要求）
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={2}
                placeholder="例如：需 COA；可接受分批；同批发货…"
                className="mp-input mt-1 resize-none"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={submitCart} className="mp-btn-primary">
                提交询价
              </button>
              <Link to="/marketplace/products" className="mp-btn-ghost">
                继续加购
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 状态筛选 */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`mp-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="ml-1 opacity-70">({counts[f.id] ?? 0})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mp-card px-4 py-10 text-center text-sm text-[var(--mp-muted)]">
          当前筛选下暂无询价单
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <InquiryCard
              key={inq.inquiryId}
              inq={inq}
              open={openId === inq.inquiryId}
              onToggle={() =>
                setOpenId((id) => (id === inq.inquiryId ? null : inq.inquiryId))
              }
              onConvert={() => convert(inq.inquiryId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
