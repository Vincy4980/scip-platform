import type { OrderStatus, PurchaseOrder } from './chemTypes';
import { chemMaterials } from './materials';
import { chemSuppliers } from './suppliers';

const ORDER_STATUSES: OrderStatus[] = [
  '草稿',
  '待审批',
  '已下单',
  '已发货',
  '已到货',
  '已入库',
];

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

/** 30 条采购订单 */
export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 30 }, (_, i) => {
  const supplier = chemSuppliers[i % chemSuppliers.length];
  const tonMaterials = chemMaterials.filter((m) => m.unit === '吨');
  const material = tonMaterials[i % tonMaterials.length];
  const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
  const orderDate = new Date(2026, i % 7, 2 + (i % 25));
  const lead = 5 + (i % 12);
  const eta = addDays(orderDate, lead);
  const shipped = ['已发货', '已到货', '已入库'].includes(status);
  const arrived = ['已到货', '已入库'].includes(status);
  const qty = Math.round((10 + (i * 17) % 490) * 10) / 10;
  const amount = Math.round(qty * material.unitPrice * 10) / 10;
  const subMat = tonMaterials[(i + 7) % tonMaterials.length];

  const approvals =
    status === '草稿'
      ? []
      : [
          {
            step: '采购员提交',
            actor: '李采购',
            result: '通过',
            time: `${fmt(orderDate)} 09:20`,
            comment: '紧急补库需求',
          },
          ...(status !== '待审批'
            ? [
                {
                  step: '采购经理审批',
                  actor: '张经理',
                  result: '通过',
                  time: `${fmt(addDays(orderDate, 1))} 11:05`,
                  comment: '同意下单',
                },
              ]
            : [
                {
                  step: '采购经理审批',
                  actor: '张经理',
                  result: '待审',
                  time: '—',
                },
              ]),
        ];

  const changes =
    i % 4 === 0
      ? [
          {
            field: '预计到货日',
            from: fmt(eta),
            to: fmt(addDays(eta, 2)),
            operator: '供应商协同',
            time: `${fmt(addDays(orderDate, 3))} 14:30`,
          },
        ]
      : i % 5 === 0
        ? [
            {
              field: '数量',
              from: `${qty - 5}`,
              to: `${qty}`,
              operator: '李采购',
              time: `${fmt(addDays(orderDate, 1))} 16:10`,
            },
          ]
        : [];

  return {
    id: `PO-2026-${String(1001 + i)}`,
    supplierId: supplier.id,
    supplierName: supplier.name,
    category: material.category,
    materialName: material.name,
    sku: material.sku,
    qty,
    amount: Math.min(500, Math.max(5, amount)),
    orderDate: fmt(orderDate),
    eta: fmt(i % 4 === 0 ? addDays(eta, 2) : eta),
    ata: arrived ? fmt(addDays(eta, shipped ? -1 + (i % 3) : 0)) : null,
    status,
    lineItems: [
      {
        sku: material.sku,
        name: material.name,
        qty,
        unit: material.unit,
        amount: Math.min(500, Math.max(5, amount)),
      },
      ...(i % 3 === 0
        ? [
            {
              sku: subMat.sku,
              name: subMat.name,
              qty: Math.round(qty * 0.2 * 10) / 10,
              unit: subMat.unit,
              amount: Math.round(amount * 0.15 * 10) / 10,
            },
          ]
        : []),
    ],
    approvals,
    changes,
    createdBy: i % 2 === 0 ? 'EMP-002' : 'EMP-005',
  };
});

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  '草稿',
  '待审批',
  '已下单',
  '已发货',
  '已到货',
  '已入库',
];
