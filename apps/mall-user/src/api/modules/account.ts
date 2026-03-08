import { request } from '@/api/client';
import type { MallUserLoginPayload, MallUserProfile, UserAddress } from '@shared/types/mall';

export interface LoginForm {
  account: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  phone: string;
  nickname?: string;
}

export interface ProfileForm {
  nickname?: string;
  phone?: string;
  avatar?: string;
}

export interface PasswordForm {
  oldPassword: string;
  newPassword: string;
}

export interface AddressForm {
  addressId?: string;
  receiverName: string;
  receiverPhone: string;
  province?: string;
  city?: string;
  region?: string;
  detailAddress: string;
  addressLabel?: string;
  defaultAddress?: number;
}

export const login = (data: LoginForm) => request.post<MallUserLoginPayload>('/account/login', data);
export const register = (data: RegisterForm) => request.post<MallUserLoginPayload>('/account/register', data);
export const getProfile = (userToken: string) => request.get<MallUserProfile>('/account/profile', { params: { userToken } });
export const saveProfile = (userToken: string, data: ProfileForm) => request.post<void>('/account/profile/save', data, { params: { userToken } });
export const updatePassword = (userToken: string, data: PasswordForm) => request.post<void>('/account/password/update', data, { params: { userToken } });
export const logout = (userToken: string) => request.post<void>('/account/logout', undefined, { params: { userToken } });
export const listAddresses = (userToken: string) => request.get<UserAddress[]>('/address/list', { params: { userToken } });
export const saveAddress = (userToken: string, data: AddressForm) => request.post<void>('/address/save', data, { params: { userToken } });
export const deleteAddress = (userToken: string, addressId: string) => request.post<void>(`/address/delete/${addressId}`, undefined, { params: { userToken } });
export const setDefaultAddress = (userToken: string, addressId: string) => request.post<void>(`/address/default/${addressId}`, undefined, { params: { userToken } });
