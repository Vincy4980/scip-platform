import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROLE_COLORS, ROLE_LABELS, UserRole, type User } from '../types/user';
import UserAvatar from './UserAvatar';

/**
 * SCIP 演示登录弹窗：按角色快速选择账号进入
 */
export default function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const users = useAuthStore((s) => s.users);
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<string>('EMP-001');

  const activeUsers = useMemo(
    () => users.filter((u) => u.status === 'active'),
    [users],
  );

  const byRole = useMemo(() => {
    const map = new Map<UserRole, User[]>();
    for (const role of Object.values(UserRole)) {
      map.set(
        role,
        activeUsers.filter((u) => u.role === role),
      );
    }
    return map;
  }, [activeUsers]);

  if (!open) return null;

  const submit = (employeeId: string) => {
    const ok = login(employeeId);
    if (!ok) {
      setError('登录失败：账号不存在或已禁用，请选择其他演示账号');
      return;
    }
    setError('');
    onClose();
    navigate('/my-workspace');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#1D2939]/45"
        aria-label="关闭登录"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--scip-border)] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--scip-ink)]">登录 SCIP</h2>
            <p className="mt-1 text-xs text-[var(--scip-muted)]">
              演示环境 · 选择账号即可进入（含角色切换能力）
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[var(--scip-muted)] hover:bg-[var(--scip-bg)]"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-[#FFF1F0] px-3 py-2 text-xs text-[var(--scip-red)]">
            {error}
          </p>
        )}

        <div className="mt-4 max-h-[50vh] space-y-4 overflow-auto pr-1">
          {Object.values(UserRole).map((role) => {
            const list = byRole.get(role) ?? [];
            if (!list.length) return null;
            return (
              <div key={role}>
                <div
                  className={`mb-2 inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${ROLE_COLORS[role]}`}
                >
                  {ROLE_LABELS[role]}
                </div>
                <ul className="space-y-1.5">
                  {list.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => setPicked(u.employeeId)}
                        onDoubleClick={() => submit(u.employeeId)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                          picked === u.employeeId
                            ? 'border-[var(--scip-blue)] bg-[var(--scip-blue-soft)]'
                            : 'border-[var(--scip-border)] hover:bg-[var(--scip-bg)]'
                        }`}
                      >
                        <UserAvatar name={u.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-[var(--scip-ink)]">
                            {u.name}
                          </div>
                          <div className="truncate text-[11px] text-[var(--scip-muted)]">
                            {u.employeeId} · {u.department}
                          </div>
                        </div>
                        {picked === u.employeeId && (
                          <span className="text-[var(--scip-blue)]">✓</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--scip-border)] py-2.5 text-sm text-[var(--scip-muted)]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => submit(picked)}
            className="flex-1 rounded-xl bg-[var(--scip-blue)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--scip-primary-deep)]"
          >
            登录
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-[var(--scip-muted)]">
          推荐：张伟 EMP-001（控制塔总监）可查看全部模块含用户管理
        </p>
      </div>
    </div>
  );
}
