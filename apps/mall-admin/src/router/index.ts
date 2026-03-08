import { createRouter, createWebHistory } from 'vue-router';
import { STORAGE_KEYS } from '@shared/constants/storage';
import AdminLayout from '@/layouts/AdminLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/auth/LoginPage.vue') },
    {
      path: '/',
      component: AdminLayout,
      redirect: '/dashboard',
      meta: { auth: true },
      children: [
        { path: 'dashboard', component: () => import('@/views/dashboard/DashboardPage.vue') },
        { path: 'product/category', component: () => import('@/views/product/CategoryManagePage.vue') },
        { path: 'product/list', component: () => import('@/views/product/ProductManagePage.vue') },
        { path: 'order/list', component: () => import('@/views/order/OrderManagePage.vue') },
        { path: 'refund/list', component: () => import('@/views/order/RefundManagePage.vue') },
        { path: 'review/list', component: () => import('@/views/order/ReviewManagePage.vue') },
        { path: 'user/list', component: () => import('@/views/user/UserManagePage.vue') },
        { path: 'notice/list', component: () => import('@/views/notice/NoticeManagePage.vue') },
        { path: 'ai/config', component: () => import('@/views/ai/AiConfigPage.vue') },
        { path: 'ai/knowledge', component: () => import('@/views/ai/KnowledgeManagePage.vue') },
        { path: 'ai/monitor', component: () => import('@/views/ai/AiMonitorPage.vue') },
        { path: 'authority/account', component: () => import('@/views/authority/AccountManagePage.vue') },
        { path: 'authority/role', component: () => import('@/views/authority/RoleManagePage.vue') },
        { path: 'audit/list', component: () => import('@/views/authority/AuditLogPage.vue') }
      ]
    }
  ]
});

router.beforeEach((to) => {
  if (to.meta.auth && !window.localStorage.getItem(STORAGE_KEYS.adminToken)) {
    return '/login';
  }
  return true;
});

export default router;
