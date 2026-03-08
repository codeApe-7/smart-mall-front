<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { listAuditLogs } from '@mall-admin/api/modules/audit';
import type { AdminAuditItem } from '@shared/types/admin';
import { formatDateTime } from '@shared/utils/format';

const query = reactive({ pageNo: 1, pageSize: 20, operatorName: '', operationType: '' });
const logs = ref<AdminAuditItem[]>([]);

async function loadData() {
  const result = await listAuditLogs(query);
  logs.value = result.records;
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>审计日志</h2><p>操作日志列表对接 `/audit/list`。</p></header>
    <section class="admin-panel product-page__toolbar">
      <el-form inline>
        <el-form-item label="操作人"><el-input v-model="query.operatorName" /></el-form-item>
        <el-form-item label="类型"><el-input v-model="query.operationType" /></el-form-item>
        <el-form-item><el-button type="primary" @click="loadData">查询</el-button></el-form-item>
      </el-form>
    </section>
    <section class="admin-panel product-page__table">
      <el-table :data="logs">
        <el-table-column prop="operatorName" label="操作人" width="140" />
        <el-table-column prop="operationType" label="类型" width="140" />
        <el-table-column prop="operationDesc" label="描述" min-width="260" />
        <el-table-column label="时间" width="180"><template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template></el-table-column>
      </el-table>
    </section>
  </div>
</template>
