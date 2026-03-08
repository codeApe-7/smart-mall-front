<template>
  <div class="admin-page">
    <AppPageHeader title="审计日志" description="筛选字段对应 `AdminOperationLogQueryDTO`，用于排查后台关键操作。" />
    <WorkbenchPanel title="操作日志列表">
      <div class="toolbar">
        <el-input v-model="query.accountName" placeholder="账号名称" clearable />
        <el-input v-model="query.operationType" placeholder="操作类型" clearable />
        <el-select v-model="query.operationStatus" placeholder="执行状态" clearable>
          <el-option label="成功" :value="1" />
          <el-option label="失败" :value="0" />
        </el-select>
        <el-input v-model="query.keyword" placeholder="URI / 操作名 / 参数关键词" clearable />
        <el-button type="primary" @click="loadLogs">查询</el-button>
      </div>
      <el-table :data="logs.records || []">
        <el-table-column prop="accountName" label="账号" min-width="120" />
        <el-table-column prop="operationType" label="操作类型" min-width="120" />
        <el-table-column prop="operationName" label="操作名称" min-width="160" />
        <el-table-column prop="requestUri" label="请求 URI" min-width="220" show-overflow-tooltip />
        <el-table-column prop="requestMethod" label="方法" min-width="90" />
        <el-table-column prop="operationStatus" label="状态" min-width="90" />
        <el-table-column prop="createTime" label="时间" min-width="180" />
      </el-table>
    </WorkbenchPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import { auditApi } from '@/api/modules/admin'

const query = reactive({ pageNo: 1, pageSize: 10, accountName: '', operationType: '', operationStatus: undefined as number | undefined, keyword: '' })
const logs = ref<any>({ records: [] })
const loadLogs = async () => { logs.value = await auditApi.list(query) }

onMounted(loadLogs)
</script>
