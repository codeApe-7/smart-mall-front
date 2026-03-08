<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  deleteAddress,
  fetchAddressList,
  fetchUserProfile,
  logoutUser,
  saveAddress,
  saveUserProfile,
  setDefaultAddress,
  updateUserPassword,
} from '@/api/modules/account'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const sessionStore = useSessionStore()
const profile = ref<Record<string, unknown> | null>(null)
const addresses = ref<Array<Record<string, unknown>>>([])
const profileForm = reactive({ nickname: '', phone: '', avatar: '' })
const passwordForm = reactive({ oldPassword: '', newPassword: '' })
const addressForm = reactive({ addressId: '', receiverName: '', receiverPhone: '', province: '', city: '', region: '', detailAddress: '', addressLabel: '', defaultAddress: false })

const currentToken = () => String(sessionStore.userToken || '')

const load = async () => {
  const userToken = currentToken()
  if (!userToken) return
  const userProfile = await fetchUserProfile(userToken)
  profile.value = (userProfile as unknown as Record<string, unknown>) || null
  addresses.value = (await fetchAddressList(userToken)) as Array<Record<string, unknown>>
  profileForm.nickname = String(userProfile.nickname || '')
  profileForm.phone = String(userProfile.phone || '')
  profileForm.avatar = String(userProfile.avatar || '')
}

const saveProfileAction = async () => {
  await saveUserProfile(currentToken(), profileForm)
  ElMessage.success('资料已保存')
  await load()
}

const savePasswordAction = async () => {
  await updateUserPassword(currentToken(), passwordForm)
  ElMessage.success('密码已更新')
}

const saveAddressAction = async () => {
  await saveAddress(currentToken(), { ...addressForm })
  ElMessage.success('地址已保存')
  await load()
}

const handleLogout = async () => {
  const userToken = currentToken()
  if (userToken) await logoutUser(userToken)
  sessionStore.clearSession()
  router.push('/auth/login')
}

onMounted(load)
</script>

<template>
  <div class="page-grid">
    <div class="card-grid two">
      <SectionPanel title="个人资料" subtitle="对应资料读取和保存。">
        <el-form label-position="top">
          <el-form-item label="nickname"><el-input v-model="profileForm.nickname" /></el-form-item>
          <el-form-item label="phone"><el-input v-model="profileForm.phone" /></el-form-item>
          <el-form-item label="avatar"><el-input v-model="profileForm.avatar" placeholder="可选头像地址" /></el-form-item>
          <div class="toolbar">
            <el-button type="primary" @click="saveProfileAction">保存资料</el-button>
            <el-button plain @click="handleLogout">退出登录</el-button>
          </div>
        </el-form>
      </SectionPanel>
      <SectionPanel title="修改密码" subtitle="对应 `/account/password/update`" accent="#ff5d00">
        <el-form label-position="top">
          <el-form-item label="oldPassword"><el-input v-model="passwordForm.oldPassword" type="password" show-password /></el-form-item>
          <el-form-item label="newPassword"><el-input v-model="passwordForm.newPassword" type="password" show-password /></el-form-item>
          <el-button type="primary" @click="savePasswordAction">更新密码</el-button>
        </el-form>
      </SectionPanel>
    </div>

    <SectionPanel title="地址管理" subtitle="地址列表、保存、删除、设默认全部在这里。">
      <div class="card-grid two">
        <div>
          <el-form label-position="top">
            <el-form-item label="addressId"><el-input v-model="addressForm.addressId" placeholder="编辑时填写" /></el-form-item>
            <el-form-item label="receiverName"><el-input v-model="addressForm.receiverName" /></el-form-item>
            <el-form-item label="receiverPhone"><el-input v-model="addressForm.receiverPhone" /></el-form-item>
            <el-form-item label="province"><el-input v-model="addressForm.province" /></el-form-item>
            <el-form-item label="city"><el-input v-model="addressForm.city" /></el-form-item>
            <el-form-item label="region"><el-input v-model="addressForm.region" /></el-form-item>
            <el-form-item label="detailAddress"><el-input v-model="addressForm.detailAddress" type="textarea" :rows="3" /></el-form-item>
            <el-form-item label="addressLabel"><el-input v-model="addressForm.addressLabel" /></el-form-item>
            <el-form-item label="defaultAddress"><el-switch v-model="addressForm.defaultAddress" /></el-form-item>
            <el-button type="primary" @click="saveAddressAction">保存地址</el-button>
          </el-form>
        </div>
        <div class="page-grid">
          <el-table :data="addresses" border>
            <el-table-column prop="receiverName" label="收货人" />
            <el-table-column prop="receiverPhone" label="电话" />
            <el-table-column prop="detailAddress" label="详细地址" min-width="220" />
            <el-table-column label="操作" min-width="200">
              <template #default="scope">
                <div class="toolbar">
                  <el-button text @click="Object.assign(addressForm, scope.row)">编辑</el-button>
                  <el-button text @click="setDefaultAddress(currentToken(), String(scope.row.addressId)).then(load)">设默认</el-button>
                  <el-button text type="danger" @click="deleteAddress(currentToken(), String(scope.row.addressId)).then(load)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </SectionPanel>

    <SectionPanel title="原始资料返回" subtitle="对不确定字段做稳定展示。" accent="#ff4d00">
      <JsonPanel v-if="profile" :data="profile" />
    </SectionPanel>
  </div>
</template>
