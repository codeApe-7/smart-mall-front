<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand-card">
        <div class="brand-logo">SM</div>
        <div>
          <h1>SmartMall Console</h1>
          <p>淘宝感运营中台 · AI 增强工作流</p>
        </div>
      </div>

      <nav class="nav-list">
        <RouterLink v-for="item in visibleMenu" :key="item.to" :to="item.to" class="nav-item">
          <span>{{ item.short }}</span>
          <div>
            <strong>{{ item.label }}</strong>
            <small>{{ item.description }}</small>
          </div>
        </RouterLink>
      </nav>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div>
          <p class="topbar-eyebrow">运营驾驶舱</p>
          <h2>{{ currentTitle }}</h2>
          <p class="topbar-subtitle">{{ currentDescription }}</p>
        </div>
        <div class="topbar-actions">
          <el-button plain @click="refreshProfile">刷新资料</el-button>
          <el-dropdown>
            <div class="profile-pill">
              <strong>{{ session.profile?.nickname || session.profile?.accountName || '管理员' }}</strong>
              <small>{{ session.profile?.roleNames?.join(' / ') || '未分配角色' }}</small>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/authority')">账号权限</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="workspace-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { useAdminSessionStore } from '@/stores/adminSession'

const router = useRouter()
const route = useRoute()
const session = useAdminSessionStore()

const menu = [
  { to: '/dashboard', label: '数据概览', short: '01', description: '交易、退款、库存与趋势', permission: 'dashboard:overview' },
  { to: '/category', label: '分类属性', short: '02', description: '分类树、属性和排序联动', permission: 'product:manage' },
  { to: '/products', label: '商品管理', short: '03', description: '商品详情、保存和删除', permission: 'product:manage' },
  { to: '/orders', label: '订单履约', short: '04', description: '订单详情、发货与物流', permission: 'order:manage' },
  { to: '/refunds', label: '退款售后', short: '05', description: '审核通过、驳回与跟踪', permission: 'order:manage' },
  { to: '/reviews', label: '评价运营', short: '06', description: '回复差评和内容删除', permission: 'review:manage' },
  { to: '/users', label: '用户管理', short: '07', description: '用户状态与画像详情', permission: 'user:manage' },
  { to: '/notices', label: '通知中心', short: '08', description: '草稿、发布、下线闭环', permission: 'notice:manage' },
  { to: '/ai-config', label: 'AI 配置', short: '09', description: '助手、检索和知识配置', permission: 'ai:config' },
  { to: '/knowledge', label: '知识索引', short: '10', description: '单品同步与全量重建', permission: 'knowledge:manage' },
  { to: '/ai-monitor', label: 'AI 监控', short: '11', description: '趋势、错误码与服务状态', permission: 'ai:monitor' },
  { to: '/authority', label: '账号权限', short: '12', description: '账号、角色、权限组', permission: 'authority:manage' },
  { to: '/audit', label: '审计日志', short: '13', description: '操作轨迹与异常排查', permission: 'audit:log' },
]

const visibleMenu = computed(() => menu.filter((item) => session.hasPermission(item.permission)))
const currentItem = computed(() => menu.find((item) => route.path.startsWith(item.to)) ?? menu[0])
const currentTitle = computed(() => currentItem.value?.label ?? 'SmartMall Console')
const currentDescription = computed(() => currentItem.value?.description ?? '管理后台')

const refreshProfile = async () => {
  await session.fetchProfile()
}

const handleLogout = async () => {
  await session.logout()
  router.push('/login')
}
</script>
