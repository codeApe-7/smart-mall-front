import { request } from '@/api/client'

export const fetchShippingDetail = (userId: string, orderId: string) =>
  request.get<Record<string, unknown>>('/shipping/detail', { params: { userId, orderId } })

export const confirmReceive = (data: { userId: string; orderId: string }) =>
  request.post<void>('/shipping/confirmReceive', data)
