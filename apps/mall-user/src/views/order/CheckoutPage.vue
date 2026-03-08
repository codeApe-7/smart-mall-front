<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { listAddresses } from '@mall-user/api/modules/account';
import { createOrder, previewOrder } from '@mall-user/api/modules/order';
import { formatCurrency } from '@shared/utils/format';
import type { OrderPreview, UserAddress } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const route = useRoute();
const router = useRouter();
const sessionStore = useMallUserSessionStore();
const preview = ref<OrderPreview | null>(null);
const addresses = ref<UserAddress[]>([]);
const selectedAddressId = ref('');
const form = reactive({ orderRemark: '' });

const cartIds = computed(() => String(route.query.cartIds || '').split(',').filter(Boolean));
const selectedAddress = computed(() => addresses.value.find((item) => item.addressId === selectedAddressId.value));

async function loadData() {
  if (!sessionStore.profile?.userId || !sessionStore.userToken) {
    return;
  }
  preview.value = await previewOrder({ userId: sessionStore.profile.userId, cartIds: cartIds.value });
  addresses.value = await listAddresses(sessionStore.userToken);
  selectedAddressId.value = addresses.value.find((item) => item.defaultAddress === 1)?.addressId || addresses.value[0]?.addressId || '';
}

async function submit() {
  if (!sessionStore.profile?.userId || !selectedAddress.value) {
    return;
  }
  const addressLine = [selectedAddress.value.province, selectedAddress.value.city, selectedAddress.value.region, selectedAddress.value.detailAddress].filter(Boolean).join(' ');
  const order = await createOrder({
    userId: sessionStore.profile.userId,
    cartIds: cartIds.value,
    receiverName: selectedAddress.value.receiverName,
    receiverPhone: selectedAddress.value.receiverPhone,
    receiverAddress: addressLine,
    orderRemark: form.orderRemark
  });
  ElMessage.success('订单创建成功');
  router.push(`/orders/${order.orderId}`);
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <div class="section-title">
      <h3>确认订单</h3>
      <span class="dimmed">映射 `/order/preview` 与 `/order/create`</span>
    </div>
    <section class="mall-panel checkout-page__body">
      <div class="checkout-page__main">
        <div class="section-title"><h3>收货地址</h3></div>
        <el-radio-group v-model="selectedAddressId" class="checkout-page__addresses">
          <el-radio-button v-for="item in addresses" :key="item.addressId" :value="item.addressId">
            {{ item.receiverName }} / {{ item.detailAddress }}
          </el-radio-button>
        </el-radio-group>
        <div class="section-title"><h3>订单备注</h3></div>
        <el-input v-model="form.orderRemark" type="textarea" :rows="4" placeholder="告诉商家你的偏好或配送要求" />
      </div>
      <aside class="checkout-page__aside">
        <h3>金额汇总</h3>
        <p>商品金额 <strong>{{ formatCurrency(preview?.totalAmount) }}</strong></p>
        <p>实付金额 <strong class="price-text">{{ formatCurrency(preview?.payAmount) }}</strong></p>
        <el-button type="primary" @click="submit">提交订单</el-button>
      </aside>
    </section>
  </div>
</template>

<style scoped>
.checkout-page__body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  padding: 24px;
}
.checkout-page__addresses {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
.checkout-page__aside {
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 106, 43, 0.08), rgba(15, 127, 116, 0.08));
}
.checkout-page__aside p {
  display: flex;
  justify-content: space-between;
}
</style>
