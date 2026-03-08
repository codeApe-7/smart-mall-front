import { request } from '@/api/client'

export const fetchAddressList = (userToken: string) =>
  request.get<Array<Record<string, unknown>>>('/address/list', { params: { userToken } })

export const fetchAddressDetail = (userToken: string, addressId: string) =>
  request.get<Record<string, unknown>>(`/address/detail/${addressId}`, { params: { userToken } })

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
    defaultAddress?: boolean
  },
) => request.post<void>('/address/save', data, { params: { userToken } })

export const deleteAddress = (userToken: string, addressId: string) =>
  request.post<void>(`/address/delete/${addressId}`, undefined, { params: { userToken } })

export const setDefaultAddress = (userToken: string, addressId: string) =>
  request.post<void>(`/address/default/${addressId}`, undefined, { params: { userToken } })
