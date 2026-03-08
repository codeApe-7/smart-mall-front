import { createHttpClient } from '@shared/http/createHttpClient'

export const mallClient = createHttpClient({
  baseURL: import.meta.env.VITE_MALL_API_URL || 'http://localhost:6050/api',
})

export const request = mallClient

export const mallWsUrl = import.meta.env.VITE_MALL_WS_URL || 'ws://localhost:6050/api/ws/assistant'
