<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { register } from '@mall-user/api/modules/account';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const router = useRouter();
const sessionStore = useMallUserSessionStore();
const form = reactive({ username: '', password: '', phone: '', nickname: '' });
const loading = reactive({ value: false });

async function handleSubmit() {
  loading.value = true;
  try {
    const payload = await register(form);
    sessionStore.setSession(payload as never);
    ElMessage.success('注册成功，已为你登录。');
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
    <section class="auth-page__hero auth-page__hero--light">
      <p>NEW BUYER / WELCOME</p>
      <h1>先把喜欢的风格说给我们听，再开始你的第一单。</h1>
    </section>
    <section class="auth-page__panel mall-panel">
      <h2>创建账号</h2>
      <el-form label-position="top" @submit.prevent>
        <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" show-password /></el-form-item>
        <el-button type="primary" :loading="loading.value" @click="handleSubmit">完成注册</el-button>
        <el-button link @click="router.push('/login')">已有账号？去登录</el-button>
      </el-form>
    </section>
  </div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
.auth-page__hero { padding: 72px; color: white; background: linear-gradient(160deg, #ff824d, #ffb44f 45%, #1b2f3f); }
.auth-page__hero--light h1 { max-width: 520px; margin-top: 120px; font-size: 50px; line-height: 1.12; }
.auth-page__panel { align-self: center; width: 460px; padding: 32px; justify-self: center; }
</style>

