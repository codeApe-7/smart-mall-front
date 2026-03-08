import type { AxiosRequestConfig } from 'axios'
import type { PageResult } from '@shared/types/common'
import { createHttpClient } from '@shared/http/createHttpClient'
import { ADMIN_TOKEN_KEY } from '@shared/constants/storage'

const adminHttp = createHttpClient({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:6061',
  tokenKey: ADMIN_TOKEN_KEY,
  tokenHeader: 'adminToken',
})

export type PagedQuery = { pageNo?: number; pageSize?: number; [key: string]: unknown }
export type Dict = Record<string, any>

const get = <T>(url: string, config?: AxiosRequestConfig) => adminHttp.get<any, T>(url, config)
const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => adminHttp.post<any, T>(url, data, config)

export const accountApi = {
  getCheckCode: () => get<{ checkCode: string; checkCodeKey: string }>('/account/checkCode'),
  login: (payload: { account: string; password: string; checkCode: string; checkCodeKey: string }) =>
    post<string>('/account/login', payload),
  profile: () => get<Dict>('/account/profile'),
  logout: () => post<void>('/account/logout'),
}

export const dashboardApi = {
  overview: () => get<Dict>('/dashboard/overview'),
}

export const categoryApi = {
  list: (payload: PagedQuery) => post<any>('/category/list', payload),
  get: (categoryId: string) => get<Dict>(`/category/get/${categoryId}`),
  add: (payload: { categoryName: string; pCategoryId?: string }) => post<void>('/category/add', payload),
  update: (payload: Dict) => post<void>('/category/update', payload),
  remove: (categoryId: string) => post<void>(`/category/delete/${categoryId}`),
  addBatch: (payload: Dict[]) => post<void>('/category/addBatch', payload),
  updateBatch: (payload: Dict[]) => post<void>('/category/updateBatch', payload),
  deleteBatch: (payload: string[]) => post<void>('/category/deleteBatch', payload),
  tree: (pCategoryId?: string) => get<Dict[]>('/category/tree', { params: { pCategoryId } }),
  changeSort: (categoryIds: string) => post<void>('/category/changeSort', null, { params: { categoryIds } }),
  changeSortByList: (payload: string[]) => post<void>('/category/changeSortByList', payload),
  addProperty: (payload: { propertyName: string; pCategoryId?: string; categoryId: string; coverType?: number }) =>
    post<void>('/category/property/add', payload),
  updateProperty: (payload: Dict) => post<void>('/category/property/update', payload),
  removeProperty: (propertyId: string) => post<void>(`/category/property/delete/${propertyId}`),
  removePropertyBatch: (payload: string[]) => post<void>('/category/property/deleteBatch', payload),
}

export const productApi = {
  list: (payload: PagedQuery) => post<PageResult<Dict>>('/product/loadProductList', payload),
  detail: (productId: string) => get<Dict>(`/product/getProductDetail/${productId}`),
  save: (payload: Dict) => post<void>('/product/save', payload),
  remove: (productId: string) => post<void>(`/product/delete/${productId}`),
}

export const orderApi = {
  list: (payload: PagedQuery) => post<PageResult<Dict>>('/order/list', payload),
  detail: (orderId: string) => get<Dict>(`/order/detail/${orderId}`),
  ship: (payload: { orderId: string; shippingCompany?: string }) => post<Dict>('/order/ship', payload),
  shipping: (orderId: string) => get<Dict>(`/order/shipping/${orderId}`),
}

export const refundApi = {
  list: (payload: PagedQuery) => post<PageResult<Dict>>('/refund/list', payload),
  detail: (refundId: string) => get<Dict>(`/refund/detail/${refundId}`),
  approve: (refundId: string) => post<void>(`/refund/approve/${refundId}`),
  reject: (refundId: string) => post<void>(`/refund/reject/${refundId}`),
}

export const reviewApi = {
  list: (payload: PagedQuery) => post<PageResult<Dict>>('/review/list', payload),
  detail: (reviewId: string) => get<Dict>(`/review/detail/${reviewId}`),
  reply: (payload: { reviewId: string; replyContent: string }) => post<void>('/review/reply', payload),
  remove: (reviewId: string) => post<void>(`/review/delete/${reviewId}`),
}

export const userApi = {
  list: (payload: PagedQuery) => post<PageResult<Dict>>('/user/list', payload),
  detail: (userId: string) => get<Dict>(`/user/detail/${userId}`),
  updateStatus: (payload: { userId: string; status: number }) => post<void>('/user/status', payload),
}

export const noticeApi = {
  list: (payload: PagedQuery) => post<PageResult<Dict>>('/notice/list', payload),
  detail: (noticeId: string) => get<Dict>(`/notice/detail/${noticeId}`),
  save: (payload: Dict) => post<void>('/notice/save', payload),
  publish: (noticeId: string) => post<void>(`/notice/publish/${noticeId}`),
  offline: (noticeId: string) => post<void>(`/notice/offline/${noticeId}`),
  remove: (noticeId: string) => post<void>(`/notice/delete/${noticeId}`),
}

export const aiApi = {
  configDetail: () => get<Dict>('/ai-config/detail'),
  saveConfig: (payload: Dict) => post<void>('/ai-config/save', payload),
  knowledgeProduct: (productId: string) => get<Dict>(`/knowledge/product/${productId}`),
  knowledgeSummary: () => get<Dict>('/knowledge/index/summary'),
  syncProduct: (productId: string) => post<Dict>(`/knowledge/index/sync/${productId}`),
  rebuildIndex: () => post<Dict>('/knowledge/index/rebuild'),
  monitorOverview: () => get<Dict>('/ai-monitor/overview'),
}

export const authorityApi = {
  accountList: (payload: PagedQuery) => post<PageResult<Dict>>('/authority/account/list', payload),
  accountDetail: (accountId: string) => get<Dict>(`/authority/account/detail/${accountId}`),
  saveAccount: (payload: Dict) => post<void>('/authority/account/save', payload),
  updateAccountStatus: (payload: { accountId: string; status: number }) => post<void>('/authority/account/status', payload),
  resetPassword: (payload: { accountId: string; password: string }) => post<void>('/authority/account/reset-password', payload),
  roleList: (payload: PagedQuery) => post<PageResult<Dict>>('/authority/role/list', payload),
  saveRole: (payload: Dict) => post<void>('/authority/role/save', payload),
  updateRoleStatus: (payload: { roleId: string; status: number }) => post<void>('/authority/role/status', payload),
  permissionList: () => get<Dict[]>('/authority/permission/list'),
}

export const auditApi = {
  list: (payload: PagedQuery) => post<PageResult<Dict>>('/audit/list', payload),
}

export const fileApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return adminHttp.post<any, Dict>('/file/uploadImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getResourceUrl: (filePath: string) => `${import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:6061'}/file/getResource?filePath=${encodeURIComponent(filePath)}`,
}
