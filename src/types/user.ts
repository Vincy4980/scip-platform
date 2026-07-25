/** 用户角色（const 对象，兼容 erasableSyntaxOnly，语义等同 enum） */
export const UserRole = {
  CONTROL_TOWER_DIRECTOR: 'control_tower_director',
  PROCUREMENT_MANAGER: 'procurement_manager',
  LOGISTICS_SUPERVISOR: 'logistics_supervisor',
  CUSTOMER_SERVICE: 'customer_service',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type PermissionAction = 'view' | 'edit' | 'delete' | 'export';
export type DataScope = 'all' | 'department' | 'self';

export interface Permission {
  module: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  dataScope: DataScope;
}

export interface User {
  id: string;
  name: string;
  employeeId: string;
  role: UserRole;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastLoginAt?: string;
  permissions: Permission[];
}

export interface OperationLog {
  id: string;
  time: string;
  action: string;
  detail: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CONTROL_TOWER_DIRECTOR]: '控制塔总监',
  [UserRole.PROCUREMENT_MANAGER]: '采购经理',
  [UserRole.LOGISTICS_SUPERVISOR]: '物流调度主管',
  [UserRole.CUSTOMER_SERVICE]: '客服专员',
};

/** 角色色标：蓝 / 橙浅底 / 绿 / 紫 */
export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.CONTROL_TOWER_DIRECTOR]: 'bg-[#E8F3FF] text-[#1677FF]',
  [UserRole.PROCUREMENT_MANAGER]: 'bg-[#FFF1E6] text-[#FF7D29]',
  [UserRole.LOGISTICS_SUPERVISOR]: 'bg-[#E8FFEA] text-[#00B42A]',
  [UserRole.CUSTOMER_SERVICE]: 'bg-[#F3E8FF] text-[#845EC2]',
};

/** 平台模块标识 */
export const Modules = {
  DASHBOARD: 'dashboard',
  CONTROL_TOWER: 'control_tower',
  SOURCING: 'sourcing',
  PROCUREMENT: 'procurement',
  ORDERS: 'orders',
  INVENTORY: 'inventory',
  WAREHOUSE: 'warehouse',
  LOGISTICS: 'logistics',
  CUSTOMS: 'customs',
  DELIVERY: 'delivery',
  FINANCE: 'finance',
  SUSTAINABILITY: 'sustainability',
  RISK: 'risk',
  AI: 'ai',
  USERS: 'users',
  WORKSPACE: 'my_workspace',
  PROCESS_FLOW: 'process_flow',
} as const;

export type ModuleKey = (typeof Modules)[keyof typeof Modules];
