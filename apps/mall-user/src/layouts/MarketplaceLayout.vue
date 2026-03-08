<template>
  <div class="market-layout">
    <header class="market-header">
      <div class="brand" @click="router.push('/')">
        <span class="brand-badge">智</span>
        <div>
          <h1>SmartMall</h1>
          <p>会思考的逛街体验</p>
        </div>
      </div>
      <nav class="nav-list">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item">
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="header-actions">
        <el-button text @click="router.push('/assistant')">AI 导购</el-button>
        <el-button round type="danger" @click="router.push('/auth/login')">
          {{ session.isLoggedIn ? '切换账号' : '登录' }}
        </el-button>
      </div>
    </header>
    <main class="market-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const session = useSessionStore()

const navItems = [
  { label: '寻宝首页', to: '/' },
  { label: '商品广场', to: '/products' },
  { label: '购物车', to: '/cart' },
  { label: '订单中心', to: '/orders' },
  { label: '消息中心', to: '/messages' },
  { label: '偏好画像', to: '/preference' },
]
</script>
