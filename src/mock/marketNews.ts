/** SCIP Marketplace — 看市场（Market Insights）模拟数据 */

export type NewsTag = '热门' | '热点' | '趋势' | '政策' | '市场';

export type NewsCategory =
  | '新能源'
  | '医药'
  | '食品与营养'
  | '政策法规'
  | '精细化工'
  | '新材料';

export interface MarketNewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  publishedAt: string;
  tag: NewsTag;
  /** 详情正文（演示） */
  body: string;
  imageHue: number;
  featured?: boolean;
}

export interface CategoryFlash {
  id: string;
  category: string;
  /** 对应产品目录筛选品类 */
  productCategory: string;
  headline: string;
  detail?: string;
}

export type EventStatus = '预登记开启' | '报名中' | '即将开启' | '即将开始';

export interface IndustryEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  description: string;
}

export const headlineNews: MarketNewsItem[] = [
  {
    id: 'NEWS-001',
    title: '千亿电解液龙头亲手叫停26亿项目',
    summary:
      '天赐材料在7月3日晚间公告，终止南通年产24.3万吨锂电及含氟新材料项目的建设。',
    category: '新能源',
    publishedAt: '2026-07-03',
    tag: '热门',
    featured: true,
    imageHue: 28,
    body: '天赐材料在7月3日晚间公告，终止南通年产24.3万吨锂电及含氟新材料项目的建设。公司表示将根据市场需求与产能利用率动态优化资本开支节奏，短期内聚焦存量产线效率与海外客户交付。对下游电解液及相关含氟中间体采购方而言，短期供应格局或趋稳，建议关注替代供方与长约条款调整窗口。',
  },
  {
    id: 'NEWS-002',
    title: 'AstraZeneca心脏药Wainua三期失败，市值一度蒸发约270亿美元',
    summary:
      '2026年7月9日，英国制药集团AstraZeneca与美国Ionis Pharmaceuticals公布，Wainua用于转甲状腺素蛋白淀粉样变性心肌病（ATTR-CM）的全球III期CARDIO-TTRansform试验未达到主要疗效终点。',
    category: '医药',
    publishedAt: '2026-07-09',
    tag: '热点',
    imageHue: 210,
    body: '2026年7月9日，AstraZeneca 与 Ionis 公布 Wainua 用于 ATTR-CM 的全球 III 期 CARDIO-TTRansform 试验未达主要疗效终点，资本市场反应剧烈。虽与化工成品采购无直接关联，但医药中间体与特种溶剂需求预期可能阶段性承压，建议关注相关合同量与库存策略。',
  },
  {
    id: 'NEWS-003',
    title: '精准营养爆发：2026十大潜力原料全盘点',
    summary: '健康已从被动需求转为主动生活方式，驱动全球功能食品迈向万亿市场。',
    category: '食品与营养',
    publishedAt: '2026-07-05',
    tag: '趋势',
    imageHue: 145,
    body: '健康消费升级推动功能食品原料需求上升。本盘点覆盖益生元、植物蛋白、微量营养素复配与风味载体等十大潜力原料方向，并对采购周期、认证要求与供应链风险给出建议，帮助制造企业与贸易商优化备货结构。',
  },
  {
    id: 'NEWS-004',
    title: '欧盟REACH法规新增5种高度关注物质（SVHC）',
    summary:
      '欧洲化学品管理局（ECHA）于2026年7月1日将5种新物质列入SVHC候选清单，影响多个化工品类。',
    category: '政策法规',
    publishedAt: '2026-07-01',
    tag: '政策',
    imageHue: 265,
    body: 'ECHA 于 2026 年 7 月 1 日将 5 种新物质列入 SVHC 候选清单。出口欧盟的成品与中间体需更新 SDS、评估授权义务，并与下游客户同步合规声明。建议采购与关务团队联合复核现有 BOM 与供应商声明。',
  },
  {
    id: 'NEWS-005',
    title: '全球聚氨酯市场需求回暖，2026年Q2同比增长6.8%',
    summary:
      '据行业研究机构报告，2026年第二季度全球聚氨酯市场需求稳步回升，主要受益于建筑、汽车和家具行业复苏。',
    category: '精细化工',
    publishedAt: '2026-06-28',
    tag: '市场',
    imageHue: 35,
    body: '2026 年 Q2 全球聚氨酯需求同比增长 6.8%，建筑保温、汽车内饰与家具软泡拉动明显。MDI/TDI 及多元醇价格波动仍存，建议结合 SCIP Marketplace 库存灯色与询价节奏做滚动备货。',
  },
];

export const categoryFlashes: CategoryFlash[] = [
  {
    id: 'FLASH-01',
    category: '精细化工',
    productCategory: '精细化学品',
    headline: '行业展会 CBB 2026 双预登记正式开启！',
    detail:
      '中国国际酒、饮料制造技术及设备展览会将于2026年10月12日至15日在上海举行。',
  },
  {
    id: 'FLASH-02',
    category: '新能源',
    productCategory: '精细化学品',
    headline: '政策解读：新能源材料进口关税调整影响分析',
    detail: '关税调整或影响电解液溶剂、含氟材料进口成本，建议评估长约与本地化供源。',
  },
  {
    id: 'FLASH-03',
    category: '食品与营养',
    productCategory: '精细化学品',
    headline: '2026年全球功能食品市场规模预计突破8000亿美元',
    detail: '功能食品原料采购窗口拉长，认证与溯源要求持续提升。',
  },
  {
    id: 'FLASH-04',
    category: '新材料',
    productCategory: '聚合物',
    headline: '石墨烯在复合材料领域的应用新突破',
    detail: '导电与增强复合材料加速落地，特种聚合物与助剂需求可期。',
  },
];

export const industryEvents: IndustryEvent[] = [
  {
    id: 'EVT-001',
    name: 'CBB 2026 中国国际酒、饮料制造技术及设备展览会',
    date: '2026年10月12-15日',
    location: '上海新国际博览中心',
    status: '预登记开启',
    description:
      '覆盖饮料制造技术、包装与相关化工原料供应链对接，适合食品与营养、精细化工采购团队。',
  },
  {
    id: 'EVT-002',
    name: '2026中国精细化工产业发展峰会',
    date: '2026年9月15-17日',
    location: '广州',
    status: '报名中',
    description:
      '聚焦精细化工产业链协同、绿色工艺与供应链韧性，设置供需对接专场。',
  },
  {
    id: 'EVT-003',
    name: '2026新能源材料国际论坛',
    date: '2026年11月5-7日',
    location: '深圳',
    status: '即将开启',
    description:
      '电解液、隔膜、正极材料与含氟新材料技术交流，配套采购洽谈区。',
  },
  {
    id: 'EVT-004',
    name: '2026食品安全与营养健康大会',
    date: '2026年12月2-4日',
    location: '北京',
    status: '即将开启',
    description:
      '功能食品原料、添加剂合规与营养健康趋势研讨，助力精准营养采购决策。',
  },
];

export const TAG_STYLE: Record<NewsTag, string> = {
  热门: 'bg-[#FFF1E6] text-[#FF7D29]',
  热点: 'bg-[#FFF1F0] text-[#F53F3F]',
  趋势: 'bg-[#E8FFEA] text-[#00B42A]',
  政策: 'bg-[#F3E8FF] text-[#845EC2]',
  市场: 'bg-[#E8F3FF] text-[#1677FF]',
};

export const EVENT_STATUS_STYLE: Record<EventStatus, string> = {
  预登记开启: 'bg-[#E8F3FF] text-[#1677FF]',
  报名中: 'bg-[#FFF1E6] text-[#FF7D29]',
  即将开启: 'bg-[#FFF7E6] text-[#D48806]',
  即将开始: 'bg-[#FFF7E6] text-[#D48806]',
};

export function findNewsById(id: string) {
  return headlineNews.find((n) => n.id === id);
}

export function findEventById(id: string) {
  return industryEvents.find((e) => e.id === id);
}
