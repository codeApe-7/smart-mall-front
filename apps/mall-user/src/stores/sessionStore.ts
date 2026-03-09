import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@shared/constants/storage'

export interface UserProfileSnapshot {
  userId?: string
  username?: string
  nickname?: string
  phone?: string
  avatar?: string
}

function getStoredProfile() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawProfile = window.localStorage.getItem(STORAGE_KEYS.userProfile)
  if (!rawProfile) {
    return null
  }

  try {
    return JSON.parse(rawProfile) as UserProfileSnapshot
  } catch {
    return null
  }
}

export const useSessionStore = defineStore('legacyUserSessionStore', () => {
  const userToken = ref(typeof window === 'undefined' ? '' : window.localStorage.getItem(STORAGE_KEYS.userToken) ?? '')
  const profile = ref<UserProfileSnapshot | null>(getStoredProfile())

  const isLoggedIn = computed(() => Boolean(userToken.value))

  function setProfile(nextProfile: UserProfileSnapshot | Record<string, unknown> | null) {
    profile.value = nextProfile

    if (typeof window === 'undefined') {
      return
    }

    if (nextProfile) {
      window.localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(nextProfile))
      const nextUserId = typeof nextProfile.userId === 'string' ? nextProfile.userId : ''
      if (nextUserId) {
        window.localStorage.setItem(STORAGE_KEYS.userId, nextUserId)
      }
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.userProfile)
      window.localStorage.removeItem(STORAGE_KEYS.userId)
    }
  }

  function setSession(token: string, nextProfile?: UserProfileSnapshot | Record<string, unknown> | null) {
    userToken.value = token

    if (typeof window !== 'undefined') {
      if (token) {
        window.localStorage.setItem(STORAGE_KEYS.userToken, token)
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.userToken)
      }
    }

    if (nextProfile !== undefined) {
      setProfile(nextProfile)
    }
  }

  function clearSession() {
    userToken.value = ''
    setProfile(null)

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.userToken)
    }
  }

  return { userToken, profile, isLoggedIn, setSession, setProfile, clearSession }
})
