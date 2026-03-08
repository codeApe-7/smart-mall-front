import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAdminSessionStore } from '@/stores/adminSession'
import { pinia } from '@/stores'

const routes = [
  {
    path: '/login',
    name: 'admin-login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminWorkbenchLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', meta: { permission: 'dashboard:overview' }, component: () => import('@/views/DashboardView.vue') },
      { path: 'category', name: 'admin-category', meta: { permission: 'product:manage' }, component: () => import('@/views/CategoryManageView.vue') },
      { path: 'products', name: 'admin-products', meta: { permission: 'product:manage' }, component: () => import('@/views/ProductManageView.vue') },
      { path: 'orders', name: 'admin-orders', meta: { permission: 'order:manage' }, component: () => import('@/views/OrderManageView.vue') },
      { path: 'refunds', name: 'admin-refunds', meta: { permission: 'order:manage' }, component: () => import('@/views/RefundManageView.vue') },
      { path: 'reviews', name: 'admin-reviews', meta: { permission: 'review:manage' }, component: () => import('@/views/ReviewManageView.vue') },
      { path: 'users', name: 'admin-users', meta: { permission: 'user:manage' }, component: () => import('@/views/UserManageView.vue') },
      { path: 'notices', name: 'admin-notices', meta: { permission: 'notice:manage' }, component: () => import('@/views/NoticeManageView.vue') },
      { path: 'ai-config', name: 'admin-ai-config', meta: { permission: 'ai:config' }, component: () => import('@/views/AiConfigView.vue') },
      { path: 'knowledge', name: 'admin-knowledge', meta: { permission: 'knowledge:manage' }, component: () => import('@/views/KnowledgeManageView.vue') },
      { path: 'ai-monitor', name: 'admin-ai-monitor', meta: { permission: 'ai:monitor' }, component: () => import('@/views/AiMonitorView.vue') },
      { path: 'authority', name: 'admin-authority', meta: { permission: 'authority:manage' }, component: () => import('@/views/AuthorityManageView.vue') },
      { path: 'audit', name: 'admin-audit', meta: { permission: 'audit:log' }, component: () => import('@/views/AuditLogView.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const session = useAdminSessionStore(pinia)
  if (to.meta.public) {
    if (to.path === '/login' && session.isAuthenticated) return '/dashboard'
    return true
  }

  if (!session.isAuthenticated) return '/login'

  if (!session.profile && !session.loading) {
    try {
      await session.fetchProfile()
    } catch {
      await session.logout()
      return '/login'
    }
  }

  const permission = typeof to.meta.permission === 'string' ? to.meta.permission : ''
  if (permission && !session.hasPermission(permission)) {
    ElMessage.warning('当前账号暂无该页面权限')
    return '/dashboard'
  }

  return true
})

export default router
