export type ScippyMood =
  | 'idle'
  | 'thinking'
  | 'happy'
  | 'excited'
  | 'sad'
  | 'warning'
  | 'success'
  | 'listening';

/** 展示层仅允许：开心 / 紧急 */
export type ScippyDisplayMood = 'happy' | 'warning';

export function normalizeScippyMood(mood: ScippyMood): ScippyDisplayMood {
  return mood === 'warning' ? 'warning' : 'happy';
}

/** 存储/展示用：保留开心系多样表情，消极一律映射为 happy */
export function toScippyVisualMood(mood: ScippyMood): ScippyMood {
  if (mood === 'warning') return 'warning';
  if (
    mood === 'excited' ||
    mood === 'success' ||
    mood === 'listening' ||
    mood === 'thinking' ||
    mood === 'idle'
  ) {
    return mood;
  }
  return 'happy';
}

export interface ScippyPersonality {
  name: string;
  title: string;
  greetingPhrases: string[];
  personality: string;
  emojis: string[];
}

export interface ScippySettings {
  proactiveEnabled: boolean;
  greetingDelayMs: number;
  refreshGreetingDelayMs: number;
  typingSpeedMs: number;
  showInput: boolean;
  quickActionCount: number;
}

export const scippyPersonality: ScippyPersonality = {
  name: 'Scippy',
  title: '供应链智能助手',
  personality: '热情、专业、活泼，永远靠谱',
  emojis: ['😊', '😄', '🚀', '📊', '💡', '🎯', '✨', '🚨'],
  greetingPhrases: [
    '嘿！我是 Scippy 👋 你的供应链小助手～今天想先查什么？',
    '哈喽！又见面啦 ✨ 订单、库存、物流都可以丢给我～',
    'Hi～Scippy 在线！有问题随时说，别客气 😊',
    '早上好！☀️ 控制塔数据已就绪，需要我帮你扫一眼吗？',
    '下午好～今天供应链运转得怎么样？我来帮你盯数据 💪',
    '哒哒～Scippy 上线！采购、仓储、在途，问我就行 🚀',
    '欢迎回来！我已同步最新告警与库存水位，要一起看吗？',
    '嗨嗨～想闲聊还是想干活？业务查询我都在行～',
    '你好呀！今天想从 KPI、订单还是物流异常开始？',
    'Scippy 报到！✨ 说个关键词，我帮你定位问题～',
    '来啦来啦～供应链情报站已开机，请吩咐！',
    '嘿，伙伴！刚扫过一遍平台动态，有想深入看的模块吗？',
    '开心见到你～今天我们一起把闭环走顺吧 😄',
    '叮咚～你的智能助手已就位，快捷提问在输入框上方哦～',
    '新的一天，新的交付！需要我帮你列今日待办重点吗？',
    '哇哦，又见面了！库存、在途、采购，你想先聊哪块？',
    'Scippy 在此～随时帮你查数、找异常、推 SOP 💡',
    '你好！我已连接 SCIP 全模块数据，开口就能查～',
  ],
};

/** 业务数据类回复的随机开场（避免千篇一律） */
export const scippyDataOpeningPhrases = [
  '好的，马上帮你拉今日关键指标～',
  '收到！控制塔最新数据如下：',
  '数据已整理好，请看今日概览：',
  '帮你汇总了一版今日 KPI，请查收：',
  '来啦～这是刚刷新的供应链核心指标：',
  'OK！我从控制塔拎来了这些数据：',
  '稍等…好了！今日运营快照如下：',
  '叮～今日数据看板已送达：',
];

/** 身份介绍类随机话术 */
export const scippyIdentityPhrases = [
  '我是 Scippy！SCIP 平台的智能小助手，采购、库存、物流、交付都能帮你搞定～🚀',
  'Scippy 在此～专门帮你查供应链数据、推 SOP、跟闭环，有问必答！',
  '你好，我是 Scippy ✨ 平台的「供应链副驾驶」，查数找异常我最拿手～',
  '我是你的 Scippy 小助手～订单追踪、库存预警、物流异常，一句话就能开工！',
  'Scippy 报到！我会把复杂供应链问题拆成你能马上执行的步骤 💡',
];

export function pickScippyPhrase(phrases: readonly string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)]!;
}

export const scippyMoodEmoji: Record<ScippyMood, string> = {
  idle: '😊',
  thinking: '😊',
  happy: '😄',
  excited: '😄',
  sad: '😊',
  warning: '🚨',
  success: '😊',
  listening: '😊',
};

export const scippySettings: ScippySettings = {
  proactiveEnabled: true,
  greetingDelayMs: 1500,
  refreshGreetingDelayMs: 800,
  typingSpeedMs: 30,
  showInput: true,
  quickActionCount: 3,
};

export const DEFAULT_QUICK_ACTIONS = [
  { id: 'kpi', label: '📊 查看今日数据', prompt: '查看今日数据' },
  { id: 'orders', label: '📦 追踪订单', prompt: '我的订单到哪了？' },
  { id: 'alerts', label: '⚠️ 查看告警', prompt: '今天有什么异常？' },
] as const;

export const POSITION_STORAGE_KEY = 'scippy-bubble-position';
