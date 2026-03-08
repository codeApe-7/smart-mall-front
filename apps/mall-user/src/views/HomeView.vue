<template>
  <div class="page-grid">
    <section class="hero-panel">
      <div>
        <span class="eyebrow">淘宝式热闹氛围 × SmartMall 智能特色</span>
        <h2>会推荐、会比价、会记住你的逛街节奏。</h2>
        <p>首页联动 `/product/recommend`、`/message/unreadCount` 和 `/preference/profile`，把推荐、提醒与偏好画像放进一个主场景。</p>
        <div class="hero-actions">
          <el-button type="danger" round @click="$router.push('/products')">开始逛</el-button>
          <el-button round @click="$router.push('/assistant')">打开 AI 导购</el-button>
        </div>
      </div>
      <div class="hero-card-grid">
        <article class="hero-card">
          <span>推荐</span>
          <h3>{{ recommendProducts.length }} 件个性化候选</h3>
          <p>根据登录态优先带上 `userId` 拉个性化推荐。</p>
        </article>
        <article class="hero-card">
          <span>消息</span>
          <h3>{{ unreadCount }} 条未读提醒</h3>
          <p>订单与通知不分家，顶部入口直接带用户回消息中心。</p>
        </article>
        <article class="hero-card">
          <span>偏好</span>
          <h3>{{ preferenceTagsText }}</h3>
          <p>把分类偏好、价格区间和搜索关键词折叠成一张可读卡片。</p>
        </article>
      </div>
    </section>

    <SectionPanel title="今日推荐" subtitle="主打橙米白市集感，商品卡片保留淘宝式浏览爽感。">
      <div class="card-grid three">
        <ProductCard v-for="item in recommendProducts" :key="item.productId" :product="item">
          <div class="hero-actions" style="margin-top: 12px">
            <el-button type="danger" text @click="$router.push(`/products/${item.productId}`)">查看详情</el-button>
          </div>
        </ProductCard>
      </div>
    </SectionPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { fetchUnreadCount } from '@/api/modules/message'
import { fetchPreferenceProfile } from '@/api/modules/preference'
import { fetchRecommendProducts } from '@/api/modules/product'
import { useSessionStore } from '@/stores/sessionStore'
import type { ProductListItem, UserPreference } from '@shared/types/mall'

const sessionStore = useSessionStore()
const recommendProducts = ref<ProductListItem[]>([])
const unreadCount = ref(0)
const preference = ref<UserPreference | null>(null)

const preferenceTagsText = computed(() => {
  if (!preference.value?.preferenceTags?.length) {
    return '等待画像生成'
  }
  return preference.value.preferenceTags.slice(0, 3).join(' / ')
})

onMounted(async () => {
  const userId = sessionStore.profile?.userId
  const userToken = sessionStore.userToken

  recommendProducts.value = await fetchRecommendProducts({ userId: userId || undefined, limit: 6 })

  if (userToken) {
    unreadCount.value = await fetchUnreadCount(userToken)
  }

  if (userId) {
    preference.value = await fetchPreferenceProfile(userId)
  }
})
</script>
