import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { clearUserSession, getUserId, getUserToken, saveUserSession } from '@shared/utils/session'
import { fetchUserProfile, loginUser, logoutUser, registerUser } from '@/api/modules/account'

export const useSessionStore = defineStore('userSessionStore', () => {
  const userToken = ref(getUserToken())
  const userId = ref(getUserId())
  const profile = ref<Record<string, unknown> | null>(null)
  const isLoggedIn = computed(() => Boolean(userToken.value))

  const persist = () => {
    saveUserSession({ token: userToken.value, userId: userId.value, profile: profile.value })
  }

  const setProfile = (nextProfile: Record<string, unknown> | null) => {
    profile.value = nextProfile
    if (typeof nextProfile?.userId === 'string') {
      userId.value = nextProfile.userId
    }
    persist()
  }

  const setSession = (
    tokenOrPayload: string | { userToken?: string; profile?: unknown },
    maybeProfile?: Record<string, unknown> | null,
  ) => {
    if (typeof tokenOrPayload === 'string') {
      userToken.value = tokenOrPayload
      setProfile(maybeProfile ?? profile.value)
      return
    }
    userToken.value = String(tokenOrPayload.userToken || '')
    setProfile((tokenOrPayload.profile as unknown as Record<string, unknown> | null) ?? null)
  }

  const login = async (payload: { account: string; password: string }) => {
    const result = await loginUser(payload)
    setSession({ userToken: String(result.userToken || ''), profile: result.profile as unknown as Record<string, unknown> | null })
    return result
  }

  const register = async (payload: { username: string; password: string; phone: string; nickname?: string }) => {
    const result = await registerUser(payload)
    setSession({ userToken: String(result.userToken || ''), profile: result.profile as unknown as Record<string, unknown> | null })
    return result
  }

  const loadProfile = async () => {
    if (!userToken.value) return null
    const result = await fetchUserProfile(userToken.value)
    setProfile(result as unknown as Record<string, unknown>)
    return result
  }

  const clearSession = () => {
    userToken.value = ''
    userId.value = ''
    profile.value = null
    clearUserSession()
  }

  const logout = async () => {
    if (userToken.value) {
      await logoutUser(userToken.value)
    }
    clearSession()
  }

  return {
    userToken,
    userId,
    profile,
    isLoggedIn,
    setProfile,
    setSession,
    clearSession,
    login,
    register,
    loadProfile,
    logout,
  }
})

export const useMallUserSessionStore = useSessionStore
