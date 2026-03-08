import { adminClient } from '../client';
import type { AdminCurrentAccount, CheckCodePayload } from '@shared/types/admin';

export function getCheckCode() {
  return adminClient.get<never, CheckCodePayload>('/account/checkCode');
}

export function login(data: { account: string; password: string; checkCode: string; checkCodeKey: string }) {
  return adminClient.post<never, string>('/account/login', data);
}

export function getProfile() {
  return adminClient.get<never, AdminCurrentAccount>('/account/profile');
}

export function logout() {
  return adminClient.post('/account/logout');
}
