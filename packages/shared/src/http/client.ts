import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { ADMIN_TOKEN_KEY } from '@shared/constants/storage'
import type { RequestConfig } from '@shared/http/types'
import type { ResponseVO } from '@shared/types/common'

const successCode = 200

export const createHttpClient = ({ baseURL, withAdminToken, onUnauthorized }: RequestConfig) => {
  const instance: AxiosInstance = axios.create({
    baseURL,
    timeout: 15000,
  })

  instance.interceptors.request.use((config) => {
    if (withAdminToken) {
      const token = window.localStorage.getItem(ADMIN_TOKEN_KEY)
      if (token) {
        config.headers.adminToken = token
      }
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => {
      const payload = response.data as ResponseVO<unknown>
      if (typeof payload?.code === 'number' && payload.code !== successCode) {
        ElMessage.error(payload.info || '请求失败')
        if (payload.code === 401 || payload.code === 403) onUnauthorized?.()
        return Promise.reject(payload)
      }
      return payload?.data ?? response.data
    },
    (error) => {
      ElMessage.error(error?.response?.data?.info || error.message || '网络异常')
      if (error?.response?.status === 401 || error?.response?.status === 403) onUnauthorized?.()
      return Promise.reject(error)
    },
  )

  return {
    get<T>(url: string, config?: AxiosRequestConfig) {
      return instance.get<T, T>(url, config)
    },
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
      return instance.post<T, T>(url, data, config)
    },
    raw: instance,
  }
}
