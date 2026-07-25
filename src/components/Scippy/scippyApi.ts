import {
  alerts,
  inventoryItems,
  kpiData,
  replenishmentAdvice,
  shipments,
  suppliers,
} from '../../mock/data';
import { purchaseOrders } from '../../mock/purchaseOrders';
import { geoRisks, riskSuppliers } from '../../mock/global';

export function getPendingAlerts() {
  return alerts.filter((a) => a.status === 'pending' || a.status === 'processing');
}

export function getInventorySummary() {
  const total = inventoryItems.reduce((s, i) => s + i.currentStock, 0);
  const yellow = inventoryItems.filter((i) => i.status === 'yellow').length;
  const red = inventoryItems.filter((i) => i.status === 'red');
  return {
    total: Math.round(total),
    yellow,
    red,
    advice: replenishmentAdvice.filter((a) => a.urgency === 'high').slice(0, 3),
  };
}

export function getOrders() {
  return purchaseOrders.slice(0, 8);
}

export function getSuppliers() {
  return suppliers;
}

export function getLogisticsStatus() {
  const total = shipments.length;
  const anomaly = shipments.filter((s) => s.hasAnomaly);
  return {
    total,
    normal: total - anomaly.length,
    mild: Math.max(0, anomaly.length - 1),
    urgent: anomaly.filter((s) => s.status.includes('偏离') || s.status.includes('超时')).length ||
      (anomaly[0] ? 1 : 0),
    top: anomaly[0],
  };
}

export function getKpiSummary() {
  return kpiData;
}

export function getRiskDigest() {
  return {
    suppliers: riskSuppliers.slice(0, 2),
    geo: geoRisks.slice(0, 2),
  };
}

export function getScippyData() {
  return {
    alerts: getPendingAlerts(),
    inventory: getInventorySummary(),
    orders: getOrders(),
    suppliers: getSuppliers(),
    logistics: getLogisticsStatus(),
    kpis: getKpiSummary(),
    risks: getRiskDigest(),
  };
}

export type ScippyActionNav = string;

export interface ScippyActionDef {
  label: string;
  icon?: string;
  navigateTo?: ScippyActionNav;
  followUpPrompt?: string;
}
