import { Link, useParams } from 'react-router-dom';
import {
  EVENT_STATUS_STYLE,
  TAG_STYLE,
  findEventById,
  findNewsById,
  headlineNews,
  industryEvents,
} from '../../mock/marketNews';

export default function MarketNewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--mp-ink)]">市场资讯</h1>
        <p className="mt-1 text-sm text-[var(--mp-muted)]">
          看市场 · 行业头条、品类快讯与展会活动
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-block h-4 w-1 rounded-full bg-[var(--mp-orange)]" />
          行业头条
        </h2>
        <div className="grid gap-3">
          {headlineNews.map((n) => (
            <Link
              key={n.id}
              to={`/marketplace/market-news/${n.id}`}
              className="mp-card flex min-h-[120px] flex-col gap-2 p-4 transition hover:border-[#FFC9A0] sm:flex-row sm:items-center"
            >
              <div
                className="h-24 w-full shrink-0 rounded-xl sm:h-20 sm:w-28"
                style={{
                  background: `linear-gradient(145deg, hsl(${n.imageHue} 50% 88%), hsl(${(n.imageHue + 40) % 360} 42% 70%))`,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_STYLE[n.tag]}`}>
                    {n.tag}
                  </span>
                  <span className="text-[10px] text-[var(--mp-muted)]">{n.category}</span>
                  <span className="text-[10px] text-[var(--mp-muted)]">{n.publishedAt}</span>
                </div>
                <h3 className="mt-1 text-sm font-semibold text-[var(--mp-ink)]">{n.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--mp-muted)]">{n.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="events" className="space-y-3 scroll-mt-24">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-block h-4 w-1 rounded-full bg-[var(--mp-orange)]" />
          行业展会
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {industryEvents.map((ev) => (
            <Link
              key={ev.id}
              to={`/marketplace/events/${ev.id}`}
              className="mp-card p-4 hover:border-[#FFC9A0]"
            >
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${EVENT_STATUS_STYLE[ev.status]}`}
              >
                {ev.status}
              </span>
              <div className="mt-2 font-semibold text-sm">{ev.name}</div>
              <p className="mt-1 text-xs text-[var(--mp-muted)]">
                {ev.date} · {ev.location}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function MarketNewsDetailPage() {
  const { id } = useParams();
  const news = findNewsById(id ?? '');

  if (!news) {
    return (
      <div className="mp-card p-8 text-center text-[var(--mp-muted)]">
        未找到资讯 ·{' '}
        <Link to="/marketplace/market-news" className="text-[var(--mp-orange)]">
          返回
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <nav className="text-xs text-[var(--mp-muted)]">
        <Link to="/marketplace/market-news" className="hover:text-[var(--mp-orange)]">
          市场资讯
        </Link>
        {' / '}
        <span className="text-[var(--mp-ink)]">详情</span>
      </nav>
      <div
        className="h-44 rounded-2xl"
        style={{
          background: `linear-gradient(145deg, hsl(${news.imageHue} 50% 88%), hsl(${(news.imageHue + 40) % 360} 42% 65%))`,
        }}
      />
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_STYLE[news.tag]}`}>
          {news.tag}
        </span>
        <span className="text-xs text-[var(--mp-muted)]">{news.category}</span>
        <span className="text-xs text-[var(--mp-muted)]">{news.publishedAt}</span>
      </div>
      <h1 className="text-2xl font-bold text-[var(--mp-ink)]">{news.title}</h1>
      <p className="text-sm leading-relaxed text-[var(--mp-muted)]">{news.summary}</p>
      <div className="mp-card p-4 text-sm leading-relaxed text-[var(--mp-ink)]">{news.body}</div>
      <Link to="/marketplace/products" className="mp-btn-primary inline-flex !text-xs">
        去选品采购
      </Link>
    </article>
  );
}

export function EventDetailPage() {
  const { id } = useParams();
  const ev = findEventById(id ?? '');

  if (!ev) {
    return (
      <div className="mp-card p-8 text-center text-[var(--mp-muted)]">
        未找到展会 ·{' '}
        <Link to="/marketplace/market-news#events" className="text-[var(--mp-orange)]">
          返回
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <nav className="text-xs text-[var(--mp-muted)]">
        <Link to="/marketplace/market-news#events" className="hover:text-[var(--mp-orange)]">
          行业展会
        </Link>
        {' / '}
        <span className="text-[var(--mp-ink)]">详情</span>
      </nav>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${EVENT_STATUS_STYLE[ev.status]}`}
      >
        {ev.status}
      </span>
      <h1 className="text-2xl font-bold text-[var(--mp-ink)]">{ev.name}</h1>
      <div className="mp-card space-y-2 p-4 text-sm">
        <p>
          <span className="text-[var(--mp-muted)]">时间：</span>
          {ev.date}
        </p>
        <p>
          <span className="text-[var(--mp-muted)]">地点：</span>
          {ev.location}
        </p>
        <p className="leading-relaxed text-[var(--mp-muted)]">{ev.description}</p>
      </div>
      <button type="button" className="mp-btn-primary !text-xs">
        预约提醒（演示）
      </button>
    </article>
  );
}
