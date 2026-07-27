import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryGrid, ProductCard } from '../components/ProductCard';
import { MpSection } from '../components/MarketplaceLayout';
import MarketInsights from '../components/MarketInsights';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { marketplaceBanners } from '../../mock/marketplaceBanners';

export default function MarketplaceHome() {
  const products = useMarketplaceStore((s) => s.products);
  const banners = useMemo(() => marketplaceBanners, []);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  const go = useCallback(
    (dir: 1 | -1) => {
      setSlide((s) => (s + dir + banners.length) % banners.length);
    },
    [banners.length],
  );

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!pausedRef.current) next();
    }, 5000);
    return () => window.clearInterval(t);
  }, [next]);

  const hot = products.slice(0, 6);
  const b = banners[slide]!;

  return (
    <div className="space-y-10">
      {/* Banner：固定比例；新闻 / 活动 / 成果 */}
      <section
        className="mp-hero-banner mp-fade-up overflow-hidden rounded-2xl border border-[var(--mp-border)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {banners.map((item, i) => (
          <img
            key={item.id}
            src={item.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === slide ? 1 : 0 }}
            aria-hidden={i !== slide}
          />
        ))}

        <div className="mp-hero-veil absolute inset-0" />

        <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 py-8 md:px-16 md:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm"
              style={{ background: b.accent }}
            >
              {b.badge}
            </span>
            {b.meta && (
              <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-[#3D4A5C] shadow-sm backdrop-blur-sm">
                {b.meta}
              </span>
            )}
          </div>
          <h1 className="mp-hero-title mt-3 max-w-2xl text-xl font-extrabold leading-snug line-clamp-2 md:mt-4 md:text-[2.1rem] md:leading-tight">
            {b.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#3D4A5C] line-clamp-2 md:mt-3 md:text-base">
            {b.desc}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-6">
            <Link
              to={b.to}
              className="mp-btn-primary inline-flex w-fit text-sm !px-4 !py-2 md:text-base md:!px-5 md:!py-2.5"
            >
              {b.cta}
            </Link>
            <Link
              to={
                b.kind === 'news'
                  ? '/marketplace/market-news'
                  : b.kind === 'event'
                    ? '/marketplace/market-news#events'
                    : '/marketplace/products'
              }
              className="mp-btn-ghost inline-flex !bg-white/90 !text-xs backdrop-blur-sm md:!text-sm"
            >
              {b.kind === 'news'
                ? '更多资讯'
                : b.kind === 'event'
                  ? '全部活动'
                  : '去选品'}
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 md:mt-5">
            {(
              [
                { kind: 'news', label: '热点' },
                { kind: 'event', label: '活动' },
                { kind: 'achievement', label: '成果' },
              ] as const
            ).map((t) => {
              const active = b.kind === t.kind;
              const count = banners.filter((x) => x.kind === t.kind).length;
              return (
                <button
                  key={t.kind}
                  type="button"
                  onClick={() => {
                    const idx = banners.findIndex((x) => x.kind === t.kind);
                    if (idx >= 0) setSlide(idx);
                  }}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    active
                      ? 'bg-[var(--mp-orange)] text-white'
                      : 'bg-white/80 text-[var(--mp-muted)] hover:bg-[var(--mp-orange-soft)]'
                  }`}
                >
                  {t.label} · {count}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="mp-hero-nav left-3"
          aria-label="上一张"
          onClick={prev}
        >
          ‹
        </button>
        <button
          type="button"
          className="mp-hero-nav right-3"
          aria-label="下一张"
          onClick={next}
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-5">
          {banners.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${item.badge}：${item.title}`}
              aria-current={i === slide}
              onClick={() => setSlide(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === slide
                  ? 'w-8 bg-[var(--mp-orange)]'
                  : 'w-2.5 bg-white/90 ring-1 ring-[#E4D5C8] hover:bg-[var(--mp-orange-soft)]'
              }`}
            />
          ))}
        </div>
      </section>

      <MarketInsights />

      <MpSection title="产品分类" subtitle="按品类快速进入成品目录">
        <CategoryGrid />
      </MpSection>

      <MpSection
        title="热点产品推荐"
        subtitle="库存与销售价实时同步自 SCIP"
        action={
          <Link to="/marketplace/products" className="text-sm font-medium text-[var(--mp-orange)]">
            查看全部 →
          </Link>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hot.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}
        </div>
      </MpSection>

      <section className="mp-card grid gap-4 p-6 md:grid-cols-3">
        {[
          { t: '共享库存', d: '可用量与灯色来自 SCIP 库存模块' },
          { t: '双向订单', d: '客户下单写回 SCIP 订单管理' },
          { t: '物流可视', d: '在途事件同步 SCIP 物流模块' },
        ].map((x) => (
          <div key={x.t}>
            <div className="text-sm font-semibold text-[var(--mp-ink)]">{x.t}</div>
            <p className="mt-1 text-xs text-[var(--mp-muted)]">{x.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
