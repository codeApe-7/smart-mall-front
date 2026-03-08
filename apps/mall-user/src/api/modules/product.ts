import { request } from '@/api/client'
import type { PageResultVO } from '@shared/types/common'

export const fetchProductList = (data?: {
  pageNo?: number
  pageSize?: number
  productName?: string
  categoryIdOrPCategoryId?: string
  commendType?: number
  status?: number
  semanticSearch?: boolean
}) => request.post<PageResultVO<Record<string, unknown>>>('/product/list', data)

export const fetchRecommendProducts = (params?: { userId?: string; limit?: number }) =>
  request.get<Array<Record<string, unknown>>>('/product/recommend', { params })

export const fetchProductDetail = (productId: string) =>
  request.get<Record<string, unknown>>(`/product/detail/${productId}`)

export const searchKnowledge = (data: {
  pageNo?: number
  pageSize?: number
  keyword?: string
  productId?: string
  categoryIdOrPCategoryId?: string
  semanticSearch?: boolean
}) => request.post<Record<string, unknown>>('/product/knowledge/search', data)

export const fetchKnowledgeDetail = (productId: string) =>
  request.get<Record<string, unknown>>(`/product/knowledge/detail/${productId}`)

export const compareProducts = (data: {
  productIds: string[]
  keyword?: string
  maxCount?: number
  semanticSearch?: boolean
}) => request.post<Record<string, unknown>>('/product/knowledge/compare', data)
