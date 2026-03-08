<template>
  <div class="admin-page">
    <AppPageHeader title="用户管理" description="后台用户画像详情、订单/退款概览和启停状态管理。" />
    <WorkbenchPanel title="用户列表">
      <div class="toolbar">
        <el-input v-model="query.userId" placeholder="用户ID" clearable />
        <el-input v-model="query.keyword" placeholder="关键词" clearable />
        <el-input v-model="query.phone" placeholder="手机号" clearable />
        <el-select v-model="query.status" placeholder="状态" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
        <el-button type="primary" @click="loadUsers">查询</el-button>
      </div>
      <el-table :data="users.records || []">
        <el-table-column prop="userId" label="用户ID" min-width="160" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column prop="statusDesc" label="状态" min-width="100" />
        <el-table-column prop="orderCount" label="订单数" min-width="90" />
        <el-table-column label="操作" min-width="260">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.userId)">详情</el-button>
            <el-switch :model-value="scope.row.status === 1" inline-prompt active-text="启" inactive-text="禁" @change="toggleStatus(scope.row.userId, $event)" />
          </template>
        </el-table-column>
      </el-table>
    </WorkbenchPanel>

    <el-drawer v-model="detailVisible" title="用户详情" size="46%">
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
import { userApi } from '@/api/modules/admin'

const query = reactive({ pageNo: 1, pageSize: 10, userId: '', keyword: '', phone: '', status: undefined as number | undefined })
const users = ref<any>({ records: [] })
const detail = ref<Record<string, any>>({})
const detailVisible = ref(false)

const loadUsers = async () => { users.value = await userApi.list(query) }
const viewDetail = async (userId: string) => { detail.value = await userApi.detail(userId); detailVisible.value = true }
const toggleStatus = async (userId: string, enabled: boolean | string | number) => {
  await userApi.updateStatus({ userId, status: enabled ? 1 : 0 })
  ElMessage.success('用户状态已更新')
  loadUsers()
}

onMounted(loadUsers)
</script>
