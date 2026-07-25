import { create } from 'zustand';
import { getPermissionsForRole } from '../config/roles';
import { findUserByEmployeeId, mockUsers } from '../mock/users';
import {
  ROLE_LABELS,
  UserRole,
  type PermissionAction,
  type User,
} from '../types/user';

const USERS_STORAGE_KEY = 'scip-users';

const ALL_ROLES: UserRole[] = [
  UserRole.CONTROL_TOWER_DIRECTOR,
  UserRole.PROCUREMENT_MANAGER,
  UserRole.LOGISTICS_SUPERVISOR,
  UserRole.CUSTOMER_SERVICE,
];

function loadPersistedUsers(): User[] | null {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User[];
  } catch {
    return null;
  }
}

function persistUsers(users: User[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

function withFreshPermissions(user: User): User {
  return {
    ...user,
    avatar: user.name,
    permissions: getPermissionsForRole(user.role),
  };
}

/** 合并本地新增用户与 mock 种子，保证演示账号始终可用 */
function initialUsers(): User[] {
  const saved = loadPersistedUsers();
  const byId = new Map<string, User>();
  for (const u of mockUsers) {
    byId.set(u.id, withFreshPermissions(u));
  }
  if (saved) {
    for (const u of saved) {
      if (!u?.id || !u.role) continue;
      // 覆盖同 id；保留用户新增的账号
      byId.set(u.id, withFreshPermissions(u));
    }
  }
  // 若种子 EMP-001 被弄丢，强制补回
  const hasEmp001 = [...byId.values()].some((u) => u.employeeId === 'EMP-001');
  if (!hasEmp001) {
    const seed = mockUsers.find((u) => u.employeeId === 'EMP-001');
    if (seed) byId.set(seed.id, withFreshPermissions(seed));
  }
  return [...byId.values()];
}

function resolveUser(employeeId: string, users: User[]): User | undefined {
  return (
    users.find((u) => u.employeeId === employeeId && u.status === 'active') ??
    findUserByEmployeeId(employeeId)
  );
}

const bootUsers = initialUsers();
const defaultUser =
  resolveUser('EMP-001', bootUsers) ??
  bootUsers.find((u) => u.status === 'active') ??
  null;

interface AuthState {
  currentUser: User | null;
  availableRoles: UserRole[];
  switching: boolean;
  switchLabel: string;
  loginModalOpen: boolean;
  setLoginModalOpen: (v: boolean) => void;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => boolean;
  hasPermission: (module: string, action: PermissionAction) => boolean;
  login: (employeeId: string) => boolean;
  logout: () => void;
  updateUserLocal: (user: User) => void;
  upsertUser: (user: User) => void;
  users: User[];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: defaultUser ? withFreshPermissions(defaultUser) : null,
  availableRoles: ALL_ROLES,
  switching: false,
  switchLabel: '',
  loginModalOpen: false,
  users: bootUsers,

  setLoginModalOpen: (v) => set({ loginModalOpen: v }),

  hasPermission: (module, action) => {
    const user = get().currentUser;
    if (!user) return false;
    const p = user.permissions.find((x) => x.module === module);
    if (!p || !p.canView) return false;
    if (action === 'view') return p.canView;
    if (action === 'edit') return p.canEdit;
    if (action === 'delete') return p.canDelete;
    if (action === 'export') return p.canExport;
    return false;
  },

  switchRole: (role) => {
    const label = ROLE_LABELS[role];
    set({ switching: true, switchLabel: `正在切换至${label}...` });

    window.setTimeout(() => {
      const candidates = get().users.filter(
        (u) => u.role === role && u.status === 'active',
      );
      const seed = mockUsers.find((u) => u.role === role && u.status === 'active');
      const next =
        candidates[0] ??
        seed ??
        ({
          id: `TMP-${role}`,
          name: label,
          employeeId: 'TMP-000',
          role,
          department: '演示',
          email: 'demo@basf-scip.com',
          phone: '-',
          avatar: label,
          status: 'active' as const,
          permissions: getPermissionsForRole(role),
        } satisfies User);

      set({
        currentUser: withFreshPermissions({
          ...next,
          lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        }),
        switching: false,
        switchLabel: '',
      });
    }, 500);
  },

  switchUser: (userId) => {
    const user = get().users.find((u) => u.id === userId);
    if (!user || user.status !== 'active') return false;

    set({ switching: true, switchLabel: `正在切换至${user.name}...` });
    window.setTimeout(() => {
      set({
        currentUser: withFreshPermissions({
          ...user,
          lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        }),
        switching: false,
        switchLabel: '',
      });
    }, 400);
    return true;
  },

  login: (employeeId) => {
    const user = resolveUser(employeeId, get().users);
    if (!user || user.status !== 'active') return false;
    set({
      currentUser: withFreshPermissions({
        ...user,
        lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }),
      loginModalOpen: false,
    });
    return true;
  },

  logout: () => set({ currentUser: null, loginModalOpen: true }),

  updateUserLocal: (user) => {
    const normalized = withFreshPermissions(user);
    set((state) => {
      const users = state.users.map((u) => (u.id === normalized.id ? normalized : u));
      persistUsers(users);
      return {
        users,
        currentUser:
          state.currentUser?.id === normalized.id
            ? normalized
            : state.currentUser,
      };
    });
  },

  upsertUser: (user) => {
    const normalized = withFreshPermissions(user);
    set((state) => {
      const exists = state.users.some((u) => u.id === normalized.id);
      const users = exists
        ? state.users.map((u) => (u.id === normalized.id ? normalized : u))
        : [...state.users, normalized];
      persistUsers(users);
      return { users };
    });
  },
}));
