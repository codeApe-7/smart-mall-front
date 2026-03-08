<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { fetchRecommendProducts, fetchProductList } from '@/api/modules/product'
import type { ProductListItem } from '@shared/types/mall'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const sessionStore = useSessionStore()
const recommendProducts = ref<ProductListItem[]>([])
const products = ref<ProductListItem[]>([])

onMounted(async () => {
  recommendProducts.value = await fetchRecommendProducts({ userId: sessionStore.profile?.userId, limit: 4 })
  const result = await fetchProductList({ pageNo: 1, pageSize: 8, status: 1 })
  products.value = result.records || []
})
</script>

<template>
  <div class="page-grid home-page">
    <section class="hero-panel">
      <div>
        <span class="eyebrow">SMARTMALL SELECT</span>
        <h2>会推荐、会对比、会解释，像淘宝一样会陈列。</h2>
        <p>首页联动推荐商品、商品广场和智能导购，强调“逛”和“决策”同时在线。</p>
        <div class="hero-actions">
          <el-button type="danger" round @click="router.push('/products')">开始逛</el-button>
          <el-button round @click="router.push('/assistant')">打开 AI 导购</el-button>
        </div>
      </div>
      <div class="hero-card-grid">
        <article class="hero-card">
          <span>推荐流</span>
          <h3>{{ recommendProducts.length }} 件个性化候选</h3>
          <p>对接 `/product/recommend`，登录后自动带 `userId`。</p>
        </article>
        <article class="hero-card">
          <span>商品库</span>
          <h3>{{ products.length }} 件首页热卖</h3>
          <p>对接 `/product/list`，保持分页和筛选参数与后端一致。</p>
        </article>
      </div>
    </section>

    <SectionPanel title="猜你喜欢" subtitle="热闹陈列感保留，但每张卡都能直达详情。">
      <div class="card-grid four">
        <ProductCard v-for="item in recommendProducts" :key="item.productId" :product="item" @click="router.push(`/products/${item.productId}`)" />
      </div>
    </SectionPanel>

    <SectionPanel title="热门好物" subtitle="首页继续承接商品广场。" accent="#ff8c38">
      <div class="card-grid four">
        <ProductCard v-for="item in products" :key="item.productId" :product="item" @click="router.push(`/products/${item.productId}`)" />
      </div>
    </SectionPanel>
  </div>
</template>
