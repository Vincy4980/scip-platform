import { Modules, UserRole, type User } from '../types/user';

/** 根据当前用户角色与 dataScope 过滤列表数据 */
export function filterDataByRole<T>(
  data: T[],
  user: User | null,
  dataOwnerField: keyof T,
  module: string,
): T[] {
  if (!user) return [];
  if (user.role === UserRole.CONTROL_TOWER_DIRECTOR) return data;

  const perm = user.permissions.find((p) => p.module === module);
  if (!perm?.canView) return [];

  if (perm.dataScope === 'all') return data;

  if (perm.dataScope === 'self') {
    return data.filter((item) => {
      const owner = item[dataOwnerField];
      return (
        owner === user.employeeId ||
        owner === user.id ||
        owner === user.name
      );
    });
  }

  // department：演示中放行全部模块可见数据，真实环境可按部门字段过滤
  return data;
}

export function canAccessModule(user: User | null, module: string): boolean {
  if (!user) return false;
  return !!user.permissions.find((p) => p.module === module)?.canView;
}

export function isReadOnly(user: User | null, module: string): boolean {
  if (!user) return true;
  const p = user.permissions.find((x) => x.module === module);
  return !!p?.canView && !p.canEdit;
}

/** 工作台 / Dashboard KPI 域过滤 */
export type KpiDomain = 'all' | 'procurement' | 'logistics' | 'delivery';

export function getKpiDomain(role: UserRole): KpiDomain {
  switch (role) {
    case UserRole.CONTROL_TOWER_DIRECTOR:
      return 'all';
    case UserRole.PROCUREMENT_MANAGER:
      return 'procurement';
    case UserRole.LOGISTICS_SUPERVISOR:
      return 'logistics';
    case UserRole.CUSTOMER_SERVICE:
      return 'delivery';
    default:
      return 'all';
  }
}

export const MODULE_ROUTE_MAP: Record<string, string> = {
  [Modules.DASHBOARD]: '/',
  [Modules.CONTROL_TOWER]: '/control-tower',
  [Modules.SOURCING]: '/sourcing',
  [Modules.PROCUREMENT]: '/procurement',
  [Modules.ORDERS]: '/orders',
  [Modules.INVENTORY]: '/inventory',
  [Modules.WAREHOUSE]: '/warehouse',
  [Modules.LOGISTICS]: '/logistics',
  [Modules.CUSTOMS]: '/customs',
  [Modules.DELIVERY]: '/delivery',
  [Modules.FINANCE]: '/finance',
  [Modules.SUSTAINABILITY]: '/sustainability',
  [Modules.RISK]: '/risk',
  [Modules.AI]: '/ai',
  [Modules.USERS]: '/users',
  [Modules.WORKSPACE]: '/my-workspace',
};
