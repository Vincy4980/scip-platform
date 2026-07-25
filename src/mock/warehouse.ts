import type {
  AgeBucket,
  QcBatch,
  QcRejectReason,
  WarehouseStats,
} from './chemTypes';
import { chemMaterials } from './materials';
import { chemSuppliers } from './suppliers';

export const warehouseStats: WarehouseStats = {
  totalCapacity: 50000,
  usedCapacity: 32000,
  utilizationRate: 64,
  inboundToday: 1280,
  outboundToday: 965,
};

/** 库龄分布：0-7(30%) 8-30(40%) 31-90(20%) 90+(10%) */
export const warehouseAgeBuckets: AgeBucket[] = [
  { label: '0-7天', tons: 9600, pct: 30 },
  { label: '8-30天', tons: 12800, pct: 40 },
  { label: '31-90天', tons: 6400, pct: 20 },
  { label: '90天以上', tons: 3200, pct: 10 },
];

/** 今日质检队列（12 批，落在 5-15） */
export const qcBatches: QcBatch[] = Array.from({ length: 12 }, (_, i) => {
  const mat = chemMaterials[i * 3];
  const sup = chemSuppliers[i % chemSuppliers.length];
  const day = 10 + (i % 5);
  return {
    id: `QC-20260714-${String(i + 1).padStart(2, '0')}`,
    supplierName: sup.name,
    materialName: mat.name,
    arrivalDate: `2026-07-${String(day).padStart(2, '0')}`,
    status: i < 8 ? (i % 2 === 0 ? '待检' : '检验中') : '已完成',
    warehouse: mat.warehouse,
    qty: Math.round(mat.currentStock * 0.05 * 10) / 10 || 12 + i * 3,
  };
});

export const qcTodayPassRate = 95.6;

export const qcRejectReasons: QcRejectReason[] = [
  { reason: '纯度偏低', count: 8 },
  { reason: '水分超标', count: 6 },
  { reason: '色度异常', count: 4 },
  { reason: '包装标识不符', count: 3 },
  { reason: '微量杂质超标', count: 2 },
];
