import { request } from '@/api/client'
import type { PageResultVO } from '@shared/types/common'

export const fetchMessageList = (userToken: string, data?: { pageNo?: number; pageSize?: number; readStatus?: number }) =>
  request.post<PageResultVO<Record<string, unknown>>>('/message/list', data, { params: { userToken } })

export const fetchMessageDetail = (userToken: string, noticeId: string) =>
  request.get<Record<string, unknown>>(`/message/detail/${noticeId}`, { params: { userToken } })

export const readMessage = (userToken: string, noticeId: string) =>
  request.post<void>(`/message/read/${noticeId}`, undefined, { params: { userToken } })

export const fetchUnreadCount = (userToken: string) => request.get<number>('/message/unreadCount', { params: { userToken } })
