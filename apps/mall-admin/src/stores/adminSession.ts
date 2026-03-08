import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { getStorage, removeStorage, setStorage } from '@shared/utils/storage'
import { ADMIN_PROFILE_KEY, ADMIN_TOKEN_KEY } from '@shared/constants/storage'
import { accountApi } from '@/api/modules/admin'

export const useAdminSessionStore = defineStore('admin-session', () => {
  const token = ref<string>(getStorage(ADMIN_TOKEN_KEY, ''))
  const profile = ref<Record<string, any> | null>(getStorage(ADMIN_PROFILE_KEY, null))
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))
  const permissionCodes = computed<string[]>(() => profile.value?.permissionCodes ?? [])
  const isSuperAdmin = computed(() => Boolean(profile.value?.superAdmin))

  const setToken = (nextToken: string) => {
    token.value = nextToken
    setStorage(ADMIN_TOKEN_KEY, nextToken)
  }

  const setProfile = (nextProfile: Record<string, any> | null) => {
    profile.value = nextProfile
    if (nextProfile) {
      setStorage(ADMIN_PROFILE_KEY, nextProfile)
      return
    }
    removeStorage(ADMIN_PROFILE_KEY)
  }

  const fetchProfile = async () => {
    if (!token.value) return null
    loading.value = true
    try {
      const payload = await accountApi.profile()
      setProfile(payload)
      return payload
    } finally {
      loading.value = false
    }
  }

  const login = async (payload: { account: string; password: string; checkCode: string; checkCodeKey: string }) => {
    loading.value = true
    try {
      const nextToken = await accountApi.login(payload)
      setToken(nextToken)
      await fetchProfile()
      ElMessage.success('登录成功，欢迎进入 SmartMall Console')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) await accountApi.logout()
    } catch {
      // ignore remote logout failure
    } finally {
      token.value = ''
      setProfile(null)
      removeStorage(ADMIN_TOKEN_KEY)
      removeStorage(ADMIN_PROFILE_KEY)
    }
  }

  const hasPermission = (permission?: string) => {
    if (!permission) return true
    if (isSuperAdmin.value) return true
    return permissionCodes.value.includes(permission)
  }

  return {
    token,
    profile,
    loading,
    isAuthenticated,
    permissionCodes,
    isSuperAdmin,
    setToken,
    setProfile,
    fetchProfile,
    login,
    logout,
    hasPermission,
  }
})
