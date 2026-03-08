<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProductList, fetchRecommendProducts } from '@/api/modules/product'
import ProductCard from '@/components/ProductCard.vue'
import SectionPanel from '@/components/SectionPanel.vue'

const router = useRouter()
const recommendProducts = ref<Array<Record<string, unknown>>>([])
const latestProducts = ref<Array<Record<string, unknown>>>([])

onMounted(async () => {
  recommendProducts.value = await fetchRecommendProducts({ limit: 4 })
  const page = await fetchProductList({ pageNo: 1, pageSize: 6 })
  latestProducts.value = page.records
})
</script>

<template>
  <div class="page-grid">
    <section class="hero-banner">
      <h2>橙色潮场 ·<br />一站式智能购物宇宙</h2>
      <p>用接近淘宝的爽感做陈列，用 SmartMall 的智能助手、知识搜索和偏好画像做差异化。这里既能快速下单，也能慢慢逛出个人风格。</p>
      <div class="toolbar" style="margin-top: 20px">
        <el-button type="primary" size="large" @click="router.push('/products')">立即开逛</el-button>
        <el-button size="large" @click="router.push('/assistant')">试试智能助手</el-button>
      </div>
    </section>

    <SectionPanel title="今日推荐" subtitle="个性化推荐和爆款陈列同时存在，像淘宝一样丰富，但更突出智能导购的路径。">
      <div class="card-grid two">
        <ProductCard v-for="item in recommendProducts" :key="String(item.productId || item.id)" :product="item">
          <div class="toolbar" style="margin-top: 14px">
            <el-button type="primary" @click="router.push(`/products/${item.productId}`)">查看详情</el-button>
          </div>
        </ProductCard>
      </div>
    </SectionPanel>

    <SectionPanel title="新鲜上架" subtitle="用户端首页保留淘宝式瀑布逛感，用更精致的橙米白肌理来做品牌识别。" accent="#ff4d00">
      <div class="card-grid three">
        <ProductCard v-for="item in latestProducts" :key="String(item.productId || item.id)" :product="item">
          <div class="toolbar" style="margin-top: 14px">
            <el-button text type="primary" @click="router.push(`/products/${item.productId}`)">展开商品</el-button>
          </div>
        </ProductCard>
      </div>
    </SectionPanel>
  </div>
</template>
