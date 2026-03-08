import { request } from '@/api/client'
import type { PageResultVO } from '@shared/types/common'

export const previewOrder = (data: { userId: string; cartIds: string[] }) =>
  request.post<Record<string, unknown>>('/order/preview', data)

export const createOrder = (data: {
  userId: string
  cartIds: string[]
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  orderRemark?: string
}) => request.post<Record<string, unknown>>('/order/create', data)

export const fetchOrderList = (data: { userId?: string; orderStatus?: number; pageNo?: number; pageSize?: number }) =>
  request.post<PageResultVO<Record<string, unknown>>>('/order/list', data)

export const fetchOrderDetail = (userId: string, orderId: string) =>
  request.get<Record<string, unknown>>('/order/detail', { params: { userId, orderId } })

export const cancelOrder = (data: { userId: string; orderId: string }) => request.post<void>('/order/cancel', data)
