/**
 * Marketplace 首页 Banner：新闻热点 / 近期活动 / 企业成果
 * 图片来自 Unsplash（见 public/marketplace/CREDITS.md）
 */
import { headlineNews, industryEvents } from './marketNews';

export type BannerKind = 'news' | 'event' | 'achievement';

export interface MarketplaceBanner {
  id: string;
  kind: BannerKind;
  /** 角标文案 */
  badge: string;
  title: string;
  desc: string;
  cta: string;
  to: string;
  image: string;
  /** 强调色（角标） */
  accent: string;
  meta?: string;
}

const KIND_META: Record<
  BannerKind,
  { badge: string; accent: string }
> = {
  news: { badge: '新闻热点', accent: '#FF7D29' },
  event: { badge: '近期活动', accent: '#1677FF' },
  achievement: { badge: '成果亮点', accent: '#00B42A' },
};

/** 企业成果演示数据（自家 SCIP 平台亮点） */
const ACHIEVEMENTS: Array<Omit<MarketplaceBanner, 'kind' | 'badge' | 'accent'> & { kind?: never }> = [
  {
    id: 'ACH-001',
    title: '准时交付率提升至 96.8%',
    desc: 'SCIP 控制塔 + Marketplace 双门户协同，本季度准时交付率同比提升 8.2 个百分点，客户满意度持续走高。',
    cta: '了解履约能力',
    to: '/marketplace/orders',
    image: '/marketplace/banners/banner-achieve-1.jpg',
    meta: 'Q2 运营亮点',
  },
  {
    id: 'ACH-002',
    title: '危化品专线覆盖华南华东 12 城',
    desc: '自有仓配网络与 SCIP 物流模块实时联动，询价到在途可视一站完成，平均履约周期缩短 1.5 天。',
    cta: '查看产品目录',
    to: '/marketplace/products',
    image: '/marketplace/banners/banner-achieve-2.jpg',
    meta: '供应链网络',
  },
];

const EVENT_IMAGES = [
  '/marketplace/banners/banner-event-1.jpg',
  '/marketplace/banners/banner-event-2.jpg',
];

const NEWS_FALLBACK = [
  '/marketplace/banners/banner-news-1.jpg',
  '/marketplace/banners/banner-news-2.jpg',
];

/** 首页轮播：2 条热点新闻 + 2 场近期活动 + 2 项成果亮点 */
export function buildMarketplaceBanners(): MarketplaceBanner[] {
  const newsSlides: MarketplaceBanner[] = headlineNews.slice(0, 2).map((n, i) => ({
    id: `BANNER-${n.id}`,
    kind: 'news',
    badge: KIND_META.news.badge,
    accent: KIND_META.news.accent,
    title: n.title,
    desc: n.summary,
    cta: '阅读全文',
    to: `/marketplace/market-news/${n.id}`,
    image: n.imageUrl || NEWS_FALLBACK[i % NEWS_FALLBACK.length]!,
    meta: `${n.tag} · ${n.category} · ${n.publishedAt}`,
  }));

  const eventSlides: MarketplaceBanner[] = industryEvents.slice(0, 2).map((ev, i) => ({
    id: `BANNER-${ev.id}`,
    kind: 'event',
    badge: KIND_META.event.badge,
    accent: KIND_META.event.accent,
    title: ev.name,
    desc: `${ev.date} · ${ev.location}。${ev.description}`,
    cta: '查看活动详情',
    to: `/marketplace/events/${ev.id}`,
    image: ev.imageUrl || EVENT_IMAGES[i % EVENT_IMAGES.length]!,
    meta: ev.status,
  }));

  const achievementSlides: MarketplaceBanner[] = ACHIEVEMENTS.map((a) => ({
    ...a,
    kind: 'achievement' as const,
    badge: KIND_META.achievement.badge,
    accent: KIND_META.achievement.accent,
  }));

  // 交错排列：新闻 → 活动 → 成果 → 新闻 → 活动 → 成果
  const out: MarketplaceBanner[] = [];
  const max = Math.max(newsSlides.length, eventSlides.length, achievementSlides.length);
  for (let i = 0; i < max; i++) {
    if (newsSlides[i]) out.push(newsSlides[i]!);
    if (eventSlides[i]) out.push(eventSlides[i]!);
    if (achievementSlides[i]) out.push(achievementSlides[i]!);
  }
  return out;
}

export const marketplaceBanners = buildMarketplaceBanners();
