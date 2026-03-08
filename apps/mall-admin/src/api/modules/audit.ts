import { adminClient } from '../client';
import type { PageResult } from '@shared/types/common';
import type { AdminAuditItem } from '@shared/types/admin';

export function listAuditLogs(data: { pageNo?: number; pageSize?: number; operatorName?: string; operationType?: string }) {
  return adminClient.post<never, PageResult<AdminAuditItem>>('/audit/list', data);
}
