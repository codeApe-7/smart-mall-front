<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { getPermissionList, listRoles, saveRole, updateRoleStatus } from '@mall-admin/api/modules/authority';
import type { AdminPermissionGroup, AdminRoleItem } from '@shared/types/admin';

const roles = ref<AdminRoleItem[]>([]);
const permissions = ref<AdminPermissionGroup[]>([]);
const dialogVisible = ref(false);
const form = reactive<Record<string, unknown>>({ roleId: '', roleName: '', roleCode: '', status: 1, permissionCodes: [] });

async function loadData() {
  const [roleResult, permissionResult] = await Promise.all([listRoles({ pageNo: 1, pageSize: 20 }), getPermissionList()]);
  roles.value = roleResult.records;
  permissions.value = permissionResult;
}

async function submit() {
  await saveRole(form);
  dialogVisible.value = false;
  await loadData();
}

async function toggleStatus(row: AdminRoleItem) {
  await updateRoleStatus({ roleId: row.roleId, status: row.status === 1 ? 0 : 1 });
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>角色管理</h2><p>角色列表、权限树和状态切换全部对应 `/authority/role/*`。</p></header>
    <section class="admin-panel product-page__toolbar"><el-button type="primary" @click="dialogVisible = true">新增角色</el-button></section>
    <section class="admin-panel product-page__table">
      <el-table :data="roles">
        <el-table-column prop="roleName" label="角色名" min-width="160" />
        <el-table-column prop="roleCode" label="角色编码" width="160" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column label="权限码" min-width="240"><template #default="scope"><el-tag v-for="code in scope.row.permissionCodes || []" :key="code" style="margin-right: 6px">{{ code }}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="160"><template #default="scope"><el-button link @click="Object.assign(form, scope.row); dialogVisible = true">编辑</el-button><el-button link @click="toggleStatus(scope.row)">切换状态</el-button></template></el-table-column>
      </el-table>
    </section>
    <el-dialog v-model="dialogVisible" title="角色编辑" width="760px">
      <el-form label-position="top">
        <el-form-item label="角色名"><el-input v-model="form.roleName as string" /></el-form-item>
        <el-form-item label="角色编码"><el-input v-model="form.roleCode as string" /></el-form-item>
        <el-form-item label="权限码">
          <el-checkbox-group v-model="form.permissionCodes as string[]">
            <template v-for="group in permissions" :key="group.groupName">
              <p>{{ group.groupName }}</p>
              <el-checkbox v-for="permission in group.permissions || []" :key="permission.permissionCode" :label="permission.permissionCode">{{ permission.permissionName }}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>
  </div>
</template>
