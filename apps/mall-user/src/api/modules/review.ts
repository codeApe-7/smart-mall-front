import { request } from '@/api/client'

export const submitReview = (data: {
  userId: string
  orderId: string
  reviews: Array<{ itemId: string; productId: string; rating: number; content?: string }>
}) => request.post<void>('/review/submit', data)

export const fetchOrderReviews = (userId: string, orderId: string) =>
  request.get<Array<Record<string, unknown>>>('/review/orderReviews', { params: { userId, orderId } })

export const fetchProductReviews = (data: { productId: string; pageNo?: number; pageSize?: number }) =>
  request.post<Record<string, unknown>>('/review/productReviews', data)
