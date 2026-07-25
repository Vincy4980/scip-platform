import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import '../marketplace.css';

const NAV = [
  { to: '/marketplace', label: '首页', end: true },
  { to: '/marketplace/products', label: '产品中心' },
  { to: '/marketplace/inquiry', label: '询价管理' },
  { to: '/marketplace/orders', label: '我的订单' },
  { to: '/marketplace/account', label: '客户中心' },
];

export default function MarketplaceLayout() {
  const navigate = useNavigate();
  const cart = useMarketplaceStore((s) => s.cart);
  const loggedIn = useMarketplaceStore((s) => s.loggedIn);
  const logout = useMarketplaceStore((s) => s.logout);
  const customer = useMarketplaceStore((s) => s.customer);
  const [q, setQ] = useState('');

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/marketplace/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="mp-root">
      <header className="sticky top-0 z-40 shrink-0 border-b border-[var(--mp-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
          <Link to="/marketplace" className="shrink-0">
            <div className="mp-logo">SCIP Marketplace</div>
            <div className="text-[10px] text-[var(--mp-muted)]">成品采购门户</div>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[var(--mp-orange-soft)] text-[var(--mp-orange-deep)]'
                      : 'text-[var(--mp-muted)] hover:bg-[#FAF8F6] hover:text-[var(--mp-ink)]'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={onSearch} className="ml-auto hidden min-w-0 flex-1 max-w-xs sm:block">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索产品名称 / 规格…"
              className="mp-input"
              aria-label="搜索产品"
            />
          </form>

          <Link
            to="/marketplace/inquiry"
            className="relative rounded-xl border border-[var(--mp-border)] bg-white p-2 hover:bg-[var(--mp-orange-soft)]"
            title="询价单 / 购物车"
          >
            <span className="text-lg" aria-hidden>
              🛒
            </span>
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--mp-orange)] px-1 text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </Link>

          {loggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/marketplace/account"
                className="hidden text-sm font-medium text-[var(--mp-ink)] sm:block"
              >
                {customer.companyName.slice(0, 6)}…
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/marketplace/auth');
                }}
                className="mp-btn-ghost !py-1.5 !text-xs"
              >
                退出
              </button>
            </div>
          ) : (
            <Link to="/marketplace/auth" className="mp-btn-primary !py-1.5 !text-xs">
              登录 / 注册
            </Link>
          )}
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-[var(--mp-border)] px-4 py-2 lg:hidden">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                  isActive
                    ? 'bg-[var(--mp-orange-soft)] text-[var(--mp-orange-deep)]'
                    : 'text-[var(--mp-muted)]'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
        <Outlet />
      </main>

      <footer className="mt-auto shrink-0 border-t border-[var(--mp-border)] bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 md:grid-cols-3 md:px-6 md:py-6">
          <div>
            <div className="mp-logo text-base md:text-lg">SCIP Marketplace</div>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--mp-muted)] md:text-sm">
              面向下游客户的成品采购门户。选品、询价、下单、追踪一站完成。
            </p>
            <Link
              to="/"
              className="mt-2 inline-block text-xs font-medium text-[var(--mp-orange)] hover:underline"
            >
              ← 返回 SCIP 内部平台
            </Link>
          </div>
          <div className="text-xs text-[var(--mp-muted)] md:text-sm">
            <div className="font-semibold text-[var(--mp-ink)]">联系我们</div>
            <p className="mt-1.5">客服热线：400-800-SCIP</p>
            <p>邮箱：marketplace@scip.example</p>
            <p>工作日 09:00–18:00</p>
          </div>
          <div className="text-xs text-[var(--mp-muted)] md:text-sm">
            <div className="font-semibold text-[var(--mp-ink)]">法律信息</div>
            <p className="mt-1.5 cursor-pointer hover:text-[var(--mp-orange)]">隐私政策</p>
            <p className="cursor-pointer hover:text-[var(--mp-orange)]">使用条款</p>
            <p className="cursor-pointer hover:text-[var(--mp-orange)]">危化品销售合规声明</p>
          </div>
        </div>
        <div className="border-t border-[var(--mp-border)] py-2.5 text-center text-[11px] text-[var(--mp-muted)]">
          © 2026 SCIP Marketplace · 与 SCIP 平台数据同步演示
        </div>
      </footer>
    </div>
  );
}

export function MpSection({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--mp-ink)]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--mp-muted)]">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
