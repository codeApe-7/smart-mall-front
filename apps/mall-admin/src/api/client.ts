import { STORAGE_KEYS } from '@shared/constants/storage';
import { createHttpClient } from '@shared/http/createHttpClient';

export const adminClient = createHttpClient({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:6061/api',
  tokenKey: STORAGE_KEYS.adminToken,
  tokenHeader: 'adminToken'
});
