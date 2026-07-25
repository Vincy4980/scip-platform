/**
 * SCIP ↔ Marketplace 渠道订单同步层（演示）
 * Marketplace 客户下单后写入本模块；SCIP「客户交付」可读同一份数据。
 */
import type { MarketplaceOrder, MarketplaceOrderStatus } from '../mock/scipData';
import { seedOrders } from '../mock/scipData';

export type ChannelOrderStatus =
  | '待确认'
  | '履约中'
  | '运输中'
  | '待收货'
  | '已完成'
  | '已取消';

export interface ChannelOrderRecord {
  /** SCIP 侧客户订单号，如 CO-2026-0412 */
  scipOrderId: string;
  /** Marketplace 门户订单号，如 MO-2026-0412 */
  marketplaceOrderId: string;
  inquiryId?: string;
  customerName: string;
  productSummary: string;
  qtySummary: string;
  amount: number;
  status: ChannelOrderStatus;
  placedAt: string;
  syncedAt: string;
  source: 'marketplace';
}

export function pushOrderToScip(marketplaceOrderId: string): string {
  return `CO-${marketplaceOrderId.replace(/^MO-/, '')}`;
}

export function mapMarketplaceStatus(
  status: MarketplaceOrderStatus,
): ChannelOrderStatus {
  switch (status) {
    case '待确认':
      return '待确认';
    case '已确认':
    case '待发货':
      return '履约中';
    case '运输中':
      return '运输中';
    case '待收货':
      return '待收货';
    case '已完成':
      return '已完成';
    case '已取消':
      return '已取消';
    default:
      return '履约中';
  }
}

export function marketplaceOrderToChannel(
  order: MarketplaceOrder,
  customerName: string,
): ChannelOrderRecord {
  const scipOrderId = order.scipOrderRef ?? pushOrderToScip(order.orderId);
  const first = order.lines[0];
  return {
    scipOrderId,
    marketplaceOrderId: order.orderId,
    inquiryId: order.inquiryId,
    customerName,
    productSummary: first
      ? order.lines.length > 1
        ? `${first.productName} 等 ${order.lines.length} 项`
        : first.productName
      : '—',
    qtySummary: first
      ? order.lines.length > 1
        ? `${first.qty}${first.unit}+`
        : `${first.qty} ${first.unit}`
      : '—',
    amount: order.totalAmount,
    status: mapMarketplaceStatus(order.status),
    placedAt: order.placedAt,
    syncedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    source: 'marketplace',
  };
}

/** 启动时从 Marketplace 种子订单生成 SCIP 侧镜像 */
export function seedChannelOrdersFromMarketplace(
  customerName = '华南精密制造有限公司',
): ChannelOrderRecord[] {
  return seedOrders.map((o) =>
    marketplaceOrderToChannel(
      o,
      o.invoiceTitle || customerName,
    ),
  );
}
