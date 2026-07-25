import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryGrid, ProductCard } from '../components/ProductCard';
import { MpSection } from '../components/MarketplaceLayout';
import MarketInsights from '../components/MarketInsights';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

const BANNERS = [
  {
    title: '在线采购，一步到位',
    desc: '从选品到交付，全链路数字化采购体验',
    cta: '开始采购',
    to: '/marketplace/products',
    image: '/marketplace/mp-banner-1.png',
    accent: '#FF7D29',
  },
  {
    title: '透明供应，实时可查',
    desc: '实时库存、在线询价、订单追踪，全程可视化',
    cta: '查看产品',
    to: '/marketplace/products',
    image: '/marketplace/mp-banner-2.png',
    accent: '#1677FF',
  },
  {
    title: '100+ 企业信赖的选择',
    desc: '为制造企业提供高效、可靠的供应链采购服务',
    cta: '立即注册',
    to: '/marketplace/auth/register',
    image: '/marketplace/mp-banner-3.png',
    accent: '#E86A1A',
  },
];

export default function MarketplaceHome() {
  const products = useMarketplaceStore((s) => s.products);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  const go = useCallback((dir: 1 | -1) => {
    setSlide((s) => (s + dir + BANNERS.length) % BANNERS.length);
  }, []);

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!pausedRef.current) next();
    }, 4000);
    return () => window.clearInterval(t);
  }, [next]);

  const hot = products.slice(0, 6);
  const b = BANNERS[slide]!;

  return (
    <div className="space-y-10">
      {/* Banner：亮色插画 + 醒目文案 + 自动轮播 / 左右翻页 */}
      <section
        className="mp-hero-banner mp-fade-up relative overflow-hidden rounded-2xl border border-[var(--mp-border)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {BANNERS.map((item, i) => (
          <div
            key={item.image}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{
              backgroundImage: `url(${item.image})`,
              opacity: i === slide ? 1 : 0,
            }}
            aria-hidden={i !== slide}
          />
        ))}

        {/* 浅色蒙层：文字醒目，不用黑底 */}
        <div className="mp-hero-veil absolute inset-0" />

        <div className="relative z-10 flex min-h-[300px] flex-col justify-center px-14 py-12 md:min-h-[340px] md:px-16 md:py-14">
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm"
            style={{ background: b.accent }}
          >
            SCIP MARKETPLACE
          </span>
          <h1 className="mp-hero-title mt-4 max-w-xl text-3xl font-extrabold leading-tight md:text-[2.55rem]">
            {b.title}
          </h1>
          <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-[#3D4A5C] md:text-base">
            {b.desc}
          </p>
          <Link
            to={b.to}
            className="mp-btn-primary mt-7 inline-flex w-fit text-base !px-5 !py-2.5"
          >
            {b.cta}
          </Link>
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

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`第 ${i + 1} 张`}
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
