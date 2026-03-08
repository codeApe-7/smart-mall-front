<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getProfile, logout, saveProfile, updatePassword } from '@mall-user/api/modules/account';
import { useMallUserSessionStore } from '@mall-user/stores/session';
import { useRouter } from 'vue-router';

const router = useRouter();
const sessionStore = useMallUserSessionStore();
const profileForm = reactive({ nickname: '', phone: '', avatar: '' });
const passwordForm = reactive({ oldPassword: '', newPassword: '' });

async function loadProfile() {
  const token = String((sessionStore as any).userToken || '');
  if (!token) return;
  const profile = await getProfile(token);
  profileForm.nickname = profile.nickname || '';
  profileForm.phone = profile.phone || '';
  profileForm.avatar = String(profile.avatar || '');
}

async function saveCurrentProfile() {
  const token = String((sessionStore as any).userToken || '');
  if (!token) return;
  await saveProfile(token, profileForm);
  ElMessage.success('资料已保存');
}

async function savePassword() {
  const token = String((sessionStore as any).userToken || '');
  if (!token) return;
  await updatePassword(token, passwordForm);
  ElMessage.success('密码更新成功');
}

async function doLogout() {
  const token = String((sessionStore as any).userToken || '');
  if (token) await logout(token).catch(() => undefined);
  (sessionStore as any).clearSession?.();
  router.push('/login');
}

onMounted(loadProfile);
</script>

<template>
  <div class="profile-page">
    <section class="mall-panel profile-page__card">
      <div class="section-title"><h3>个人资料</h3></div>
      <el-form label-position="top">
        <el-form-item label="昵称"><el-input v-model="profileForm.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="profileForm.phone" /></el-form-item>
        <el-form-item label="头像地址"><el-input v-model="profileForm.avatar" /></el-form-item>
        <el-button type="primary" @click="saveCurrentProfile">保存资料</el-button>
      </el-form>
    </section>
    <section class="mall-panel profile-page__card">
      <div class="section-title"><h3>安全设置</h3></div>
      <el-form label-position="top">
        <el-form-item label="旧密码"><el-input v-model="passwordForm.oldPassword" show-password /></el-form-item>
        <el-form-item label="新密码"><el-input v-model="passwordForm.newPassword" show-password /></el-form-item>
        <div class="profile-page__actions">
          <el-button type="primary" @click="savePassword">修改密码</el-button>
          <el-button plain @click="router.push('/address')">管理地址</el-button>
          <el-button plain @click="router.push('/preference')">偏好档案</el-button>
          <el-button type="danger" plain @click="doLogout">退出登录</el-button>
        </div>
      </el-form>
    </section>
  </div>
</template>

<style scoped>
.profile-page { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
.profile-page__card { padding: 24px; }
.profile-page__actions { display: flex; gap: 12px; flex-wrap: wrap; }
</style>
