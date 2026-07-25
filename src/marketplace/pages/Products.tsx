import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  STOCK_LABEL,
  STOCK_TAG,
  marketplaceCategories,
  type StockStatus,
} from '../../mock/scipData';
import {
  ProductThumb,
  StockDot,
} from '../components/ProductCard';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

type ViewMode = 'grid' | 'list';
type SortKey = 'name' | 'stock' | 'updated';

export default function MarketplaceProducts() {
  const [params] = useSearchParams();
  const products = useMarketplaceStore((s) => s.products);
  const inventory = useMarketplaceStore((s) => s.inventory);
  const getStock = useMarketplaceStore((s) => s.getStock);

  const initialCat = params.get('category');
  const initialQ = params.get('q') ?? '';

  const [categories, setCategories] = useState<string[]>(
    initialCat ? [initialCat] : [],
  );
  const [apps, setApps] = useState<string[]>([]);
  const [stocks, setStocks] = useState<StockStatus[]>([]);
  const [q, setQ] = useState(initialQ);
  const [view, setView] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortKey>('name');

  const appOptions = useMemo(
    () => [...new Set(products.map((p) => p.application))],
    [products],
  );

  const toggle = (list: string[], v: string, set: (x: string[]) => void) => {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (categories.length && !categories.includes(p.category)) return false;
      if (apps.length && !apps.includes(p.application)) return false;
      const st = getStock(p.productId)?.status;
      if (stocks.length && (!st || !stocks.includes(st))) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !p.productName.toLowerCase().includes(s) &&
          !p.specification.toLowerCase().includes(s) &&
          !p.sku.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.productName.localeCompare(b.productName, 'zh');
      if (sort === 'updated') return b.updatedAt.localeCompare(a.updatedAt);
      const sa = getStock(a.productId)?.availableStock ?? 0;
      const sb = getStock(b.productId)?.availableStock ?? 0;
      return sb - sa;
    });
    return list;
  }, [products, categories, apps, stocks, q, sort, getStock]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-[var(--mp-ink)]">产品目录</h1>
        <p className="mt-1 text-sm text-[var(--mp-muted)]">
          共 {filtered.length} 款 · 库存同步自 SCIP（{inventory.length} SKU）
        </p>
      </div>

      <div className="mp-card space-y-4 p-4">
        <div>
          <div className="mb-2 text-xs font-medium text-[var(--mp-muted)]">品类（多选）</div>
          <div className="flex flex-wrap gap-2">
            {marketplaceCategories.slice(0, 6).map((c) => (
              <button
                key={c.id}
                type="button"
                className={`mp-chip ${categories.includes(c.id) ? 'active' : ''}`}
                onClick={() => toggle(categories, c.id, setCategories)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-medium text-[var(--mp-muted)]">应用领域</div>
          <div className="flex flex-wrap gap-2">
            {appOptions.map((a) => (
              <button
                key={a}
                type="button"
                className={`mp-chip ${apps.includes(a) ? 'active' : ''}`}
                onClick={() => toggle(apps, a, setApps)}
              >
                {a.split(' / ')[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-3 text-sm">
            {(['green', 'yellow', 'red'] as StockStatus[]).map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-[var(--mp-muted)]">
                <input
                  type="checkbox"
                  checked={stocks.includes(s)}
                  onChange={() =>
                    setStocks((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
                    )
                  }
                  className="accent-[#FF7D29]"
                />
                {STOCK_LABEL[s]}
              </label>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索产品…"
            className="mp-input max-w-xs"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-[var(--mp-border)] bg-white p-1">
          {(['grid', 'list'] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1 text-xs font-medium ${
                view === v
                  ? 'bg-[var(--mp-orange-soft)] text-[var(--mp-orange-deep)]'
                  : 'text-[var(--mp-muted)]'
              }`}
            >
              {v === 'grid' ? '网格' : '列表'}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="mp-input !w-auto"
        >
          <option value="name">按名称</option>
          <option value="stock">按库存</option>
          <option value="updated">按最近更新</option>
        </select>
      </div>

      {view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const st = getStock(p.productId);
            return (
              <article key={p.productId} className="mp-card overflow-hidden">
                <ProductThumb product={p} className="h-40 w-full" />
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold">{p.productName}</h3>
                  <p className="text-xs text-[var(--mp-muted)]">{p.specification}</p>
                  <p className="text-xs text-[var(--mp-muted)]">{p.application}</p>
                  {st && (
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${STOCK_TAG[st.status]}`}>
                      {STOCK_LABEL[st.status]} · {st.availableStock} {p.unit}
                    </span>
                  )}
                  <Link
                    to={`/marketplace/products/${p.productId}`}
                    className="mp-btn-ghost mt-2 inline-flex w-full !text-xs"
                  >
                    查看详情
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mp-card divide-y divide-[var(--mp-border)] overflow-hidden">
          {filtered.map((p) => {
            const st = getStock(p.productId);
            return (
              <div
                key={p.productId}
                className="flex flex-wrap items-center gap-4 px-4 py-3 hover:bg-[#FAF8F6]"
              >
                <ProductThumb product={p} className="h-14 w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{p.productName}</div>
                  <div className="text-xs text-[var(--mp-muted)]">
                    {p.specification} · {p.application}
                  </div>
                </div>
                {st && <StockDot status={st.status} />}
                <Link
                  to={`/marketplace/products/${p.productId}`}
                  className="mp-btn-primary !px-3 !py-1.5 !text-xs"
                >
                  查看详情
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
