<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import SectionPanel from '@/components/SectionPanel.vue'
import { deleteCartItems, getCart, updateCartQuantity, updateCartSelected } from '@/api/modules/cart'
import { formatCurrency } from '@shared/utils/format'
import type { CartItem } from '@shared/types/mall'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const sessionStore = useSessionStore()
const items = ref<CartItem[]>([])

const userId = computed(() => sessionStore.profile?.userId || '')
const selectedIds = computed(() => items.value.filter((item) => item.selected).map((item) => item.cartId))
const totalAmount = computed(() => items.value.filter((item) => item.selected).reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0))

const loadCart = async () => {
  if (!userId.value) return
  const cart = await getCart(userId.value)
  items.value = cart.items || []
}

const changeQuantity = async (item: CartItem, quantity: number) => {
  if (!userId.value) return
  await updateCartQuantity({ userId: userId.value, cartId: item.cartId, quantity })
  item.quantity = quantity
}

const toggleSelected = async (item: CartItem, selected: boolean) => {
  if (!userId.value) return
  await updateCartSelected({ userId: userId.value, cartId: item.cartId, selected })
  item.selected = selected
}

const removeSelected = async () => {
  if (!userId.value || !selectedIds.value.length) return
  await deleteCartItems({ userId: userId.value, cartIds: selectedIds.value })
  ElMessage.success('已删除选中商品')
  await loadCart()
}

const checkout = () => {
  router.push({ path: '/checkout', query: { cartIds: selectedIds.value.join(',') } })
}

onMounted(loadCart)
</script>

<template>
  <SectionPanel title="购物车" subtitle="对应 `/cart/list`、`/cart/updateQuantity`、`/cart/updateSelected`。">
    <el-table :data="items" border>
      <el-table-column label="选择" width="90">
        <template #default="scope">
          <el-checkbox :model-value="scope.row.selected" @change="(value: string | number | boolean) => toggleSelected(scope.row, Boolean(value))" />
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品" min-width="220" />
      <el-table-column prop="skuName" label="规格" min-width="160" />
      <el-table-column label="数量" width="160">
        <template #default="scope">
          <el-input-number :model-value="scope.row.quantity" :min="1" @change="(value: string | number | undefined) => changeQuantity(scope.row, Number(value ?? 1))" />
        </template>
      </el-table-column>
      <el-table-column label="金额" width="140">
        <template #default="scope">{{ formatCurrency(Number(scope.row.price || 0) * scope.row.quantity) }}</template>
      </el-table-column>
    </el-table>
    <div class="toolbar" style="justify-content: space-between; margin-top: 18px">
      <div>
        <strong>已选 {{ selectedIds.length }} 件</strong>
        <span class="price-text">{{ formatCurrency(totalAmount) }}</span>
      </div>
      <div class="toolbar">
        <el-button plain @click="removeSelected">删除选中</el-button>
        <el-button type="primary" :disabled="!selectedIds.length" @click="checkout">去结算</el-button>
      </div>
    </div>
  </SectionPanel>
</template>
