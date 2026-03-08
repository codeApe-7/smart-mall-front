<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { approveRefund, listRefunds, rejectRefund } from '@mall-admin/api/modules/order';
import { formatCurrency } from '@shared/utils/format';
import type { AdminRefundItem } from '@shared/types/admin';

const query = reactive({ pageNo: 1, pageSize: 10, orderNo: '', userId: '', refundStatus: undefined as number | undefined });
const refunds = ref<AdminRefundItem[]>([]);

async function loadData() {
  const result = await listRefunds(query);
  refunds.value = result.records;
}

async function approve(id: string) {
  await approveRefund(id);
  ElMessage.success('已同意退款');
  await loadData();
}

async function reject(id: string) {
  await rejectRefund(id);
  ElMessage.success('已拒绝退款');
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>退款管理</h2><p>映射 `/refund/list`、`/refund/approve/{id}`、`/refund/reject/{id}`。</p></header>
    <section class="admin-panel product-page__table">
      <el-table :data="refunds">
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="userId" label="用户" width="120" />
        <el-table-column label="金额" width="120"><template #default="scope">{{ formatCurrency(scope.row.refundAmount) }}</template></el-table-column>
        <el-table-column prop="refundStatusDesc" label="状态" width="120" />
        <el-table-column prop="refundReason" label="原因" min-width="220" />
        <el-table-column label="操作" width="160"><template #default="scope"><el-button link type="success" @click="approve(scope.row.refundId)">同意</el-button><el-button link type="danger" @click="reject(scope.row.refundId)">拒绝</el-button></template></el-table-column>
      </el-table>
    </section>
  </div>
</template>
