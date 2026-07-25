export type ScippyIntent =
  | 'greeting'
  | 'identity'
  | 'capability'
  | 'thanks'
  | 'goodbye'
  | 'query_alert'
  | 'query_supplier'
  | 'query_inventory'
  | 'query_order'
  | 'query_logistics'
  | 'query_risk'
  | 'create_order'
  | 'analyze_data'
  // 日常扩展
  | 'morning_greeting'
  | 'evening_greeting'
  | 'weekend_greeting'
  | 'holiday_greeting'
  | 'feeling_tired'
  | 'feeling_stressed'
  | 'feeling_sad'
  | 'feeling_bored'
  | 'feeling_lucky'
  | 'feeling_annoyed'
  | 'work_efficiency'
  | 'supplier_negotiation'
  | 'team_collaboration'
  | 'emergency_response'
  | 'upward_reporting'
  | 'team_management'
  | 'conflict_resolution'
  | 'what_is_supply_chain'
  | 'what_is_scor'
  | 'what_is_vmi'
  | 'what_is_jit'
  | 'why_supply_chain_matters'
  | 'supply_chain_resilience'
  | 'what_is_esg'
  | 'tell_joke'
  | 'tell_another_joke'
  | 'supply_chain_joke'
  | 'cold_joke'
  | 'daily_fortune'
  | 'weather_inquiry'
  | 'book_recommendation'
  | 'learning_path'
  | 'food_recommendation'
  | 'travel_planning'
  | 'positive_energy'
  | 'scippy_color'
  | 'scippy_relationship'
  | 'scippy_eat'
  | 'scippy_age'
  | 'scippy_gender'
  | 'scippy_love'
  | 'scippy_hate'
  | 'scippy_praise'
  | 'scippy_silly'
  | 'scippy_love_question'
  | 'news_inquiry'
  | 'give_advice'
  | 'feeling_hungry'
  | 'off_work'
  | 'weekend_plan'
  | 'overtime_tired'
  | 'unknown';

/** 情绪类意图：用于情感感知与 SOP 推送 */
export const EMOTION_INTENTS: ScippyIntent[] = [
  'feeling_tired',
  'feeling_stressed',
  'feeling_sad',
  'feeling_bored',
  'feeling_lucky',
  'feeling_annoyed',
  'feeling_hungry',
  'overtime_tired',
];

const PATTERNS: { intent: ScippyIntent; keywords: string[] }[] = [
  // —— 业务（优先长词）——
  { intent: 'query_alert', keywords: ['今天有什么异常', '告警', '异常', '警告', '有什么问题'] },
  {
    intent: 'query_supplier',
    keywords: ['供应商最近', '供应商绩效', '供应商', '绩效', '湛江中石化', '万华', '茂名石化'],
  },
  {
    intent: 'query_inventory',
    keywords: ['库存够用吗', '库存够', '缺货', '补货', '水位', '库存'],
  },
  {
    intent: 'query_order',
    keywords: ['我的订单', '订单状态', '到哪了', '追踪订单', '采购订单', '订单'],
  },
  {
    intent: 'query_logistics',
    keywords: ['帮我看下物流', '看下物流', '在途', '物流', '运输', '车辆'],
  },
  { intent: 'query_risk', keywords: ['最近有什么风险', '风险预警', '风险', '预警', '威胁'] },
  {
    intent: 'create_order',
    keywords: ['提交补货申请', '生成采购', '补货申请', '生成订单', '下订单', '帮我采购', '乙烯'],
  },
  {
    intent: 'analyze_data',
    keywords: ['查看今日数据', '今日数据', '分析数据', '分析', '趋势'],
  },
  { intent: 'identity', keywords: ['你是谁', '你叫什么', '你的名字', '介绍一下自己'] },
  { intent: 'capability', keywords: ['你能干什么', '你会什么', '能做什么', '帮我什么', '功能'] },
  { intent: 'thanks', keywords: ['多谢', '谢谢', '感谢'] },
  { intent: 'goodbye', keywords: ['下次见', '再见', '拜拜', '先这样'] },

  // —— 类别1 问候 ——
  {
    intent: 'morning_greeting',
    keywords: ['good morning', '早上好', '早晨', 'morning', '早呀', '早啊'],
  },
  {
    intent: 'evening_greeting',
    keywords: ['good evening', '晚上好', '晚安', 'evening'],
  },
  {
    intent: 'weekend_greeting',
    keywords: ['周末愉快', '周末好', '周六好', '周日好'],
  },
  {
    intent: 'holiday_greeting',
    keywords: ['新年快乐', '圣诞快乐', '中秋快乐', '国庆快乐', '节日快乐'],
  },
  { intent: 'greeting', keywords: ['你好', '哈喽', 'hello', '嗨', 'hi'] },

  // —— 类别2 情绪 ——
  { intent: 'feeling_tired', keywords: ['好累', '累了', '疲惫', '疲劳'] },
  { intent: 'feeling_stressed', keywords: ['好大压力', '焦虑', '压力', '紧张'] },
  { intent: 'feeling_sad', keywords: ['心情不好', '不开心', '难过', '伤心'] },
  { intent: 'feeling_bored', keywords: ['好闷', '没意思', '无聊'] },
  { intent: 'feeling_lucky', keywords: ['运气真好', '运气好', '幸运', '好事'] },
  { intent: 'feeling_annoyed', keywords: ['烦死了', '好烦', '烦躁'] },

  // —— 类别3 职场 ——
  { intent: 'work_efficiency', keywords: ['提高效率', '高效工作', '效率'] },
  {
    intent: 'supplier_negotiation',
    keywords: ['供应商谈判', '谈判', '砍价', '议价'],
  },
  { intent: 'team_collaboration', keywords: ['跨部门', '协作', '配合', '合作'] },
  {
    intent: 'emergency_response',
    keywords: ['应急预案', '突发', '应急', '应对'],
  },
  { intent: 'upward_reporting', keywords: ['向上汇报', '汇报', '报告'] },
  { intent: 'team_management', keywords: ['管理团队', '带团队', '领导力'] },
  {
    intent: 'conflict_resolution',
    keywords: ['怎么处理关系', '冲突', '矛盾', '吵架'],
  },

  // —— 类别4 知识 ——
  {
    intent: 'what_is_supply_chain',
    keywords: ['什么是供应链', '供应链定义', '供应链是'],
  },
  {
    intent: 'what_is_scor',
    keywords: ['供应链参考模型', 'SCOR模型', 'SCOR', 'scor'],
  },
  { intent: 'what_is_vmi', keywords: ['供应商管理库存', 'VMI', 'vmi'] },
  { intent: 'what_is_jit', keywords: ['准时生产', '准时制', 'JIT', 'jit'] },
  {
    intent: 'why_supply_chain_matters',
    keywords: ['供应链为什么重要', '供应链价值'],
  },
  {
    intent: 'supply_chain_resilience',
    keywords: ['供应链韧性', '韧性', '抗风险'],
  },
  { intent: 'what_is_esg', keywords: ['ESG', 'esg', '可持续', '社会责任'] },

  // —— 类别5 段子 ——
  { intent: 'tell_another_joke', keywords: ['再讲一个', '还有吗'] },
  {
    intent: 'supply_chain_joke',
    keywords: ['供应链段子', '供应链笑话'],
  },
  { intent: 'cold_joke', keywords: ['冷笑话', '好冷'] },
  { intent: 'daily_fortune', keywords: ['今日运势', '今天运气', '运势'] },
  { intent: 'tell_joke', keywords: ['讲个笑话', '讲笑话', '逗我笑', '搞笑', '笑话'] },

  // —— 类别6 生活 ——
  {
    intent: 'weather_inquiry',
    keywords: ['今天天气', '天气怎么样', '热不热', '冷不冷', '下雨', '天气'],
  },
  { intent: 'book_recommendation', keywords: ['推荐书', '读书', '看书', '书'] },
  { intent: 'learning_path', keywords: ['学习路径', '怎么学', '想学'] },
  {
    intent: 'food_recommendation',
    keywords: ['好吃的', '美食', '外卖', '吃什么'],
  },
  { intent: 'travel_planning', keywords: ['去哪玩', '旅游', '旅行', '度假'] },
  { intent: 'positive_energy', keywords: ['正能量', '鼓励', '加油'] },

  // —— 类别7 人设 ——
  {
    intent: 'scippy_color',
    keywords: ['你是什么颜色', '你什么颜色', '你蓝色', '颜色'],
  },
  {
    intent: 'scippy_relationship',
    keywords: ['男朋友', '女朋友', '恋爱', '结婚'],
  },
  { intent: 'scippy_eat', keywords: ['你吃饭', '你吃什么', '饿不饿'] },
  { intent: 'scippy_age', keywords: ['你多大', '几岁', '年龄', '生日'] },
  { intent: 'scippy_gender', keywords: ['男生还是女生', '男生', '女生', '性别'] },
  { intent: 'scippy_love', keywords: ['最喜欢', '喜欢什么', '爱好'] },
  { intent: 'scippy_hate', keywords: ['讨厌什么', '不喜欢', '烦什么'] },
  { intent: 'scippy_praise', keywords: ['你好厉害', '你厉害', '你真行', '你棒'] },
  { intent: 'scippy_silly', keywords: ['你傻不傻', '你傻', '傻子', '笨'] },
  {
    intent: 'scippy_love_question',
    keywords: ['你爱我吗', '爱我吗', '喜欢我吗'],
  },

  // —— 类别8 场景 ——
  {
    intent: 'news_inquiry',
    keywords: ['最近发生了什么', '有什么新消息', '新闻'],
  },
  { intent: 'give_advice', keywords: ['给个建议', '你觉得', '建议', '意见'] },
  { intent: 'feeling_hungry', keywords: ['我好饿', '好饿', '饿了', '饿'] },
  { intent: 'off_work', keywords: ['下班了', '回家了', '下班', '走了'] },
  { intent: 'weekend_plan', keywords: ['周末了', '周末', '周六', '周日', '双休'] },
  { intent: 'overtime_tired', keywords: ['加班好累', '加班累', '加班', '好累啊'] },
];

export function matchIntent(input: string): ScippyIntent {
  const text = input.trim().toLowerCase();
  if (!text) return 'unknown';

  let best: ScippyIntent = 'unknown';
  let bestScore = 0;

  for (const row of PATTERNS) {
    for (const kw of row.keywords) {
      if (text.includes(kw.toLowerCase())) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          best = row.intent;
        }
      }
    }
  }

  return best;
}

export function extractSupplierHint(input: string): string | null {
  const names = ['湛江中石化', '茂名石化', '万华化学', '华峰化学', '金发科技', 'BASF'];
  return names.find((n) => input.includes(n)) ?? null;
}

export function isEmotionIntent(intent: ScippyIntent): boolean {
  return EMOTION_INTENTS.includes(intent);
}
