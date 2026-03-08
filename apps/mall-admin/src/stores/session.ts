import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AdminCurrentAccount } from '@shared/types/admin';
import { STORAGE_KEYS } from '@shared/constants/storage';
import { getStorage, removeStorage, setStorage } from '@shared/utils/storage';

export const useAdminSessionStore = defineStore('admin-session', () => {
  const adminToken = ref(getStorage<string>(STORAGE_KEYS.adminToken, ''));
  const profile = ref<AdminCurrentAccount | null>(getStorage<AdminCurrentAccount | null>(STORAGE_KEYS.adminProfile, null));

  const isLoggedIn = computed(() => Boolean(adminToken.value));
  const permissionCodes = computed(() => profile.value?.permissionCodes || []);

  function setToken(token: string) {
    adminToken.value = token;
    setStorage(STORAGE_KEYS.adminToken, token);
  }

  function setProfile(value: AdminCurrentAccount) {
    profile.value = value;
    setStorage(STORAGE_KEYS.adminProfile, value);
  }

  function clearSession() {
    adminToken.value = '';
    profile.value = null;
    removeStorage(STORAGE_KEYS.adminToken);
    removeStorage(STORAGE_KEYS.adminProfile);
  }

  return {
    adminToken,
    profile,
    isLoggedIn,
    permissionCodes,
    setToken,
    setProfile,
    clearSession
  };
});
