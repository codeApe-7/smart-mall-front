<template>
  <div class="page-grid">
    <SectionPanel v-if="!sessionStore.isLoggedIn" title="请先登录" subtitle="个人中心依赖 `userToken` 和 `userId`。">
      <div class="hero-actions">
        <el-button type="danger" round @click="$router.push('/auth/login')">去登录</el-button>
      </div>
    </SectionPanel>

    <template v-else>
      <div class="card-grid two">
        <SectionPanel title="个人资料" subtitle="对接 `/account/profile` 与 `/account/profile/save`。">
          <el-form label-position="top">
            <el-form-item label="昵称 nickname"><el-input v-model="profileForm.nickname" /></el-form-item>
            <el-form-item label="手机号 phone"><el-input v-model="profileForm.phone" /></el-form-item>
            <el-form-item label="头像 avatar"><el-input v-model="profileForm.avatar" /></el-form-item>
            <div class="hero-actions">
              <el-button type="danger" round @click="saveProfileAction">保存资料</el-button>
              <el-button round @click="logoutAction">退出登录</el-button>
            </div>
          </el-form>
        </SectionPanel>

        <SectionPanel title="修改密码" subtitle="对接 `/account/password/update`。" accent="#125d5c">
          <el-form label-position="top">
            <el-form-item label="原密码 oldPassword"><el-input v-model="passwordForm.oldPassword" type="password" show-password /></el-form-item>
            <el-form-item label="新密码 newPassword"><el-input v-model="passwordForm.newPassword" type="password" show-password /></el-form-item>
            <div class="hero-actions">
              <el-button type="danger" round @click="savePasswordAction">更新密码</el-button>
            </div>
          </el-form>
        </SectionPanel>
      </div>

      <SectionPanel title="地址管理" subtitle="字段与 `UserAddressSaveDTO` / `UserAddressVO` 保持一致。" accent="#ff9d2e">
        <div class="card-grid two">
          <el-form label-position="top">
            <el-form-item label="addressId（编辑时可填）"><el-input v-model="addressForm.addressId" /></el-form-item>
            <el-form-item label="收货人 receiverName"><el-input v-model="addressForm.receiverName" /></el-form-item>
            <el-form-item label="电话 receiverPhone"><el-input v-model="addressForm.receiverPhone" /></el-form-item>
            <el-form-item label="省 province"><el-input v-model="addressForm.province" /></el-form-item>
            <el-form-item label="市 city"><el-input v-model="addressForm.city" /></el-form-item>
            <el-form-item label="区 region"><el-input v-model="addressForm.region" /></el-form-item>
            <el-form-item label="详细地址 detailAddress"><el-input v-model="addressForm.detailAddress" type="textarea" :rows="3" /></el-form-item>
            <el-form-item label="标签 addressLabel"><el-input v-model="addressForm.addressLabel" /></el-form-item>
            <el-form-item label="默认地址 defaultAddress"><el-switch v-model="addressForm.defaultAddress" /></el-form-item>
            <div class="hero-actions">
              <el-button type="danger" round @click="saveAddressAction">保存地址</el-button>
            </div>
          </el-form>

          <el-table :data="addresses" border>
            <el-table-column prop="receiverName" label="收货人" width="100" />
            <el-table-column prop="receiverPhone" label="电话" width="140" />
            <el-table-column prop="fullAddress" label="完整地址" min-width="240" />
            <el-table-column label="操作" min-width="220">
              <template #default="scope">
                <div class="hero-actions" style="justify-content: flex-start">
                  <el-button text @click="fillAddress(scope.row)">编辑</el-button>
                  <el-button text @click="setDefaultAction(String(scope.row.addressId))">设默认</el-button>
                  <el-button text type="danger" @click="deleteAddressAction(String(scope.row.addressId))">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </SectionPanel>

      <SectionPanel title="原始资料" subtitle="方便联调时校验字段。" accent="#ff5a36">
        <JsonPanel :data="profile" />
      </SectionPanel>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { deleteAddress, fetchAddressList, fetchUserProfile, logoutUser, saveAddress, saveUserProfile, setDefaultAddress, updateUserPassword } from '@/api/modules/account'
import { useSessionStore } from '@/stores/sessionStore'
import type { MallUserProfile, UserAddress } from '@shared/types/mall'

const router = useRouter()
const sessionStore = useSessionStore()
const profile = ref<MallUserProfile | null>(null)
const addresses = ref<UserAddress[]>([])
const profileForm = reactive({ nickname: '', phone: '', avatar: '' })
const passwordForm = reactive({ oldPassword: '', newPassword: '' })
const addressForm = reactive({ addressId: '', receiverName: '', receiverPhone: '', province: '', city: '', region: '', detailAddress: '', addressLabel: '', defaultAddress: false })

const loadData = async () => {
  if (!sessionStore.userToken) {
    return
  }
  profile.value = await fetchUserProfile(sessionStore.userToken)
  addresses.value = await fetchAddressList(sessionStore.userToken)
  sessionStore.setProfile(profile.value)
  profileForm.nickname = profile.value.nickname || ''
  profileForm.phone = profile.value.phone || ''
  profileForm.avatar = profile.value.avatar || ''
}

const saveProfileAction = async () => {
  if (!sessionStore.userToken) return
  await saveUserProfile(sessionStore.userToken, profileForm)
  ElMessage.success('资料已保存')
  await loadData()
}

const savePasswordAction = async () => {
  if (!sessionStore.userToken) return
  await updateUserPassword(sessionStore.userToken, passwordForm)
  ElMessage.success('密码已更新')
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
}

const saveAddressAction = async () => {
  if (!sessionStore.userToken) return
  await saveAddress(sessionStore.userToken, addressForm)
  ElMessage.success('地址已保存')
  Object.assign(addressForm, { addressId: '', receiverName: '', receiverPhone: '', province: '', city: '', region: '', detailAddress: '', addressLabel: '', defaultAddress: false })
  await loadData()
}

const fillAddress = (row: UserAddress) => {
  Object.assign(addressForm, {
    addressId: row.addressId || '',
    receiverName: row.receiverName,
    receiverPhone: row.receiverPhone,
    province: row.province || '',
    city: row.city || '',
    region: row.region || '',
    detailAddress: row.detailAddress,
    addressLabel: row.addressLabel || '',
    defaultAddress: Boolean(row.defaultAddress),
  })
}

const deleteAddressAction = async (addressId: string) => {
  if (!sessionStore.userToken) return
  await deleteAddress(sessionStore.userToken, addressId)
  ElMessage.success('地址已删除')
  await loadData()
}

const setDefaultAction = async (addressId: string) => {
  if (!sessionStore.userToken) return
  await setDefaultAddress(sessionStore.userToken, addressId)
  ElMessage.success('默认地址已更新')
  await loadData()
}

const logoutAction = async () => {
  if (sessionStore.userToken) {
    await logoutUser(sessionStore.userToken)
  }
  sessionStore.clearSession()
  router.push('/auth/login')
}

onMounted(loadData)
</script>
