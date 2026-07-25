import { create } from 'zustand';
import type { MarketplaceOrder } from '../mock/scipData';
import {
  marketplaceOrderToChannel,
  seedChannelOrdersFromMarketplace,
  type ChannelOrderRecord,
} from '../services/channelSync';

interface ChannelSyncState {
  /** SCIP 侧可见的 Marketplace 来源订单 */
  channelOrders: ChannelOrderRecord[];
  /** Marketplace 下单成功后写入 SCIP */
  ingestMarketplaceOrder: (order: MarketplaceOrder, customerName: string) => void;
  /** Marketplace 确认收货后回写 SCIP 状态 */
  mirrorMarketplaceStatus: (
    marketplaceOrderId: string,
    status: ChannelOrderRecord['status'],
  ) => void;
  getByMarketplaceId: (id: string) => ChannelOrderRecord | undefined;
  getByScipId: (id: string) => ChannelOrderRecord | undefined;
}

export const useChannelSyncStore = create<ChannelSyncState>((set, get) => ({
  channelOrders: seedChannelOrdersFromMarketplace(),

  ingestMarketplaceOrder: (order, customerName) => {
    const record = marketplaceOrderToChannel(order, customerName);
    set((s) => {
      const rest = s.channelOrders.filter(
        (o) => o.marketplaceOrderId !== record.marketplaceOrderId,
      );
      return { channelOrders: [record, ...rest] };
    });
  },

  mirrorMarketplaceStatus: (marketplaceOrderId, status) => {
    set((s) => ({
      channelOrders: s.channelOrders.map((o) =>
        o.marketplaceOrderId === marketplaceOrderId
          ? {
              ...o,
              status,
              syncedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : o,
      ),
    }));
  },

  getByMarketplaceId: (id) =>
    get().channelOrders.find((o) => o.marketplaceOrderId === id),

  getByScipId: (id) => get().channelOrders.find((o) => o.scipOrderId === id),
}));
