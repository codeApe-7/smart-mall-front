<template>
  <section class="auth-card login-shell">
    <div>
      <span class="eyebrow">创建新账号</span>
      <h2>注册 SmartMall</h2>
      <p>字段与后端 `MallUserRegisterDTO` 一致：`username`、`password`、`phone`、`nickname`。</p>
    </div>
    <el-form label-position="top" :model="form" @submit.prevent="submit">
      <el-form-item label="用户名 username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号 phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="昵称 nickname">
        <el-input v-model="form.nickname" placeholder="可选昵称" />
      </el-form-item>
      <el-form-item label="密码 password">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
      <div class="hero-actions">
        <el-button type="danger" :loading="loading" round @click="submit">完成注册</el-button>
        <el-button round @click="$router.push('/auth/login')">已有账号</el-button>
      </div>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registerUser } from '@/api/modules/account'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const sessionStore = useSessionStore()
const loading = ref(false)
const form = reactive({ username: '', password: '', phone: '', nickname: '' })

const submit = async () => {
  if (!form.username || !form.password || !form.phone) {
    ElMessage.warning('请完整填写用户名、手机号和密码')
    return
  }

  loading.value = true
  try {
    const result = await registerUser(form)
    sessionStore.setSession(result.userToken, result.profile)
    ElMessage.success('注册成功，已自动登录')
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>
