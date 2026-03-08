import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MarketplaceLayout.vue'),
      children: [
        { path: '', name: 'user-home', component: () => import('@/views/HomeView.vue') },
        { path: 'products', name: 'user-products', component: () => import('@/views/ProductListView.vue') },
        { path: 'products/:productId', name: 'user-product-detail', component: () => import('@/views/ProductDetailView.vue') },
        { path: 'compare', name: 'user-product-compare', component: () => import('@/views/ProductCompareView.vue') },
        { path: 'cart', name: 'user-cart', component: () => import('@/views/CartView.vue') },
        { path: 'checkout', name: 'user-checkout', component: () => import('@/views/CheckoutView.vue') },
        { path: 'orders', name: 'user-orders', component: () => import('@/views/OrderListView.vue') },
        { path: 'orders/:orderId', name: 'user-order-detail', component: () => import('@/views/OrderDetailView.vue') },
        { path: 'messages', name: 'user-messages', component: () => import('@/views/MessageCenterView.vue') },
        { path: 'preference', name: 'user-preference', component: () => import('@/views/PreferenceView.vue') },
        { path: 'assistant', name: 'user-assistant', component: () => import('@/views/AssistantView.vue') },
        { path: 'profile', name: 'user-profile', component: () => import('@/views/ProfileView.vue') },
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

export default router
