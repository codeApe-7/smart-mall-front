<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { listUsers, updateUserStatus } from '@mall-admin/api/modules/user';
import type { AdminUserItem } from '@shared/types/admin';
import { formatDateTime } from '@shared/utils/format';

const query = reactive({ pageNo: 1, pageSize: 10, keyword: '', phone: '', status: undefined as number | undefined });
const users = ref<AdminUserItem[]>([]);

async function loadData() {
  const result = await listUsers(query);
  users.value = result.records;
}

async function toggleStatus(row: AdminUserItem) {
  await updateUserStatus({ userId: row.userId, status: row.status === 1 ? 0 : 1 });
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>用户管理</h2><p>用户分页、详情与启用禁用状态完全对齐后端。</p></header>
    <section class="admin-panel product-page__toolbar">
      <el-form inline>
        <el-form-item label="关键词"><el-input v-model="query.keyword" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="query.phone" /></el-form-item>
        <el-form-item><el-button type="primary" @click="loadData">查询</el-button></el-form-item>
      </el-form>
    </section>
    <section class="admin-panel product-page__table">
      <el-table :data="users">
        <el-table-column prop="userId" label="用户 ID" min-width="180" />
        <el-table-column prop="nickname" label="昵称" width="140" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="statusDesc" label="状态" width="120" />
        <el-table-column label="最近活跃" width="180"><template #default="scope">{{ formatDateTime(scope.row.lastActiveTime) }}</template></el-table-column>
        <el-table-column label="操作" width="120"><template #default="scope"><el-button link @click="toggleStatus(scope.row)">{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button></template></el-table-column>
      </el-table>
    </section>
  </div>
</template>
