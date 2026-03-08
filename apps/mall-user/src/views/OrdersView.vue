<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserId } from '@shared/utils/session'
import SectionPanel from '@/components/SectionPanel.vue'
import JsonPanel from '@/components/JsonPanel.vue'
import { applyRefund } from '@/api/modules/refund'
import { fetchOrderList, cancelOrder } from '@/api/modules/order'
import { confirmReceive } from '@/api/modules/shipping'

const router = useRouter()
const query = reactive({ pageNo: 1, pageSize: 10, orderStatus: undefined as number | undefined })
const orders = ref<Array<Record<string, unknown>>>([])
const refundForm = reactive({ orderId: '', refundReason: '' })
const activeDetail = ref<Record<string, unknown> | null>(null)

const loadOrders = async () => {
  const result = await fetchOrderList({ userId: getUserId(), ...query })
  orders.value = result.records
}

const submitRefund = async () => {
  await applyRefund({ userId: getUserId(), orderId: refundForm.orderId, refundReason: refundForm.refundReason || undefined })
  await loadOrders()
}

onMounted(loadOrders)
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="订单中心" subtitle="查看、取消、退款申请、确认收货都在这里。">
      <div class="toolbar" style="margin-bottom: 16px">
        <el-input-number v-model="query.orderStatus" :min="0" controls-position="right" placeholder="orderStatus" />
        <el-button type="primary" @click="loadOrders">刷新列表</el-button>
      </div>
      <el-table :data="orders" border>
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="orderStatusName" label="状态" width="120" />
        <el-table-column prop="totalAmount" label="金额" width="120" />
        <el-table-column label="操作" min-width="320">
          <template #default="scope">
            <div class="toolbar">
              <el-button text type="primary" @click="router.push(`/orders/${scope.row.orderId}`)">详情</el-button>
              <el-button text @click="activeDetail = scope.row">预览</el-button>
              <el-button text type="danger" @click="cancelOrder({ userId: getUserId(), orderId: String(scope.row.orderId) }).then(loadOrders)">取消</el-button>
              <el-button text type="success" @click="confirmReceive({ userId: getUserId(), orderId: String(scope.row.orderId) }).then(loadOrders)">确认收货</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </SectionPanel>

    <div class="card-grid two">
      <SectionPanel title="退款申请" subtitle="对应 `/refund/apply`。">
        <el-form label-position="top">
          <el-form-item label="orderId">
            <el-input v-model="refundForm.orderId" />
          </el-form-item>
          <el-form-item label="refundReason">
            <el-input v-model="refundForm.refundReason" type="textarea" :rows="3" />
          </el-form-item>
          <el-button type="primary" @click="submitRefund">提交退款</el-button>
        </el-form>
      </SectionPanel>
      <SectionPanel title="当前选中订单" subtitle="这里做快速预览，详情页承接物流、退款和评价。" accent="#ff5d00">
        <JsonPanel v-if="activeDetail" :data="activeDetail" />
      </SectionPanel>
    </div>
  </div>
</template>
