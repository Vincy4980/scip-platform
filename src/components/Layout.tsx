import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  Modules,
  ROLE_COLORS,
  ROLE_LABELS,
  type UserRole as UserRoleType,
} from '../types/user';
import ScippyBubble from './Scippy/ScippyBubble';
import UserAvatar from './UserAvatar';
import LoginModal from './LoginModal';

type NavLeaf = { to: string; label: string; icon: string; module: string };

type NavGroup = {
  id: string;
  label: string;
  icon: string;
  children: NavLeaf[];
};

/** 多级菜单：同类模块聚合，点击展开下级 */
const NAV_GROUPS: NavGroup[] = [
  {
    id: 'workspace',
    label: '工作台与控制塔',
    icon: '◈',
    children: [
      { to: '/my-workspace', label: '我的工作台', icon: '▣', module: Modules.WORKSPACE },
      { to: '/', label: '控制塔看板', icon: '◈', module: Modules.DASHBOARD },
      { to: '/control-tower', label: '全域控制塔', icon: '⬡', module: Modules.CONTROL_TOWER },
    ],
  },
  {
    id: 'source',
    label: '寻源与采购',
    icon: '◐',
    children: [
      { to: '/sourcing', label: '全球寻源', icon: '◉', module: Modules.SOURCING },
      { to: '/procurement', label: '供应商协同', icon: '◐', module: Modules.PROCUREMENT },
      { to: '/orders', label: '采购订单', icon: '☰', module: Modules.ORDERS },
      { to: '/process-flow', label: '补货闭环', icon: '⟳', module: Modules.PROCESS_FLOW },
    ],
  },
  {
    id: 'ops',
    label: '仓储与物流',
    icon: '◎',
    children: [
      { to: '/inventory', label: '库存水位', icon: '▦', module: Modules.INVENTORY },
      { to: '/warehouse', label: '智能仓储', icon: '▤', module: Modules.WAREHOUSE },
      { to: '/logistics', label: '在途监控', icon: '◎', module: Modules.LOGISTICS },
      { to: '/customs', label: '关务跨境', icon: '⇄', module: Modules.CUSTOMS },
      { to: '/delivery', label: '客户交付', icon: '◇', module: Modules.DELIVERY },
    ],
  },
  {
    id: 'intel',
    label: '金融与智能',
    icon: '✦',
    children: [
      { to: '/finance', label: '供应链金融', icon: '¥', module: Modules.FINANCE },
      { to: '/sustainability', label: 'ESG 可持续', icon: '✿', module: Modules.SUSTAINABILITY },
      { to: '/risk', label: '风险预警', icon: '⚠', module: Modules.RISK },
      { to: '/ai', label: 'Scippy 对话台', icon: '✦', module: Modules.AI },
    ],
  },
  {
    id: 'admin',
    label: '系统管理',
    icon: '⚙',
    children: [
      { to: '/users', label: '用户管理', icon: '👤', module: Modules.USERS },
    ],
  },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((s) => s.currentUser);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const availableRoles = useAuthStore((s) => s.availableRoles);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);
  const switching = useAuthStore((s) => s.switching);
  const switchLabel = useAuthStore((s) => s.switchLabel);
  const loginModalOpen = useAuthStore((s) => s.loginModalOpen);
  const setLoginModalOpen = useAuthStore((s) => s.setLoginModalOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /** 未登录时仍展示完整导航结构，点击后引导登录（避免「模块消失」观感） */
  const visibleGroups = useMemo(() => {
    if (!currentUser) {
      return NAV_GROUPS;
    }
    return NAV_GROUPS.map((g) => ({
      ...g,
      children: g.children.filter((c) => hasPermission(c.module, 'view')),
    })).filter((g) => g.children.length > 0);
  }, [hasPermission, currentUser]);

  const activeGroupId = useMemo(() => {
    const path = location.pathname;
    for (const g of visibleGroups) {
      if (
        g.children.some((c) =>
          c.to === '/' ? path === '/' : path === c.to || path.startsWith(`${c.to}/`),
        )
      ) {
        return g.id;
      }
    }
    return visibleGroups[0]?.id ?? '';
  }, [location.pathname, visibleGroups]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenGroups((prev) => ({
      ...prev,
      [activeGroupId]: true,
    }));
  }, [activeGroupId]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalLeaves = NAV_GROUPS.reduce((n, g) => n + g.children.length, 0);
  const visibleLeafCount = visibleGroups.reduce((n, g) => n + g.children.length, 0);
  const hiddenCount =
    currentUser && currentUser.role !== 'control_tower_director'
      ? Math.max(0, totalLeaves - visibleLeafCount)
      : 0;

  return (
    <div className="flex h-full min-h-screen bg-[var(--scip-bg)]">
      {switching && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1D2939]/35">
          <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-[#1D2939] shadow-xl">
            {switchLabel || '正在切换角色...'}
          </div>
        </div>
      )}

      <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--scip-border)] bg-white">
        <div className="border-b border-[var(--scip-border)] px-5 py-5">
          <div className="scip-logo-mark" aria-label="SCIP">
            SCIP
          </div>
          <div className="scip-logo-sub mt-1.5 text-[10px]">
            Supply Chain · Intelligence
          </div>
          <div className="mt-1 text-[11px] text-[var(--scip-muted)]">
            全球化工供应链平台
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {visibleGroups.map((group) => {
            const open = openGroups[group.id] ?? group.id === activeGroupId;
            return (
              <div key={group.id} className="rounded-xl">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    group.id === activeGroupId
                      ? 'bg-[#F2F4F7] text-[#1D2939]'
                      : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-[#1D2939]'
                  }`}
                >
                  <span className="opacity-80">{group.icon}</span>
                  <span className="flex-1">{group.label}</span>
                  <span
                    className={`text-[10px] text-[#98A2B3] transition-transform ${
                      open ? 'rotate-90' : ''
                    }`}
                  >
                    ›
                  </span>
                </button>
                {open && (
                  <div className="mt-0.5 space-y-0.5 border-l-2 border-[#E8F3FF] ml-3 pl-2">
                    {group.children.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          [
                            'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                            isActive
                              ? 'bg-[var(--scip-blue-soft)] text-[var(--scip-blue)]'
                              : 'text-[var(--scip-muted)] hover:bg-[#F2F4F7] hover:text-[var(--scip-ink)]',
                          ].join(' ')
                        }
                      >
                        <span className="text-xs opacity-80">{item.icon}</span>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-[var(--scip-border)] px-4 py-3 text-xs text-[var(--scip-muted)]">
          <NavLink
            to="/marketplace"
            className="flex items-center gap-2 rounded-xl bg-[#FFF1E6] px-3 py-2 font-semibold text-[#FF7D29] hover:bg-[#FFE4CC]"
          >
            <span>🛒</span>
            <span>SCIP Marketplace</span>
          </NavLink>
          <span className="inline-flex items-center gap-1.5">
            <i className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--scip-orange)]" />
            v2.3 · 多级导航
          </span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-14 shrink-0 flex-col justify-center border-b border-[var(--scip-border)] bg-white px-6 py-2">
          <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-semibold text-[var(--scip-ink)]">
              Supply Chain Intelligence Platform
            </h1>
            <p className="text-xs text-[var(--scip-muted)]">
              {currentUser
                ? `${ROLE_LABELS[currentUser.role]} · ${currentUser.department}`
                : '未登录'}
            </p>
            {hiddenCount > 0 && currentUser && (
              <p className="mt-0.5 max-w-2xl text-[11px] leading-snug text-[#FF7D29]">
                角色权限提示：当前为「{ROLE_LABELS[currentUser.role]}」，侧栏已按权限隐藏约{' '}
                {hiddenCount}{' '}
                个模块。切换至「控制塔总监」可查看全部菜单（含用户管理）。
              </p>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            {currentUser ? (
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-[var(--scip-bg)]"
              >
                <UserAvatar name={currentUser.name} size="sm" />
                <div className="hidden text-left text-sm sm:block">
                  <div className="font-semibold text-[var(--scip-ink)]">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-[var(--scip-muted)]">
                    {currentUser.employeeId}
                  </div>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="rounded-xl bg-[var(--scip-blue)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--scip-primary-deep)]"
              >
                登录
              </button>
            )}

            {menuOpen && currentUser && (
              <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-[var(--scip-border)] bg-white py-2 shadow-lg shadow-[#1D2939]/08">
                <div className="border-b border-[var(--scip-border)] px-3 pb-2">
                  <div className="text-sm font-semibold text-[var(--scip-ink)]">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-[var(--scip-muted)]">
                    {currentUser.employeeId} · {ROLE_LABELS[currentUser.role]}
                  </div>
                </div>
                <div className="px-3 py-2">
                  <div className="mb-2 text-[11px] font-medium text-[var(--scip-muted)]">
                    切换角色
                  </div>
                  <div className="space-y-1">
                    {availableRoles.map((role: UserRoleType) => {
                      const active = currentUser.role === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            switchRole(role);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left text-xs ${
                            active
                              ? 'bg-[var(--scip-blue-soft)] text-[var(--scip-blue)]'
                              : 'text-[var(--scip-ink)] hover:bg-[var(--scip-bg)]'
                          }`}
                        >
                          <span
                            className={`rounded-md px-1.5 py-0.5 ${ROLE_COLORS[role]}`}
                          >
                            {ROLE_LABELS[role]}
                          </span>
                          {active && (
                            <span className="text-[var(--scip-blue)]">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-[var(--scip-border)] px-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate('/my-workspace');
                    }}
                    className="w-full rounded-xl px-2 py-1.5 text-left text-xs font-medium text-[var(--scip-red)] hover:bg-[#FFF1F0]"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto p-5 md:p-6">
          <Outlet />
        </main>
      </div>

      <ScippyBubble />
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
