import { request } from '@/api/client'

export const applyRefund = (data: { userId: string; orderId: string; refundReason?: string }) =>
  request.post<void>('/refund/apply', data)

export const fetchRefundDetail = (userId: string, orderId: string) =>
  request.get<Record<string, unknown>>('/refund/detail', { params: { userId, orderId } })
