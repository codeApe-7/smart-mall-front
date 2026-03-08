<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { login } from '@mall-user/api/modules/account';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const router = useRouter();
const sessionStore = useMallUserSessionStore();
const form = reactive({ account: '', password: '' });
const loading = reactive({ value: false });

async function handleSubmit() {
  loading.value = true;
  try {
    const payload = await login(form);
    sessionStore.setSession(payload);
    ElMessage.success('欢迎回来，准备开逛。');
    router.push('/');
  } catch (error) {
    ElMessage.error((error as Error).message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-page__hero">
      <p>星淘精选 / SMART ASSIST SHOPPING</p>
      <h1>橙金陈列、深海导航、像淘宝一样热闹但更有判断力。</h1>
      <ul>
        <li>后端接口一一映射的购物、消息、智能助手主链路</li>
        <li>支持智能导购对话、订单售后、偏好画像刷新</li>
        <li>为移动端和后台共用的数据模型保留统一边界</li>
      </ul>
    </section>
    <section class="auth-page__panel mall-panel">
      <h2>用户登录</h2>
      <el-form label-position="top" @submit.prevent>
        <el-form-item label="账号">
          <el-input v-model="form.account" placeholder="用户名或手机号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary" :loading="loading.value" @click="handleSubmit">立即登录</el-button>
        <el-button link @click="router.push('/register')">没有账号？去注册</el-button>
      </el-form>
    </section>
  </div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: grid; grid-template-columns: 1.2fr 0.8fr; }
.auth-page__hero { padding: 72px; color: #fff7ef; background: linear-gradient(135deg, #1b2f3f, #0f7f74 55%, #ff6a2b); }
.auth-page__hero p { letter-spacing: 0.2em; }
.auth-page__hero h1 { max-width: 640px; font-size: 52px; line-height: 1.1; }
.auth-page__hero ul { margin: 32px 0 0; padding-left: 18px; display: grid; gap: 12px; }
.auth-page__panel { align-self: center; width: 460px; padding: 32px; justify-self: center; }
.auth-page__panel h2 { margin: 0 0 20px; }
</style>
