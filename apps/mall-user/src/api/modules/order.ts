import { request } from '@/api/client';
import type { PageResult } from '@shared/types/common';
import type { OrderCreateResult, OrderDetail, OrderPreview, OrderSummary, PaymentSubmitResult, RefundInfo, ShippingInfo } from '@shared/types/mall';

export const previewOrder = (data: { userId: string; cartIds: string[] }) => request.post<OrderPreview>('/order/preview', data);
export const createOrder = (data: { userId: string; cartIds: string[]; receiverName: string; receiverPhone: string; receiverAddress: string; orderRemark?: string }) => request.post<OrderCreateResult>('/order/create', data);
export const listOrders = (data: { userId: string; orderStatus?: number; pageNo?: number; pageSize?: number }) => request.post<PageResult<OrderSummary>>('/order/list', data);
export const getOrderDetail = (userId: string, orderId: string) => request.get<OrderDetail>('/order/detail', { params: { userId, orderId } });
export const cancelOrder = (data: { userId: string; orderId: string }) => request.post<void>('/order/cancel', data);
export const submitPayment = (data: { userId: string; orderId: string; payType?: string }) => request.post<PaymentSubmitResult>('/payment/submit', data);
export const paymentCallback = (data: { paymentNo: string; callbackStatus: string; callbackContent?: string }) => request.post<void>('/payment/callback', data);
export const applyRefund = (data: { userId: string; orderId: string; refundReason: string }) => request.post<RefundInfo>('/refund/apply', data);
export const getRefundDetail = (userId: string, orderId: string) => request.get<RefundInfo>('/refund/detail', { params: { userId, orderId } });
export const getShippingDetail = (userId: string, orderId: string) => request.get<ShippingInfo>('/shipping/detail', { params: { userId, orderId } });
export const confirmReceive = (data: { userId: string; orderId: string }) => request.post<void>('/shipping/confirmReceive', data);
export const submitReview = (data: { userId: string; orderId: string; reviews: Array<{ productId: string; rating: number; content: string }> }) => request.post('/review/submit', data);
export const getOrderReviews = (userId: string, orderId: string) => request.get('/review/orderReviews', { params: { userId, orderId } });
export const getProductReviews = (data: { productId: string; pageNo?: number; pageSize?: number }) => request.post<PageResult<Record<string, unknown>>>('/review/productReviews', data);
