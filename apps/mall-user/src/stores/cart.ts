import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMallCartStore = defineStore('mallCartStore', () => {
  const count = ref(0)
  return { count }
})
