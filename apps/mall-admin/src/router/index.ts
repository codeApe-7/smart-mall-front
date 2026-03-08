import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'admin-login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminWorkbenchLayout.vue'),
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/DashboardView.vue') },
        { path: 'category', name: 'admin-category', component: () => import('@/views/CategoryManageView.vue') },
        { path: 'products', name: 'admin-products', component: () => import('@/views/ProductManageView.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('@/views/OrderManageView.vue') },
        { path: 'refunds', name: 'admin-refunds', component: () => import('@/views/RefundManageView.vue') },
        { path: 'reviews', name: 'admin-reviews', component: () => import('@/views/ReviewManageView.vue') },
        { path: 'users', name: 'admin-users', component: () => import('@/views/UserManageView.vue') },
        { path: 'notices', name: 'admin-notices', component: () => import('@/views/NoticeManageView.vue') },
        { path: 'ai-config', name: 'admin-ai-config', component: () => import('@/views/AiConfigView.vue') },
        { path: 'knowledge', name: 'admin-knowledge', component: () => import('@/views/KnowledgeManageView.vue') },
        { path: 'ai-monitor', name: 'admin-ai-monitor', component: () => import('@/views/AiMonitorView.vue') },
        { path: 'authority', name: 'admin-authority', component: () => import('@/views/AuthorityManageView.vue') },
        { path: 'audit', name: 'admin-audit', component: () => import('@/views/AuditLogView.vue') },
      ],
    },
  ],
})

export default router
