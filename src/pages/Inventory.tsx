import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  inventoryItems,
  inventoryThresholdRules,
  replenishmentAdvice,
} from '../mock/data';
import { globalMaterials, globalWarehouses } from '../mock/global';
import type { InventoryStatus, ReplenishmentAdvice } from '../mock/types';
import { useAuthStore } from '../store/useAuthStore';
import { useFlowStore } from '../store/useFlowStore';
import { Modules } from '../types/user';
import { isReadOnly } from '../utils/permission';

const cellColor: Record<InventoryStatus, string> = {
  green: 'bg-emerald-500 hover:bg-emerald-600',
  yellow: 'bg-amber-400 hover:bg-amber-500',
  red: 'bg-red-500 hover:bg-red-600',
};

export default function Inventory() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.currentUser);
  const createFromAdvice = useFlowStore((s) => s.createFromAdvice);
  const advance = useFlowStore((s) => s.advance);
  const readOnly = isReadOnly(user, Modules.INVENTORY);
  const [tab, setTab] = useState<'shelf' | 'global'>('shelf');
  const [warehouse, setWarehouse] = useState('全部仓库');
  const [toast, setToast] = useState('');
  const [fromWh, setFromWh] = useState(globalWarehouses[0].id);
  const [toWh, setToWh] = useState(globalWarehouses[6].id);
  const [matSku, setMatSku] = useState(globalMaterials[0].sku);
  const [qty, setQty] = useState('50');

  const warehouses = useMemo(
    () => ['全部仓库', ...new Set(inventoryItems.map((i) => i.warehouse))],
    [],
  );

  const shelves = useMemo(() => {
    return inventoryItems.filter((i) =>
      warehouse === '全部仓库' ? true : i.warehouse === warehouse,
    );
  }, [warehouse]);

  const advice = useMemo(() => {
    return replenishmentAdvice.filter((a) =>
      warehouse === '全部仓库' ? true : a.warehouse === warehouse,
    );
  }, [warehouse]);

  const activeRule =
    warehouse === '全部仓库'
      ? inventoryThresholdRules[0]
      : inventoryThresholdRules.find((r) => r.warehouse === warehouse) ??
        inventoryThresholdRules[0];

  const byCountry = useMemo(() => {
    const map = new Map<string, number>();
    globalWarehouses.forEach((w) => {
      map.set(w.country, (map.get(w.country) ?? 0) + w.stockTons);
    });
    return [...map.entries()];
  }, []);

  const generatePO = (item: ReplenishmentAdvice) => {
    if (!user) return;
    const inst = createFromAdvice(item, {
      actor: user.name,
      employeeId: user.employeeId,
    });
    // 自动提交进入审批，缩短操作路径
    advance(inst.id, 'SUBMIT', user.name, '库存预警一键发起');
    setToast(`已发起补货闭环 ${inst.poId}（${item.sku}），跳转流程跟踪…`);
    window.setTimeout(() => {
      setToast('');
      navigate('/process-flow');
    }, 900);
  };

  const submitTransfer = () => {
    const from = globalWarehouses.find((w) => w.id === fromWh)?.name;
    const to = globalWarehouses.find((w) => w.id === toWh)?.name;
    setToast(`已创建跨国调拨申请：${matSku} ${qty} 吨 · ${from} → ${to}`);
    window.setTimeout(() => setToast(''), 2500);
  };

  const maxRow = Math.max(...shelves.map((s) => s.row), 0);
  const maxCol = Math.max(...shelves.map((s) => s.col), 0);
  const grid: ((typeof inventoryItems)[number] | null)[][] = [];
  for (let r = 0; r <= maxRow; r++) {
    const row: ((typeof inventoryItems)[number] | null)[] = [];
    for (let c = 0; c <= maxCol; c++) {
      row.push(shelves.find((s) => s.row === r && s.col === c) ?? null);
    }
    grid.push(row);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">库存水位预警</h2>
          <p className="mt-1 text-sm text-slate-500">
            本地货架 · 全球库存总览 · 跨国调拨
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab('shelf')}
            className={`rounded-lg px-3 py-2 text-sm ${
              tab === 'shelf'
                ? 'bg-teal-700 text-white'
                : 'border border-slate-200 bg-white text-slate-700'
            }`}
          >
            水位预警
          </button>
          <button
            type="button"
            onClick={() => setTab('global')}
            className={`rounded-lg px-3 py-2 text-sm ${
              tab === 'global'
                ? 'bg-teal-700 text-white'
                : 'border border-slate-200 bg-white text-slate-700'
            }`}
          >
            全球库存总览
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      {readOnly && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          当前角色为只读（采购视角），不可执行调拨 / 补货操作。
        </div>
      )}

      {tab === 'global' ? (
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <h3 className="mb-3 font-medium text-slate-800">按国家库存总量（吨）</h3>
              <ul className="space-y-2">
                {byCountry.map(([country, tons]) => (
                  <li key={country}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{country}</span>
                      <span className="font-medium">{tons.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                          width: `${Math.min(100, (tons / 50000) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-3 py-2">仓库</th>
                    <th className="px-3 py-2">国家/城市</th>
                    <th className="px-3 py-2">类型</th>
                    <th className="px-3 py-2">库容</th>
                    <th className="px-3 py-2">使用率</th>
                    <th className="px-3 py-2">库存(吨)</th>
                  </tr>
                </thead>
                <tbody>
                  {globalWarehouses.map((w) => (
                    <tr key={w.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium">{w.name}</td>
                      <td className="px-3 py-2 text-xs">
                        {w.country} / {w.city}
                      </td>
                      <td className="px-3 py-2">{w.type}</td>
                      <td className="px-3 py-2">{w.capacityTons.toLocaleString()}</td>
                      <td className="px-3 py-2">{w.utilizationPct}%</td>
                      <td className="px-3 py-2 text-teal-700">
                        {w.stockTons.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:col-span-2">
            <h3 className="mb-3 font-medium text-slate-800">跨国调拨申请</h3>
            <div className="space-y-3 text-sm">
              <label className="block text-xs text-slate-500">
                源仓库
                <select
                  value={fromWh}
                  onChange={(e) => setFromWh(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {globalWarehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}（{w.country}）
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-slate-500">
                目标仓库
                <select
                  value={toWh}
                  onChange={(e) => setToWh(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {globalWarehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}（{w.country}）
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-slate-500">
                物料
                <select
                  value={matSku}
                  onChange={(e) => setMatSku(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {globalMaterials.slice(0, 20).map((m) => (
                    <option key={m.sku} value={m.sku}>
                      {m.sku} · {m.nameZh}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-slate-500">
                数量（吨）
                <input
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
              <button
                type="button"
                onClick={submitTransfer}
                disabled={readOnly}
                className="w-full rounded-lg bg-teal-700 py-2.5 text-sm font-medium text-white hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400"
              >
                创建调拨申请
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              {warehouses.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            <aside className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-3">
              <h3 className="font-medium text-slate-800">预警规则配置</h3>
              <p className="text-xs text-slate-500">
                基于近 {activeRule.basedOnMonths} 个月消耗数据设定阈值。
              </p>
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                <div className="font-medium text-slate-700">
                  {warehouse === '全部仓库' ? '默认模板' : activeRule.warehouse}
                </div>
                <div className="mt-2">安全覆盖 {activeRule.safetyDays} 天</div>
              </div>
              {inventoryThresholdRules.map((rule) => (
                <button
                  key={rule.warehouse}
                  type="button"
                  onClick={() => setWarehouse(rule.warehouse)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${
                    warehouse === rule.warehouse
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  {rule.warehouse}
                </button>
              ))}
            </aside>

            <section className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-5">
              <h3 className="mb-3 font-medium text-slate-800">仓库货架俯视图</h3>
              <div className="space-y-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4">
                {grid.map((row, ri) => (
                  <div key={ri} className="flex items-center gap-2">
                    <span className="w-8 text-[10px] text-slate-400">R{ri + 1}</span>
                    <div
                      className="grid flex-1 gap-2"
                      style={{
                        gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))`,
                      }}
                    >
                      {row.map((cell, ci) =>
                        cell ? (
                          <div
                            key={cell.id}
                            className={`aspect-square rounded-md ${cellColor[cell.status]} p-1.5 text-white`}
                          >
                            <div className="text-[10px] font-semibold">{cell.shelf}</div>
                          </div>
                        ) : (
                          <div
                            key={`e-${ri}-${ci}`}
                            className="aspect-square rounded-md border border-dashed border-slate-200"
                          />
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:col-span-4">
              <h3 className="mb-3 font-medium text-slate-800">补货建议</h3>
              <ul className="max-h-[480px] space-y-3 overflow-auto">
                {advice.map((item) => (
                  <li key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                    <div className="font-semibold">{item.sku}</div>
                    <div className="text-xs text-slate-500">{item.name}</div>
                    <div className="mt-1 text-xs">
                      库存 {item.currentStock} · 建议 {item.suggestQty} · ETA {item.eta}
                    </div>
                    <button
                      type="button"
                      onClick={() => generatePO(item)}
                      disabled={readOnly}
                      className="mt-2 w-full rounded-lg bg-[#1677FF] py-1.5 text-xs font-medium text-white hover:bg-[#0E5FD4] disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      一键发起补货闭环
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
          <footer className="rounded-lg border border-slate-200/60 bg-white/80 px-4 py-3 text-xs text-slate-500">
            阈值依据近 36 个月消耗统计；全球视图数据来自跨国 WMS 同步（演示）。
          </footer>
        </>
      )}
    </div>
  );
}
