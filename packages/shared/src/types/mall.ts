import type { PageResult } from './common';

export interface MallUserProfile {
  userId: string;
  username?: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
}

export interface MallUserLoginPayload {
  userToken: string;
  profile: MallUserProfile;
}

export interface ProductQuery {
  pageNo?: number;
  pageSize?: number;
  productName?: string;
  categoryIdOrPCategoryId?: string;
  commendType?: number;
  status?: number;
  semanticSearch?: boolean;
}

export interface ProductListItem {
  productId: string;
  productName: string;
  categoryName?: string;
  productCover?: string;
  price?: number;
  salePrice?: number;
  stockNum?: number;
  saleCount?: number;
  commendType?: number;
  status?: number;
  [key: string]: unknown;
}

export interface ProductDetail extends ProductListItem {
  productIntro?: string;
  propertyList?: Array<{ propertyName: string; propertyValue: string }>;
  skuList?: Array<{ skuId: string; skuName: string; salePrice?: number; stockNum?: number }>;
  reviewList?: ProductReview[];
}

export interface CartItem {
  cartId: string;
  productId: string;
  productName: string;
  productCover?: string;
  skuId?: string;
  skuName?: string;
  price?: number;
  quantity: number;
  selected?: boolean;
  stockNum?: number;
}

export interface ShoppingCart {
  items: CartItem[];
  itemCount?: number;
  totalQuantity?: number;
  selectedCount?: number;
  selectedAmount?: number;
}

export interface OrderPreview {
  addressList?: UserAddress[];
  items?: CartItem[];
  totalAmount?: number;
  payAmount?: number;
  freightAmount?: number;
  [key: string]: unknown;
}

export interface OrderSummary {
  orderId: string;
  orderNo?: string;
  userId?: string;
  orderStatus?: number;
  orderStatusDesc?: string;
  payAmount?: number;
  totalAmount?: number;
  createTime?: string;
  productCount?: number;
  [key: string]: unknown;
}

export interface OrderCreateResult {
  orderId: string;
  orderNo?: string;
  payAmount?: number;
  [key: string]: unknown;
}

export interface OrderDetail extends OrderSummary {
  itemList?: CartItem[];
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  orderRemark?: string;
}

export interface PaymentSubmitResult {
  paymentNo?: string;
  payUrl?: string;
  mockPayUrl?: string;
  [key: string]: unknown;
}

export interface RefundInfo {
  refundId?: string;
  orderId?: string;
  orderNo?: string;
  refundStatus?: number;
  refundStatusDesc?: string;
  refundAmount?: number;
  refundReason?: string;
  createTime?: string;
  [key: string]: unknown;
}

export interface ShippingInfo {
  shippingId?: string;
  orderId?: string;
  companyName?: string;
  trackingNo?: string;
  shippingStatus?: number;
  shippingStatusDesc?: string;
  shipTime?: string;
  receiveTime?: string;
  [key: string]: unknown;
}

export interface ProductReview {
  reviewId?: string;
  productId?: string;
  productName?: string;
  userId?: string;
  orderId?: string;
  rating?: number;
  content?: string;
  replyContent?: string;
  createTime?: string;
  [key: string]: unknown;
}

export interface MallMessage {
  noticeId: string;
  noticeTitle: string;
  noticeSummary?: string;
  noticeContent?: string;
  messageType?: string;
  publishedTime?: string;
  readStatus?: number;
  [key: string]: unknown;
}

export interface UserAddress {
  addressId?: string;
  receiverName: string;
  receiverPhone: string;
  province?: string;
  city?: string;
  region?: string;
  detailAddress: string;
  fullAddress?: string;
  addressLabel?: string;
  defaultAddress?: number;
}

export interface UserPreference {
  userId: string;
  favoriteCategoryNames?: string[];
  minPricePreference?: number;
  maxPricePreference?: number;
  recentSearchKeywords?: string[];
  preferenceTags?: string[];
  orderCount?: number;
  reviewCount?: number;
  averageRating?: number;
}

export interface AssistantChatResponse {
  sessionId: string;
  reply?: string;
  recommendProducts?: ProductListItem[];
  compareProducts?: ProductListItem[];
  orderResult?: OrderSummary;
  [key: string]: unknown;
}

export interface AssistantHistoryItem {
  sessionId: string;
  userId?: string;
  question?: string;
  answer?: string;
  createTime?: string;
  [key: string]: unknown;
}

export type PagedMessages = PageResult<MallMessage>;
export type PagedOrders = PageResult<OrderSummary>;
export type PagedReviews = PageResult<ProductReview>;
