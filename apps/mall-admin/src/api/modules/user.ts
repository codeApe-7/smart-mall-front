import { adminClient } from '../client';
import type { PageResult } from '@shared/types/common';
import type { AdminUserItem } from '@shared/types/admin';

export function listUsers(data: { pageNo?: number; pageSize?: number; keyword?: string; phone?: string; status?: number }) {
  return adminClient.post<never, PageResult<AdminUserItem>>('/user/list', data);
}

export function getUserDetail(userId: string) {
  return adminClient.get(`/user/detail/${userId}`);
}

export function updateUserStatus(data: { userId: string; status: number }) {
  return adminClient.post('/user/status', data);
}
