import { request, mallWsUrl } from '@/api/client'
import type { PageResultVO } from '@shared/types/common'

export const chatAssistant = (data: {
  userId: string
  sessionId?: string
  message: string
  productId?: string
  orderId?: string
  refundReason?: string
  reviews?: Array<{ itemId: string; productId: string; rating: number; content?: string }>
}) => request.post<Record<string, unknown>>('/assistant/chat', data)

export const chatAssistantByAgent = (data: {
  userId: string
  sessionId?: string
  message: string
  productId?: string
  orderId?: string
  refundReason?: string
  reviews?: Array<{ itemId: string; productId: string; rating: number; content?: string }>
}) => request.post<Record<string, unknown>>('/assistant/agent/chat', data)

export const fetchAssistantHistory = (data: { userId: string; sessionId?: string; pageNo?: number; pageSize?: number }) =>
  request.post<PageResultVO<Record<string, unknown>>>('/assistant/history', data)

export const chatAssistantAgent = chatAssistantByAgent
export const getAssistantHistory = fetchAssistantHistory
export const createAssistantSocket = () => (mallWsUrl ? new WebSocket(mallWsUrl) : null)
