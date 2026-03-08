import type { PageResult } from './common';

export interface CheckCodePayload {
  checkCode: string;
  checkCodeKey: string;
}

export interface AdminCurrentAccount {
  accountId: string;
  accountName: string;
  nickname?: string;
  superAdmin?: boolean;
  roleCodes?: string[];
  roleNames?: string[];
  permissionCodes?: string[];
  lastLoginTime?: string;
}

export interface DashboardOverview {
  summary?: Array<{ label: string; value: number; trend?: number }>;
  pendingShipmentOrders?: Array<Record<string, unknown>>;
  lowStockProducts?: Array<Record<string, unknown>>;
  saleTrendList?: Array<Record<string, unknown>>;
  refundTrendList?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface SysCategoryNode {
  categoryId: string;
  categoryName: string;
  pCategoryId?: string;
  sort?: number;
  children?: SysCategoryNode[];
  properties?: Array<{ propertyId?: string; propertyName: string; categoryId?: string; coverType?: number }>;
}

export interface AdminProductItem {
  productId: string;
  productName: string;
  categoryName?: string;
  salePrice?: number;
  stockNum?: number;
  status?: number;
  saleCount?: number;
  [key: string]: unknown;
}

export interface AdminOrderItem {
  orderId: string;
  orderNo?: string;
  userId?: string;
  orderStatus?: number;
  orderStatusDesc?: string;
  payAmount?: number;
  createTime?: string;
  [key: string]: unknown;
}

export interface AdminRefundItem {
  refundId: string;
  orderId?: string;
  orderNo?: string;
  userId?: string;
  refundStatus?: number;
  refundStatusDesc?: string;
  refundAmount?: number;
  refundReason?: string;
  [key: string]: unknown;
}

export interface AdminReviewItem {
  reviewId: string;
  orderNo?: string;
  productName?: string;
  userId?: string;
  rating?: number;
  content?: string;
  replyContent?: string;
  replyTime?: string;
  [key: string]: unknown;
}

export interface AdminUserItem {
  userId: string;
  username?: string;
  nickname?: string;
  phone?: string;
  status?: number;
  statusDesc?: string;
  orderCount?: number;
  refundCount?: number;
  lastActiveTime?: string;
  [key: string]: unknown;
}

export interface AdminNoticeItem {
  noticeId: string;
  noticeTitle: string;
  noticeSummary?: string;
  messageType?: string;
  publishStatus?: number;
  publishStatusDesc?: string;
  publishedTime?: string;
  [key: string]: unknown;
}

export interface AdminAiConfig {
  assistantAgentEnabled?: boolean;
  semanticSearchEnabled?: boolean;
  openaiBaseUrl?: string;
  openaiApiKeyMasked?: string;
  mcpUrl?: string;
  [key: string]: unknown;
}

export interface AdminKnowledgeSummary {
  totalProductCount?: number;
  indexedProductCount?: number;
  lastSyncTime?: string;
  [key: string]: unknown;
}

export interface AdminAiMonitorOverview {
  summaryList?: Array<{ label: string; value: string | number }>;
  recentEvents?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface AdminAccountItem {
  accountId: string;
  accountName?: string;
  nickname?: string;
  status?: number;
  statusDesc?: string;
  roleNames?: string[];
  lastLoginTime?: string;
  [key: string]: unknown;
}

export interface AdminRoleItem {
  roleId: string;
  roleName?: string;
  roleCode?: string;
  status?: number;
  permissionCodes?: string[];
  [key: string]: unknown;
}

export interface AdminPermissionGroup {
  groupName?: string;
  permissions?: Array<{ permissionCode: string; permissionName: string }>;
  [key: string]: unknown;
}

export interface AdminAuditItem {
  logId?: string;
  operatorName?: string;
  operationType?: string;
  operationDesc?: string;
  createTime?: string;
  [key: string]: unknown;
}

export type PagedAdminProducts = PageResult<AdminProductItem>;
export type PagedAdminOrders = PageResult<AdminOrderItem>;
export type PagedAdminRefunds = PageResult<AdminRefundItem>;
export type PagedAdminReviews = PageResult<AdminReviewItem>;
export type PagedAdminUsers = PageResult<AdminUserItem>;
export type PagedAdminNotices = PageResult<AdminNoticeItem>;
export type PagedAdminAccounts = PageResult<AdminAccountItem>;
export type PagedAdminRoles = PageResult<AdminRoleItem>;
export type PagedAdminAudits = PageResult<AdminAuditItem>;
