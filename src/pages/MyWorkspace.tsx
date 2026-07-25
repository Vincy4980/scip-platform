import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  alerts,
  inventoryItems,
  kpiData,
  replenishmentAdvice,
  shipments,
  suppliers,
} from '../mock/data';
import { customerComplaints, customerOrders } from '../mock/delivery';
import { purchaseOrders } from '../mock/purchaseOrders';
import { towerWarnings } from '../mock/controlTower';
import { useAuthStore } from '../store/useAuthStore';
import { useFlowStore } from '../store/useFlowStore';
import { Modules, ROLE_LABELS, UserRole } from '../types/user';
import { filterDataByRole } from '../utils/permission';

const QUICK_LINKS = [
  { to: '/', label: '控制塔看板', desc: '端到端 KPI' },
  { to: '/process-flow', label: '补货闭环', desc: '状态机跟踪' },
  { to: '/inventory', label: '库存水位', desc: '黄红灯补货' },
  { to: '/orders', label: '采购订单', desc: '全生命周期' },
  { to: '/logistics', label: '在途监控', desc: '异常地图' },
  { to: '/ai', label: 'Scippy 对话台', desc: '统一助手' },
];

export default function MyWorkspace() {
  const user = useAuthStore((s) => s.currentUser);
  const flows = useFlowStore((s) => s.instances);

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
        请先登录
      </div>
    );
  }

  const pendingAlerts = alerts.filter((a) => a.status === 'pending').length;
  const openFlows = flows.filter((f) => f.status !== '已入库').length;
  const todayTasks = pendingAlerts + openFlows + replenishmentAdvice.filter((a) => a.urgency === 'high').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#1D2939]">我的工作台</h2>
          <p className="mt-1 text-sm text-[#667085]">
            {user.name} · {ROLE_LABELS[user.role]} · {user.department}
          </p>
        </div>
        <div className="rounded-xl bg-[#E8F3FF] px-3 py-1.5 text-xs font-medium text-[#1677FF]">
          今日待办约 {todayTasks} 项
        </div>
      </div>

      {/* 通用：今日待办 / 快捷入口 / 闭环看板 */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="待处理告警" value={pendingAlerts} tone="warn" to="/logistics" />
        <StatCard label="在途闭环" value={openFlows} tone="blue" to="/process-flow" />
        <StatCard
          label="高优补货建议"
          value={replenishmentAdvice.filter((a) => a.urgency === 'high').length}
          tone="orange"
          to="/inventory"
        />
        <StatCard
          label="红灯库存 SKU"
          value={inventoryItems.filter((i) => i.status === 'red').length}
          tone="red"
          to="/inventory"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel title="今日待办清单" className="lg:col-span-2">
          <ul className="space-y-2 text-sm">
            {alerts
              .filter((a) => a.status === 'pending')
              .slice(0, 3)
              .map((a) => (
                <TodoRow
                  key={a.id}
                  tag="告警"
                  title={a.title}
                  meta={a.level}
                  to="/logistics"
                />
              ))}
            {flows
              .filter((f) => f.status === '待审批' || f.status === '已到货')
              .slice(0, 3)
              .map((f) => (
                <TodoRow
                  key={f.id}
                  tag="闭环"
                  title={`${f.materialName} · ${f.status}`}
                  meta={f.poId}
                  to="/process-flow"
                />
              ))}
            {replenishmentAdvice
              .filter((a) => a.urgency === 'high')
              .slice(0, 2)
              .map((a) => (
                <TodoRow
                  key={a.id}
                  tag="补货"
                  title={`${a.name} 建议补 ${a.suggestQty}`}
                  meta={a.warehouse}
                  to="/inventory"
                />
              ))}
          </ul>
        </Panel>
        <Panel title="快捷入口">
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-xl border border-[#E4E7EC] bg-[#F7FBFF] px-2.5 py-2 hover:border-[#1677FF]"
              >
                <div className="text-xs font-semibold text-[#1D2939]">{l.label}</div>
                <div className="text-[10px] text-[#667085]">{l.desc}</div>
              </Link>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="补货闭环看板">
          <div className="mb-2 flex flex-wrap gap-2 text-[11px]">
            {(['草稿', '待审批', '已下单', '已发货', '已到货', '已入库'] as const).map((s) => (
              <span
                key={s}
                className="rounded-full bg-[#F2F4F7] px-2 py-0.5 text-[#667085]"
              >
                {s} {flows.filter((f) => f.status === s).length}
              </span>
            ))}
          </div>
          <ul className="max-h-48 space-y-2 overflow-auto text-sm">
            {flows.slice(0, 6).map((f) => (
              <li
                key={f.id}
                className="flex justify-between gap-2 rounded-lg bg-[#F2F4F7] px-3 py-2"
              >
                <span className="truncate text-[#1D2939]">
                  {f.materialName} · {f.qty}t
                </span>
                <span className="shrink-0 text-xs text-[#1677FF]">{f.status}</span>
              </li>
            ))}
          </ul>
          <Link to="/process-flow" className="mt-3 inline-block text-xs text-[#1677FF]">
            打开流程跟踪 →
          </Link>
        </Panel>
        <Panel title="本周日程（演示）">
          <ul className="space-y-2 text-sm">
            {[
              { d: '周一', t: '供应商季度评审' },
              { d: '周三', t: '湛江仓安全库存复盘' },
              { d: '周四', t: '在途异常专项会' },
              { d: '周五', t: '闭环延误案例复盘' },
            ].map((x) => (
              <li
                key={x.d}
                className="flex items-center gap-3 rounded-lg border border-[#E4E7EC] px-3 py-2"
              >
                <span className="w-10 text-xs font-semibold text-[#1677FF]">{x.d}</span>
                <span className="text-[#1D2939]">{x.t}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* 角色专属看板 */}
      <h3 className="text-sm font-semibold text-[#1D2939]">角色专属看板</h3>
      {user.role === UserRole.CONTROL_TOWER_DIRECTOR && <DirectorBoard />}
      {user.role === UserRole.PROCUREMENT_MANAGER && (
        <ProcurementBoard employeeId={user.employeeId} />
      )}
      {user.role === UserRole.LOGISTICS_SUPERVISOR && <LogisticsBoard />}
      {user.role === UserRole.CUSTOMER_SERVICE && <CsBoard />}
    </div>
  );
}

function DirectorBoard() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((k) => (
          <div
            key={k.key}
            className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm"
          >
            <div className="text-sm text-[#667085]">{k.label}</div>
            <div className="mt-2 text-2xl font-semibold text-[#1D2939]">
              {k.value}
              {k.unit}
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="全平台预警汇总">
          <ul className="space-y-2 text-sm">
            {towerWarnings.slice(0, 6).map((w) => (
              <li key={w.id} className="rounded-lg bg-[#F2F4F7] px-3 py-2">
                <span className="text-xs text-[#FF7D29]">{w.severity}</span> {w.title}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="经营决策关注点">
          <ul className="space-y-2 text-sm">
            <li className="rounded-lg bg-[#E8F3FF] px-3 py-2">产能瓶颈：装车月台利用率</li>
            <li className="rounded-lg bg-[#FFF1E6] px-3 py-2">成本：物流环比关注</li>
            <li className="rounded-lg bg-[#F3E8FF] px-3 py-2">ESG：重点供方尽职调查</li>
          </ul>
          <Link to="/" className="mt-3 inline-block text-xs text-[#1677FF]">
            打开控制塔 →
          </Link>
        </Panel>
      </div>
    </>
  );
}

function ProcurementBoard({ employeeId }: { employeeId: string }) {
  const user = useAuthStore((s) => s.currentUser);
  const myOrders = filterDataByRole(purchaseOrders, user, 'createdBy', Modules.ORDERS);
  const byStatus = (s: string) => myOrders.filter((o) => o.status === s).length;
  const top = [...suppliers].sort((a, b) => b.onTimeRate - a.onTimeRate).slice(0, 5);
  const poor = [...suppliers].filter((s) => s.risk !== 'normal').slice(0, 3);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            ['待审批', byStatus('待审批')],
            ['已下单', byStatus('已下单')],
            ['已发货', byStatus('已发货')],
            ['已到货', byStatus('已到货')],
          ] as const
        ).map(([l, v]) => (
          <div key={l} className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#667085]">{l}</div>
            <div className="mt-2 text-2xl font-semibold">{v}</div>
            <div className="text-[10px] text-[#98A2B3]">范围 · {employeeId}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="供应商绩效 TOP5">
          <ul className="space-y-2 text-sm">
            {top.map((s) => (
              <li key={s.id} className="flex justify-between rounded bg-[#F2F4F7] px-3 py-2">
                <span>{s.name}</span>
                <span className="text-[#1677FF]">{s.onTimeRate}%</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="待协同 / 待改善">
          <ul className="space-y-2 text-sm">
            {poor.map((s) => (
              <li key={s.id} className="rounded bg-[#FFF1E6] px-3 py-2">
                {s.name} · {s.anomalies.join('、') || '需关注'}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="询价 / 合同提醒">
          <ul className="space-y-2 text-sm">
            <li className="rounded bg-[#E8F3FF] px-3 py-2">RFQ-882 催化剂包 · 明日截止</li>
            <li className="rounded bg-[#E8F3FF] px-3 py-2">框架协议 · 万华化学 续签节点</li>
            <li className="rounded bg-[#F3E8FF] px-3 py-2">备选供方入库审核 2 家</li>
          </ul>
          <Link to="/procurement" className="mt-3 inline-block text-xs text-[#1677FF]">
            采购协同 →
          </Link>
        </Panel>
      </div>
    </>
  );
}

function LogisticsBoard() {
  const anomaly = shipments.filter((s) => s.hasAnomaly).length;
  const lowSku = inventoryItems.filter((i) => i.status === 'red').length;
  const pending = alerts.filter((a) => a.status === 'pending');

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="在途车辆" value={shipments.length} tone="blue" />
        <StatCard label="今日异常" value={anomaly} tone="warn" />
        <StatCard label="低库存 SKU" value={lowSku} tone="red" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="仓储库存总览">
          <p className="text-sm text-[#667085]">
            监控 SKU {inventoryItems.length} · 补货建议 {replenishmentAdvice.length} 条
          </p>
          <Link to="/warehouse" className="mt-2 inline-block text-xs text-[#1677FF]">
            智能仓储 →
          </Link>
        </Panel>
        <Panel title="待处理告警">
          <ul className="space-y-2 text-sm">
            {pending.slice(0, 5).map((a) => (
              <li key={a.id} className="rounded bg-[#FFF1F0] px-3 py-2">
                [{a.level}] {a.title}
              </li>
            ))}
          </ul>
          <Link to="/logistics" className="mt-2 inline-block text-xs text-[#1677FF]">
            在途监控 →
          </Link>
        </Panel>
        <Panel title="运力与班次">
          <ul className="space-y-2 text-sm">
            <li className="rounded bg-[#F2F4F7] px-3 py-2">华南干线满载率 86%</li>
            <li className="rounded bg-[#F2F4F7] px-3 py-2">危化品专线余量 2 车次</li>
            <li className="rounded bg-[#E8F3FF] px-3 py-2">夜间班次延误风险：低</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}

function CsBoard() {
  const pendingDeliver = customerOrders.filter((o) => o.status === '待交付');
  const avg = Math.round(
    customerOrders.reduce(
      (s, o) => s + (o.onTimeRate + o.intactRate + o.responseRate) / 3,
      0,
    ) / customerOrders.length,
  );
  const openCmp = customerComplaints.filter((c) => c.status !== '已闭环');

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="待交付订单" value={pendingDeliver.length} tone="blue" />
        <StatCard label="综合满意度" value={avg} tone="blue" suffix="分" />
        <StatCard label="待处理投诉" value={openCmp.length} tone="warn" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="今日交付任务">
          <ul className="space-y-2 text-sm">
            {pendingDeliver.slice(0, 5).map((o) => (
              <li key={o.id} className="rounded bg-[#F2F4F7] px-3 py-2">
                {o.id} · {o.customerName} · {o.product}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="待处理投诉">
          <ul className="space-y-2 text-sm">
            {openCmp.map((c) => (
              <li key={c.id} className="rounded bg-[#FFF1E6] px-3 py-2">
                {c.id} · {c.type} · {c.customerName}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="客户关怀看板">
          <ul className="space-y-2 text-sm">
            <li className="rounded bg-[#E8F3FF] px-3 py-2">VIP 回访：3 家本周到期</li>
            <li className="rounded bg-[#E8FFEA] px-3 py-2">准时签收表扬工单 2</li>
            <li className="rounded bg-[#F3E8FF] px-3 py-2">改址申请待确认 1</li>
          </ul>
          <Link to="/delivery" className="mt-2 inline-block text-xs text-[#1677FF]">
            客户交付 →
          </Link>
        </Panel>
      </div>
    </>
  );
}

function Panel({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm ${className}`}
    >
      <h3 className="mb-3 font-medium text-[#1D2939]">{title}</h3>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  suffix,
  to,
}: {
  label: string;
  value: number;
  tone: 'blue' | 'warn' | 'orange' | 'red';
  suffix?: string;
  to?: string;
}) {
  const ring =
    tone === 'blue'
      ? 'border-[#D0E4FF]'
      : tone === 'warn' || tone === 'orange'
        ? 'border-[#FFE4CC]'
        : 'border-[#FFD0D0]';
  const body = (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${ring}`}>
      <div className="text-sm text-[#667085]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[#1D2939]">
        {value}
        {suffix}
      </div>
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

function TodoRow({
  tag,
  title,
  meta,
  to,
}: {
  tag: string;
  title: string;
  meta: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 rounded-lg border border-[#E4E7EC] px-3 py-2 hover:bg-[#F7FBFF]"
    >
      <div className="min-w-0">
        <span className="mr-2 rounded bg-[#E8F3FF] px-1.5 py-0.5 text-[10px] text-[#1677FF]">
          {tag}
        </span>
        <span className="text-[#1D2939]">{title}</span>
      </div>
      <span className="shrink-0 text-[11px] text-[#98A2B3]">{meta}</span>
    </Link>
  );
}
