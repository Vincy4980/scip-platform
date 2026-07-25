/**
 * 零依赖核心回归（与 channelSync.ts 规则保持一致）
 * 运行：node scripts/test-core.mjs
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

function pushOrderToScip(marketplaceOrderId) {
  return `CO-${marketplaceOrderId.replace(/^MO-/, '')}`;
}

function mapMarketplaceStatus(status) {
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

describe('SCIP channel sync rules', () => {
  it('MO maps to CO', () => {
    assert.equal(pushOrderToScip('MO-2026-0412'), 'CO-2026-0412');
  });

  it('status mapping', () => {
    assert.equal(mapMarketplaceStatus('待发货'), '履约中');
    assert.equal(mapMarketplaceStatus('运输中'), '运输中');
    assert.equal(mapMarketplaceStatus('已完成'), '已完成');
  });
});
