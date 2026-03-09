import { createRouter, createWebHistory } from 'vue-router';
import { STORAGE_KEYS } from '@shared/constants/storage';

const adminLegacyRedirects = [
  { path: '/admin/login', redirect: '/login' },
  { path: '/admin/dashboard', redirect: '/dashboard' },
  { path: '/admin/product/category', redirect: '/product/category' },
  { path: '/admin/product/list', redirect: '/product/list' },
  { path: '/admin/order/list', redirect: '/order/list' },
  { path: '/admin/refund/list', redirect: '/refund/list' },
  { path: '/admin/review/list', redirect: '/review/list' },
  { path: '/admin/user/list', redirect: '/user/list' },
  { path: '/admin/notice/list', redirect: '/notice/list' },
  { path: '/admin/ai/config', redirect: '/ai/config' },
  { path: '/admin/ai/knowledge', redirect: '/ai/knowledge' },
  { path: '/admin/ai/monitor', redirect: '/ai/monitor' },
  { path: '/admin/authority/account', redirect: '/authority/account' },
  { path: '/admin/authority/role', redirect: '/authority/role' },
  { path: '/admin/audit/list', redirect: '/audit/list' },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...adminLegacyRedirects,
    { path: '/product/category', redirect: '/category' },
    { path: '/product/list', redirect: '/products' },
    { path: '/order/list', redirect: '/orders' },
    { path: '/refund/list', redirect: '/refunds' },
    { path: '/review/list', redirect: '/reviews' },
    { path: '/user/list', redirect: '/users' },
    { path: '/notice/list', redirect: '/notices' },
    { path: '/ai/config', redirect: '/ai-config' },
    { path: '/ai/knowledge', redirect: '/knowledge' },
    { path: '/ai/monitor', redirect: '/ai-monitor' },
    { path: '/authority', redirect: '/authority/account' },
    { path: '/audit/list', redirect: '/audit' },
    {
      path: '/login',
      name: 'admin-login',
      component: () => import('@/views/LoginView.vue')
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
        { path: 'authority/account', name: 'admin-account', component: () => import('@/views/AccountManageView.vue') },
        { path: 'authority/role', name: 'admin-role', component: () => import('@/views/RoleManageView.vue') },
        { path: 'audit', name: 'admin-audit', component: () => import('@/views/AuditLogView.vue') }
      ]
    }
  ]
});

router.beforeEach((to) => {
  if (to.path !== '/login' && !window.localStorage.getItem(STORAGE_KEYS.adminToken)) {
    return '/login';
  }
  return true;
});

export default router;
