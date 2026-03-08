<template>
  <div class="admin-page">
    <AppPageHeader title="账号权限管理" description="账号、角色、权限组三块联动，菜单显隐基于 `permissionCodes`。" />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="账号管理" name="accounts">
        <WorkbenchPanel title="后台账号列表">
          <div class="toolbar">
            <el-input v-model="accountQuery.keyword" placeholder="账号关键词" clearable />
            <el-select v-model="accountQuery.status" placeholder="状态" clearable><el-option label="启用" :value="1" /><el-option label="禁用" :value="0" /></el-select>
            <el-button type="primary" @click="loadAccounts">查询</el-button>
            <el-button @click="openAccountEditor()">新增账号</el-button>
          </div>
          <el-table :data="accounts.records || []">
            <el-table-column prop="accountName" label="账号" min-width="140" />
            <el-table-column prop="nickname" label="昵称" min-width="120" />
            <el-table-column prop="roleNames" label="角色" min-width="180">
              <template #default="scope">{{ scope.row.roleNames?.join('，') }}</template>
            </el-table-column>
            <el-table-column prop="statusDesc" label="状态" min-width="100" />
            <el-table-column label="操作" min-width="320">
              <template #default="scope">
                <el-button link type="primary" @click="viewAccount(scope.row.accountId)">详情</el-button>
                <el-button link @click="editAccount(scope.row.accountId)">编辑</el-button>
                <el-switch :model-value="scope.row.status === 1" inline-prompt active-text="启" inactive-text="禁" @change="toggleAccountStatus(scope.row.accountId, $event)" />
                <el-button link type="warning" @click="openResetPassword(scope.row.accountId)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </WorkbenchPanel>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="roles">
        <WorkbenchPanel title="角色列表">
          <div class="toolbar">
            <el-input v-model="roleQuery.keyword" placeholder="角色关键词" clearable />
            <el-select v-model="roleQuery.status" placeholder="状态" clearable><el-option label="启用" :value="1" /><el-option label="禁用" :value="0" /></el-select>
            <el-button type="primary" @click="loadRoles">查询</el-button>
            <el-button @click="openRoleEditor()">新增角色</el-button>
          </div>
          <el-table :data="roles.records || []">
            <el-table-column prop="roleName" label="角色名称" min-width="160" />
            <el-table-column prop="roleCode" label="角色编码" min-width="160" />
            <el-table-column prop="permissionNames" label="权限" min-width="220"><template #default="scope">{{ scope.row.permissionNames?.join('，') }}</template></el-table-column>
            <el-table-column label="操作" min-width="220">
              <template #default="scope">
                <el-button link @click="editRole(scope.row)">编辑</el-button>
                <el-switch :model-value="scope.row.status === 1" inline-prompt active-text="启" inactive-text="禁" @change="toggleRoleStatus(scope.row.roleId, $event)" />
              </template>
            </el-table-column>
          </el-table>
        </WorkbenchPanel>
      </el-tab-pane>
      <el-tab-pane label="权限分组" name="permissions">
        <WorkbenchPanel title="权限组列表">
          <el-collapse>
            <el-collapse-item v-for="group in permissions" :key="group.groupCode" :title="group.groupName || group.groupCode" :name="group.groupCode">
              <el-space wrap>
                <el-tag v-for="item in group.permissions || []" :key="item.permissionCode">{{ item.permissionName || item.permissionCode }}</el-tag>
              </el-space>
            </el-collapse-item>
          </el-collapse>
        </WorkbenchPanel>
      </el-tab-pane>
    </el-tabs>

    <el-drawer v-model="accountDetailVisible" title="账号详情" size="40%"><KeyValueGrid :model="accountDetail" /></el-drawer>

    <el-dialog v-model="accountEditorVisible" :title="accountForm.accountId ? '编辑账号' : '新增账号'" width="760">
      <el-form :model="accountForm" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="账号"><el-input v-model="accountForm.accountName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="密码"><el-input v-model="accountForm.password" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="昵称"><el-input v-model="accountForm.nickname" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机号"><el-input v-model="accountForm.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="邮箱"><el-input v-model="accountForm.email" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="状态"><el-select v-model="accountForm.status"><el-option label="启用" :value="1" /><el-option label="禁用" :value="0" /></el-select></el-form-item></el-col>
        </el-row>
        <el-form-item label="超级管理员"><el-switch v-model="accountForm.superAdmin" /></el-form-item>
        <el-form-item label="角色 ID 列表（逗号分隔）"><el-input v-model="accountRoleText" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="accountForm.remark" type="textarea" :rows="4" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="accountEditorVisible=false">取消</el-button><el-button type="primary" @click="saveAccount">保存账号</el-button></template>
    </el-dialog>

    <el-dialog v-model="passwordVisible" title="重置密码" width="520">
      <el-form label-position="top"><el-form-item label="账号 ID"><el-input v-model="passwordForm.accountId" disabled /></el-form-item><el-form-item label="新密码"><el-input v-model="passwordForm.password" /></el-form-item></el-form>
      <template #footer><el-button @click="passwordVisible=false">取消</el-button><el-button type="primary" @click="submitResetPassword">确认重置</el-button></template>
    </el-dialog>

    <el-dialog v-model="roleEditorVisible" :title="roleForm.roleId ? '编辑角色' : '新增角色'" width="760">
      <el-form :model="roleForm" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="角色编码"><el-input v-model="roleForm.roleCode" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="角色名称"><el-input v-model="roleForm.roleName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="状态"><el-select v-model="roleForm.status"><el-option label="启用" :value="1" /><el-option label="禁用" :value="0" /></el-select></el-form-item></el-col>
        </el-row>
        <el-form-item label="权限选择">
          <el-checkbox-group v-model="roleForm.permissionCodes">
            <el-space wrap>
              <el-checkbox v-for="item in flatPermissions" :key="item.permissionCode" :label="item.permissionCode">{{ item.permissionName || item.permissionCode }}</el-checkbox>
            </el-space>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="roleForm.remark" type="textarea" :rows="4" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="roleEditorVisible=false">取消</el-button><el-button type="primary" @click="saveRole">保存角色</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import KeyValueGrid from '@/components/KeyValueGrid.vue'
import { authorityApi } from '@/api/modules/admin'

const activeTab = ref('accounts')
const accounts = ref<any>({ records: [] })
const roles = ref<any>({ records: [] })
const permissions = ref<any[]>([])
const accountDetail = ref<Record<string, any>>({})
const accountDetailVisible = ref(false)

const accountQuery = reactive({ pageNo: 1, pageSize: 10, keyword: '', status: undefined as number | undefined, roleId: '' })
const roleQuery = reactive({ pageNo: 1, pageSize: 10, keyword: '', status: undefined as number | undefined })
const accountEditorVisible = ref(false)
const accountForm = reactive<any>({ accountId: '', accountName: '', password: '', nickname: '', phone: '', email: '', status: 1, superAdmin: false, remark: '', roleIds: [] })
const accountRoleText = ref('')
const passwordVisible = ref(false)
const passwordForm = reactive({ accountId: '', password: '' })
const roleEditorVisible = ref(false)
const roleForm = reactive<any>({ roleId: '', roleCode: '', roleName: '', status: 1, remark: '', permissionCodes: [] })

const flatPermissions = computed(() => permissions.value.flatMap((group) => group.permissions || []))

const loadAccounts = async () => { accounts.value = await authorityApi.accountList(accountQuery) }
const loadRoles = async () => { roles.value = await authorityApi.roleList(roleQuery) }
const loadPermissions = async () => { permissions.value = await authorityApi.permissionList() }
const viewAccount = async (accountId: string) => { accountDetail.value = await authorityApi.accountDetail(accountId); accountDetailVisible.value = true }
const openAccountEditor = () => { Object.assign(accountForm, { accountId: '', accountName: '', password: '', nickname: '', phone: '', email: '', status: 1, superAdmin: false, remark: '', roleIds: [] }); accountRoleText.value = ''; accountEditorVisible.value = true }
const editAccount = async (accountId: string) => {
  const detail = await authorityApi.accountDetail(accountId)
  Object.assign(accountForm, { ...detail, password: '' })
  accountRoleText.value = (detail.roleIds || []).join(',')
  accountEditorVisible.value = true
}
const saveAccount = async () => {
  accountForm.roleIds = accountRoleText.value.split(',').map((item: string) => item.trim()).filter(Boolean)
  await authorityApi.saveAccount(accountForm)
  accountEditorVisible.value = false
  ElMessage.success('账号已保存')
  loadAccounts()
}
const toggleAccountStatus = async (accountId: string, enabled: boolean | string | number) => { await authorityApi.updateAccountStatus({ accountId, status: enabled ? 1 : 0 }); ElMessage.success('账号状态已更新'); loadAccounts() }
const openResetPassword = (accountId: string) => { passwordForm.accountId = accountId; passwordForm.password = ''; passwordVisible.value = true }
const submitResetPassword = async () => { await authorityApi.resetPassword(passwordForm); passwordVisible.value = false; ElMessage.success('密码已重置') }
const openRoleEditor = () => { Object.assign(roleForm, { roleId: '', roleCode: '', roleName: '', status: 1, remark: '', permissionCodes: [] }); roleEditorVisible.value = true }
const editRole = (role: any) => { Object.assign(roleForm, { ...role, permissionCodes: role.permissionCodes || [] }); roleEditorVisible.value = true }
const saveRole = async () => { await authorityApi.saveRole(roleForm); roleEditorVisible.value = false; ElMessage.success('角色已保存'); loadRoles() }
const toggleRoleStatus = async (roleId: string, enabled: boolean | string | number) => { await authorityApi.updateRoleStatus({ roleId, status: enabled ? 1 : 0 }); ElMessage.success('角色状态已更新'); loadRoles() }

onMounted(async () => { await Promise.all([loadAccounts(), loadRoles(), loadPermissions()]) })
</script>
