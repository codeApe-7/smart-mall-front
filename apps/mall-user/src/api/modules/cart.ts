import { request } from '@/api/client';
import type { ShoppingCart } from '@shared/types/mall';

export const getCart = (userId: string) => request.get<ShoppingCart>('/cart/list', { params: { userId } });
export const addToCart = (data: { userId: string; productId: string; skuId?: string; quantity: number }) => request.post<void>('/cart/add', data);
export const updateCartQuantity = (data: { userId: string; cartId: string; quantity: number }) => request.post<void>('/cart/updateQuantity', data);
export const updateCartSelected = (data: { userId: string; cartIds: string[]; selected: boolean }) => request.post<void>('/cart/updateSelected', data);
export const deleteCartItems = (data: { userId: string; cartIds: string[] }) => request.post<void>('/cart/delete', data);
