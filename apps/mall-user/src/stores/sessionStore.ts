import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getStorage, removeStorage, setStorage } from '@shared/utils/storage'

const TOKEN_KEY = 'smart-mall-user-token'
const PROFILE_KEY = 'smart-mall-user-profile'

export interface UserProfileSnapshot {
  userId?: string
  username?: string
  nickname?: string
  phone?: string
  avatar?: string
}

export const useSessionStore = defineStore('userSessionStore', () => {
  const userToken = ref(getStorage<string | null>(TOKEN_KEY, null))
  const profile = ref<UserProfileSnapshot | null>(getStorage<UserProfileSnapshot | null>(PROFILE_KEY, null))

  const isLoggedIn = computed(() => Boolean(userToken.value))

  function setSession(token: string, nextProfile?: UserProfileSnapshot | null) {
    userToken.value = token
    setStorage(TOKEN_KEY, token)
    if (nextProfile !== undefined) {
      profile.value = nextProfile
      setStorage(PROFILE_KEY, nextProfile)
    }
  }

  function setProfile(nextProfile: UserProfileSnapshot | null) {
    profile.value = nextProfile
    setStorage(PROFILE_KEY, nextProfile)
  }

  function clearSession() {
    userToken.value = null
    profile.value = null
    removeStorage(TOKEN_KEY)
    removeStorage(PROFILE_KEY)
  }

  return { userToken, profile, isLoggedIn, setSession, setProfile, clearSession }
})
