import { request } from '@/api/client'
import type { PageResultVO } from '@shared/types/common'
import type { ProductReview } from '@shared/types/mall'

export const submitReview = (data: {
  userId: string
  orderId: string
  reviews: Array<{ itemId: string; productId: string; rating: number; content?: string }>
}) => request.post<void>('/review/submit', data)

export const fetchOrderReviews = (userId: string, orderId: string) => request.get<ProductReview[]>('/review/orderReviews', { params: { userId, orderId } })

export const fetchProductReviews = (data: { productId: string; pageNo?: number; pageSize?: number }) => request.post<PageResultVO<ProductReview>>('/review/productReviews', data)
