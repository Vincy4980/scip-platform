import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { STOCK_LABEL, STOCK_TAG } from '../../mock/scipData';
import { ProductThumb, formatMoney } from '../components/ProductCard';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

export default function MarketplaceProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMarketplaceStore((s) => s.getProduct(id ?? ''));
  const stock = useMarketplaceStore((s) => s.getStock(id ?? ''));
  const customer = useMarketplaceStore((s) => s.customer);
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const submitInquiry = useMarketplaceStore((s) => s.submitInquiry);
  const toggleFavorite = useMarketplaceStore((s) => s.toggleFavorite);
  const loggedIn = useMarketplaceStore((s) => s.loggedIn);

  const [qty, setQty] = useState(1);
  const [date, setDate] = useState('2026-08-15');
  const [addressId, setAddressId] = useState(customer.addresses[0]?.id ?? '');
  const [toast, setToast] = useState('');

  if (!product) {
    return (
      <div className="mp-card p-10 text-center text-[var(--mp-muted)]">
        未找到产品 · <Link to="/marketplace/products" className="text-[var(--mp-orange)]">返回目录</Link>
      </div>
    );
  }

  const fav = customer.favorites.includes(product.productId);

  const addInquiryCart = () => {
    addToCart({
      productId: product.productId,
      productName: product.productName,
      qty,
      unit: product.unit,
      expectedDate: date,
      addressId,
    });
    setToast('已加入询价单');
    window.setTimeout(() => setToast(''), 2000);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loggedIn) {
      navigate('/marketplace/auth');
      return;
    }
    const inquiryId = submitInquiry([
      {
        productId: product.productId,
        productName: product.productName,
        qty,
        unit: product.unit,
        expectedDate: date,
        addressId,
      },
    ]);
    setToast(`询价已提交 ${inquiryId}，已同步 SCIP`);
    window.setTimeout(() => navigate('/marketplace/inquiry'), 1200);
  };

  return (
    <div className="space-y-6">
      <nav className="text-xs text-[var(--mp-muted)]">
        <Link to="/marketplace" className="hover:text-[var(--mp-orange)]">
          首页
        </Link>
        {' / '}
        <Link to="/marketplace/products" className="hover:text-[var(--mp-orange)]">
          产品中心
        </Link>
        {' / '}
        <span className="text-[var(--mp-ink)]">{product.productName}</span>
      </nav>

      {toast && (
        <div className="rounded-xl border border-[#FFE4CC] bg-[var(--mp-orange-soft)] px-4 py-2 text-sm text-[var(--mp-orange-deep)]">
          {toast}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductThumb product={product} className="min-h-[280px] w-full" />
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--mp-ink)]">{product.productName}</h1>
            <p className="mt-1 text-sm text-[var(--mp-muted)]">{product.specification}</p>
            <p className="text-xs text-[var(--mp-muted)]">产品编号 · {product.productId} / {product.sku}</p>
          </div>
          <p className="text-sm">应用领域：{product.application}</p>
          {stock && (
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STOCK_TAG[stock.status]}`}>
                {STOCK_LABEL[stock.status]}
              </span>
              <span className="text-sm text-[var(--mp-muted)]">
                可用库存 {stock.availableStock.toLocaleString()} {product.unit}
                <span className="ml-2 text-xs">（{stock.warehouse}）</span>
              </span>
            </div>
          )}
          <p className="text-lg font-semibold text-[var(--mp-orange)]">
            参考销售价 {formatMoney(Math.round(product.unitPrice * 1000))}
            <span className="ml-1 text-xs font-normal text-[var(--mp-muted)]">
              / {product.unit}（门户价，非 SCIP 成本价）
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addInquiryCart} className="mp-btn-primary">
              加入询价单
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product.productId)}
              className="mp-btn-ghost"
            >
              {fav ? '★ 已收藏' : '☆ 收藏'}
            </button>
          </div>
        </div>
      </div>

      <section className="mp-card overflow-hidden">
        <h2 className="border-b border-[var(--mp-border)] px-4 py-3 text-sm font-semibold">
          技术参数
        </h2>
        <table className="w-full text-sm">
          <tbody>
            {product.specs.map((s) => (
              <tr key={s.label} className="border-t border-[var(--mp-border)]">
                <td className="w-40 bg-[#FAF8F6] px-4 py-2.5 text-[var(--mp-muted)]">{s.label}</td>
                <td className="px-4 py-2.5">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mp-card p-4">
        <h2 className="text-sm font-semibold">应用说明</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--mp-muted)]">
          {product.applications.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[var(--mp-muted)]">注意事项：{product.usageNotes}</p>
      </section>

      <section className="mp-card p-4">
        <h2 className="text-sm font-semibold">文档下载</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={product.tdsUrl} className="mp-btn-ghost !text-xs" onClick={(e) => e.preventDefault()}>
            技术数据表 TDS（演示）
          </a>
          <a href={product.sdsUrl} className="mp-btn-ghost !text-xs" onClick={(e) => e.preventDefault()}>
            安全数据表 SDS（演示）
          </a>
        </div>
      </section>

      <section className="mp-card p-4">
        <h2 className="mb-3 text-sm font-semibold">询价操作</h2>
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs text-[var(--mp-muted)]">
            数量（{product.unit}）
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
              className="mp-input mt-1"
            />
          </label>
          <label className="text-xs text-[var(--mp-muted)]">
            期望到货日期
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mp-input mt-1"
            />
          </label>
          <label className="text-xs text-[var(--mp-muted)]">
            收货地址
            <select
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              className="mp-input mt-1"
            >
              {customer.addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} · {a.city}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-3">
            <button type="submit" className="mp-btn-primary">
              提交询价
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
