import { request } from '@/api/client'
import type { MallUserLoginPayload, MallUserProfile, UserAddress } from '@shared/types/mall'

export interface SaveProfilePayload {
  nickname?: string
  phone?: string
  avatar?: string
}

export interface UpdatePasswordPayload {
  oldPassword: string
  newPassword: string
}

export interface RegisterPayload {
  username: string
  password: string
  phone: string
  nickname?: string
}

export interface LoginPayload {
  account: string
  password: string
}

export const registerUser = (data: RegisterPayload) => request.post<MallUserLoginPayload>('/account/register', data)
export const register = registerUser

export const loginUser = (data: LoginPayload) => request.post<MallUserLoginPayload>('/account/login', data)
export const login = loginUser

export const fetchUserProfile = (userToken: string) => request.get<MallUserProfile>('/account/profile', { params: { userToken } })
export const getProfile = fetchUserProfile

export const saveUserProfile = (userToken: string, data: SaveProfilePayload) => request.post<void>('/account/profile/save', data, { params: { userToken } })
export const saveProfile = saveUserProfile

export const updateUserPassword = (userToken: string, data: UpdatePasswordPayload) => request.post<void>('/account/password/update', data, { params: { userToken } })
export const updatePassword = updateUserPassword

export const logoutUser = (userToken: string) => request.post<void>('/account/logout', undefined, { params: { userToken } })
export const logout = logoutUser

export const fetchAddressList = (userToken: string) => request.get<UserAddress[]>('/address/list', { params: { userToken } })
export const listAddresses = fetchAddressList

export const fetchAddressDetail = (userToken: string, addressId: string) => request.get<UserAddress>(`/address/detail/${addressId}`, { params: { userToken } })

export const saveAddress = (
  userToken: string,
  data: {
    addressId?: string
    receiverName: string
    receiverPhone: string
    province: string
    city: string
    region?: string
    detailAddress: string
    addressLabel?: string
    defaultAddress?: boolean | number
  },
) => request.post<void>('/address/save', data, { params: { userToken } })

export const deleteAddress = (userToken: string, addressId: string) => request.post<void>(`/address/delete/${addressId}`, undefined, { params: { userToken } })

export const setDefaultAddress = (userToken: string, addressId: string) => request.post<void>(`/address/default/${addressId}`, undefined, { params: { userToken } })
