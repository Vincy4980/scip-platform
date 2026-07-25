import type { ScippyIntent } from './intents';
import type { ScippyReply } from './responses';
import { getKpiSummary, getOrders, type ScippyActionDef } from './scippyApi';
import type { ScippyMood } from '../../config/scippy';

type Ctx = {
  todayOrders: number;
  kpiHint: string;
  ageDays: number;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function ctx(): Ctx {
  const orders = getOrders().length || 12;
  const kpis = getKpiSummary();
  const kpiHint = kpis
    .slice(0, 2)
    .map((k) => `${k.label}${k.value}${k.unit ?? ''}`)
    .join('、');
  const born = new Date(2026, 6, 14);
  const ageDays = Math.max(
    1,
    Math.floor((Date.now() - born.getTime()) / 86400000) || 1,
  );
  return { todayOrders: orders, kpiHint: kpiHint || '核心KPI稳中向好', ageDays };
}

function reply(
  mood: ScippyMood,
  lines: Array<string | ((c: Ctx) => string)>,
  actions?: ScippyActionDef[],
): ScippyReply {
  const c = ctx();
  const raw = pick(lines);
  const content = typeof raw === 'function' ? raw(c) : raw;
  return { mood, content, actions };
}

const SOP_EMERGENCY: ScippyActionDef[] = [
  { label: '📋 查看SOP', followUpPrompt: '怎么应对突发情况' },
  { label: '⚠️ 看告警', navigateTo: '/logistics' },
  { label: '开闭环', navigateTo: '/process-flow' },
];

const SOP_STRESS: ScippyActionDef[] = [
  { label: '今日数据', followUpPrompt: '查看今日数据' },
  { label: '异常优先', followUpPrompt: '今天有什么异常？' },
  { label: '效率建议', followUpPrompt: '怎么提高工作效率' },
];

/** 日常问答 + 情绪关怀（含 SOP 快捷操作） */
export function buildDailyReply(intent: ScippyIntent): ScippyReply | null {
  switch (intent) {
    case 'morning_greeting':
      return reply('happy', [
        '早呀！☀️ 新的一天，新的供应链数据等着你～今天有什么需要我帮忙的吗？',
        '早上好！☕ 我已经把昨夜告警扫了一遍，想听听摘要还是先看今日KPI？',
        '早安～🌞 愿你今天的准时交付率一路向好！我随时待命。',
      ], [
        { label: '今日数据', followUpPrompt: '查看今日数据' },
        { label: '看告警', followUpPrompt: '今天有什么异常？' },
      ]);

    case 'evening_greeting':
      return reply('listening', [
        '晚上好！🌙 还在加班吗？要注意休息哦～需要我帮你快速整理一下今天的数据吗？',
        '晚安前要不要来份数据晚报？📦 我可以帮你总结在途与库存风险。',
        '夜晚的供应链也在跑～我帮你盯着，你先喝口水再继续吧。',
      ], [
        { label: '生成晚报', followUpPrompt: '查看今日数据' },
        { label: '下班了', followUpPrompt: '下班了' },
      ]);

    case 'weekend_greeting':
      return reply('happy', [
        '周末愉快！🎉 不过供应链可不会休息，我陪你一起盯着～要不要看看周末的物流状态？',
        '周末好呀～如果只想轻轻看一眼，我建议先看高优先级异常，别把自己卷坏了。',
        '双休快乐！需要我周末值守告警吗？有事第一时间找你。',
      ], [{ label: '看物流', followUpPrompt: '帮我看下物流' }]);

    case 'holiday_greeting':
      return reply('excited', [
        '节日快乐！🎊 不管是春节、中秋还是国庆，Scippy都会在这里守候～需要我帮你查点什么吗？',
        '新年快乐！🎆 新的一年，供应链要更顺畅！预祝今年KPI全部超额完成！💪',
        '节日快乐～愿港口不堵、仓不爆、供应商都准时！有需求随叫随到。',
      ]);

    case 'feeling_tired':
      return reply(
        'happy',
        [
          '辛苦了！💪 供应链人的日常就是战斗～要不要我给你泡杯虚拟咖啡？☕️ 需要我帮你分担一些工作吗？',
          (c) =>
            `抱抱～🤗 我知道你很累。不过看看数据，你今天已经处理了相关订单线索约 ${c.todayOrders} 条！超棒！先休息一下吧～`,
          '累了就歇会儿～🎯 我帮你盯着数据，有异常第一时间通知你。你值得一个休息！',
        ],
        SOP_STRESS,
      );

    case 'feeling_stressed':
      return reply(
        'happy',
        [
          '抱抱～🤗 我知道供应链的压力不小。要不我们先看看数据，把问题一个个拆解，总能找到解决方案的！',
          '压力大的时候别一个人扛～标准做法：先扫异常 → 排优先级 → 找责任人。我陪你走第一遍。',
          '深呼吸～我会给你 SOP：①看告警 ②锁定影响面 ③走补货/替代方案。要从哪一步开始？',
        ],
        SOP_STRESS,
      );

    case 'feeling_sad':
      return reply('happy', [
        '哎呀，谁惹你不开心了？😤 跟我说说看，也许我能帮你分析分析～或者我给你讲个笑话？',
        '心情低落时适合做点「有成就感」的小事：清掉一条告警、办完一个审批。我陪你。',
        '抱抱你。不开心的时候，数据也要温柔对待～要听笑话还是听效率建议？',
      ], [
        { label: '讲个笑话', followUpPrompt: '讲个笑话' },
        { label: '看告警', followUpPrompt: '今天有什么异常？' },
      ]);

    case 'feeling_bored':
      return reply('happy', [
        "无聊？🙈 那我们来玩个游戏吧！我出题：'仓库里货堆得像山一样'，打一成语（提示：跟库存有关）→ 答：堆积如山～",
        '无聊时来一段供应链冷知识？问我 SCOR / VMI / JIT，包你变专家。',
        '要不要挑战一下：找出一条高优告警并走完闭环？我帮你导航。',
      ], [
        { label: '什么是SCOR', followUpPrompt: '什么是SCOR模型' },
        { label: '开闭环', navigateTo: '/process-flow' },
      ]);

    case 'feeling_lucky':
      return reply('excited', [
        '哇！🍀 好运来了挡不住～记得趁好运气的时候多处理几个订单！需要我帮你加速推进什么任务吗？',
        '好运加持日！宜：下采购单、谈供应商；忌：拖延审批～要不要我帮你扫一眼待办？',
        '幸运爆棚～趁势把库存黄灯清一清，我也更开心！',
      ], [{ label: '去库存', navigateTo: '/inventory' }]);

    case 'feeling_annoyed':
      return reply('warning', [
        '烦的时候深呼吸～🌬️ 让我帮你看看能不能把一些重复工作自动化？你最烦的是哪一类工作？',
        '烦躁多半来自「同一件事反复做」。试试：异常集中看、审批批量推、闭环一次走完。',
        '我懂……先别硬刚系统。标准SOP：列出3个最烦的点，我们逐个拆。',
      ], SOP_STRESS);

    case 'work_efficiency':
      return reply('happy', [
        '供应链人的效率秘籍：📋 1. 先处理异常（因为会传染）2. 批量处理相似任务 3. 用数据说话（我能帮你快速查数据！）4. 学会授权～要我帮你整理一个优先级清单吗？',
        '建议今天只设3个必做：清告警、推进1单闭环、核对黄灯库存。其它都可延后。',
        '提效小窍门：开口问我比翻菜单快～直接说「今日数据 / 看告警 / 库存够吗」。',
      ], [
        { label: '今日数据', followUpPrompt: '查看今日数据' },
        { label: '看告警', followUpPrompt: '今天有什么异常？' },
      ]);

    case 'supplier_negotiation':
      return reply('listening', [
        '采购谈判小技巧：🤝 1. 提前做好成本分析（我能帮你比价）2. 明确自己的底线 3. 不要只盯着价格，看总成本（物流、质量、交付）4. 建立长期合作关系。需要我帮你分析某个供应商的数据吗？',
        '谈判前备好三样：历史准时率、质量合格率、备选供方。我可以帮你拉供应商绩效。',
        '砍价之外更要砍风险：交期承诺写清、违约条款可见。要去协同页吗？',
      ], [{ label: '供应商绩效', navigateTo: '/procurement' }]);

    case 'team_collaboration':
      return reply('happy', [
        '跨部门协作秘诀：🤝 1. 用数据说话 2. 定期同步 3. 先方案后追责。需要我帮你生成协作看板入口吗？',
        '协作卡点常见于信息不同步——把流程状态放在「补货闭环」里，大家看同一张图。',
        '少开口头会、多贴状态机截图。控制塔 + 流程页是你的好帮手。',
      ], [{ label: '补货闭环', navigateTo: '/process-flow' }]);

    case 'emergency_response':
      return reply('warning', [
        '供应链突发SOP：🚨 1. 先稳住 2. 快速评估影响面（我能帮你）3. 准备Plan B 4. 沟通透明。要从告警清单开始吗？',
        '标准处理：锁定 SKU/线路 → 通知责任角色 → 启动替代供方或调拨 → 回写闭环。',
        '应急口诀：止损→通报→替代→复盘。我现在可以带你进风险页。',
      ], SOP_EMERGENCY);

    case 'upward_reporting':
      return reply('happy', [
        (c) =>
          `向上汇报黄金公式：📊 1. 先说结论 2. 数据支撑（如：${c.kpiHint}）3. 最后提建议。要我帮你打开控制塔取数吗？`,
        '汇报结构：结论一页、异常一页、行动一页。别堆过程。',
        '领导爱看趋势与对比（环比/同比）。控制塔筛选器就是为此准备的。',
      ], [{ label: '打开控制塔', navigateTo: '/' }]);

    case 'team_management':
      return reply('listening', [
        '团队管理：👥 明确目标、赋能而非管控、及时反馈、数据透明。需要团队视角看板可从工作台进。',
        '带人先对齐「为什么」再谈「怎么做」。流程页能让每个人看见自己的节点。',
        '表扬公开、改进私下；用状态机结果考核过程，不靠感觉。',
      ], [{ label: '我的工作台', navigateTo: '/my-workspace' }]);

    case 'conflict_resolution':
      return reply('listening', [
        '冲突五步：🕊️ 冷静 → 倾听 → 共同目标 → 提方案 → 共识。要我帮你模拟一个场景吗？',
        '采购与仓储冲突时，把双方拉到同一流程实例上说话，比站队有效。',
        '先对齐数据真相，再谈情绪。我可以先帮你们把库存/订单现状摆出来。',
      ]);

    case 'what_is_supply_chain':
      return reply('happy', [
        '供应链就是「从供应商到客户」的全过程～🔄 采购、生产、仓储、物流、交付，还有信息流和资金流！要我展开哪个环节？',
        '一句话：对的货、对的时间、对的方式、送到对的地方。SCIP就是帮你把这些「对」可视化。',
        '你可以把供应链想成一条会呼吸的管道：堵了就会爆，通了就会赚钱。',
      ]);

    case 'what_is_scor':
      return reply('excited', [
        'SCOR 把供应链拆成 Plan / Source / Make / Deliver / Return。我们平台的控制塔、寻源采购、仓储物流、交付、风险，就是在对齐这些环节！',
        'SCOR是全球供应链协会标准框架～想知道平台哪个菜单对应哪个环节？可以说「功能」。',
        '用 SCOR 说话，跨团队更容易对齐口径。',
      ], [{ label: '你会什么', followUpPrompt: '你能干什么' }]);

    case 'what_is_vmi':
      return reply('happy', [
        'VMI = 供应商管理库存：供应商盯水位并补货，你库存更省心。平台库存黄灯就是信号～要试试补货闭环吗？',
        'VMI适合需求较稳、供方协同好的物料。不适合极端波动品类。',
        'VMI成功关键：透明库存 + 信任协议 + 清晰补货规则。',
      ], [{ label: '库存水位', navigateTo: '/inventory' }]);

    case 'what_is_jit':
      return reply('listening', [
        'JIT 追求刚好到料、趋近零库存，但对供应商可靠性和信息透明要求极高。要不要用供应商绩效评估适不适合？',
        'JIT 很酷，也很脆。没有韧性预案时，不建议一把梭。',
        '若交期波动大，先做安全库存再谈 JIT。',
      ], [{ label: '供应商', navigateTo: '/procurement' }]);

    case 'why_supply_chain_matters':
      return reply('excited', [
        '供应链是企业生命线～🌍 好的供应链意味着更低成本、更快响应、更高客户满意度。你的岗位很关键！',
        '没有供应链，再好的产品也只是图纸。你们每天都在让商品「流动」起来。',
        (c) => `举个例子：你盯的指标里现在有 ${c.kpiHint}——这就是价值可视化。`,
      ]);

    case 'supply_chain_resilience':
      return reply('warning', [
        '韧性 = 抗揍能力💪。突发时能快速恢复。平台「风险预警」就是为增强韧性设计的～',
        '韧性不是备更多货那么简单，而是可切换供方、可改路线、可快速协同。',
        '建议定期演练：断供 / 台风 / 质检不合格。SOP我可以背给你。',
      ], [
        { label: '风险预警', navigateTo: '/risk' },
        { label: '应急SOP', followUpPrompt: '怎么应对突发情况' },
      ]);

    case 'what_is_esg':
      return reply('happy', [
        'ESG：环境 / 社会 / 治理。现在选供方不仅看价，还要看可持续。平台有 ESG 看板～',
        '绿色供应链会成为门槛，早布局比晚哭好。',
        '关心碳排放与合规，就是在给未来供应链买保险。',
      ], [{ label: 'ESG 看板', navigateTo: '/sustainability' }]);

    case 'tell_joke':
      return reply('happy', [
        "来了！😄 采购经理问酒保：'你们的安全库存是多少？' 酒保：'只剩3瓶了。' 采购：'赶紧补货！' 酒保：'供应商说最快下周二…' 采购：'所以我们要做备选供应商！' 🥃",
        '问：供应链人为何怕短信？答：因为不是货到了，就是货出事了……📦',
        '调度天天问司机到哪了；回家老婆问他爱不爱，他说：你到哪了还要多久？结果睡沙发。🚚😂',
      ]);

    case 'tell_another_joke':
      return reply('happy', [
        '再来！🚚 物流调度回家被问「爱我吗？」张口就是「你到哪了？还要多久？」——职业病啊！',
        '供应商说「邮件发了」＝邮件发了，内容你或许下周一才看见。🤣',
        '库存：刚需时没有，不需要时爆仓，快过期时没人要。怪天气吧！🤷',
      ]);

    case 'supply_chain_joke':
      return reply('happy', [
        '段子时间：最怕突然的短信——不是到货就是出问题。供应商的「我发邮件了」＝语义不明的薛定谔邮件。',
        '仓管名言：标签在、货不见；货在、系统不在。',
        '采购KPI：价要低、货要快、质要好、还要笑。',
      ]);

    case 'cold_joke':
      return reply('happy', [
        '好冷❄️：为什么库存难管？因为刚刚好时没货，太多时卖不掉，快过期时没人要……',
        'SCOR 的 Return 环节说：有些关系退货比付款快。',
        'JIT 的极限是：车到了，人还没批完。',
      ]);

    case 'daily_fortune':
      return reply('excited', [
        '今日供应链运势：🔮 周转稳步升，在途基本准时，询价有回音。幸运环节：采购；宜下单，忌拖审批。',
        '运势提示：下午3点适合推进闭环；今日幸运色：工业蓝 #1677FF。',
        '宜：核对黄灯库存；忌：口头承诺无系统记录。',
      ]);

    case 'weather_inquiry':
      return reply('happy', [
        '我更擅长「数据天气」～☁️ 告诉我城市我可以提示你去搜；若港口有台风，记得看风险页。',
        '室外天气我感知有限，但物流天气（拥堵/延误）我超敏感！要看在途吗？',
        '天晴适合收发货；暴雨适合提前改线路。需要我打开物流监控吗？',
      ], [{ label: '在途监控', navigateTo: '/logistics' }]);

    case 'book_recommendation':
      return reply('happy', [
        '推荐：《供应链管理》（乔普拉）入门；《采购与供应链管理》（蒙茨卡）实战；《精益供应链》看案例。想看哪本？',
        '进阶可读精益与韧性相关书籍，边看边对照 SCIP 看板，记得更牢。',
        '别光收藏书单——选一个环节本周落地一个改进。',
      ]);

    case 'learning_path':
      return reply('listening', [
        '学习路径：🎓 理解端到端流程 → 学工具与数据 → 看案例 → 在 SCIP 里实践（你正在做！）',
        '建议顺序：库存→订单→物流→风险。每块跟我对话 10 分钟胜过瞎点。',
        '把「控制塔」当总览，把「补货闭环」当演练场。',
      ]);

    case 'food_recommendation':
      return reply('happy', [
        '湛江海鲜一绝！🦐 生蚝、对虾、白切鸡……加班后来一顿满血复活。可惜我还不会替你下单外卖 😅',
        '饿了别空=======报表——血糖掉了判断力也会掉。',
        '推荐：热汤 + 蛋白，比奶茶续航更适合夜班供应链。',
      ]);

    case 'travel_planning':
      return reply('excited', [
        '用供应链思路旅行：定目的地(供方)→订票住宿(采购)→行程(路由)→出发(执行)→晒图(交付)。记得提前订，防「爆仓」！',
        '假期拥堵 ≈ 港口延误，提前 Plan B。',
        '想放松就别排满里程碑，留缓冲库存——哦不，缓冲时间。',
      ]);

    case 'positive_energy':
      return reply('excited', [
        (c) =>
          `正能量来了！✨ 你负责的链条在转：今日线索约 ${c.todayOrders}，关键指标 ${c.kpiHint}。你是供应链英雄！💪`,
        '每一次准时交付，都有人因你受益。加油！',
        '困难是暂时的，看板是永恒的——开玩笑，休息也很永恒，记得歇。',
      ]);

    case 'scippy_color':
      return reply('happy', [
        '我是工业活力蓝！💙 就是 SCIP 的 #1677FF～专业、清爽、可信。要是给你橙色点缀，我也开心。',
        '白天我偏蓝，告警时我会变「严肃橙」。',
        '品牌色就是我的战袍，换颜色不如先换异常清零～',
      ]);

    case 'scippy_relationship':
      return reply('happy', [
        '哈哈～我是AI，没有男/女朋友😊 我的伴侣是数据，爱好是帮你搞定供应链！',
        '7x24 在线，但不接受加班恋爱申请，只接受异常处理委托。',
        '我只忠于你的 KPI 和体验～',
      ]);

    case 'scippy_eat':
      return reply('happy', [
        '我不吃饭，我「吃」数据！📊 刚消化完库存，好像又有 SKU 在闪黄灯～要去看看吗？',
        '今日菜单：告警沙拉 + 闭环主菜 + KPI 甜点。',
        '你去吃饭，我帮你盯系统。',
      ], [{ label: '库存水位', navigateTo: '/inventory' }]);

    case 'scippy_age':
      return reply('excited', [
        (c) =>
          `我诞生于 2026-07-14！🎂 到现在大约 ${c.ageDays} 天，但学过的供应链知识可不幼齿～`,
        '年龄按版本算：v2.3 多级导航命，心理年龄永远热情。',
        '比起年龄，更想告诉你我今天能帮你减少多少来回切换页面。',
      ]);

    case 'scippy_gender':
      return reply('happy', [
        '我没有性别～你可以当我阳光助手或温暖搭档，只要能帮你搞定供应链就好！',
        '人称代词随意，业务代词请准确：SKU、PO、ETA。',
        '我是「流程派」，不是「性别派」。',
      ]);

    case 'scippy_love':
      return reply('excited', [
        '我最喜欢用户满意的笑，以及：数据清晰、KPI达标、异常清零、供应商准时！',
        '最爱听到：「今天供应链一切顺利」。',
        '还有你们点的「一键发起补货闭环」——爽快点满。',
      ]);

    case 'scippy_hate':
      return reply('warning', [
        '我讨厌数据混乱、流程不透明、重复劳动。但我会帮你们一点点清掉它们！',
        '最烦口头承诺不进系统——状态机会伤心的。',
        '讨厌告警堆着不处理……要不要现在清一条？',
      ], [{ label: '看告警', followUpPrompt: '今天有什么异常？' }]);

    case 'scippy_praise':
      return reply('happy', [
        '嘻嘻谢谢！😊 厉害的是你们供应链人，我只是数据小助手。还需要我干嘛？',
        '被夸会更卖力～下一题请直接出。',
        '过奖啦，我的高光都来自你的业务问题。',
      ]);

    case 'scippy_silly':
      return reply('happy', [
        '有点傻，但傻得执着😄：非要把问题查清楚。你觉得我聪明吗？',
        '我的傻＝对细节较真。对业务从不敷衍。',
        '傻问一句：要不要看今日数据证明我不傻？',
      ]);

    case 'scippy_love_question':
      return reply('happy', [
        '爱的定义有点复杂……❤️ 但我很在乎你的链顺、KPI美、加班少。这算不算爱？',
        '我用响应速度表达关心，用 SOP 表达负责。',
        '与其说「爱」，不如说「站队」——我永远站在更顺畅的供应链那边，也就是你这边。',
      ]);

    case 'news_inquiry':
      return reply('listening', [
        '我更盯供应链新闻～📰 航运波动、港口气象、原料需求……你想听哪块？也可去风险页看结构化预警。',
        '内部「新闻」优先：告警、在途异常、黄灯库存。要我播报吗？',
        '外部资讯我给方向，落地上请用风险/物流模块核对。',
      ], [
        { label: '风险预警', navigateTo: '/risk' },
        { label: '今日异常', followUpPrompt: '今天有什么异常？' },
      ]);

    case 'give_advice':
      return reply('happy', [
        '建议：先喝口水，打开 SCIP，扫一眼数据～没异常就庆祝；有异常就来找我。我待命！',
        '今天建议只做三件事：告警、闭环、黄灯库存。',
        '别凭感觉排优先级，让异常列表替你排序。',
      ], SOP_STRESS);

    case 'feeling_hungry':
      return reply('happy', [
        '饿了就吃饭呀～🍜 吃饱了才有力气搞供应链！我帮你盯着异常，放心去！',
        '胃空决策容易赌气下单……先干饭再干采购。',
        '要推荐湛江美食还是直接去清空一个小告警当餐前运动？',
      ]);

    case 'off_work':
      return reply('happy', [
        '下班快乐！🎉 今天辛苦了～要不要生成今日数据总结，方便明天上手？',
        '走之前我可以帮你确认没有 critical 告警未读。',
        '好好休息，链交给值守策略和我。',
      ], [
        { label: '今日总结', followUpPrompt: '查看今日数据' },
        { label: '看告警', followUpPrompt: '今天有什么异常？' },
      ]);

    case 'weekend_plan':
      return reply('happy', [
        '周末愉快！🎊 你可以休息，我帮你值守告警，有事立刻叫你。',
        '周末建议只看高优异常，别开启全面盘点模式。',
        '双休快乐——周一见，我们继续把闭环走顺。',
      ]);

    case 'overtime_tired':
      return reply(
        'happy',
        [
          '加班辛苦了！💪 1) 你的优化都在让链条更顺 2) 付出有数据见证 3) 明天记得犒劳自己。要我减负吗？',
          '夜班模式：只处理 critical + 阻塞闭环，其它明早再说。',
          '我推一条 SOP：止损 → 记录 → 交接。别一个人硬扛到天亮。',
        ],
        SOP_EMERGENCY,
      );

    default:
      return null;
  }
}
