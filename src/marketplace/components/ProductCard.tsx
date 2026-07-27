import { Link } from 'react-router-dom';
import {
  STOCK_DOT,
  STOCK_LABEL,
  marketplaceCategories,
  type MarketplaceProduct,
  type StockStatus,
} from '../../mock/scipData';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

export function StockDot({ status }: { status: StockStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--mp-muted)]">
      <i className={`inline-block h-2 w-2 rounded-full ${STOCK_DOT[status]}`} />
      {STOCK_LABEL[status]}
    </span>
  );
}

export function ProductThumb({
  product,
  className = '',
}: {
  product: MarketplaceProduct;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#FAF8F6] ${className}`}
      style={{
        background: product.imageUrl
          ? undefined
          : `linear-gradient(145deg, hsl(${product.imageHue} 55% 92%), hsl(${(product.imageHue + 40) % 360} 45% 86%))`,
      }}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-80" aria-hidden>
          ⚗️
        </span>
      )}
      <span className="absolute bottom-2 right-2 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-[var(--mp-muted)] backdrop-blur-sm">
        {product.category}
      </span>
    </div>
  );
}

export function ProductCard({ product }: { product: MarketplaceProduct }) {
  const stock = useMarketplaceStore((s) => s.getStock(product.productId));
  const status = stock?.status ?? 'green';

  return (
    <article className="mp-card mp-fade-up flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <ProductThumb product={product} className="h-36 w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-[var(--mp-ink)]">{product.productName}</h3>
        <p className="text-xs text-[var(--mp-muted)]">{product.specification}</p>
        <p className="text-xs text-[var(--mp-muted)]">应用：{product.application}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <StockDot status={status} />
          <Link
            to={`/marketplace/products/${product.productId}`}
            className="mp-btn-primary !px-3 !py-1.5 !text-xs"
          >
            询价
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CategoryGrid({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {marketplaceCategories.map((c) => (
        <Link
          key={c.id}
          to={`/marketplace/products?category=${encodeURIComponent(c.id)}`}
          onClick={() => onSelect?.(c.id)}
          className="mp-card flex flex-col items-center gap-2 px-3 py-4 text-center transition hover:border-[#FFC9A0] hover:bg-[var(--mp-orange-soft)]"
        >
          <span className="text-2xl">{c.icon}</span>
          <span className="text-sm font-semibold text-[var(--mp-ink)]">{c.label}</span>
          <span className="text-[10px] text-[var(--mp-muted)]">{c.desc}</span>
        </Link>
      ))}
    </div>
  );
}

export function SyncBadge({ synced }: { synced?: boolean }) {
  if (!synced) return null;
  return (
    <span className="rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[10px] font-medium text-[#1677FF]">
      已同步 SCIP
    </span>
  );
}

export function formatMoney(n: number) {
  return `¥${n.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
}
