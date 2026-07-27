import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TAG_STYLE,
  categoryFlashes,
  headlineNews,
  industryEvents,
  EVENT_STATUS_STYLE,
  type MarketNewsItem,
} from '../../mock/marketNews';

function NewsDetailModal({
  news,
  onClose,
}: {
  news: MarketNewsItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#1D2939]/45"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_STYLE[news.tag]}`}>
              {news.tag}
            </span>
            <span className="ml-2 text-[10px] text-[var(--mp-muted)]">{news.category}</span>
            <h3 className="mt-2 text-lg font-semibold text-[var(--mp-ink)]">{news.title}</h3>
            <p className="mt-1 text-xs text-[var(--mp-muted)]">{news.publishedAt}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--mp-muted)]">
            ✕
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--mp-muted)]">{news.body}</p>
        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt=""
            className="mt-4 h-40 w-full rounded-xl object-cover"
          />
        )}
        <Link
          to={`/marketplace/market-news/${news.id}`}
          className="mt-4 inline-block text-sm font-medium text-[var(--mp-orange)]"
          onClick={onClose}
        >
          打开完整页面 →
        </Link>
      </div>
    </div>
  );
}

export default function MarketInsights() {
  const [active, setActive] = useState<MarketNewsItem | null>(null);
  const top = headlineNews.slice(0, 3);
  const lead = top[0]!;
  const rest = top.slice(1);

  return (
    <section className="space-y-5 mp-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--mp-ink)]">
            <span className="inline-block h-5 w-1 rounded-full bg-[var(--mp-orange)]" />
            看市场
            <span className="text-sm font-normal text-[var(--mp-muted)]">Market Insights</span>
          </h2>
          <p className="mt-1 text-sm text-[var(--mp-muted)]">
            行业动态 · 趋势解读 · 展会活动，辅助采购决策
          </p>
        </div>
        <Link
          to="/marketplace/market-news"
          className="text-sm font-medium text-[var(--mp-orange)] hover:underline"
        >
          全部资讯 →
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        {/* 左：行业头条 */}
        <div className="mp-card flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--mp-border)] px-4 py-3">
            <h3 className="text-sm font-semibold">🔥 行业头条</h3>
            <Link
              to="/marketplace/market-news"
              className="text-xs font-medium text-[var(--mp-orange)]"
            >
              查看更多
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setActive(lead)}
            className="group flex min-h-[140px] flex-col gap-3 border-b border-[var(--mp-border)] p-4 text-left transition hover:bg-[#FFFBF7] sm:flex-row"
          >
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:min-h-[120px] sm:w-40">
              <img
                src={lead.imageUrl}
                alt=""
                className="h-full w-full object-cover transition group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D2939]/35 to-transparent" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_STYLE[lead.tag]}`}>
                  {lead.tag}
                </span>
                <span className="rounded-full bg-[#FAF8F6] px-2 py-0.5 text-[10px] text-[var(--mp-muted)]">
                  {lead.category}
                </span>
              </div>
              <h4 className="mt-2 line-clamp-2 text-base font-semibold text-[var(--mp-ink)] group-hover:text-[var(--mp-orange-deep)]">
                {lead.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--mp-muted)]">
                {lead.summary}
              </p>
              <p className="mt-2 text-[10px] text-[var(--mp-muted)]">{lead.publishedAt}</p>
            </div>
          </button>

          <ul className="divide-y divide-[var(--mp-border)]">
            {rest.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setActive(n)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#FFFBF7]"
                >
                  <img
                    src={n.imageUrl}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_STYLE[n.tag]}`}>
                        {n.tag}
                      </span>
                      <span className="text-[10px] text-[var(--mp-muted)]">{n.category}</span>
                      <span className="text-[10px] text-[var(--mp-muted)]">· {n.publishedAt}</span>
                    </div>
                    <div className="mt-1 line-clamp-1 text-sm font-semibold text-[var(--mp-ink)]">
                      {n.title}
                    </div>
                    <p className="line-clamp-1 text-xs text-[var(--mp-muted)]">{n.summary}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t border-[var(--mp-border)] px-4 py-3">
            <Link
              to="/marketplace/market-news"
              className="text-xs font-medium text-[var(--mp-orange)]"
            >
              更多头条 →
            </Link>
          </div>
        </div>

        {/* 右：热门品类 + 快讯 */}
        <div className="mp-card flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--mp-border)] px-4 py-3">
            <h3 className="text-sm font-semibold">📌 热门品类</h3>
            <Link
              to="/marketplace/products"
              className="text-xs font-medium text-[var(--mp-orange)]"
            >
              查看更多
            </Link>
          </div>
          <ul className="flex flex-1 flex-col divide-y divide-[var(--mp-border)]">
            {categoryFlashes.map((f) => (
              <li key={f.id} className="px-4 py-3">
                <Link
                  to={`/marketplace/products?category=${encodeURIComponent(f.productCategory)}`}
                  className="inline-flex rounded-full bg-[var(--mp-orange-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--mp-orange-deep)] hover:bg-[#FFE4CC]"
                >
                  {f.category}
                </Link>
                <p className="mt-2 text-sm font-medium leading-snug text-[var(--mp-ink)]">
                  {f.headline}
                </p>
                {f.detail && (
                  <p className="mt-1 line-clamp-2 text-[11px] text-[var(--mp-muted)]">{f.detail}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 展会 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-block h-4 w-1 rounded-full bg-[var(--mp-orange)]" />
            📌 行业展会 · 活动推荐
          </h3>
          <Link
            to="/marketplace/market-news#events"
            className="text-xs font-medium text-[var(--mp-orange)]"
          >
            全部展会 →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {industryEvents.map((ev) => (
            <Link
              key={ev.id}
              to={`/marketplace/events/${ev.id}`}
              className="mp-card min-w-[240px] max-w-[280px] shrink-0 p-4 transition hover:border-[#FFC9A0] hover:shadow-md"
            >
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${EVENT_STATUS_STYLE[ev.status]}`}
              >
                {ev.status}
              </span>
              <div className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--mp-ink)]">
                {ev.name}
              </div>
              <p className="mt-2 text-xs text-[var(--mp-muted)]">{ev.date}</p>
              <p className="text-xs text-[var(--mp-muted)]">{ev.location}</p>
            </Link>
          ))}
        </div>
      </div>

      {active && <NewsDetailModal news={active} onClose={() => setActive(null)} />}
    </section>
  );
}
