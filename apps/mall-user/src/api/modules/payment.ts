import { request } from '@/api/client'

export const submitPayment = (data: { userId: string; orderId: string; payChannel?: string }) =>
  request.post<Record<string, unknown>>('/payment/submit', data)

export const callbackPayment = (data: Record<string, unknown>) => request.post<Record<string, unknown>>('/payment/callback', data)
