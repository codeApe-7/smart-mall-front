import { adminClient } from '../client';
import type { PageResult } from '@shared/types/common';
import type { AdminProductItem, SysCategoryNode } from '@shared/types/admin';

export function listCategories(data: { pageNo?: number; pageSize?: number; categoryName?: string; tree?: boolean; withProperty?: boolean; pCategoryId?: string }) {
  return adminClient.post<never, PageResult<SysCategoryNode> | SysCategoryNode[]>('/category/list', data);
}

export function addCategory(data: Record<string, unknown>) {
  return adminClient.post('/category/add', data);
}

export function updateCategory(data: Record<string, unknown>) {
  return adminClient.post('/category/update', data);
}

export function deleteCategory(categoryId: string) {
  return adminClient.post(`/category/delete/${categoryId}`);
}

export function addProperty(data: Record<string, unknown>) {
  return adminClient.post('/category/property/add', data);
}

export function updateProperty(data: Record<string, unknown>) {
  return adminClient.post('/category/property/update', data);
}

export function deleteProperty(propertyId: string) {
  return adminClient.post(`/category/property/delete/${propertyId}`);
}

export function listProducts(data: { pageNo?: number; pageSize?: number; productName?: string; categoryIdOrPCategoryId?: string; status?: number }) {
  return adminClient.post<never, PageResult<AdminProductItem>>('/product/loadProductList', data);
}

export function getProductDetail(productId: string) {
  return adminClient.get(`/product/getProductDetail/${productId}`);
}

export function saveProduct(data: Record<string, unknown>) {
  return adminClient.post('/product/save', data);
}

export function deleteProduct(productId: string) {
  return adminClient.post(`/product/delete/${productId}`);
}
