import type { ChemCategory, ChemMaterial, ChemWarehouse } from './chemTypes';

const NAMES: { name: string; category: ChemCategory; unit: ChemMaterial['unit']; price: number }[] = [
  { name: '乙烯', category: '基础化学品', unit: '吨', price: 0.72 },
  { name: '丙烯', category: '基础化学品', unit: '吨', price: 0.68 },
  { name: '丁二烯', category: '基础化学品', unit: '吨', price: 0.95 },
  { name: '苯乙烯', category: '基础化学品', unit: '吨', price: 0.88 },
  { name: '聚丙烯 PP', category: '聚合物', unit: '吨', price: 0.82 },
  { name: '聚乙烯 PE', category: '聚合物', unit: '吨', price: 0.79 },
  { name: '环氧乙烷', category: '基础化学品', unit: '吨', price: 1.12 },
  { name: '乙二醇 MEG', category: '基础化学品', unit: '吨', price: 0.58 },
  { name: '丙烯酸', category: '精细化学品', unit: '吨', price: 1.35 },
  { name: '丙烯腈', category: '精细化学品', unit: '吨', price: 1.28 },
  { name: '甲苯', category: '溶剂', unit: '吨', price: 0.62 },
  { name: '二甲苯', category: '溶剂', unit: '吨', price: 0.65 },
  { name: '丙酮', category: '溶剂', unit: '吨', price: 0.71 },
  { name: '甲醇', category: '基础化学品', unit: '吨', price: 0.28 },
  { name: '乙醇', category: '溶剂', unit: '升', price: 0.012 },
  { name: '异丙醇 IPA', category: '溶剂', unit: '吨', price: 0.84 },
  { name: 'MDI', category: '精细化学品', unit: '吨', price: 1.85 },
  { name: 'TDI', category: '精细化学品', unit: '吨', price: 1.62 },
  { name: '己二酸', category: '精细化学品', unit: '吨', price: 1.05 },
  { name: '己内酰胺', category: '聚合物', unit: '吨', price: 1.22 },
  { name: 'ABS 树脂', category: '聚合物', unit: '吨', price: 1.15 },
  { name: 'PC 聚碳酸酯', category: '聚合物', unit: '吨', price: 1.65 },
  { name: '尼龙 PA6', category: '聚合物', unit: '吨', price: 1.42 },
  { name: 'PVC 树脂', category: '聚合物', unit: '吨', price: 0.66 },
  { name: '丁苯橡胶 SBR', category: '聚合物', unit: '吨', price: 1.18 },
  { name: '正丁醇', category: '溶剂', unit: '吨', price: 0.76 },
  { name: '醋酸乙酯', category: '溶剂', unit: '吨', price: 0.69 },
  { name: '环己酮', category: '溶剂', unit: '吨', price: 0.92 },
  { name: '过氧化氢 27.5%', category: '精细化学品', unit: '吨', price: 0.48 },
  { name: '液碱 32%', category: '基础化学品', unit: '吨', price: 0.22 },
  { name: '盐酸 31%', category: '基础化学品', unit: '吨', price: 0.18 },
  { name: '硫酸 98%', category: '基础化学品', unit: '吨', price: 0.25 },
  { name: '氨水 25%', category: '基础化学品', unit: '吨', price: 0.31 },
  { name: '二氧化钛', category: '精细化学品', unit: '吨', price: 1.55 },
  { name: '炭黑 N330', category: '精细化学品', unit: '吨', price: 0.98 },
  { name: '苯酚', category: '精细化学品', unit: '吨', price: 0.86 },
  { name: '双酚 A', category: '精细化学品', unit: '吨', price: 1.08 },
  { name: 'Ziegler 催化剂', category: '催化剂', unit: '千克', price: 0.45 },
  { name: '加氢脱硫催化剂', category: '催化剂', unit: '千克', price: 0.62 },
  { name: '贵金属重整催化剂', category: '催化剂', unit: '千克', price: 1.85 },
  { name: '钛系聚合催化剂', category: '催化剂', unit: '千克', price: 0.78 },
  { name: 'IBC 吨桶 1000L', category: '包装材料', unit: '千克', price: 0.008 },
  { name: 'ISO 罐箱垫圈包', category: '包装材料', unit: '千克', price: 0.12 },
  { name: '危化品纸箱', category: '包装材料', unit: '千克', price: 0.015 },
  { name: '防爆软管组件', category: '包装材料', unit: '千克', price: 0.22 },
  { name: '苯酐', category: '精细化学品', unit: '吨', price: 0.74 },
  { name: '顺酐', category: '精细化学品', unit: '吨', price: 0.81 },
  { name: '己二醇', category: '精细化学品', unit: '吨', price: 1.25 },
  { name: '新戊二醇', category: '精细化学品', unit: '吨', price: 1.18 },
  { name: '甲基丙烯酸甲酯 MMA', category: '精细化学品', unit: '吨', price: 1.32 },
];

const WAREHOUSES: ChemWarehouse[] = ['湛江1号库', '湛江2号库', '中转库'];

function pickStatus(current: number, safety: number): ChemMaterial['status'] {
  if (current < safety) return 'red';
  if (current < safety * 1.2) return 'yellow';
  return 'green';
}

/** 50 个化工 SKU 库存 */
export const chemMaterials: ChemMaterial[] = NAMES.map((item, i) => {
  const safety =
    item.unit === '吨'
      ? 50 + ((i * 37) % 950)
      : item.unit === '升'
        ? 500 + ((i * 41) % 4000)
        : 80 + ((i * 29) % 900);
  const current =
    item.unit === '吨'
      ? 10 + ((i * 97) % 4990)
      : 20 + ((i * 83) % 4800);
  const warehouse = WAREHOUSES[i % 3];
  const code = `BASF-${item.category.slice(0, 1)}${(i + 1).toString().padStart(2, '0')}-${(1000 + i * 17).toString().slice(0, 4)}`;

  return {
    id: `MAT-${(i + 1).toString().padStart(3, '0')}`,
    sku: code,
    name: item.name,
    category: item.category,
    unit: item.unit,
    currentStock: Math.round(current * 10) / 10,
    safetyStock: Math.round(safety * 10) / 10,
    status: pickStatus(current, safety),
    warehouse,
    unitPrice: item.price,
  };
});
