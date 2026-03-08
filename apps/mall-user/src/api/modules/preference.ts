import { request } from '@/api/client'

export const fetchPreferenceProfile = (userId: string) =>
  request.get<Record<string, unknown>>('/preference/profile', { params: { userId } })

export const refreshPreferenceProfile = (userId: string) =>
  request.post<Record<string, unknown>>('/preference/refresh', undefined, { params: { userId } })
