import {
  Modules,
  UserRole,
  type Permission,
} from '../types/user';

function perm(
  module: string,
  opts: Partial<Permission> & Pick<Permission, 'canView'>,
): Permission {
  return {
    module,
    canView: opts.canView,
    canEdit: opts.canEdit ?? false,
    canDelete: opts.canDelete ?? false,
    canExport: opts.canExport ?? false,
    dataScope: opts.dataScope ?? 'all',
  };
}

/** 控制塔总监：全量权限 */
export const directorPermissions: Permission[] = Object.values(Modules).map((m) =>
  perm(m, {
    canView: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    dataScope: 'all',
  }),
);

/** 采购经理 */
export const procurementPermissions: Permission[] = [
  perm(Modules.DASHBOARD, { canView: true, canExport: true, dataScope: 'all' }),
  perm(Modules.CONTROL_TOWER, { canView: true, dataScope: 'all' }),
  perm(Modules.PROCUREMENT, {
    canView: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    dataScope: 'all',
  }),
  perm(Modules.ORDERS, {
    canView: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    dataScope: 'self',
  }),
  perm(Modules.SOURCING, {
    canView: true,
    canEdit: true,
    canExport: true,
    dataScope: 'all',
  }),
  perm(Modules.INVENTORY, { canView: true, dataScope: 'all' }),
  perm(Modules.WAREHOUSE, { canView: true, dataScope: 'all' }),
  perm(Modules.LOGISTICS, { canView: true, dataScope: 'all' }),
  perm(Modules.PROCESS_FLOW, {
    canView: true,
    canEdit: true,
    dataScope: 'all',
  }),
  perm(Modules.FINANCE, { canView: true, dataScope: 'all' }),
  perm(Modules.RISK, { canView: true, dataScope: 'all' }),
  perm(Modules.AI, { canView: true, canEdit: true, dataScope: 'department' }),
  perm(Modules.WORKSPACE, { canView: true, canEdit: true, dataScope: 'self' }),
];

/** 物流调度主管：仓储物流全模块 + 交付只读协同 */
export const logisticsPermissions: Permission[] = [
  perm(Modules.DASHBOARD, { canView: true, canExport: true, dataScope: 'all' }),
  perm(Modules.CONTROL_TOWER, { canView: true, dataScope: 'all' }),
  perm(Modules.INVENTORY, {
    canView: true,
    canEdit: true,
    canExport: true,
    dataScope: 'all',
  }),
  perm(Modules.WAREHOUSE, {
    canView: true,
    canEdit: true,
    canExport: true,
    dataScope: 'all',
  }),
  perm(Modules.PROCESS_FLOW, {
    canView: true,
    canEdit: true,
    dataScope: 'all',
  }),
  perm(Modules.LOGISTICS, {
    canView: true,
    canEdit: true,
    canExport: true,
    dataScope: 'all',
  }),
  perm(Modules.CUSTOMS, {
    canView: true,
    canEdit: true,
    canExport: true,
    dataScope: 'all',
  }),
  perm(Modules.DELIVERY, { canView: true, dataScope: 'all' }),
  perm(Modules.ORDERS, { canView: true, dataScope: 'all' }),
  perm(Modules.RISK, { canView: true, dataScope: 'all' }),
  perm(Modules.AI, { canView: true, canEdit: true, dataScope: 'department' }),
  perm(Modules.WORKSPACE, { canView: true, canEdit: true, dataScope: 'self' }),
];

/** 客服专员 */
export const customerServicePermissions: Permission[] = [
  perm(Modules.DASHBOARD, { canView: true, canExport: true, dataScope: 'all' }),
  perm(Modules.DELIVERY, {
    canView: true,
    canEdit: true,
    canExport: true,
    dataScope: 'all',
  }),
  perm(Modules.LOGISTICS, { canView: true, dataScope: 'all' }),
  perm(Modules.INVENTORY, { canView: true, dataScope: 'all' }),
  perm(Modules.ORDERS, { canView: true, dataScope: 'all' }),
  perm(Modules.AI, { canView: true, canEdit: true, dataScope: 'department' }),
  perm(Modules.WORKSPACE, { canView: true, canEdit: true, dataScope: 'self' }),
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CONTROL_TOWER_DIRECTOR]: directorPermissions,
  [UserRole.PROCUREMENT_MANAGER]: procurementPermissions,
  [UserRole.LOGISTICS_SUPERVISOR]: logisticsPermissions,
  [UserRole.CUSTOMER_SERVICE]: customerServicePermissions,
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role].map((p) => ({ ...p }));
}
