import { adminClient } from '../client';
import type { PageResult } from '@shared/types/common';
import type { AdminAccountItem, AdminPermissionGroup, AdminRoleItem } from '@shared/types/admin';

export function listAccounts(data: { pageNo?: number; pageSize?: number; keyword?: string; status?: number; roleId?: string }) {
  return adminClient.post<never, PageResult<AdminAccountItem>>('/authority/account/list', data);
}

export function getAccountDetail(accountId: string) {
  return adminClient.get(`/authority/account/detail/${accountId}`);
}

export function saveAccount(data: Record<string, unknown>) {
  return adminClient.post('/authority/account/save', data);
}

export function updateAccountStatus(data: { accountId: string; status: number }) {
  return adminClient.post('/authority/account/status', data);
}

export function resetAccountPassword(data: { accountId: string; password: string }) {
  return adminClient.post('/authority/account/reset-password', data);
}

export function listRoles(data: { pageNo?: number; pageSize?: number; keyword?: string; status?: number }) {
  return adminClient.post<never, PageResult<AdminRoleItem>>('/authority/role/list', data);
}

export function saveRole(data: Record<string, unknown>) {
  return adminClient.post('/authority/role/save', data);
}

export function updateRoleStatus(data: { roleId: string; status: number }) {
  return adminClient.post('/authority/role/status', data);
}

export function getPermissionList() {
  return adminClient.get<never, AdminPermissionGroup[]>('/authority/permission/list');
}
