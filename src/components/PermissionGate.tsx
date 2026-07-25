import type { ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import type { PermissionAction } from '../types/user';

interface PermissionGateProps {
  module: string;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({
  module,
  action,
  children,
  fallback = null,
}: PermissionGateProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  if (!hasPermission(module, action)) return <>{fallback}</>;
  return <>{children}</>;
}
