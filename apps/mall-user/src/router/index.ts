import { createRouter, createWebHistory } from 'vue-router';
import { STORAGE_KEYS } from '@shared/constants/storage';
import UserLayout from '@/layouts/UserLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/account/LoginPage.vue') },
    { path: '/register', component: () => import('@/views/account/RegisterPage.vue') },
    {
      path: '/',
      component: UserLayout,
      children: [
        { path: '', component: () => import('@/views/product/HomePage.vue') },
        { path: 'products', component: () => import('@/views/product/ProductListPage.vue') },
        { path: 'products/:productId', component: () => import('@/views/product/ProductDetailPage.vue') },
        { path: 'cart', component: () => import('@/views/cart/CartPage.vue'), meta: { auth: true } },
        { path: 'checkout', component: () => import('@/views/order/CheckoutPage.vue'), meta: { auth: true } },
        { path: 'orders', component: () => import('@/views/order/OrderListPage.vue'), meta: { auth: true } },
        { path: 'orders/:orderId', component: () => import('@/views/order/OrderDetailPage.vue'), meta: { auth: true } },
        { path: 'messages', component: () => import('@/views/message/MessageCenterPage.vue'), meta: { auth: true } },
        { path: 'assistant', component: () => import('@/views/assistant/AssistantPage.vue') },
        { path: 'profile', component: () => import('@/views/profile/ProfilePage.vue'), meta: { auth: true } },
        { path: 'address', component: () => import('@/views/profile/AddressPage.vue'), meta: { auth: true } },
        { path: 'preference', component: () => import('@/views/profile/PreferencePage.vue'), meta: { auth: true } }
      ]
    }
  ]
});

router.beforeEach((to) => {
  if (to.meta.auth && !window.localStorage.getItem(STORAGE_KEYS.userToken)) {
    return '/login';
  }
  return true;
});

export default router;
