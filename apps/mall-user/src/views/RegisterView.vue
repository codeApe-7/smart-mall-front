<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registerUser } from '@/api/modules/account'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const sessionStore = useSessionStore()
const form = reactive({ username: '', password: '', phone: '', nickname: '' })
const loading = reactive({ submit: false })

const submit = async () => {
  loading.submit = true
  try {
    const result = await registerUser(form)
    sessionStore.setSession(String(result.userToken || ''), {
      userId: result.userId,
      username: result.username,
      nickname: result.nickname,
      phone: result.phone,
      avatar: result.avatar,
    })
    ElMessage.success('注册成功')
    router.push('/')
  } finally {
    loading.submit = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-panel reverse">
      <el-form label-position="top" :model="form" @submit.prevent="submit">
        <el-form-item label="用户名 username"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="昵称 nickname"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="手机号 phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="密码 password"><el-input v-model="form.password" type="password" show-password /></el-form-item>
        <div class="toolbar">
          <el-button type="primary" :loading="loading.submit" @click="submit">创建账号</el-button>
          <el-button @click="$router.push('/auth/login')">已有账号</el-button>
        </div>
      </el-form>
      <div class="hero-banner compact">
        <h2>给喜欢逛的你，<br />再多一点惊喜。</h2>
        <p>注册后即可开启个性化推荐、智能助手和订单全链路体验。</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
.auth-panel { width: min(1080px, 100%); display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; border-radius: 32px; background: rgba(255, 255, 255, 0.86); box-shadow: var(--sm-shadow); }
.compact { min-height: 100%; }
@media (max-width: 900px) { .auth-panel { grid-template-columns: 1fr; } }
</style>
