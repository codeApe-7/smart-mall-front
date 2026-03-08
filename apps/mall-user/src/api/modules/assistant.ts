import { request, mallWsUrl } from '@/api/client';
import type { AssistantChatResponse, AssistantHistoryItem } from '@shared/types/mall';
import type { PageResult } from '@shared/types/common';

export const chatAssistant = (data: { userId: string; sessionId?: string; message: string; productId?: string; orderId?: string; refundReason?: string }) => request.post<AssistantChatResponse>('/assistant/chat', data);
export const chatAssistantByAgent = (data: { userId: string; sessionId?: string; message: string; productId?: string; orderId?: string; refundReason?: string }) => request.post<AssistantChatResponse>('/assistant/agent/chat', data);
export const chatAssistantAgent = chatAssistantByAgent;
export const fetchAssistantHistory = (data: { userId: string; sessionId?: string; pageNo?: number; pageSize?: number }) => request.post<PageResult<AssistantHistoryItem>>('/assistant/history', data);
export const getAssistantHistory = fetchAssistantHistory;
export function createAssistantSocket(onMessage: (payload: AssistantChatResponse) => void, onError: () => void) {
  const socket = new WebSocket(mallWsUrl);
  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessage(payload.data as AssistantChatResponse);
    } catch {
      onError();
    }
  };
  socket.onerror = onError;
  return socket;
}
