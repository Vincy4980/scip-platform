import type { ScippyIntent } from './intents';
import { extractSupplierHint, isEmotionIntent } from './intents';
import { buildDailyReply } from './dailyResponses';
import {
  getInventorySummary,
  getKpiSummary,
  getLogisticsStatus,
  getOrders,
  getPendingAlerts,
  getRiskDigest,
  getSuppliers,
  type ScippyActionDef,
} from './scippyApi';
import type { ScippyMood } from '../../config/scippy';
import { pickScippyPhrase, scippyDataOpeningPhrases, scippyIdentityPhrases } from '../../config/scippy';

export interface ScippyReply {
  content: string;
  mood: ScippyMood;
  actions?: ScippyActionDef[];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function buildReply(intent: ScippyIntent, input: string): ScippyReply {
  const daily = buildDailyReply(intent);
  if (daily) {
    if (isEmotionIntent(intent)) {
      return {
        ...daily,
        content: `${daily.content}\n\n💚 情感感知：我听到你的状态了。若工作堵塞，可按 SOP：异常清点 → 影响评估 → 闭环推进。`,
      };
    }
    return daily;
  }

  switch (intent) {
    case 'greeting':
      return {
        mood: 'happy',
        content: pick([
          '你好呀～我是Scippy！今天天气不错，适合处理供应链数据哦 ☀️',
          '嗨嗨～Scippy在这儿！有订单、库存、物流问题尽管丢给我 😊',
          '嘿！我是Scippy，你的供应链小助手～有啥直接说！',
        ]),
      };

    case 'identity':
      return {
        mood: 'excited',
        content: pickScippyPhrase(scippyIdentityPhrases),
      };

    case 'capability':
      return {
        mood: 'happy',
        content:
          '我能帮你查数据、找问题、做分析、推建议，还能聊天解压、讲供应链冷知识！你想试哪个？',
        actions: [
          { label: '查库存', followUpPrompt: '库存够用吗？' },
          { label: '看物流', followUpPrompt: '帮我看下物流' },
          { label: '讲个笑话', followUpPrompt: '讲个笑话' },
        ],
      };

    case 'thanks':
      return {
        mood: 'happy',
        content: pick([
          '不客气～能帮到你就好！😊 有需要再叫我！',
          '不辛苦不辛苦～看到供应链顺畅运行我就开心！🚀',
        ]),
      };

    case 'goodbye':
      return {
        mood: 'happy',
        content: '拜拜～下次供应链卡住了记得叫我！✨',
      };

    case 'query_alert': {
      const list = getPendingAlerts().slice(0, 3);
      const lines = list
        .map(
          (a) =>
            `- ${a.shipmentId ?? a.id} ${a.type}（${a.level === 'critical' ? '高' : a.level === 'warning' ? '中' : '低'}）`,
        )
        .join('\n');
      return {
        mood: 'warning',
        content: `目前有 ${list.length} 条待处理告警：\n${lines || '- 暂无待处理'}\n\n📋 标准SOP：1.确认影响范围 2.通知责任人 3.启动替代/闭环 4.回写结果。`,
        actions: [
          { label: '查看详情', navigateTo: '/logistics', icon: '🔎' },
          { label: '应急SOP', followUpPrompt: '怎么应对突发情况' },
          { label: '开闭环', navigateTo: '/process-flow', icon: '✅' },
        ],
      };
    }

    case 'query_supplier': {
      const hint = extractSupplierHint(input);
      const list = getSuppliers();
      const s =
        list.find((x) => (hint ? x.name.includes(hint.replace('化学', '')) : false)) ??
        list.find((x) => x.name.includes('湛江') || x.name.includes('中石化')) ??
        list[0]!;
      return {
        mood: 'success',
        content: `供应商：${s.name}\n📊 准时交付率：${s.onTimeRate}% ↑\n📊 质量合格率：${s.qualityRate}%\n📊 响应时效：${s.responseHours}h\n📈 综合评级：${s.risk === 'normal' ? 'A（优秀）' : s.risk === 'attention' ? 'B（关注）' : 'C（改善）'}\n\n近3月趋势稳中有升，建议保持！`,
        actions: [
          { label: '查看详情', navigateTo: '/procurement' },
          { label: '谈判建议', followUpPrompt: '怎么跟供应商谈判' },
        ],
      };
    }

    case 'query_inventory': {
      const inv = getInventorySummary();
      const adv = inv.advice
        .map((a) => `- ${a.name}（${a.warehouse}）建议补 ${a.suggestQty}`)
        .join('\n');
      return {
        mood: inv.red.length ? 'warning' : 'happy',
        content: `当前库存总量：${inv.total.toLocaleString()}（演示汇总）\n⚠️ 低库存SKU：${inv.yellow}个（黄灯）\n🔴 缺货SKU：${inv.red.length}个（红灯）\n\n🔴 紧急补货建议：\n${adv || '- 暂无高优补货'}\n\n📋 库存SOP：黄/红灯 → 一键发起补货闭环 → 跟踪审批到入库。`,
        actions: [
          { label: '查看详情', navigateTo: '/inventory' },
          {
            label: '一键补货',
            navigateTo: '/inventory',
            followUpPrompt: '帮我生成乙烯的补货',
          },
          { label: '闭环跟踪', navigateTo: '/process-flow' },
        ],
      };
    }

    case 'query_order': {
      const orders = getOrders().slice(0, 3);
      const lines = orders
        .map((o) => `🚚 ${o.id} ${o.status}（预计 ${o.eta}）`)
        .join('\n');
      return {
        mood: 'listening',
        content: `您有若干在途/在办订单：\n${lines}\n...\n需要我追踪哪一个？`,
        actions: [
          { label: '查看全部', navigateTo: '/orders' },
          { label: '追踪详情', navigateTo: '/logistics' },
        ],
      };
    }

    case 'query_logistics': {
      const log = getLogisticsStatus();
      return {
        mood: log.urgent ? 'warning' : 'happy',
        content: `当前在途车辆：${log.total}辆\n🟢 正常运行：${log.normal}辆\n🟡 轻微异常：${log.mild}辆\n🔴 紧急异常：${log.urgent}辆\n\n${
          log.top
            ? `🔴 紧急：${log.top.vehicle} ${log.top.status}\n📋 SOP：联系司机 → 确认位置 → 评估延误 → 通知客户/改派。`
            : '整体平稳～'
        }`,
        actions: [
          { label: '查看地图', navigateTo: '/logistics' },
          { label: '应急SOP', followUpPrompt: '怎么应对突发情况' },
        ],
      };
    }

    case 'query_risk': {
      const r = getRiskDigest();
      const sLines = r.suppliers
        .map((s) => `- ${s.name}（${s.level}）：${s.factors.join('、')}`)
        .join('\n');
      const gLines = r.geo.map((g) => `- ${g.region}：${g.title}`).join('\n');
      return {
        mood: 'warning',
        content: `🔔 风险预警：\n${sLines}\n${gLines}\n\n📋 风险SOP：识别 → 分级 → 备选供方/路线 → 复盘韧性。`,
        actions: [
          { label: '查看详情', navigateTo: '/risk' },
          { label: '韧性是什么', followUpPrompt: '什么是供应链韧性' },
        ],
      };
    }

    case 'create_order': {
      if (input.includes('提交') || input.includes('生成乙烯')) {
        return {
          mood: 'success',
          content:
            '✅ 补货申请已提交！订单号：PO-2026-0160\n预计采购经理将在2小时内审批。建议打开「补货闭环」跟踪状态机。',
          actions: [
            { label: '闭环跟踪', navigateTo: '/process-flow' },
            { label: '查看订单', navigateTo: '/orders' },
          ],
        };
      }
      if (input.includes('乙烯') || input.includes('补货')) {
        return {
          mood: 'excited',
          content:
            '好的！已为您生成乙烯补货申请：\n- 物料：乙烯\n- 建议补货量：500吨\n- 推荐供应商：湛江中石化\n- 预计到货：7-10天\n是否提交审批？',
          actions: [
            { label: '提交', followUpPrompt: '提交补货申请' },
            { label: '去库存发起', navigateTo: '/inventory' },
          ],
        };
      }
      return {
        mood: 'listening',
        content:
          "好的！请告诉我：供应商、物料数量、期望到货日；或说'帮我采购500吨乙烯'。也可以去库存页一键发起闭环。",
        actions: [
          { label: '库存一键闭环', navigateTo: '/inventory' },
          { label: '示例：采购乙烯', followUpPrompt: '帮我采购500吨乙烯' },
        ],
      };
    }

    case 'analyze_data': {
      const kpis = getKpiSummary();
      const lines = kpis
        .map((k) => `- ${k.label}：**${k.value}${k.unit ?? ''}**`)
        .join('\n');
      return {
        mood: 'success',
        content: `${pickScippyPhrase(scippyDataOpeningPhrases)}\n${lines}\n\n需要深入某一项吗？`,
        actions: [
          { label: '打开控制塔', navigateTo: '/' },
          { label: '看告警', followUpPrompt: '今天有什么异常？' },
        ],
      };
    }

    default:
      return {
        mood: 'happy',
        content:
          '唔...这个我可以试着聊，或帮你干正事 😅\n你可以：查库存/订单/物流、问 SCOR/VMI、讲笑话、吐槽加班～\n想试试哪个？',
        actions: [
          { label: '查数据', followUpPrompt: '查看今日数据' },
          { label: '讲笑话', followUpPrompt: '讲个笑话' },
          { label: '看告警', followUpPrompt: '今天有什么异常？' },
        ],
      };
  }
}

/** 多轮简单上下文：库存列明细 / 补货确认 */
export function buildContextualReply(
  input: string,
  lastIntent: ScippyIntent | null,
): ScippyReply | null {
  const text = input.trim();
  if (
    lastIntent === 'query_inventory' &&
    (text.includes('列') || text === '嗯' || text.includes('具体'))
  ) {
    const inv = getInventorySummary();
    const red = inv.red.map((i) => `${i.name}（${i.warehouse}）`).join('、');
    return {
      mood: 'listening',
      content: `🔴 缺货SKU（${inv.red.length}个）：${red || '无'}\n🟡 低库存SKU（${inv.yellow}个）已标记黄灯。\n需要我帮你生成补货申请吗？`,
      actions: [
        { label: '生成乙烯补货', followUpPrompt: '帮我生成乙烯的补货' },
        { label: '去库存页', navigateTo: '/inventory' },
      ],
    };
  }
  if (text.includes('提交') && lastIntent === 'create_order') {
    return buildReply('create_order', '提交补货申请');
  }
  return null;
}
