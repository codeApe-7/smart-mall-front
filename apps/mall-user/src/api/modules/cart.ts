import { request } from '@/api/client';
import type { ShoppingCart } from '@shared/types/mall';

export const getCart = (userId: string) => request.get<ShoppingCart>('/cart/list', { params: { userId } });
export const fetchCart = getCart;
export const addToCart = (data: { userId: string; productId: string; skuId?: string; quantity: number }) => request.post<void>('/cart/add', data);
export const addCartItem = addToCart;
export const updateCartQuantity = (data: { userId: string; cartId: string; quantity: number }) => request.post<void>('/cart/updateQuantity', data);
export const updateCartSelected = (data: { userId: string; cartIds?: string[]; cartId?: string; selected: boolean }) => request.post<void>('/cart/updateSelected', { userId: data.userId, cartIds: data.cartIds ?? (data.cartId ? [data.cartId] : []), selected: data.selected });
export const deleteCartItems = (data: { userId: string; cartIds: string[] }) => request.post<void>('/cart/delete', data);
