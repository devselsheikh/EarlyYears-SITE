export const APP_ROLES = ['owner', 'admin', 'teacher', 'parent'] as const;
export type AppRole = (typeof APP_ROLES)[number];

export type Permission =
  | 'platform.manage' | 'users.manage' | 'website.publish' | 'website.edit'
  | 'children.manage' | 'children.view-assigned' | 'attendance.manage'
  | 'updates.publish' | 'messages.manage' | 'billing.view' | 'family.view-own';

export const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  owner: ['platform.manage', 'users.manage', 'website.publish', 'website.edit', 'children.manage', 'children.view-assigned', 'attendance.manage', 'updates.publish', 'messages.manage', 'billing.view', 'family.view-own'],
  admin: ['users.manage', 'website.edit', 'children.manage', 'children.view-assigned', 'attendance.manage', 'updates.publish', 'messages.manage', 'billing.view'],
  teacher: ['children.view-assigned', 'attendance.manage', 'updates.publish', 'messages.manage'],
  parent: ['family.view-own'],
};

export const ROLE_LABELS: Record<AppRole, string> = {
  owner: 'Owner', admin: 'Admin', teacher: 'Teacher', parent: 'Parent',
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && APP_ROLES.includes(value as AppRole);
}

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function roleFromMetadata(metadata: Record<string, unknown> | undefined): AppRole | null {
  return isAppRole(metadata?.role) ? metadata.role : null;
}

