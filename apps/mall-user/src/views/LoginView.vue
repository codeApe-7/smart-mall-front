<template>
  <section class="auth-card login-shell">
    <div>
      <span class="eyebrow">欢迎回来</span>
      <h2>登录 SmartMall</h2>
      <p>账号字段严格对应后端 `account`，登录成功后回填 `userToken` 与用户资料。</p>
    </div>
    <el-form label-position="top" :model="form" @submit.prevent="submit">
      <el-form-item label="账号 account">
        <el-input v-model="form.account" placeholder="用户名或手机号" />
      </el-form-item>
      <el-form-item label="密码 password">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
      <div class="hero-actions">
        <el-button type="danger" :loading="loading" round @click="submit">立即登录</el-button>
        <el-button round @click="$router.push('/auth/register')">去注册</el-button>
      </div>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginUser } from '@/api/modules/account'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()
const loading = ref(false)
const form = reactive({ account: '', password: '' })

const submit = async () => {
  if (!form.account || !form.password) {
    ElMessage.warning('请填写账号和密码')
    return
  }

  loading.value = true
  try {
    const result = await loginUser(form)
    sessionStore.setSession(result.userToken, result.profile)
    ElMessage.success('登录成功')
    router.push(String(route.query.redirect || '/'))
  } finally {
    loading.value = false
  }
}
</script>
