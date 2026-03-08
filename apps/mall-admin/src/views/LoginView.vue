<template>
  <div class="login-page">
    <section class="login-hero">
      <p>SMARTMALL ADMIN</p>
      <h1>像淘宝运营后台一样高密度，但保留 SmartMall 的 AI 中枢气质。</h1>
      <ul>
        <li>验证码登录 + `adminToken` 鉴权闭环</li>
        <li>权限驱动菜单与按钮显隐</li>
        <li>覆盖商品、订单、通知、AI、审计五大后台域</li>
      </ul>
    </section>

    <WorkbenchPanel title="管理员登录" description="账号、密码、验证码字段与后端 `LoginDTO` 一致。">
      <el-form :model="form" label-position="top" @submit.prevent="submit">
        <el-form-item label="账号">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="captcha-row">
            <el-input v-model="form.checkCode" placeholder="请输入验证码结果" />
            <button class="captcha-box" type="button" @click="loadCaptcha">
              <img v-if="captcha" :src="captcha" alt="captcha" />
              <span v-else>加载中…</span>
            </button>
          </div>
        </el-form-item>
        <div class="login-actions">
          <el-button link type="primary" @click="loadCaptcha">刷新验证码</el-button>
          <el-button type="primary" size="large" :loading="session.loading" @click="submit">登录后台</el-button>
        </div>
      </el-form>
    </WorkbenchPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import { accountApi } from '@/api/modules/admin'
import { useAdminSessionStore } from '@/stores/adminSession'

const router = useRouter()
const session = useAdminSessionStore()
const captcha = ref('')

const form = reactive({
  account: 'admin',
  password: '123456',
  checkCode: '',
  checkCodeKey: '',
})

const loadCaptcha = async () => {
  const payload = await accountApi.getCheckCode()
  captcha.value = payload.checkCode
  form.checkCodeKey = payload.checkCodeKey
}

const submit = async () => {
  if (!form.account || !form.password || !form.checkCode || !form.checkCodeKey) {
    ElMessage.warning('请先补全登录信息')
    return
  }
  try {
    await session.login(form)
    router.push('/dashboard')
  } catch {
    form.checkCode = ''
    loadCaptcha()
  }
}

onMounted(loadCaptcha)
</script>

<style scoped>
.login-page { min-height: 100vh; display:grid; grid-template-columns: 1.1fr .9fr; gap: 28px; padding: 32px; }
.login-hero, :deep(.workbench-panel) { min-height: calc(100vh - 64px); }
.login-hero {
  padding: 42px; border-radius: 32px; border: 1px solid var(--admin-border); background:
    linear-gradient(135deg, rgba(255,139,61,.22), rgba(79,124,255,.16)),
    radial-gradient(circle at right top, rgba(255,255,255,.14), transparent 28%),
    rgba(14, 17, 23, .86);
  box-shadow: var(--admin-shadow);
}
.login-hero p { margin: 0 0 10px; color: var(--admin-primary); letter-spacing: .24em; }
.login-hero h1 { max-width: 620px; margin: 0; font-size: 52px; line-height: 1.08; }
.login-hero ul { margin: 28px 0 0; padding-left: 18px; color: var(--admin-muted); line-height: 1.9; }
.captcha-row { display:grid; grid-template-columns: 1fr 160px; gap: 12px; }
.captcha-box { border: none; border-radius: 16px; overflow: hidden; background: rgba(255,255,255,.06); cursor: pointer; }
.captcha-box img { width: 100%; height: 100%; object-fit: cover; }
.login-actions { display:flex; justify-content:space-between; align-items:center; }
@media (max-width: 1180px) { .login-page { grid-template-columns: 1fr; } .login-hero, :deep(.workbench-panel) { min-height: auto; } }
</style>
