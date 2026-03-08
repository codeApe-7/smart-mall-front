import { adminClient } from '../client';
import type { PageResult } from '@shared/types/common';
import type { AdminNoticeItem } from '@shared/types/admin';

export function listNotices(data: { pageNo?: number; pageSize?: number; noticeTitle?: string; messageType?: string; publishStatus?: number }) {
  return adminClient.post<never, PageResult<AdminNoticeItem>>('/notice/list', data);
}

export function getNoticeDetail(noticeId: string) {
  return adminClient.get(`/notice/detail/${noticeId}`);
}

export function saveNotice(data: { noticeId?: string; noticeTitle: string; noticeSummary?: string; noticeContent: string; messageType: string; targetType?: number; targetUserId?: string }) {
  return adminClient.post('/notice/save', data);
}

export function publishNotice(noticeId: string) {
  return adminClient.post(`/notice/publish/${noticeId}`);
}

export function offlineNotice(noticeId: string) {
  return adminClient.post(`/notice/offline/${noticeId}`);
}

export function deleteNotice(noticeId: string) {
  return adminClient.post(`/notice/delete/${noticeId}`);
}
