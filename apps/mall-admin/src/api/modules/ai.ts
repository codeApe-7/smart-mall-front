import { adminClient } from '../client';
import type { AdminAiConfig, AdminAiMonitorOverview, AdminKnowledgeSummary } from '@shared/types/admin';

export function getAiConfig() {
  return adminClient.get<never, AdminAiConfig>('/ai-config/detail');
}

export function saveAiConfig(data: Record<string, unknown>) {
  return adminClient.post('/ai-config/save', data);
}

export function getKnowledgeSummary() {
  return adminClient.get<never, AdminKnowledgeSummary>('/knowledge/index/summary');
}

export function getProductKnowledge(productId: string) {
  return adminClient.get(`/knowledge/product/${productId}`);
}

export function syncKnowledge(productId: string) {
  return adminClient.post(`/knowledge/index/sync/${productId}`);
}

export function rebuildKnowledge() {
  return adminClient.post('/knowledge/index/rebuild');
}

export function getAiMonitorOverview() {
  return adminClient.get<never, AdminAiMonitorOverview>('/ai-monitor/overview');
}
