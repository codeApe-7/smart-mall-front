import { request } from '@/api/client';
import type { UserPreference } from '@shared/types/mall';

export const getPreferenceProfile = (userId: string) => request.get<UserPreference>('/preference/profile', { params: { userId } });
export const refreshPreference = (userId: string) => request.post<UserPreference>('/preference/refresh', undefined, { params: { userId } });
