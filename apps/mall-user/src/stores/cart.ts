import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserId } from '@shared/utils/session'
import { addCartItem, deleteCartItems, fetchCart, updateCartQuantity, updateCartSelected } from '@/api/modules/cart'
import type { ShoppingCart } from '@shared/types/mall'

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref<ShoppingCart | null>(null)
  const loading = ref(false)

  const items = computed(() => cart.value?.items || [])
  const summary = computed(() => cart.value ?? {})

  const loadCart = async () => {
    const userId = getUserId()
    if (!userId) return null
    loading.value = true
    try {
      cart.value = await fetchCart(userId)
      return cart.value
    } finally {
      loading.value = false
    }
  }

  const addItem = async (payload: { userId: string; productId: string; propertyValueIdHash: string; quantity: number }) => {
    await addCartItem(payload)
    return loadCart()
  }

  const changeQuantity = async (payload: { userId: string; cartId: string; quantity: number }) => {
    await updateCartQuantity(payload)
    return loadCart()
  }

  const toggleSelected = async (payload: { userId: string; cartId: string; selected: boolean }) => {
    await updateCartSelected(payload)
    return loadCart()
  }

  const removeItems = async (payload: { userId: string; cartIds: string[] }) => {
    await deleteCartItems(payload)
    return loadCart()
  }

  return {
    cart,
    loading,
    items,
    summary,
    loadCart,
    addItem,
    changeQuantity,
    toggleSelected,
    removeItems,
  }
})
