import {
  ADMIN_PROFILE_KEY,
  ADMIN_TOKEN_KEY,
  USER_ID_KEY,
  USER_PROFILE_KEY,
  USER_TOKEN_KEY,
} from '@shared/constants/storage'

const storage = () => window.localStorage

export const getUserToken = () => storage().getItem(USER_TOKEN_KEY) ?? ''
export const getUserId = () => storage().getItem(USER_ID_KEY) ?? ''
export const getAdminToken = () => storage().getItem(ADMIN_TOKEN_KEY) ?? ''

export const saveUserSession = (payload: { token: string; userId?: string; profile?: unknown }) => {
  storage().setItem(USER_TOKEN_KEY, payload.token)
  if (payload.userId) storage().setItem(USER_ID_KEY, payload.userId)
  if (payload.profile) storage().setItem(USER_PROFILE_KEY, JSON.stringify(payload.profile))
}

export const clearUserSession = () => {
  storage().removeItem(USER_TOKEN_KEY)
  storage().removeItem(USER_ID_KEY)
  storage().removeItem(USER_PROFILE_KEY)
}

export const saveAdminSession = (payload: { token: string; profile?: unknown }) => {
  storage().setItem(ADMIN_TOKEN_KEY, payload.token)
  if (payload.profile) storage().setItem(ADMIN_PROFILE_KEY, JSON.stringify(payload.profile))
}

export const clearAdminSession = () => {
  storage().removeItem(ADMIN_TOKEN_KEY)
  storage().removeItem(ADMIN_PROFILE_KEY)
}
