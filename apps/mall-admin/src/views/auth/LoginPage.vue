<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getCheckCode, getProfile, login } from '@mall-admin/api/modules/account';
import { useAdminSessionStore } from '@mall-admin/stores/session';

const router = useRouter();
const sessionStore = useAdminSessionStore();
const form = reactive({ account: 'admin', password: 'admin123', checkCode: '', checkCodeKey: '' });
const captchaImage = ref('');
const loading = ref(false);

async function loadCaptcha() {
  const captcha = await getCheckCode();
  captchaImage.value = captcha.checkCode;
  form.checkCodeKey = captcha.checkCodeKey;
}

async function handleLogin() {
  loading.value = true;
  try {
    const token = await login(form);
    sessionStore.setToken(token);
    const profile = await getProfile();
    sessionStore.setProfile(profile);
    ElMessage.success('欢迎进入运营控制台');
    router.push('/dashboard');
  } catch (error) {
    ElMessage.error((error as Error).message);
    await loadCaptcha();
  } finally {
    loading.value = false;
  }
}

onMounted(loadCaptcha);
</script>

<template>
  <div class="admin-auth">
    <section class="admin-auth__hero">
      <p>OPS CENTER</p>
      <h1>像经营一家大型电商那样管理商品、订单、用户与 AI。</h1>
    </section>
    <section class="admin-auth__panel admin-panel">
      <h2>后台登录</h2>
      <el-form label-position="top">
        <el-form-item label="账号"><el-input v-model="form.account" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" show-password /></el-form-item>
        <el-form-item label="验证码">
          <div class="admin-auth__captcha">
            <el-input v-model="form.checkCode" />
            <img :src="captchaImage" alt="captcha" @click="loadCaptcha" />
          </div>
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="handleLogin">登录控制台</el-button>
      </el-form>
    </section>
  </div>
</template>

<style scoped>
.admin-auth {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
}
.admin-auth__hero {
  padding: 72px;
  color: white;
  background: linear-gradient(145deg, #16243a, #163a56 55%, #d95d25);
}
.admin-auth__hero p {
  letter-spacing: 0.22em;
}
.admin-auth__hero h1 {
  max-width: 620px;
  margin-top: 120px;
  font-size: 54px;
  line-height: 1.06;
}
.admin-auth__panel {
  width: 460px;
  align-self: center;
  justify-self: center;
  padding: 30px;
}
.admin-auth__captcha {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 12px;
}
.admin-auth__captcha img {
  width: 110px;
  height: 42px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
}
</style>
