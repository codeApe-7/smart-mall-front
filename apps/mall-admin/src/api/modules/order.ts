import { adminClient } from '../client';
import type { PageResult } from '@shared/types/common';
import type { AdminOrderItem, AdminRefundItem } from '@shared/types/admin';

export function listOrders(data: { pageNo?: number; pageSize?: number; orderNo?: string; userId?: string; orderStatus?: number }) {
  return adminClient.post<never, PageResult<AdminOrderItem>>('/order/list', data);
}

export function getOrderDetail(orderId: string) {
  return adminClient.get(`/order/detail/${orderId}`);
}

export function shipOrder(data: { orderId: string; companyName: string; trackingNo: string }) {
  return adminClient.post('/order/ship', data);
}

export function getShipping(orderId: string) {
  return adminClient.get(`/order/shipping/${orderId}`);
}

export function listRefunds(data: { pageNo?: number; pageSize?: number; orderNo?: string; userId?: string; refundStatus?: number }) {
  return adminClient.post<never, PageResult<AdminRefundItem>>('/refund/list', data);
}

export function getRefundDetail(refundId: string) {
  return adminClient.get(`/refund/detail/${refundId}`);
}

export function approveRefund(refundId: string) {
  return adminClient.post(`/refund/approve/${refundId}`);
}

export function rejectRefund(refundId: string) {
  return adminClient.post(`/refund/reject/${refundId}`);
}
