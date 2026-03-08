<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import { applyRefund, confirmReceive, getOrderDetail, getRefundDetail, getShippingDetail, submitPayment } from '@mall-user/api/modules/order';
import { formatCurrency, formatDateTime } from '@shared/utils/format';
import type { OrderDetail, RefundInfo, ShippingInfo } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const route = useRoute();
const sessionStore = useMallUserSessionStore();
const detail = ref<OrderDetail | null>(null);
const refundInfo = ref<RefundInfo | null>(null);
const shippingInfo = ref<ShippingInfo | null>(null);
const orderId = computed(() => route.params.orderId as string);

async function loadData() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  detail.value = await getOrderDetail(sessionStore.profile.userId, orderId.value);
  refundInfo.value = await getRefundDetail(sessionStore.profile.userId, orderId.value).catch(() => null);
  shippingInfo.value = await getShippingDetail(sessionStore.profile.userId, orderId.value).catch(() => null);
}

async function payNow() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  const result = await submitPayment({ userId: sessionStore.profile.userId, orderId: orderId.value });
  ElMessage.success(`支付已提交：${result.paymentNo || result.mockPayUrl || '已进入回调模拟'}`);
}

async function receiveNow() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  await confirmReceive({ userId: sessionStore.profile.userId, orderId: orderId.value });
  ElMessage.success('已确认收货');
  await loadData();
}

async function refundNow() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  const reason = await ElMessageBox.prompt('请输入退款原因', '申请退款');
  await applyRefund({ userId: sessionStore.profile.userId, orderId: orderId.value, refundReason: reason.value });
  ElMessage.success('退款申请已提交');
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div v-if="detail" class="admin-page">
    <div class="section-title">
      <h3>订单详情</h3>
      <div>
        <el-button plain @click="payNow">支付</el-button>
        <el-button plain @click="refundNow">申请退款</el-button>
        <el-button type="primary" @click="receiveNow">确认收货</el-button>
      </div>
    </div>
    <section class="mall-panel order-detail__panel">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detail.orderStatusDesc }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(detail.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="应付金额">{{ formatCurrency(detail.payAmount) }}</el-descriptions-item>
        <el-descriptions-item label="收货人">{{ detail.receiverName }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ detail.receiverAddress }}</el-descriptions-item>
      </el-descriptions>
    </section>
    <section class="order-detail__grid">
      <div class="mall-panel order-detail__panel">
        <div class="section-title"><h3>物流信息</h3></div>
        <p>物流公司：{{ shippingInfo?.companyName || '待生成' }}</p>
        <p>运单号：{{ shippingInfo?.trackingNo || '待生成' }}</p>
        <p>状态：{{ shippingInfo?.shippingStatusDesc || '暂无' }}</p>
      </div>
      <div class="mall-panel order-detail__panel">
        <div class="section-title"><h3>退款信息</h3></div>
        <p>退款状态：{{ refundInfo?.refundStatusDesc || '未申请' }}</p>
        <p>退款金额：{{ formatCurrency(refundInfo?.refundAmount) }}</p>
        <p>原因：{{ refundInfo?.refundReason || '—' }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.order-detail__panel {
  padding: 24px;
}
.order-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}
</style>
