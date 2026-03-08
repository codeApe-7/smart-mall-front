<template>
  <div class="admin-page">
    <AppPageHeader title="订单履约管理" description="订单列表、详情、发货和物流查询全部对应后台订单控制器。" />
    <WorkbenchPanel title="订单列表">
      <div class="toolbar">
        <el-input v-model="query.orderNo" placeholder="订单号" clearable />
        <el-input v-model="query.userId" placeholder="用户ID" clearable />
        <el-select v-model="query.orderStatus" placeholder="订单状态" clearable>
          <el-option label="待支付" :value="0" />
          <el-option label="待发货" :value="10" />
          <el-option label="待收货" :value="20" />
          <el-option label="已完成" :value="30" />
          <el-option label="已取消" :value="40" />
        </el-select>
        <el-button type="primary" @click="loadOrders">查询</el-button>
      </div>
      <el-table :data="orders.records || []">
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="userId" label="用户ID" min-width="120" />
        <el-table-column prop="orderStatusDesc" label="状态" min-width="120" />
        <el-table-column prop="payAmount" label="支付金额" min-width="120" />
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column label="操作" min-width="280" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.orderId)">详情</el-button>
            <el-button link type="warning" @click="openShip(scope.row.orderId)">发货</el-button>
            <el-button link @click="viewShipping(scope.row.orderId)">物流</el-button>
          </template>
        </el-table-column>
      </el-table>
    </WorkbenchPanel>

    <el-drawer v-model="detailVisible" title="订单详情" size="48%">
      <KeyValueGrid :model="detail" />
      <WorkbenchPanel title="原始详情">
        <pre class="json-box">{{ JSON.stringify(detail, null, 2) }}</pre>
      </WorkbenchPanel>
    </el-drawer>

    <el-dialog v-model="shipVisible" title="订单发货" width="500">
      <el-form label-position="top">
        <el-form-item label="订单ID"><el-input v-model="shipForm.orderId" disabled /></el-form-item>
        <el-form-item label="物流公司"><el-input v-model="shipForm.shippingCompany" placeholder="对应 `shippingCompany`" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipVisible = false">取消</el-button>
        <el-button type="primary" @click="submitShip">确认发货</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="shippingVisible" title="物流详情" size="36%">
      <KeyValueGrid :model="shipping" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import KeyValueGrid from '@/components/KeyValueGrid.vue'
import { orderApi } from '@/api/modules/admin'

const query = reactive({ pageNo: 1, pageSize: 10, orderNo: '', userId: '', orderStatus: undefined as number | undefined })
const orders = ref<any>({ records: [] })
const detail = ref<Record<string, any>>({})
const detailVisible = ref(false)
const shipVisible = ref(false)
const shippingVisible = ref(false)
const shipping = ref<Record<string, any>>({})
const shipForm = reactive({ orderId: '', shippingCompany: '' })

const loadOrders = async () => { orders.value = await orderApi.list(query) }
const viewDetail = async (orderId: string) => { detail.value = await orderApi.detail(orderId); detailVisible.value = true }
const openShip = (orderId: string) => { shipForm.orderId = orderId; shipForm.shippingCompany = ''; shipVisible.value = true }
const submitShip = async () => {
  shipping.value = await orderApi.ship(shipForm)
  shipVisible.value = false
  shippingVisible.value = true
  ElMessage.success('发货成功')
  loadOrders()
}
const viewShipping = async (orderId: string) => { shipping.value = await orderApi.shipping(orderId); shippingVisible.value = true }

onMounted(loadOrders)
</script>
