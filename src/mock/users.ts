import { getPermissionsForRole } from '../config/roles';
import { UserRole, type OperationLog, type User } from '../types/user';

function u(
  partial: Omit<User, 'permissions' | 'avatar'> & { avatar?: string },
): User {
  return {
    ...partial,
    avatar: partial.avatar ?? partial.name,
    permissions: getPermissionsForRole(partial.role),
  };
}

/** 10 名演示用户 */
export const mockUsers: User[] = [
  u({
    id: 'U-001',
    name: '张伟',
    employeeId: 'EMP-001',
    role: UserRole.CONTROL_TOWER_DIRECTOR,
    department: '供应链管理部',
    email: 'zhang.wei@basf-scip.com',
    phone: '13800001001',
    status: 'active',
    lastLoginAt: '2026-07-14 09:12',
  }),
  u({
    id: 'U-002',
    name: '李娜',
    employeeId: 'EMP-002',
    role: UserRole.PROCUREMENT_MANAGER,
    department: '采购部',
    email: 'li.na@basf-scip.com',
    phone: '13800001002',
    status: 'active',
    lastLoginAt: '2026-07-14 08:45',
  }),
  u({
    id: 'U-003',
    name: '王强',
    employeeId: 'EMP-003',
    role: UserRole.LOGISTICS_SUPERVISOR,
    department: '物流部',
    email: 'wang.qiang@basf-scip.com',
    phone: '13800001003',
    status: 'active',
    lastLoginAt: '2026-07-14 07:50',
  }),
  u({
    id: 'U-004',
    name: '陈静',
    employeeId: 'EMP-004',
    role: UserRole.CUSTOMER_SERVICE,
    department: '客户服务部',
    email: 'chen.jing@basf-scip.com',
    phone: '13800001004',
    status: 'active',
    lastLoginAt: '2026-07-13 18:20',
  }),
  u({
    id: 'U-005',
    name: '刘洋',
    employeeId: 'EMP-005',
    role: UserRole.PROCUREMENT_MANAGER,
    department: '采购部',
    email: 'liu.yang@basf-scip.com',
    phone: '13800001005',
    status: 'active',
    lastLoginAt: '2026-07-13 16:02',
  }),
  u({
    id: 'U-006',
    name: '赵敏',
    employeeId: 'EMP-006',
    role: UserRole.LOGISTICS_SUPERVISOR,
    department: '物流部',
    email: 'zhao.min@basf-scip.com',
    phone: '13800001006',
    status: 'active',
    lastLoginAt: '2026-07-13 15:11',
  }),
  u({
    id: 'U-007',
    name: '孙磊',
    employeeId: 'EMP-007',
    role: UserRole.CUSTOMER_SERVICE,
    department: '客户服务部',
    email: 'sun.lei@basf-scip.com',
    phone: '13800001007',
    status: 'inactive',
    lastLoginAt: '2026-07-01 10:00',
  }),
  u({
    id: 'U-008',
    name: '周婷',
    employeeId: 'EMP-008',
    role: UserRole.CONTROL_TOWER_DIRECTOR,
    department: '供应链管理部',
    email: 'zhou.ting@basf-scip.com',
    phone: '13800001008',
    status: 'active',
    lastLoginAt: '2026-07-14 09:01',
  }),
  u({
    id: 'U-009',
    name: '吴刚',
    employeeId: 'EMP-009',
    role: UserRole.LOGISTICS_SUPERVISOR,
    department: '物流部',
    email: 'wu.gang@basf-scip.com',
    phone: '13800001009',
    status: 'active',
    lastLoginAt: '2026-07-12 21:30',
  }),
  u({
    id: 'U-010',
    name: '郑洁',
    employeeId: 'EMP-010',
    role: UserRole.CUSTOMER_SERVICE,
    department: '客户服务部',
    email: 'zheng.jie@basf-scip.com',
    phone: '13800001010',
    status: 'active',
    lastLoginAt: '2026-07-14 08:05',
  }),
];

export const mockUserLogs: Record<string, OperationLog[]> = {
  'U-001': [
    { id: 'L1', time: '2026-07-14 09:12', action: '登录', detail: '控制塔看板' },
    { id: 'L2', time: '2026-07-13 17:40', action: '审批', detail: '供应商准入 BASF SE' },
  ],
  'U-002': [
    { id: 'L3', time: '2026-07-14 08:45', action: '登录', detail: '采购协同' },
    { id: 'L4', time: '2026-07-13 11:20', action: '创建', detail: 'PO-2026-1012' },
  ],
  'U-003': [
    { id: 'L5', time: '2026-07-14 07:50', action: '登录', detail: '在途监控' },
    { id: 'L6', time: '2026-07-13 20:15', action: '处理告警', detail: '运输超时 SHP-8821' },
  ],
  'U-004': [
    { id: 'L7', time: '2026-07-13 18:20', action: '登录', detail: '客户交付' },
    { id: 'L8', time: '2026-07-13 16:00', action: '闭环投诉', detail: 'CMP-2026-010' },
  ],
};

export function findUserByEmployeeId(employeeId: string): User | undefined {
  return mockUsers.find((u) => u.employeeId === employeeId);
}

export function findUsersByRole(role: UserRole): User[] {
  return mockUsers.filter((u) => u.role === role && u.status === 'active');
}
