<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginUser } from '@/api/modules/account'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()
const form = reactive({ account: '', password: '' })
const loading = reactive({ submit: false })

const submit = async () => {
  loading.submit = true
  try {
    const result = await loginUser(form)
    sessionStore.setSession(String(result.userToken || ''), {
      userId: result.userId,
      username: result.username,
      nickname: result.nickname,
      phone: result.phone,
      avatar: result.avatar,
    })
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } finally {
    loading.submit = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-panel">
      <div class="hero-banner compact">
        <h2>像逛淘宝一样上头，<br />但更懂你。</h2>
        <p>SmartMall 把推荐、下单、消息与智能助手放到同一条购物动线里。</p>
      </div>
      <el-form label-position="top" :model="form" @submit.prevent="submit">
        <el-form-item label="账号 account">
          <el-input v-model="form.account" placeholder="用户名或手机号" />
        </el-form-item>
        <el-form-item label="密码 password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <div class="toolbar">
          <el-button type="primary" :loading="loading.submit" @click="submit">立即登录</el-button>
          <el-button @click="$router.push('/auth/register')">去注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
.auth-panel { width: min(1080px, 100%); display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px; padding: 24px; border-radius: 32px; background: rgba(255, 255, 255, 0.86); box-shadow: var(--sm-shadow); }
.compact { min-height: 100%; }
@media (max-width: 900px) { .auth-panel { grid-template-columns: 1fr; } }
</style>
