import { request } from '@/api/client'

export const fetchCart = (userId: string) => request.get<Record<string, unknown>>('/cart/list', { params: { userId } })

export const addCartItem = (data: {
  userId: string
  productId: string
  propertyValueIdHash: string
  quantity: number
}) => request.post<void>('/cart/add', data)

export const updateCartQuantity = (data: { userId: string; cartId: string; quantity: number }) =>
  request.post<void>('/cart/updateQuantity', data)

export const updateCartSelected = (data: { userId: string; cartId: string; selected: boolean }) =>
  request.post<void>('/cart/updateSelected', data)

export const deleteCartItems = (data: { userId: string; cartIds: string[] }) =>
  request.post<void>('/cart/delete', data)

export const getCart = fetchCart
