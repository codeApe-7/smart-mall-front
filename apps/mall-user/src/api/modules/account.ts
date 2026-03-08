import { request } from '@/api/client'

export const registerUser = (data: { username: string; password: string; phone: string; nickname?: string }) =>
  request.post<Record<string, unknown>>('/account/register', data)

export const loginUser = (data: { account: string; password: string }) =>
  request.post<Record<string, unknown>>('/account/login', data)

export const fetchUserProfile = (userToken: string) =>
  request.get<Record<string, unknown>>('/account/profile', { params: { userToken } })

export const saveUserProfile = (userToken: string, data: { nickname?: string; phone?: string; avatar?: string }) =>
  request.post<void>('/account/profile/save', data, { params: { userToken } })

export const updateUserPassword = (userToken: string, data: { oldPassword: string; newPassword: string }) =>
  request.post<void>('/account/password/update', data, { params: { userToken } })

export const logoutUser = (userToken: string) => request.post<void>('/account/logout', undefined, { params: { userToken } })
