import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { clearUserSession, getUserId, getUserToken, saveUserSession } from '@shared/utils/session'
import {
  fetchUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from '@/api/modules/account'

export const useSessionStore = defineStore('userSessionStore', () => {
  const userToken = ref(getUserToken())
  const userId = ref(getUserId())
  const profile = ref<Record<string, unknown> | null>(null)

  const isLoggedIn = computed(() => Boolean(userToken.value))

  const syncSession = (payload: { token: string; profile?: Record<string, unknown> | null }) => {
    userToken.value = payload.token
    profile.value = payload.profile ?? profile.value
    if (typeof payload.profile?.userId === 'string') {
      userId.value = payload.profile.userId
    }
    saveUserSession({ token: payload.token, userId: userId.value, profile: profile.value })
  }

  const login = async (payload: { account: string; password: string }) => {
    const result = await loginUser(payload)
    syncSession({ token: String(result.userToken || ''), profile: (result.profile as Record<string, unknown>) || null })
    return result
  }

  const register = async (payload: { username: string; password: string; phone: string; nickname?: string }) => {
    const result = await registerUser(payload)
    syncSession({ token: String(result.userToken || ''), profile: (result.profile as Record<string, unknown>) || null })
    return result
  }

  const loadProfile = async () => {
    if (!userToken.value) return null
    const result = await fetchUserProfile(userToken.value)
    profile.value = result as Record<string, unknown>
    if (typeof result?.userId === 'string') {
      userId.value = result.userId
      saveUserSession({ token: userToken.value, userId: userId.value, profile: profile.value })
    }
    return result
  }

  const logout = async () => {
    if (userToken.value) {
      await logoutUser(userToken.value)
    }
    userToken.value = ''
    userId.value = ''
    profile.value = null
    clearUserSession()
  }

  return {
    userToken,
    userId,
    profile,
    isLoggedIn,
    login,
    register,
    loadProfile,
    logout,
  }
})

export const useMallUserSessionStore = useSessionStore
