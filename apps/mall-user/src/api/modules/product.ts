import { request } from '@/api/client'
import type { PageResultVO } from '@shared/types/common'
import type { ProductDetail, ProductListItem, ProductQuery } from '@shared/types/mall'

export interface ProductDetailResponse {
  productInfo?: Record<string, unknown>
  productPropertyList?: Array<Record<string, unknown>>
  skuList?: Array<Record<string, unknown>>
}

export const fetchProductList = (data?: ProductQuery) =>
  request.post<PageResultVO<ProductListItem>>('/product/list', data).then((response) => response.data)

export const fetchRecommendProducts = (params?: { userId?: string; limit?: number }) =>
  request.get<ProductListItem[]>('/product/recommend', { params }).then((response) => response.data)

export const fetchProductDetail = (productId: string) =>
  request.get<ProductDetailResponse>(`/product/detail/${productId}`).then((response) => response.data)

export const searchKnowledge = (data: {
  pageNo?: number
  pageSize?: number
  keyword?: string
  productId?: string
  categoryIdOrPCategoryId?: string
  semanticSearch?: boolean
}) => request.post<PageResultVO<Record<string, unknown>>>('/product/knowledge/search', data).then((response) => response.data)

export const fetchKnowledgeDetail = (productId: string) =>
  request.get<Record<string, unknown>>(`/product/knowledge/detail/${productId}`).then((response) => response.data)

export const compareProducts = (data: {
  productIds: string[]
  keyword?: string
  maxCount?: number
  semanticSearch?: boolean
}) => request.post<Record<string, unknown>>('/product/knowledge/compare', data).then((response) => response.data)
