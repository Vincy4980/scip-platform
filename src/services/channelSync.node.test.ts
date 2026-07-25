/**
 * 零依赖单测入口（Node 内置 test runner）
 * 运行：node --experimental-strip-types --test src/services/channelSync.node.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  mapMarketplaceStatus,
  marketplaceOrderToChannel,
  pushOrderToScip,
} from './channelSync.ts';
import type { MarketplaceOrder } from '../mock/scipData.ts';
import { canAccessModule, getKpiDomain } from '../utils/permission.ts';
import { Modules, UserRole, type User } from '../types/user.ts';
import { getPermissionsForRole } from '../config/roles.ts';

describe('channelSync', () => {
  it('pushOrderToScip maps MO- to CO-', () => {
    assert.equal(pushOrderToScip('MO-2026-0412'), 'CO-2026-0412');
  });

  it('mapMarketplaceStatus covers key states', () => {
    assert.equal(mapMarketplaceStatus('待确认'), '待确认');
    assert.equal(mapMarketplaceStatus('运输中'), '运输中');
    assert.equal(mapMarketplaceStatus('已完成'), '已完成');
    assert.equal(mapMarketplaceStatus('待发货'), '履约中');
  });

  it('marketplaceOrderToChannel keeps scipOrderRef and summaries', () => {
    const order: MarketplaceOrder = {
      orderId: 'MO-2026-9999',
      inquiryId: 'INQ-1',
      placedAt: '2026-07-21 10:00',
      status: '待确认',
      syncedToScip: true,
      scipOrderRef: 'CO-2026-9999',
      addressLabel: '深圳仓',
      invoiceTitle: '测试公司',
      lines: [
        {
          productId: 'MAT-001',
          productName: '乙烯',
          qty: 10,
          unit: '吨',
          unitPrice: 1,
          amount: 10000,
        },
      ],
      totalAmount: 10000,
    };
    const rec = marketplaceOrderToChannel(order, '测试公司');
    assert.equal(rec.scipOrderId, 'CO-2026-9999');
    assert.equal(rec.marketplaceOrderId, 'MO-2026-9999');
    assert.equal(rec.productSummary, '乙烯');
    assert.equal(rec.source, 'marketplace');
  });
});

describe('permission helpers', () => {
  const director: User = {
    id: 'U-001',
    name: '张伟',
    employeeId: 'EMP-001',
    role: UserRole.CONTROL_TOWER_DIRECTOR,
    department: '供应链管理部',
    email: 'a@b.com',
    phone: '1',
    status: 'active',
    permissions: getPermissionsForRole(UserRole.CONTROL_TOWER_DIRECTOR),
  };

  const cs: User = {
    ...director,
    id: 'U-004',
    role: UserRole.CUSTOMER_SERVICE,
    permissions: getPermissionsForRole(UserRole.CUSTOMER_SERVICE),
  };

  it('director can access users module', () => {
    assert.equal(canAccessModule(director, Modules.USERS), true);
  });

  it('customer service cannot access users module', () => {
    assert.equal(canAccessModule(cs, Modules.USERS), false);
  });

  it('getKpiDomain maps roles', () => {
    assert.equal(getKpiDomain(UserRole.CONTROL_TOWER_DIRECTOR), 'all');
    assert.equal(getKpiDomain(UserRole.PROCUREMENT_MANAGER), 'procurement');
    assert.equal(getKpiDomain(UserRole.LOGISTICS_SUPERVISOR), 'logistics');
    assert.equal(getKpiDomain(UserRole.CUSTOMER_SERVICE), 'delivery');
  });
});
