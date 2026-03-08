import { adminClient } from '../client';
import type { PageResult } from '@shared/types/common';
import type { AdminReviewItem } from '@shared/types/admin';

export function listReviews(data: { pageNo?: number; pageSize?: number; orderNo?: string; productId?: string; userId?: string; rating?: number; replied?: boolean }) {
  return adminClient.post<never, PageResult<AdminReviewItem>>('/review/list', data);
}

export function getReviewDetail(reviewId: string) {
  return adminClient.get<never, AdminReviewItem>(`/review/detail/${reviewId}`);
}

export function replyReview(data: { reviewId: string; replyContent: string }) {
  return adminClient.post('/review/reply', data);
}

export function deleteReview(reviewId: string) {
  return adminClient.post(`/review/delete/${reviewId}`);
}
