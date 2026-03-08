<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { listAccounts, resetAccountPassword, saveAccount, updateAccountStatus } from '@mall-admin/api/modules/authority';
import type { AdminAccountItem } from '@shared/types/admin';
import { formatDateTime } from '@shared/utils/format';

const accounts = ref<AdminAccountItem[]>([]);
const dialogVisible = ref(false);
const form = reactive<Record<string, unknown>>({ accountId: '', accountName: '', password: '', nickname: '', status: 1, roleIds: [] });

async function loadData() {
  const result = await listAccounts({ pageNo: 1, pageSize: 20 });
  accounts.value = result.records;
}

async function submit() {
  await saveAccount(form);
  dialogVisible.value = false;
  await loadData();
}

async function resetPassword(accountId: string) {
  await resetAccountPassword({ accountId, password: 'admin123' });
}

async function toggleStatus(row: AdminAccountItem) {
  await updateAccountStatus({ accountId: row.accountId, status: row.status === 1 ? 0 : 1 });
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>账号管理</h2><p>后台账号、状态切换和密码重置全部映射权限控制器。</p></header>
    <section class="admin-panel product-page__toolbar"><el-button type="primary" @click="dialogVisible = true">新增账号</el-button></section>
    <section class="admin-panel product-page__table">
      <el-table :data="accounts">
        <el-table-column prop="accountName" label="账号" min-width="160" />
        <el-table-column prop="nickname" label="昵称" width="140" />
        <el-table-column prop="statusDesc" label="状态" width="120" />
        <el-table-column label="最近登录" width="180"><template #default="scope">{{ formatDateTime(scope.row.lastLoginTime) }}</template></el-table-column>
        <el-table-column label="操作" width="220"><template #default="scope"><el-button link @click="Object.assign(form, scope.row); dialogVisible = true">编辑</el-button><el-button link @click="toggleStatus(scope.row)">切换状态</el-button><el-button link @click="resetPassword(scope.row.accountId)">重置密码</el-button></template></el-table-column>
      </el-table>
    </section>
    <el-dialog v-model="dialogVisible" title="账号编辑" width="620px">
      <el-form label-position="top">
        <el-form-item label="账号"><el-input v-model="form.accountName as string" /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname as string" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password as string" show-password /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>
  </div>
</template>
