<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { deleteCartItems, getCart, updateCartQuantity, updateCartSelected } from '@mall-user/api/modules/cart';
import { formatCurrency } from '@shared/utils/format';
import type { CartItem } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const router = useRouter();
const sessionStore = useMallUserSessionStore();
const items = ref<CartItem[]>([]);

const selectedIds = computed(() => items.value.filter((item) => item.selected).map((item) => item.cartId));
const totalAmount = computed(() => items.value.filter((item) => item.selected).reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0));

async function loadCart() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  const cart = await getCart(sessionStore.profile.userId);
  items.value = cart.items || [];
}

async function changeQuantity(item: CartItem, quantity: number) {
  if (!sessionStore.profile?.userId) {
    return;
  }
  await updateCartQuantity({ userId: sessionStore.profile.userId, cartId: item.cartId, quantity });
  item.quantity = quantity;
}

async function toggleSelected(item: CartItem, selected: boolean) {
  if (!sessionStore.profile?.userId) {
    return;
  }
  await updateCartSelected({ userId: sessionStore.profile.userId, cartIds: [item.cartId], selected });
  item.selected = selected;
}

async function removeSelected() {
  if (!sessionStore.profile?.userId || !selectedIds.value.length) {
    return;
  }
  await deleteCartItems({ userId: sessionStore.profile.userId, cartIds: selectedIds.value });
  ElMessage.success('已删除选中商品');
  await loadCart();
}

function checkout() {
  router.push({ path: '/checkout', query: { cartIds: selectedIds.value.join(',') } });
}

onMounted(loadCart);
</script>

<template>
  <div class="admin-page">
    <div class="section-title">
      <h3>购物车</h3>
      <span class="dimmed">请求映射 `/cart/list`、`/cart/updateQuantity`、`/cart/updateSelected`</span>
    </div>
    <section class="mall-panel cart-page__body">
      <el-table :data="items">
        <el-table-column label="选择" width="90">
          <template #default="scope">
            <el-checkbox :model-value="scope.row.selected" @change="(value) => toggleSelected(scope.row, Boolean(value))" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品" min-width="220" />
        <el-table-column prop="skuName" label="规格" min-width="160" />
        <el-table-column label="数量" width="180">
          <template #default="scope">
            <el-input-number :model-value="scope.row.quantity" :min="1" @change="(value) => changeQuantity(scope.row, Number(value))" />
          </template>
        </el-table-column>
        <el-table-column label="金额" width="140">
          <template #default="scope">{{ formatCurrency(Number(scope.row.price || 0) * scope.row.quantity) }}</template>
        </el-table-column>
      </el-table>
      <div class="cart-page__footer">
        <div>
          <strong>已选 {{ selectedIds.length }} 件</strong>
          <span class="price-text">{{ formatCurrency(totalAmount) }}</span>
        </div>
        <div>
          <el-button plain @click="removeSelected">删除选中</el-button>
          <el-button type="primary" :disabled="!selectedIds.length" @click="checkout">去结算</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cart-page__body {
  padding: 20px;
}
.cart-page__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
}
.cart-page__footer div {
  display: flex;
  gap: 14px;
  align-items: center;
}
</style>
