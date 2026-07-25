import { Link } from 'react-router-dom';
import {
  customerComplaints,
  customerOrders,
  deliveryExceptions,
} from '../mock/delivery';
import { useChannelSyncStore } from '../store/useChannelSyncStore';

function stars(score: number): string {
  const full = Math.round(score / 20);
  return '★'.repeat(Math.min(5, Math.max(1, full))) + '☆'.repeat(5 - Math.min(5, Math.max(1, full)));
}

const statusStyle: Record<string, string> = {
  待交付: 'bg-slate-100 text-slate-600',
  运输中: 'bg-sky-100 text-sky-700',
  已签收: 'bg-emerald-100 text-emerald-700',
  异常: 'bg-red-100 text-red-700',
  待处理: 'bg-amber-100 text-amber-800',
  处理中: 'bg-sky-100 text-sky-700',
  已闭环: 'bg-emerald-100 text-emerald-700',
  待确认: 'bg-amber-100 text-amber-800',
  履约中: 'bg-[#E8F3FF] text-[#1677FF]',
  待收货: 'bg-[#FFF1E6] text-[#FF7D29]',
  已完成: 'bg-emerald-100 text-emerald-700',
  已取消: 'bg-slate-100 text-slate-500',
};

export default function Delivery() {
  const channelOrders = useChannelSyncStore((s) => s.channelOrders);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">客户交付管理</h2>
        <p className="mt-1 text-sm text-slate-500">
          下游交付履约 · 满意度 · 异常与投诉闭环 · Marketplace 渠道订单同步
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#FFE4CC] bg-gradient-to-br from-white to-[#FFF8F2] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FFE4CC] px-4 py-3">
          <div>
            <h3 className="font-medium text-slate-800">Marketplace 渠道订单（已同步 SCIP）</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              客户在门户下单后写入本列表；确认收货会回写状态。演示数据同源。
            </p>
          </div>
          <Link
            to="/marketplace/orders"
            className="rounded-lg bg-[#FF7D29] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#E86A1A]"
          >
            打开客户门户订单 →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="bg-[#FFF1E6] text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2.5 font-medium">SCIP 单号</th>
                <th className="px-3 py-2.5 font-medium">门户单号</th>
                <th className="px-3 py-2.5 font-medium">客户</th>
                <th className="px-3 py-2.5 font-medium">产品</th>
                <th className="px-3 py-2.5 font-medium">数量</th>
                <th className="px-3 py-2.5 font-medium">金额</th>
                <th className="px-3 py-2.5 font-medium">状态</th>
                <th className="px-3 py-2.5 font-medium">同步时间</th>
              </tr>
            </thead>
            <tbody>
              {channelOrders.map((o) => (
                <tr key={o.scipOrderId} className="border-t border-[#FFE4CC]/80">
                  <td className="px-3 py-2.5 font-semibold text-[#1677FF]">{o.scipOrderId}</td>
                  <td className="px-3 py-2.5">
                    <Link
                      to={`/marketplace/orders/${o.marketplaceOrderId}`}
                      className="font-medium text-[#FF7D29] hover:underline"
                    >
                      {o.marketplaceOrderId}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-slate-800">{o.customerName}</td>
                  <td className="px-3 py-2.5">{o.productSummary}</td>
                  <td className="px-3 py-2.5">{o.qtySummary}</td>
                  <td className="px-3 py-2.5">¥{o.amount.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${statusStyle[o.status] ?? 'bg-slate-100'}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{o.syncedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="font-medium text-slate-800">客户订单列表（内部交付台账）</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2.5 font-medium">客户名称</th>
                <th className="px-3 py-2.5 font-medium">订单号</th>
                <th className="px-3 py-2.5 font-medium">产品</th>
                <th className="px-3 py-2.5 font-medium">数量</th>
                <th className="px-3 py-2.5 font-medium">交付日期</th>
                <th className="px-3 py-2.5 font-medium">状态</th>
                <th className="px-3 py-2.5 font-medium">满意度</th>
              </tr>
            </thead>
            <tbody>
              {customerOrders.map((o) => {
                const score = Math.round(
                  (o.onTimeRate + o.intactRate + o.responseRate) / 3,
                );
                return (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 text-slate-800">{o.customerName}</td>
                    <td className="px-3 py-2.5 font-medium text-teal-800">{o.id}</td>
                    <td className="px-3 py-2.5">{o.product}</td>
                    <td className="px-3 py-2.5">{o.qty}</td>
                    <td className="px-3 py-2.5 text-slate-500">{o.deliveryDate}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${statusStyle[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-amber-500" title={`综合 ${score}`}>
                        {stars(score)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        准时{o.onTimeRate}% · 完好{o.intactRate}% · 响应
                        {o.responseRate}% · 综合{score}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">交付异常记录</h3>
          <ul className="space-y-2">
            {deliveryExceptions.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                    {e.type}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${statusStyle[e.status]}`}
                  >
                    {e.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{e.orderId}</span>
                </div>
                <p className="mt-1 text-sm text-slate-800">{e.description}</p>
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>{e.customerName}</span>
                  <span>{e.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">客户投诉跟踪</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="py-1.5 font-medium">投诉ID</th>
                  <th className="py-1.5 font-medium">类型</th>
                  <th className="py-1.5 font-medium">时间</th>
                  <th className="py-1.5 font-medium">状态</th>
                  <th className="py-1.5 font-medium">闭环(天)</th>
                </tr>
              </thead>
              <tbody>
                {customerComplaints.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="py-2 font-medium text-teal-800">{c.id}</td>
                    <td className="py-2">{c.type}</td>
                    <td className="py-2 text-xs text-slate-500">{c.time}</td>
                    <td className="py-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${statusStyle[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2 text-slate-600">{c.closeDays ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            {customerComplaints.map((c) => (
              <li key={`${c.id}-c`}>
                <span className="font-medium text-slate-600">{c.customerName}：</span>
                {c.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
