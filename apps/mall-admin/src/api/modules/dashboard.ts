import { adminClient } from '../client';
import type { DashboardOverview } from '@shared/types/admin';

export function getDashboardOverview() {
  return adminClient.get<never, DashboardOverview>('/dashboard/overview');
}
