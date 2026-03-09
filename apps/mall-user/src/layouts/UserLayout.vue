<script setup lang="ts">
import { Bell, ChatDotRound, Goods, House, Location, ShoppingCart, SwitchButton, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchUnreadCount } from '@/api/modules/message'
import { useCartStore } from '@/stores/cart'
import { useMallUserSessionStore } from '@/stores/session'

const route = useRoute()
const router = useRouter()
const sessionStore = useMallUserSessionStore()
const cartStore = useCartStore()

const keyword = ref('')
const unreadCount = ref(0)

const primaryLinks = [
  { label: '首页', path: '/', icon: House },
  { label: '商品库', path: '/products', icon: Goods },
  { label: '智能导购', path: '/assistant', icon: ChatDotRound },
  { label: '订单中心', path: '/orders', icon: ShoppingCart },
]

const serviceLinks = [
  { label: '消息', path: '/messages', icon: Bell },
  { label: '地址', path: '/address', icon: Location },
  { label: '我的', path: '/profile', icon: User },
]

const displayName = computed(() => sessionStore.profile?.nickname || sessionStore.profile?.username || '游客')
const welcomeText = computed(() => (
  sessionStore.isLoggedIn
    ? '登录态与购物链路按后端 Token、消息与购物车接口实时联动。'
    : '登录后即可同步购物车、消息中心、订单与偏好画像。'
))
const cartCount = computed(() => {
  const summary = cartStore.summary as Record<string, unknown>
  return Number(summary.selectedCount ?? summary.itemCount ?? cartStore.items.length ?? 0)
})

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleSearch() {
  router.push({ path: '/products', query: keyword.value ? { keyword: keyword.value } : undefined })
}

async function syncShellData() {
  if (!sessionStore.userToken) {
    unreadCount.value = 0
    cartStore.cart = null
    return
  }

  try {
    if (!sessionStore.profile) {
      await sessionStore.loadProfile()
    }
  } catch {
    sessionStore.clearSession()
    unreadCount.value = 0
    return
  }

  try {
    const [count] = await Promise.all([
      fetchUnreadCount(String(sessionStore.userToken)),
      cartStore.loadCart(),
    ])
    unreadCount.value = Number(count || 0)
  } catch {
    unreadCount.value = 0
  }
}

async function handleLogout() {
  try {
    await sessionStore.logout()
    ElMessage.success('已退出登录')
  } finally {
    unreadCount.value = 0
    router.push('/auth/login')
  }
}

watch(() => sessionStore.userToken, () => {
  void syncShellData()
}, { immediate: true })
</script>

<template>
  <div class="market-shell">
    <header class="market-shell__hero">
      <div class="market-shell__brand">
        <p>SMARTMALL MARKETPLACE</p>
        <h1>电商主会场 + AI 导购中枢</h1>
        <span>{{ welcomeText }}</span>
      </div>
      <div class="market-shell__hero-actions">
        <el-input
          v-model="keyword"
          class="market-shell__search"
          placeholder="搜索商品名、场景关键词或想比较的品类"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">开始逛购</el-button>
        <el-button plain @click="router.push('/assistant')">试试 AI 导购</el-button>
      </div>
    </header>

    <div class="market-shell__toolbar">
      <nav class="market-shell__nav mall-glass">
        <RouterLink
          v-for="item in primaryLinks"
          :key="item.path"
          :to="item.path"
          class="market-shell__nav-item"
          :class="{ 'is-active': isActive(item.path) }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="market-shell__status mall-glass">
        <div class="market-shell__status-text">
          <strong>{{ displayName }}</strong>
          <span>{{ sessionStore.isLoggedIn ? '已连接用户态' : '游客浏览中' }}</span>
        </div>
        <div class="market-shell__status-actions">
          <RouterLink
            v-for="item in serviceLinks"
            :key="item.path"
            :to="item.path"
            class="market-shell__service-link"
            :class="{ 'is-active': isActive(item.path) }"
          >
            <el-badge
              :value="item.path === '/messages' ? unreadCount : 0"
              :hidden="item.path !== '/messages' || unreadCount === 0"
            >
              <el-icon><component :is="item.icon" /></el-icon>
            </el-badge>
            <span>{{ item.label }}</span>
          </RouterLink>

          <div class="market-shell__cart-chip" @click="router.push('/cart')">
            <span>购物车</span>
            <strong>{{ cartCount }}</strong>
          </div>

          <el-button v-if="sessionStore.isLoggedIn" text @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出
          </el-button>
          <el-button v-else text @click="router.push('/auth/login')">登录</el-button>
        </div>
      </div>
    </div>

    <main class="market-shell__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.market-shell {
  display: grid;
  gap: 18px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 22px;
}

.market-shell__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 0.9fr);
  gap: 20px;
  padding: 28px 32px;
  border-radius: 32px;
  background:
    radial-gradient(circle at top right, rgba(255, 205, 137, 0.35), transparent 28%),
    linear-gradient(135deg, #ff7d26 0%, #ff5d00 42%, #1d120c 100%);
  color: #fff8f2;
  box-shadow: 0 28px 76px rgba(120, 56, 14, 0.18);
}

.market-shell__brand {
  p {
    margin: 0;
    letter-spacing: 0.24em;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.76);
  }

  h1 {
    margin: 14px 0 12px;
    font: 700 40px/1.1 'STZhongsong', serif;
  }

  span {
    display: block;
    max-width: 640px;
    color: rgba(255, 255, 255, 0.84);
    line-height: 1.7;
  }
}

.market-shell__hero-actions {
  display: grid;
  align-content: end;
  gap: 12px;
  justify-items: stretch;
}

.market-shell__search :deep(.el-input__wrapper) {
  min-height: 48px;
  border-radius: 18px;
  box-shadow: none;
}

.market-shell__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(400px, auto);
  gap: 18px;
}

.market-shell__nav,
.market-shell__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-radius: 24px;
}

.market-shell__nav {
  flex-wrap: wrap;
}

.market-shell__nav-item,
.market-shell__service-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 16px;
  color: var(--mall-muted);
  transition: 0.2s ease;
}

.market-shell__nav-item.is-active,
.market-shell__service-link.is-active {
  background: rgba(255, 106, 43, 0.12);
  color: var(--mall-text);
  font-weight: 700;
}

.market-shell__status {
  padding-right: 14px;
}

.market-shell__status-text {
  display: grid;
  gap: 4px;

  strong {
    font-size: 16px;
  }

  span {
    color: var(--mall-muted);
    font-size: 13px;
  }
}

.market-shell__status-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.market-shell__cart-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(15, 127, 116, 0.08);
  cursor: pointer;

  strong {
    min-width: 28px;
    text-align: center;
    color: var(--mall-secondary);
  }
}

.market-shell__content {
  min-height: 480px;
}

@media (max-width: 1100px) {
  .market-shell__hero,
  .market-shell__toolbar {
    grid-template-columns: 1fr;
  }

  .market-shell__status {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
