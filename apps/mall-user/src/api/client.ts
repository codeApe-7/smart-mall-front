import { type AxiosRequestConfig } from 'axios'
import { createHttpClient } from '@shared/http'
import { clearUserSession } from '@shared/utils/session'

const mallClient = createHttpClient({
  baseURL: import.meta.env.VITE_MALL_USER_API_BASE_URL || 'http://localhost:8080/api',
})

const unwrap = async <T>(requestPromise: Promise<{ data: T }>) => {
  const response = await requestPromise
  return response.data
}

export const request = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return unwrap(mallClient.get<T>(url, config))
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return unwrap(mallClient.post<T>(url, data, config))
  },
}

export const mallUserApiBaseUrl = import.meta.env.VITE_MALL_USER_API_BASE_URL || 'http://localhost:8080/api'
export const mallWsUrl = import.meta.env.VITE_MALL_USER_WS_URL || ''

export const handleUnauthorized = () => {
  clearUserSession()
  window.location.href = '/login'
}
