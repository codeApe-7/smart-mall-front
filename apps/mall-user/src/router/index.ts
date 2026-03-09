import { createRouter, createWebHistory } from 'vue-router'
import { STORAGE_KEYS } from '@shared/constants/storage'

const legacyUserRedirects = [
  { path: '/home', redirect: '/' },
  { path: '/product/list', redirect: '/products' },
  { path: '/order/preview', redirect: '/checkout' },
  { path: '/order/list', redirect: '/orders' },
  { path: '/message', redirect: '/messages' },
  { path: '/account/profile', redirect: '/profile' },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', redirect: '/auth/login' },
    { path: '/register', redirect: '/auth/register' },
    { path: '/product/:productId', redirect: (to) => `/products/${String(to.params.productId || '')}` },
    { path: '/order/:orderId', redirect: (to) => `/orders/${String(to.params.orderId || '')}` },
    ...legacyUserRedirects,
    {
      path: '/',
      component: () => import('@/layouts/MarketplaceLayout.vue'),
      children: [
        { path: '', name: 'user-home', component: () => import('@/views/HomeView.vue') },
        { path: 'products', name: 'user-products', component: () => import('@/views/ProductListView.vue') },
        { path: 'products/:productId', name: 'user-product-detail', component: () => import('@/views/ProductDetailView.vue') },
        { path: 'compare', name: 'user-product-compare', component: () => import('@/views/ProductCompareView.vue') },
        { path: 'cart', name: 'user-cart', component: () => import('@/views/CartView.vue'), meta: { auth: true } },
        { path: 'checkout', name: 'user-checkout', component: () => import('@/views/CheckoutView.vue'), meta: { auth: true } },
        { path: 'orders', name: 'user-orders', component: () => import('@/views/OrderListView.vue'), meta: { auth: true } },
        { path: 'orders/:orderId', name: 'user-order-detail', component: () => import('@/views/OrderDetailView.vue'), meta: { auth: true } },
        { path: 'messages', name: 'user-messages', component: () => import('@/views/MessageCenterView.vue'), meta: { auth: true } },
        { path: 'preference', name: 'user-preference', component: () => import('@/views/PreferenceView.vue'), meta: { auth: true } },
        { path: 'assistant', name: 'user-assistant', component: () => import('@/views/AssistantView.vue') },
        { path: 'profile', name: 'user-profile', component: () => import('@/views/ProfileView.vue'), meta: { auth: true } },
        { path: 'refund/:orderId', name: 'user-refund-detail', component: () => import('@/views/RefundDetailView.vue'), meta: { auth: true } },
        { path: 'payment/callback', name: 'user-payment-callback', component: () => import('@/views/PaymentCallbackView.vue'), meta: { auth: true } },
        { path: 'address', name: 'user-address', component: () => import('@/views/AddressView.vue'), meta: { auth: true } },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: 'login', name: 'user-login', component: () => import('@/views/LoginView.vue') },
        { path: 'register', name: 'user-register', component: () => import('@/views/RegisterView.vue') },
      ],
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.auth && !window.localStorage.getItem(STORAGE_KEYS.userToken)) {
    return '/auth/login'
  }
  return true
})

export default router
