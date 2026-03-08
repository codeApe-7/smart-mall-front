<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getShipping, listOrders, shipOrder } from '@mall-admin/api/modules/order';
import { formatCurrency, formatDateTime } from '@shared/utils/format';
import type { AdminOrderItem } from '@shared/types/admin';

const query = reactive({ pageNo: 1, pageSize: 10, orderNo: '', userId: '', orderStatus: undefined as number | undefined });
const orders = ref<AdminOrderItem[]>([]);
const shipDialog = ref(false);
const shipForm = reactive({ orderId: '', companyName: '', trackingNo: '' });

async function loadData() {
  const result = await listOrders(query);
  orders.value = result.records;
}

async function openShip(row: AdminOrderItem) {
  shipForm.orderId = row.orderId;
  shipDialog.value = true;
}

async function submitShip() {
  await shipOrder(shipForm);
  ElMessage.success('发货成功');
  shipDialog.value = false;
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>订单管理</h2><p>订单查询、详情和发货操作对接后台订单控制器。</p></header>
    <section class="admin-panel product-page__toolbar">
      <el-form inline>
        <el-form-item label="订单号"><el-input v-model="query.orderNo" /></el-form-item>
        <el-form-item label="用户 ID"><el-input v-model="query.userId" /></el-form-item>
        <el-form-item><el-button type="primary" @click="loadData">查询</el-button></el-form-item>
      </el-form>
    </section>
    <section class="admin-panel product-page__table">
      <el-table :data="orders">
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="userId" label="用户" width="120" />
        <el-table-column prop="orderStatusDesc" label="状态" width="120" />
        <el-table-column label="金额" width="120"><template #default="scope">{{ formatCurrency(scope.row.payAmount) }}</template></el-table-column>
        <el-table-column label="时间" width="180"><template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="openShip(scope.row)">发货</el-button>
            <el-button link @click="getShipping(scope.row.orderId)">物流</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-dialog v-model="shipDialog" title="订单发货" width="520px">
      <el-form label-position="top">
        <el-form-item label="物流公司"><el-input v-model="shipForm.companyName" /></el-form-item>
        <el-form-item label="运单号"><el-input v-model="shipForm.trackingNo" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="shipDialog = false">取消</el-button><el-button type="primary" @click="submitShip">提交发货</el-button></template>
    </el-dialog>
  </div>
</template>
