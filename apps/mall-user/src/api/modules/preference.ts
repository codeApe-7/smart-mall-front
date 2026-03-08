import { request } from '@/api/client'
import type { UserPreference } from '@shared/types/mall'

export const fetchPreferenceProfile = (userId: string) => request.get<UserPreference>('/preference/profile', { params: { userId } })
export const getPreferenceProfile = fetchPreferenceProfile

export const refreshPreferenceProfile = (userId: string) => request.post<UserPreference>('/preference/refresh', undefined, { params: { userId } })
export const refreshPreference = refreshPreferenceProfile
