<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { cancelOrder, listOrders } from '@mall-user/api/modules/order';
import { formatCurrency, formatDateTime } from '@shared/utils/format';
import type { OrderSummary } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const router = useRouter();
const sessionStore = useMallUserSessionStore();
const query = reactive({ pageNo: 1, pageSize: 10, orderStatus: undefined as number | undefined });
const orders = ref<OrderSummary[]>([]);
const totalCount = ref(0);

async function loadOrders() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  const result = await listOrders({ userId: sessionStore.profile.userId, ...query });
  orders.value = result.records;
  totalCount.value = result.totalCount;
}

async function handleCancel(orderId: string) {
  if (!sessionStore.profile?.userId) {
    return;
  }
  await cancelOrder({ userId: sessionStore.profile.userId, orderId });
  await loadOrders();
}

onMounted(loadOrders);
</script>

<template>
  <div class="admin-page">
    <div class="section-title">
      <h3>订单中心</h3>
      <el-select v-model="query.orderStatus" clearable placeholder="订单状态" @change="loadOrders">
        <el-option label="待支付" :value="0" />
        <el-option label="待发货" :value="10" />
        <el-option label="待收货" :value="20" />
        <el-option label="已完成" :value="30" />
      </el-select>
    </div>
    <section class="mall-panel order-list__body">
      <el-table :data="orders">
        <el-table-column prop="orderNo" label="订单号" min-width="200" />
        <el-table-column prop="orderStatusDesc" label="状态" width="120" />
        <el-table-column label="时间" width="180">
          <template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="金额" width="120">
          <template #default="scope">{{ formatCurrency(scope.row.payAmount) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button link @click="router.push(`/orders/${scope.row.orderId}`)">查看详情</el-button>
            <el-button link type="danger" @click="handleCancel(scope.row.orderId)">取消订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next, total" :total="totalCount" :page-size="query.pageSize" :current-page="query.pageNo" @current-change="(page) => { query.pageNo = page; loadOrders(); }" />
    </section>
  </div>
</template>

<style scoped>
.order-list__body {
  padding: 20px;
}
</style>
