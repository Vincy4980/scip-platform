import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CostAnalysis from '../components/Dashboard/CostAnalysis';
import DashboardFilters from '../components/Dashboard/DashboardFilters';
import DeliveryGantt from '../components/Dashboard/DeliveryGantt';
import FlowSankey from '../components/Dashboard/FlowSankey';
import HealthRadar from '../components/Dashboard/HealthRadar';
import HealthTrend from '../components/Dashboard/HealthTrend';
import KpiCards from '../components/Dashboard/KpiCards';
import KpiDetailDrawer from '../components/Dashboard/KpiDetailDrawer';
import KpiGaugePanel from '../components/Dashboard/KpiGaugePanel';
import LeadTimeAnalysis from '../components/Dashboard/LeadTimeAnalysis';
import QualityAnalysis from '../components/Dashboard/QualityAnalysis';
import SupplyDemandBalance from '../components/Dashboard/SupplyDemandBalance';
import SupplierFunnel from '../components/Dashboard/SupplierFunnel';
import TopExceptions from '../components/Dashboard/TopExceptions';
import { useAuthStore } from '../store/useAuthStore';
import { useDashboardStore } from '../store/useDashboardStore';
import { ROLE_LABELS } from '../types/user';

export default function Dashboard() {
  const user = useAuthStore((s) => s.currentUser);
  const autoRefresh = useDashboardStore((s) => s.autoRefresh);
  const refresh = useDashboardStore((s) => s.refresh);
  const summary = useDashboardStore((s) => s.summary);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => refresh(), 30_000);
    return () => window.clearInterval(id);
  }, [autoRefresh, refresh]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#1D2939]">供应链控制塔</h2>
          <p className="mt-1 text-sm text-[#667085]">
            端到端健康度 · 时效 · 成本 · 产能 · 质量总览
            {user && (
              <span className="ml-2 text-xs text-[#98A2B3]">
                · {ROLE_LABELS[user.role]}视角 · {summary}
              </span>
            )}
          </p>
        </div>
        <Link
          to="/process-flow"
          className="rounded-xl bg-[#1677FF] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0E5FD4]"
        >
          打开补货闭环流程 →
        </Link>
      </div>

      <DashboardFilters />

      <section>
        <h3 className="mb-3 text-sm font-semibold text-[#1D2939]">核心 KPI</h3>
        <KpiCards />
      </section>

      <KpiGaugePanel />

      <section className="grid gap-4 xl:grid-cols-2">
        <HealthTrend />
        <HealthRadar />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <LeadTimeAnalysis />
        <CostAnalysis />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SupplyDemandBalance />
        <QualityAnalysis />
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-[#1D2939]">供应链特色图表</h3>
        <div className="grid gap-4 xl:grid-cols-2">
          <FlowSankey />
          <SupplierFunnel />
          <div className="xl:col-span-2">
            <DeliveryGantt />
          </div>
        </div>
      </section>

      <TopExceptions />

      <KpiDetailDrawer />
    </div>
  );
}
