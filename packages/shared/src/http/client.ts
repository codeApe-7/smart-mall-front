import { STORAGE_KEYS } from '@shared/constants/storage';
import { createHttpClient } from '@shared/http/createHttpClient';

export const adminRequest = createHttpClient({
  baseURL: 'http://localhost:6061/api',
  tokenKey: STORAGE_KEYS.adminToken,
  tokenHeader: 'adminToken'
});
