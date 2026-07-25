import { create } from 'zustand';
import {
  seedCustomer,
  seedInquiries,
  seedLogistics,
  seedOrders,
  syncInventoryFromScip,
  syncProductsFromScip,
  type InquiryLine,
  type MarketplaceCustomer,
  type MarketplaceInquiry,
  type MarketplaceLogistics,
  type MarketplaceOrder,
  type MarketplaceProduct,
  type MarketplaceInventory,
  type CustomerAddress,
} from '../../mock/scipData';
import { useChannelSyncStore } from '../../store/useChannelSyncStore';
import { mapMarketplaceStatus, pushOrderToScip } from '../../services/channelSync';

const AUTH_KEY = 'scip-marketplace-auth';
const CART_KEY = 'scip-marketplace-cart';

function loadAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

function loadCart(): InquiryLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as InquiryLine[]) : [];
  } catch {
    return [];
  }
}

interface MarketplaceState {
  products: MarketplaceProduct[];
  inventory: MarketplaceInventory[];
  inquiries: MarketplaceInquiry[];
  orders: MarketplaceOrder[];
  logistics: Record<string, MarketplaceLogistics>;
  customer: MarketplaceCustomer;
  cart: InquiryLine[];
  loggedIn: boolean;
  login: (email: string, _password: string) => boolean;
  logout: () => void;
  registerComplete: () => void;
  addToCart: (line: InquiryLine) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  submitInquiry: (lines: InquiryLine[], remark?: string) => string;
  convertInquiryToOrder: (inquiryId: string) => string | null;
  confirmReceipt: (orderId: string) => void;
  toggleFavorite: (productId: string) => void;
  upsertAddress: (addr: CustomerAddress) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getStock: (productId: string) => MarketplaceInventory | undefined;
  getProduct: (productId: string) => MarketplaceProduct | undefined;
  refreshFromScip: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  products: syncProductsFromScip(),
  inventory: syncInventoryFromScip(),
  inquiries: [...seedInquiries],
  orders: [...seedOrders],
  logistics: { ...seedLogistics },
  customer: { ...seedCustomer },
  cart: loadCart(),
  loggedIn: loadAuth(),

  login: (email) => {
    if (!email.trim()) return false;
    localStorage.setItem(AUTH_KEY, '1');
    set({ loggedIn: true });
    return true;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ loggedIn: false });
  },

  registerComplete: () => {
    localStorage.setItem(AUTH_KEY, '1');
    set({ loggedIn: true });
  },

  addToCart: (line) => {
    set((s) => {
      const rest = s.cart.filter((c) => c.productId !== line.productId);
      const cart = [...rest, line];
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return { cart };
    });
  },

  removeFromCart: (productId) => {
    set((s) => {
      const cart = s.cart.filter((c) => c.productId !== productId);
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return { cart };
    });
  },

  updateCartQty: (productId, qty) => {
    set((s) => {
      const cart = s.cart.map((c) =>
        c.productId === productId ? { ...c, qty: Math.max(1, qty) } : c,
      );
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return { cart };
    });
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ cart: [] });
  },

  submitInquiry: (lines, remark) => {
    const inquiryId = `INQ-2026-${String(8000 + get().inquiries.length + 1).slice(-4)}`;
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const inquiry: MarketplaceInquiry = {
      inquiryId,
      submittedAt: now,
      status: '待回复',
      lines,
      remark: remark?.trim() || undefined,
      replySlaHours: 24,
      scipInquiryRef: `SI-2026-${4400 + get().inquiries.length}`,
      syncedToScip: true,
    };
    set((s) => ({
      inquiries: [inquiry, ...s.inquiries],
      customer: {
        ...s.customer,
        notifications: [
          {
            id: `N-${Date.now()}`,
            title: `询价 ${inquiryId} 已提交`,
            body: '已同步销售池，预计 24 小时内回复报价。',
            time: now,
            read: false,
            type: 'inquiry' as const,
            link: '/marketplace/inquiry',
          },
          ...s.customer.notifications,
        ],
      },
    }));
    get().clearCart();
    return inquiryId;
  },

  convertInquiryToOrder: (inquiryId) => {
    const inq = get().inquiries.find((i) => i.inquiryId === inquiryId);
    if (!inq || !inq.quote || inq.status === '已转化') return null;

    const orderId = `MO-2026-${String(4300 + get().orders.length).slice(-4)}`;
    const scipRef = pushOrderToScip(orderId);
    const placedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const lines = inq.lines.map((l) => {
      const lq = inq.quote!.lineQuotes?.find((q) => q.productId === l.productId);
      const unitPrice = lq?.unitPrice ?? inq.quote!.unitPrice;
      return {
        productId: l.productId,
        productName: l.productName,
        qty: l.qty,
        unit: l.unit,
        unitPrice,
        amount: lq?.amount ?? Math.round(unitPrice * l.qty * 1000),
      };
    });
    const defaultAddr = get().customer.addresses.find((a) => a.isDefault);
    const order: MarketplaceOrder = {
      orderId,
      inquiryId,
      placedAt,
      status: '待确认',
      lines,
      totalAmount: lines.reduce((s, l) => s + l.amount, 0),
      addressLabel: defaultAddr
        ? `${defaultAddr.province}${defaultAddr.city} · ${defaultAddr.detail}`
        : '默认地址',
      invoiceTitle: get().customer.companyName,
      paymentTerms: inq.quote.paymentTerms ?? '月结 30 天',
      freightAmount: 0,
      contactPhone: defaultAddr?.phone ?? get().customer.phone,
      remark: inq.remark,
      statusHistory: [
        { status: '待确认', time: placedAt, note: '由询价转单，等待销售确认' },
      ],
      syncedToScip: true,
      scipOrderRef: scipRef,
    };

    set((s) => ({
      orders: [order, ...s.orders],
      inquiries: s.inquiries.map((i) =>
        i.inquiryId === inquiryId ? { ...i, status: '已转化' as const } : i,
      ),
      customer: {
        ...s.customer,
        notifications: [
          {
            id: `N-${Date.now()}`,
            title: `订单 ${orderId} 已创建`,
            body: '已写入 SCIP 履约链路，可在「我的订单」查看进度。',
            time: placedAt,
            read: false,
            type: 'order' as const,
            link: `/marketplace/orders/${orderId}`,
          },
          ...s.customer.notifications,
        ],
      },
    }));

    useChannelSyncStore
      .getState()
      .ingestMarketplaceOrder(order, get().customer.companyName);

    return orderId;
  },

  confirmReceipt: (orderId) => {
    const doneAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    set((s) => ({
      orders: s.orders.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              status: '已完成' as const,
              statusHistory: [
                ...(o.statusHistory ?? []),
                { status: '已完成', time: doneAt, note: '客户确认收货' },
              ],
            }
          : o,
      ),
    }));
    useChannelSyncStore
      .getState()
      .mirrorMarketplaceStatus(orderId, mapMarketplaceStatus('已完成'));
  },

  toggleFavorite: (productId) => {
    set((s) => {
      const has = s.customer.favorites.includes(productId);
      const favorites = has
        ? s.customer.favorites.filter((id) => id !== productId)
        : [...s.customer.favorites, productId];
      return { customer: { ...s.customer, favorites } };
    });
  },

  upsertAddress: (addr) => {
    set((s) => {
      const exists = s.customer.addresses.some((a) => a.id === addr.id);
      let addresses = exists
        ? s.customer.addresses.map((a) => (a.id === addr.id ? addr : a))
        : [...s.customer.addresses, addr];
      if (addr.isDefault) {
        addresses = addresses.map((a) => ({
          ...a,
          isDefault: a.id === addr.id,
        }));
      }
      return { customer: { ...s.customer, addresses } };
    });
  },

  removeAddress: (id) => {
    set((s) => ({
      customer: {
        ...s.customer,
        addresses: s.customer.addresses.filter((a) => a.id !== id),
      },
    }));
  },

  setDefaultAddress: (id) => {
    set((s) => ({
      customer: {
        ...s.customer,
        addresses: s.customer.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        })),
      },
    }));
  },

  markNotificationRead: (id) => {
    set((s) => ({
      customer: {
        ...s.customer,
        notifications: s.customer.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
      },
    }));
  },

  markAllNotificationsRead: () => {
    set((s) => ({
      customer: {
        ...s.customer,
        notifications: s.customer.notifications.map((n) => ({ ...n, read: true })),
      },
    }));
  },

  getStock: (productId) => get().inventory.find((i) => i.productId === productId),
  getProduct: (productId) => get().products.find((p) => p.productId === productId),

  refreshFromScip: () => {
    set({
      products: syncProductsFromScip(),
      inventory: syncInventoryFromScip(),
    });
  },
}));
