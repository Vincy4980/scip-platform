import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPermissionsForRole } from '../config/roles';
import { mockUserLogs } from '../mock/users';
import { useAuthStore } from '../store/useAuthStore';
import {
  ROLE_COLORS,
  ROLE_LABELS,
  UserRole,
  type User,
} from '../types/user';
import PermissionGate from '../components/PermissionGate';
import UserAvatar from '../components/UserAvatar';
import { Modules } from '../types/user';

const ROLE_OPTIONS = Object.values(UserRole);

const DEPARTMENT_OPTIONS = [
  '供应链管理部',
  '采购部',
  '物流部',
  '客户服务部',
  '财务部',
  '信息技术部',
] as const;

export default function Users() {
  const users = useAuthStore((s) => s.users);
  const upsertUser = useAuthStore((s) => s.upsertUser);
  const updateUserLocal = useAuthStore((s) => s.updateUserLocal);
  const canEdit = useAuthStore((s) => s.hasPermission(Modules.USERS, 'edit'));

  const [roleFilter, setRoleFilter] = useState<'全部' | UserRole>('全部');
  const [statusFilter, setStatusFilter] = useState<'全部' | 'active' | 'inactive'>(
    '全部',
  );
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== '全部' && u.role !== roleFilter) return false;
      if (statusFilter !== '全部' && u.status !== statusFilter) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !u.name.toLowerCase().includes(s) &&
          !u.employeeId.toLowerCase().includes(s) &&
          !u.email.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, q]);

  const toggleStatus = (user: User) => {
    if (!canEdit) return;
    updateUserLocal({
      ...user,
      status: user.status === 'active' ? 'inactive' : 'active',
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">用户管理</h2>
          <p className="mt-1 text-sm text-slate-500">
            账号、角色与权限模板维护
          </p>
        </div>
        <PermissionGate module={Modules.USERS} action="edit">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="rounded-lg bg-[#1677FF] px-3 py-2 text-sm font-medium text-white hover:bg-[#4096FF]"
          >
            新增用户
          </button>
        </PermissionGate>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索姓名 / 工号 / 邮箱"
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value as '全部' | UserRole)
          }
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm"
        >
          <option value="全部">全部角色</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as '全部' | 'active' | 'inactive')
          }
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm"
        >
          <option value="全部">全部状态</option>
          <option value="active">启用</option>
          <option value="inactive">禁用</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2.5">用户</th>
              <th className="px-3 py-2.5">工号</th>
              <th className="px-3 py-2.5">角色</th>
              <th className="px-3 py-2.5">部门</th>
              <th className="px-3 py-2.5">邮箱</th>
              <th className="px-3 py-2.5">状态</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                onClick={() => setSelected(user)}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={user.name} size="sm" />
                    <span className="font-medium text-[#1D2939]">{user.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 font-medium text-[#1677FF]">
                  {user.employeeId}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}
                  >
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-500">{user.department}</td>
                <td className="px-3 py-3 text-xs text-slate-500">{user.email}</td>
                <td
                  className="px-3 py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={!canEdit}
                    onClick={() => toggleStatus(user)}
                    className={`relative h-6 w-11 rounded-full transition ${
                      user.status === 'active' ? 'bg-teal-600' : 'bg-slate-300'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                        user.status === 'active' ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <UserDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected);
            setFormOpen(true);
            setSelected(null);
          }}
          canEdit={canEdit}
        />
      )}

      {formOpen && (
        <UserFormModal
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSave={(user) => {
            upsertUser(user);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

function UserDrawer({
  user,
  onClose,
  onEdit,
  canEdit,
}: {
  user: User;
  onClose: () => void;
  onEdit: () => void;
  canEdit: boolean;
}) {
  const navigate = useNavigate();
  const switchUser = useAuthStore((s) => s.switchUser);
  const logs = mockUserLogs[user.id] ?? [
    { id: 'x', time: '—', action: '暂无', detail: '尚无操作日志' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-label="关闭"
      />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div className="flex items-start gap-3">
            <UserAvatar name={user.name} size="lg" />
            <div>
              <h3 className="font-semibold text-slate-800">{user.name}</h3>
              <p className="text-xs text-slate-500">
                {user.employeeId} · {ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-auto px-5 py-4 text-sm">
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            <div>部门：{user.department}</div>
            <div>邮箱：{user.email}</div>
            <div>手机：{user.phone}</div>
            <div>最近登录：{user.lastLoginAt ?? '—'}</div>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-semibold text-slate-700">权限列表</h4>
            <ul className="max-h-48 space-y-1 overflow-auto text-xs">
              {user.permissions
                .filter((p) => p.canView)
                .map((p) => (
                  <li
                    key={p.module}
                    className="flex justify-between rounded border border-slate-100 px-2 py-1.5"
                  >
                    <span>{p.module}</span>
                    <span className="text-slate-400">
                      {[
                        p.canView && '查看',
                        p.canEdit && '编辑',
                        p.canDelete && '删除',
                        p.canExport && '导出',
                      ]
                        .filter(Boolean)
                        .join('·')}
                      ·{p.dataScope}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-semibold text-slate-700">操作日志</h4>
            <ul className="space-y-2 text-xs">
              {logs.map((l) => (
                <li key={l.id} className="rounded bg-slate-50 px-2 py-1.5">
                  <div className="font-medium">
                    {l.action} · {l.detail}
                  </div>
                  <div className="text-slate-400">{l.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-2 border-t px-5 py-4">
          {user.status === 'active' && (
            <button
              type="button"
              onClick={() => {
                switchUser(user.id);
                onClose();
                navigate('/my-workspace');
              }}
              className="w-full rounded-lg border border-[#D0E4FF] bg-[#F7FBFF] py-2 text-sm font-medium text-[#1677FF] hover:bg-[#E8F3FF]"
            >
              切换为该用户
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="w-full rounded-lg bg-[#1677FF] py-2 text-sm text-white hover:bg-[#4096FF]"
            >
              编辑用户
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UserFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial: User | null;
  onClose: () => void;
  onSave: (u: User) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [employeeId, setEmployeeId] = useState(initial?.employeeId ?? '');
  const [department, setDepartment] = useState(initial?.department ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [role, setRole] = useState<UserRole | ''>(initial?.role ?? '');
  const [status, setStatus] = useState<'active' | 'inactive'>(
    initial?.status ?? 'active',
  );
  const [extraExport, setExtraExport] = useState(false);

  const canSave = Boolean(
    name.trim() &&
      employeeId.trim() &&
      role &&
      department.trim(),
  );

  const submit = () => {
    if (!canSave || !role) return;
    const base = getPermissionsForRole(role);
    const permissions = extraExport
      ? base.map((p) => ({ ...p, canExport: true }))
      : base;
    onSave({
      id: initial?.id ?? `U-${Date.now()}`,
      name,
      employeeId,
      department,
      email,
      phone,
      role,
      status,
      avatar: name.trim(),
      permissions,
      lastLoginAt: initial?.lastLoginAt,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-label="关闭"
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="font-semibold text-slate-800">
          {initial ? '编辑用户' : '新增用户'}
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="姓名" value={name} onChange={setName} required />
          <Field label="工号" value={employeeId} onChange={setEmployeeId} required />
          <label className="block text-xs text-slate-500">
            部门 <span className="text-red-500">*</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">请选择部门</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <Field label="手机号" value={phone} onChange={setPhone} />
          <label className="block text-xs text-slate-500 sm:col-span-2">
            邮箱
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs text-slate-500">
            角色 <span className="text-red-500">*</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole | '')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">请选择角色</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-slate-500">
            状态
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'active' | 'inactive')
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          </label>
        </div>
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <div className="font-medium text-slate-700">角色默认权限</div>
          <p className="mt-1">
            {role
              ? `将加载「${ROLE_LABELS[role]}」模板权限。可勾选额外导出能力。`
              : '请先选择角色，系统将自动加载对应权限模板。'}
          </p>
          <label className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={extraExport}
              onChange={(e) => setExtraExport(e.target.checked)}
              className="accent-teal-700"
            />
            额外开启全部模块导出权限（高级）
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-600"
          >
            取消
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSave}
            className="rounded-lg bg-[#1677FF] px-4 py-2 text-sm text-white hover:bg-[#4096FF] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-xs text-slate-500">
      {label}
      {required && <span className="text-red-500"> *</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
    </label>
  );
}
