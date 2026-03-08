<template>
  <div class="admin-page">
    <AppPageHeader title="退款管理" description="对接退款列表、详情、审核通过与驳回接口。" />
    <WorkbenchPanel title="退款单列表">
      <div class="toolbar">
        <el-input v-model="query.refundNo" placeholder="退款单号" clearable />
        <el-input v-model="query.orderNo" placeholder="订单号" clearable />
        <el-input v-model="query.userId" placeholder="用户ID" clearable />
        <el-select v-model="query.refundStatus" placeholder="退款状态" clearable>
          <el-option label="待审核" :value="0" />
          <el-option label="已通过" :value="1" />
          <el-option label="已拒绝" :value="2" />
        </el-select>
        <el-button type="primary" @click="loadRefunds">查询</el-button>
      </div>
      <el-table :data="refunds.records || []">
        <el-table-column prop="refundNo" label="退款单号" min-width="180" />
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="refundStatusDesc" label="状态" min-width="120" />
        <el-table-column prop="refundAmount" label="退款金额" min-width="120" />
        <el-table-column label="操作" min-width="260">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.refundId)">详情</el-button>
            <el-button link type="success" @click="approve(scope.row.refundId)">通过</el-button>
            <el-button link type="danger" @click="reject(scope.row.refundId)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </WorkbenchPanel>

    <el-drawer v-model="detailVisible" title="退款详情" size="42%">
      <KeyValueGrid :model="detail" />
      <pre class="json-box">{{ JSON.stringify(detail, null, 2) }}</pre>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import KeyValueGrid from '@/components/KeyValueGrid.vue'
import { refundApi } from '@/api/modules/admin'

const query = reactive({ pageNo: 1, pageSize: 10, refundNo: '', orderNo: '', userId: '', refundStatus: undefined as number | undefined })
const refunds = ref<any>({ records: [] })
const detail = ref<Record<string, any>>({})
const detailVisible = ref(false)

const loadRefunds = async () => { refunds.value = await refundApi.list(query) }
const viewDetail = async (refundId: string) => { detail.value = await refundApi.detail(refundId); detailVisible.value = true }
const approve = async (refundId: string) => { await refundApi.approve(refundId); ElMessage.success('退款已通过'); loadRefunds() }
const reject = async (refundId: string) => { await refundApi.reject(refundId); ElMessage.success('退款已驳回'); loadRefunds() }

onMounted(loadRefunds)
</script>
