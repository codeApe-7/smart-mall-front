import { STORAGE_KEYS } from '@shared/constants/storage';

const storage = () => window.localStorage;

export const getUserToken = () => storage().getItem(STORAGE_KEYS.userToken) ?? '';
export const getUserId = () => storage().getItem(STORAGE_KEYS.userId) ?? '';
export const getAdminToken = () => storage().getItem(STORAGE_KEYS.adminToken) ?? '';

export const saveUserSession = (payload: { token: string; userId?: string; profile?: unknown }) => {
  storage().setItem(STORAGE_KEYS.userToken, payload.token);
  if (payload.userId) storage().setItem(STORAGE_KEYS.userId, payload.userId);
  if (payload.profile) storage().setItem(STORAGE_KEYS.userProfile, JSON.stringify(payload.profile));
};

export const clearUserSession = () => {
  storage().removeItem(STORAGE_KEYS.userToken);
  storage().removeItem(STORAGE_KEYS.userId);
  storage().removeItem(STORAGE_KEYS.userProfile);
};

export const saveAdminSession = (payload: { token: string; profile?: unknown }) => {
  storage().setItem(STORAGE_KEYS.adminToken, payload.token);
  if (payload.profile) storage().setItem(STORAGE_KEYS.adminProfile, JSON.stringify(payload.profile));
};

export const clearAdminSession = () => {
  storage().removeItem(STORAGE_KEYS.adminToken);
  storage().removeItem(STORAGE_KEYS.adminProfile);
};
