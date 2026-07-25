import { useState, type FormEvent } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  apArItems,
  financeOverview,
  financeTypes,
  fxRates,
  fxTrend30d,
  lettersOfCredit,
} from '../mock/global';

export default function Finance() {
  const [finType, setFinType] = useState<(typeof financeTypes)[number]>('保理');
  const [amount, setAmount] = useState('500');
  const [party, setParty] = useState('');
  const [apps, setApps] = useState<
    { id: string; type: string; amount: string; party: string; status: string }[]
  >([
    { id: 'FIN-001', type: '保理', amount: '800', party: 'BASF SE', status: '审批中' },
    { id: 'FIN-002', type: '订单融资', amount: '1200', party: 'SABIC', status: '已放款' },
  ]);
  const [toast, setToast] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = `FIN-${String(100 + apps.length)}`;
    setApps((prev) => [
      { id, type: finType, amount, party: party || '未命名对手方', status: '受理中' },
      ...prev,
    ]);
    setToast('融资申请已提交（演示）');
    setParty('');
    window.setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">供应链金融</h2>
        <p className="mt-1 text-sm text-slate-500">
          应付应收 · 信用证 · 多币种汇率 · 融资申请
        </p>
      </div>

      {toast && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="应付账款总额" value={financeOverview.apTotalCny} unit="万元" />
        <Card label="应收账款总额" value={financeOverview.arTotalCny} unit="万元" />
        <Card label="在途信用证金额" value={financeOverview.lcInTransitCny} unit="万元" />
        <Card label="融资余额" value={financeOverview.financingBalanceCny} unit="万元" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">应付 / 应收账款（账龄）</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="py-1">对手方</th>
                  <th className="py-1">类型</th>
                  <th className="py-1">金额(万CNY)</th>
                  <th className="py-1">原币</th>
                  <th className="py-1">账龄</th>
                </tr>
              </thead>
              <tbody>
                {apArItems.map((i) => (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="py-2">{i.party}</td>
                    <td className="py-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] ${
                          i.type === 'AP'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {i.type}
                      </span>
                    </td>
                    <td className="py-2 font-medium">{i.amountCny}</td>
                    <td className="py-2 text-xs text-slate-500">
                      {i.amountOrig} {i.currency}
                    </td>
                    <td className="py-2 text-xs">{i.aging}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">信用证管理</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="py-1">L/C</th>
                  <th className="py-1">开证行</th>
                  <th className="py-1">受益人</th>
                  <th className="py-1">原币 / CNY</th>
                  <th className="py-1">有效期</th>
                  <th className="py-1">状态</th>
                </tr>
              </thead>
              <tbody>
                {lettersOfCredit.map((lc) => (
                  <tr key={lc.id} className="border-t border-slate-100">
                    <td className="py-2 font-medium text-teal-800">{lc.id}</td>
                    <td className="max-w-[120px] truncate py-2 text-xs">{lc.bank}</td>
                    <td className="py-2">{lc.beneficiary}</td>
                    <td className="py-2 text-xs">
                      {(lc.amountOrig / 1e6).toFixed(2)}M {lc.currency}
                      <br />
                      {lc.amountCny} 万
                    </td>
                    <td className="py-2 text-xs text-slate-500">{lc.expiry}</td>
                    <td className="py-2 text-xs">{lc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-3">
          <h3 className="mb-2 font-medium text-slate-800">多币种汇率看板</h3>
          <div className="mb-3 flex flex-wrap gap-2">
            {fxRates.map((r) => (
              <span
                key={r.pair}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
              >
                {r.pair} <strong className="text-teal-700">{r.rate}</strong>
              </span>
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fxTrend30d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} width={40} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="USD" stroke="#0d9488" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="EUR" stroke="#0369a1" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="SGD" stroke="#d97706" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="mb-3 font-medium text-slate-800">融资申请</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs text-slate-500">
              融资类型
              <select
                value={finType}
                onChange={(e) =>
                  setFinType(e.target.value as (typeof financeTypes)[number])
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {financeTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-500">
              对手方
              <input
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="供应商 / 客户"
              />
            </label>
            <label className="block text-xs text-slate-500">
              申请金额（万元）
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-teal-700 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              提交申请
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {apps.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
              >
                <div className="font-medium text-slate-800">
                  {a.id} · {a.type}
                </div>
                <div className="text-slate-500">
                  {a.party} · {a.amount} 万 · {a.status}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-2xl font-semibold text-slate-800">
          {value.toLocaleString()}
        </span>
        <span className="mb-0.5 text-xs text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
