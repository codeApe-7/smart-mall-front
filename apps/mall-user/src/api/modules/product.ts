import { request } from '@/api/client';
import type { PageResult } from '@shared/types/common';
import type { ProductDetail, ProductListItem, ProductQuery, ProductReview } from '@shared/types/mall';

export interface ProductDetailResponse extends Record<string, unknown> {
  productInfo?: Record<string, unknown>
  productPropertyList?: Array<Record<string, unknown>>
  skuList?: Array<Record<string, unknown>>
}

export const fetchProductList = (data?: ProductQuery) => request.post<PageResult<ProductListItem>>('/product/list', data);
export const listProducts = fetchProductList;
export const fetchRecommendProducts = (params?: { userId?: string; limit?: number }) => request.get<ProductListItem[]>('/product/recommend', { params });
export const recommendProducts = (userId?: string, limit = 8) => fetchRecommendProducts({ userId, limit });
export const fetchProductDetail = (productId: string) => request.get<ProductDetailResponse>(`/product/detail/${productId}`);
export const getProductDetail = fetchProductDetail;
export const searchKnowledge = (data: { productName?: string; question?: string; keyword?: string; pageNo?: number; pageSize?: number; productId?: string; categoryIdOrPCategoryId?: string; semanticSearch?: boolean }) => request.post<PageResult<Record<string, unknown>>>('/product/knowledge/search', data);
export const fetchKnowledgeDetail = (productId: string) => request.get<Record<string, unknown>>(`/product/knowledge/detail/${productId}`);
export const getKnowledgeDetail = fetchKnowledgeDetail;
export const compareProducts = (data: { productIds: string[]; keyword?: string; maxCount?: number; semanticSearch?: boolean; userQuestion?: string }) => request.post<Record<string, unknown>>('/product/knowledge/compare', data);
export const compareKnowledge = compareProducts;
export const getProductReviews = (data: { productId: string; pageNo?: number; pageSize?: number }) => request.post<PageResult<ProductReview>>('/review/productReviews', data);
