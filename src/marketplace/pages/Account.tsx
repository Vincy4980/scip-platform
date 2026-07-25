import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { CustomerAddress } from '../../mock/scipData';
import { ProductThumb, StockDot, formatMoney } from '../components/ProductCard';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

const TABS = [
  { id: 'overview', label: '概览' },
  { id: 'company', label: '企业信息' },
  { id: 'address', label: '收货地址' },
  { id: 'invoice', label: '发票信息' },
  { id: 'security', label: '账户安全' },
  { id: 'favorites', label: '我的收藏' },
  { id: 'notify', label: '通知中心' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const NOTIFY_TAG: Record<string, string> = {
  inquiry: '询价',
  order: '订单',
  account: '账户',
  system: '系统',
};

export default function MarketplaceAccount() {
  const customer = useMarketplaceStore((s) => s.customer);
  const products = useMarketplaceStore((s) => s.products);
  const orders = useMarketplaceStore((s) => s.orders);
  const inquiries = useMarketplaceStore((s) => s.inquiries);
  const upsertAddress = useMarketplaceStore((s) => s.upsertAddress);
  const removeAddress = useMarketplaceStore((s) => s.removeAddress);
  const setDefaultAddress = useMarketplaceStore((s) => s.setDefaultAddress);
  const toggleFavorite = useMarketplaceStore((s) => s.toggleFavorite);
  const markNotificationRead = useMarketplaceStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useMarketplaceStore((s) => s.markAllNotificationsRead);
  const getStock = useMarketplaceStore((s) => s.getStock);
  const loggedIn = useMarketplaceStore((s) => s.loggedIn);
  const [tab, setTab] = useState<TabId>('overview');
  const [editing, setEditing] = useState<CustomerAddress | null>(null);
  const [pwdMsg, setPwdMsg] = useState('');
  const [invoiceMsg, setInvoiceMsg] = useState('');

  const unread = customer.notifications.filter((n) => !n.read).length;
  const creditPct = Math.min(
    100,
    Math.round((customer.creditUsed / customer.creditLimit) * 100),
  );

  const favProducts = useMemo(
    () => products.filter((p) => customer.favorites.includes(p.productId)),
    [products, customer.favorites],
  );

  const openOrders = orders.filter(
    (o) => !['已完成', '已取消'].includes(o.status),
  ).length;
  const openQuotes = inquiries.filter((i) => i.status === '已报价').length;

  if (!loggedIn) {
    return (
      <div className="mp-card mx-auto max-w-md p-10 text-center">
        <h1 className="text-lg font-semibold">客户中心</h1>
        <p className="mt-2 text-sm text-[var(--mp-muted)]">
          登录后管理企业资料、地址、发票、收藏与通知
        </p>
        <Link to="/marketplace/auth" className="mp-btn-primary mt-5 inline-flex">
          去登录
        </Link>
      </div>
    );
  }

  const saveAddress = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const addr: CustomerAddress = {
      id: editing?.id || `ADDR-${Date.now()}`,
      label: String(fd.get('label') ?? ''),
      contact: String(fd.get('contact') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      province: String(fd.get('province') ?? ''),
      city: String(fd.get('city') ?? ''),
      detail: String(fd.get('detail') ?? ''),
      isDefault: fd.get('isDefault') === 'on',
    };
    upsertAddress(addr);
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">客户中心</h1>
        <p className="mt-1 text-sm text-[var(--mp-muted)]">
          {customer.companyName} · {customer.certified ? '已认证企业' : '认证审核中'}
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <aside className="mp-card h-fit w-full shrink-0 p-2 lg:w-52">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`mb-0.5 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                tab === t.id
                  ? 'bg-[var(--mp-orange-soft)] font-semibold text-[var(--mp-orange-deep)]'
                  : 'text-[var(--mp-muted)] hover:bg-[#FAF8F6]'
              }`}
            >
              <span>{t.label}</span>
              {t.id === 'notify' && unread > 0 && (
                <span className="rounded-full bg-[var(--mp-orange)] px-1.5 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          {tab === 'overview' && (
            <>
              <section className="mp-card overflow-hidden">
                <div className="bg-gradient-to-br from-[#FFF7F0] to-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-[var(--mp-muted)]">欢迎回来</div>
                      <div className="mt-1 text-lg font-semibold">{customer.contactName}</div>
                      <p className="mt-1 text-sm text-[var(--mp-muted)]">
                        专属顾问 {customer.accountManager} · {customer.accountManagerPhone}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2 text-right text-xs shadow-sm">
                      <div className="text-[var(--mp-muted)]">授信额度</div>
                      <div className="mt-0.5 font-semibold text-[var(--mp-ink)]">
                        {formatMoney(customer.creditLimit)}
                      </div>
                      <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-[#F2F4F7]">
                        <div
                          className="h-full rounded-full bg-[var(--mp-orange)]"
                          style={{ width: `${creditPct}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[var(--mp-muted)]">
                        已用 {formatMoney(customer.creditUsed)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-px bg-[var(--mp-border)] sm:grid-cols-4">
                  {[
                    {
                      label: '进行中订单',
                      value: openOrders,
                      to: '/marketplace/orders',
                    },
                    {
                      label: '待转单报价',
                      value: openQuotes,
                      to: '/marketplace/inquiry',
                    },
                    {
                      label: '收藏产品',
                      value: customer.favorites.length,
                      to: undefined,
                      onClick: () => setTab('favorites'),
                    },
                    {
                      label: '未读通知',
                      value: unread,
                      to: undefined,
                      onClick: () => setTab('notify'),
                    },
                  ].map((c) =>
                    c.to ? (
                      <Link
                        key={c.label}
                        to={c.to}
                        className="bg-white px-4 py-3 hover:bg-[#FFFBF7]"
                      >
                        <div className="text-xs text-[var(--mp-muted)]">{c.label}</div>
                        <div className="mt-1 text-xl font-semibold">{c.value}</div>
                      </Link>
                    ) : (
                      <button
                        key={c.label}
                        type="button"
                        onClick={c.onClick}
                        className="bg-white px-4 py-3 text-left hover:bg-[#FFFBF7]"
                      >
                        <div className="text-xs text-[var(--mp-muted)]">{c.label}</div>
                        <div className="mt-1 text-xl font-semibold">{c.value}</div>
                      </button>
                    ),
                  )}
                </div>
              </section>

              <section className="grid gap-3 sm:grid-cols-3">
                <Link to="/marketplace/products" className="mp-card p-4 hover:border-[#FFC9A0]">
                  <div className="text-sm font-semibold">选品询价</div>
                  <p className="mt-1 text-xs text-[var(--mp-muted)]">浏览目录，加入询价篮</p>
                </Link>
                <Link to="/marketplace/orders" className="mp-card p-4 hover:border-[#FFC9A0]">
                  <div className="text-sm font-semibold">跟踪订单</div>
                  <p className="mt-1 text-xs text-[var(--mp-muted)]">查物流、确认收货</p>
                </Link>
                <button
                  type="button"
                  onClick={() => setTab('address')}
                  className="mp-card p-4 text-left hover:border-[#FFC9A0]"
                >
                  <div className="text-sm font-semibold">管理地址</div>
                  <p className="mt-1 text-xs text-[var(--mp-muted)]">
                    默认：{customer.addresses.find((a) => a.isDefault)?.label ?? '未设置'}
                  </p>
                </button>
              </section>

              {unread > 0 && (
                <section className="mp-card p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">最新通知</h2>
                    <button
                      type="button"
                      className="text-xs text-[var(--mp-orange)]"
                      onClick={() => setTab('notify')}
                    >
                      全部 →
                    </button>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {customer.notifications
                      .filter((n) => !n.read)
                      .slice(0, 3)
                      .map((n) => (
                        <li key={n.id} className="rounded-xl bg-[#FAF8F6] px-3 py-2 text-sm">
                          <div className="font-medium">{n.title}</div>
                          <div className="text-xs text-[var(--mp-muted)]">{n.time}</div>
                        </li>
                      ))}
                  </ul>
                </section>
              )}
            </>
          )}

          {tab === 'company' && (
            <section className="mp-card space-y-1 p-5 text-sm">
              <h2 className="mb-3 text-lg font-semibold">企业信息</h2>
              <Row label="企业名称" value={customer.companyName} />
              <Row label="统一社会信用代码" value={customer.creditCode} />
              <Row
                label="认证状态"
                value={customer.certified ? '已认证（危化品采购资质已核验）' : '审核中'}
              />
              <Row label="入驻时间" value={customer.memberSince} />
              <Row label="联系人" value={customer.contactName} />
              <Row label="手机" value={customer.phone} />
              <Row label="邮箱" value={customer.email} />
              <Row
                label="专属顾问"
                value={`${customer.accountManager} · ${customer.accountManagerPhone}`}
              />
              <div className="mt-4 rounded-xl bg-[#FAF8F6] px-3 py-3 text-xs text-[var(--mp-muted)]">
                如需变更企业主体或认证资料，请联系顾问或发送邮件至 marketplace@scip.example
              </div>
            </section>
          )}

          {tab === 'address' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">收货地址</h2>
                  <p className="text-xs text-[var(--mp-muted)]">转单与发货默认使用「默认地址」</p>
                </div>
                <button
                  type="button"
                  className="mp-btn-primary !text-xs"
                  onClick={() =>
                    setEditing({
                      id: '',
                      label: '',
                      contact: customer.contactName,
                      phone: customer.phone,
                      province: '广东',
                      city: '深圳',
                      detail: '',
                      isDefault: customer.addresses.length === 0,
                    })
                  }
                >
                  新增地址
                </button>
              </div>
              <div className="grid gap-3">
                {customer.addresses.map((a) => (
                  <div key={a.id} className="mp-card p-4 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">
                          {a.label}
                          {a.isDefault && (
                            <span className="ml-2 rounded bg-[var(--mp-orange-soft)] px-1.5 py-0.5 text-[10px] text-[var(--mp-orange-deep)]">
                              默认
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[var(--mp-muted)]">
                          {a.contact} · {a.phone}
                        </p>
                        <p className="text-[var(--mp-muted)]">
                          {a.province}
                          {a.city}
                          {a.detail}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        {!a.isDefault && (
                          <button
                            type="button"
                            className="text-[var(--mp-orange)]"
                            onClick={() => setDefaultAddress(a.id)}
                          >
                            设为默认
                          </button>
                        )}
                        <button
                          type="button"
                          className="text-[var(--mp-orange)]"
                          onClick={() => setEditing(a)}
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeAddress(a.id)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {editing && (
                <form onSubmit={saveAddress} className="mp-card grid gap-3 p-4 sm:grid-cols-2">
                  <h3 className="sm:col-span-2 text-sm font-semibold">
                    {editing.id ? '编辑地址' : '新增地址'}
                  </h3>
                  {(
                    [
                      ['label', '地址名称', editing.label],
                      ['contact', '联系人', editing.contact],
                      ['phone', '手机', editing.phone],
                      ['province', '省', editing.province],
                      ['city', '市', editing.city],
                      ['detail', '详细地址', editing.detail],
                    ] as const
                  ).map(([name, label, val]) => (
                    <label key={name} className="text-xs text-[var(--mp-muted)]">
                      {label}
                      <input name={name} defaultValue={val} required className="mp-input mt-1" />
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      defaultChecked={editing.isDefault}
                      className="accent-[#FF7D29]"
                    />
                    设为默认地址
                  </label>
                  <div className="flex gap-2 sm:col-span-2">
                    <button type="submit" className="mp-btn-primary !text-xs">
                      保存
                    </button>
                    <button
                      type="button"
                      className="mp-btn-ghost !text-xs"
                      onClick={() => setEditing(null)}
                    >
                      取消
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {tab === 'invoice' && (
            <section className="mp-card space-y-3 p-5 text-sm">
              <h2 className="text-lg font-semibold">发票信息</h2>
              {invoiceMsg && (
                <p className="text-sm text-[var(--mp-orange-deep)]">{invoiceMsg}</p>
              )}
              <Row label="发票抬头" value={customer.companyName} />
              <Row label="纳税人识别号" value={customer.creditCode} />
              <Row label="开票类型" value={customer.invoiceType} />
              <Row label="开户银行" value={customer.invoiceBank} />
              <Row label="银行账号" value={customer.invoiceAccount} />
              <form
                className="mt-2 grid gap-3 border-t border-[var(--mp-border)] pt-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setInvoiceMsg('开票资料已保存（演示，本地生效）');
                }}
              >
                <p className="sm:col-span-2 text-xs text-[var(--mp-muted)]">
                  如需变更开户行或账号，请填写后提交（演示环境不会上传后端）
                </p>
                <label className="text-xs text-[var(--mp-muted)]">
                  开户银行
                  <input
                    name="bank"
                    defaultValue={customer.invoiceBank}
                    className="mp-input mt-1"
                  />
                </label>
                <label className="text-xs text-[var(--mp-muted)]">
                  银行账号
                  <input
                    name="account"
                    defaultValue={customer.invoiceAccount}
                    className="mp-input mt-1"
                  />
                </label>
                <button type="submit" className="mp-btn-primary !text-xs sm:col-span-2 sm:w-fit">
                  保存开票资料
                </button>
              </form>
            </section>
          )}

          {tab === 'security' && (
            <section className="space-y-4">
              <div className="mp-card space-y-4 p-5">
                <h2 className="text-lg font-semibold">账户安全</h2>
                {pwdMsg && (
                  <p className="text-sm text-[var(--mp-orange-deep)]">{pwdMsg}</p>
                )}
                <form
                  className="grid max-w-sm gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPwdMsg('密码已更新（演示，未实际上传）');
                  }}
                >
                  <label className="text-xs text-[var(--mp-muted)]">
                    当前密码
                    <input type="password" required className="mp-input mt-1" />
                  </label>
                  <label className="text-xs text-[var(--mp-muted)]">
                    新密码（至少 8 位）
                    <input type="password" required minLength={8} className="mp-input mt-1" />
                  </label>
                  <button type="submit" className="mp-btn-primary !text-xs">
                    修改密码
                  </button>
                </form>
              </div>
              <div className="mp-card p-5 text-sm">
                <div className="font-medium">绑定手机号</div>
                <p className="mt-1 text-[var(--mp-muted)]">{customer.phone}</p>
                <button type="button" className="mp-btn-ghost mt-3 !text-xs">
                  更换手机号
                </button>
              </div>
              <div className="mp-card p-5 text-sm">
                <div className="font-medium">最近登录</div>
                <ul className="mt-3 space-y-2 text-xs text-[var(--mp-muted)]">
                  <li className="flex justify-between rounded-lg bg-[#FAF8F6] px-3 py-2">
                    <span>Chrome · 深圳</span>
                    <span>2026-07-17 09:12 · 当前</span>
                  </li>
                  <li className="flex justify-between rounded-lg bg-[#FAF8F6] px-3 py-2">
                    <span>Safari · iPhone</span>
                    <span>2026-07-15 21:40</span>
                  </li>
                </ul>
              </div>
            </section>
          )}

          {tab === 'favorites' && (
            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">我的收藏</h2>
                <p className="text-xs text-[var(--mp-muted)]">快速复购常采产品</p>
              </div>
              {favProducts.length === 0 ? (
                <div className="mp-card px-4 py-10 text-center text-sm text-[var(--mp-muted)]">
                  暂无收藏 ·{' '}
                  <Link to="/marketplace/products" className="text-[var(--mp-orange)]">
                    去产品中心逛逛
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {favProducts.map((p) => {
                    const stock = getStock(p.productId);
                    return (
                      <div key={p.productId} className="mp-card flex gap-3 p-3">
                        <ProductThumb product={p} className="h-20 w-20 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/marketplace/products/${p.productId}`}
                            className="font-medium text-sm hover:text-[var(--mp-orange)]"
                          >
                            {p.productName}
                          </Link>
                          <div className="mt-0.5 text-xs text-[var(--mp-muted)]">
                            {p.specification}
                          </div>
                          <div className="mt-1">
                            <StockDot status={stock?.status ?? 'green'} />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Link
                              to={`/marketplace/products/${p.productId}`}
                              className="mp-btn-primary !px-2.5 !py-1 !text-[11px]"
                            >
                              去询价
                            </Link>
                            <button
                              type="button"
                              className="mp-btn-ghost !px-2.5 !py-1 !text-[11px]"
                              onClick={() => toggleFavorite(p.productId)}
                            >
                              取消收藏
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {tab === 'notify' && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">通知中心</h2>
                  <p className="text-xs text-[var(--mp-muted)]">
                    {unread > 0 ? `${unread} 条未读` : '全部已读'}
                  </p>
                </div>
                {unread > 0 && (
                  <button
                    type="button"
                    className="mp-btn-ghost !text-xs"
                    onClick={() => markAllNotificationsRead()}
                  >
                    全部标为已读
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {customer.notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`mp-card p-4 text-sm ${n.read ? '' : 'border-[#FFC9A0] bg-[#FFFBF7]'}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-[#FAF8F6] px-1.5 py-0.5 text-[10px] text-[var(--mp-muted)]">
                            {NOTIFY_TAG[n.type]}
                          </span>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mp-orange)]" />
                          )}
                          <span className="font-medium">{n.title}</span>
                        </div>
                        <p className="mt-1.5 text-[var(--mp-muted)]">{n.body}</p>
                        <p className="mt-1 text-xs text-[var(--mp-muted)]">{n.time}</p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        {n.link && (
                          <Link
                            to={n.link}
                            className="text-[var(--mp-orange)]"
                            onClick={() => markNotificationRead(n.id)}
                          >
                            查看
                          </Link>
                        )}
                        {!n.read && (
                          <button
                            type="button"
                            className="text-[var(--mp-muted)]"
                            onClick={() => markNotificationRead(n.id)}
                          >
                            已读
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-[var(--mp-border)] py-2.5 last:border-0">
      <span className="w-36 shrink-0 text-[var(--mp-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
