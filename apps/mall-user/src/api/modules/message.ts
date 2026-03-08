import { request } from '@/api/client'
import type { MallMessage } from '@shared/types/mall'
import type { PageResult } from '@shared/types/common'

export const fetchMessageList = (userToken: string, data: { pageNo?: number; pageSize?: number; messageType?: string }) => request.post<PageResult<MallMessage>>('/message/list', data, { params: { userToken } })
export const listMessages = fetchMessageList

export const fetchMessageDetail = (userToken: string, noticeId: string) => request.get<MallMessage>(`/message/detail/${noticeId}`, { params: { userToken } })
export const getMessageDetail = fetchMessageDetail

export const readMessage = (userToken: string, noticeId: string) => request.post<void>(`/message/read/${noticeId}`, undefined, { params: { userToken } })

export const fetchUnreadCount = (userToken: string) => request.get<number>('/message/unreadCount', { params: { userToken } })
export const getUnreadCount = fetchUnreadCount
