<template>
  <div class="page-grid product-detail-page">
    <SectionPanel title="商品详情" subtitle="详情结构直接对应 `/product/detail/{productId}`。">
      <div class="card-grid two">
        <div class="hero-card detail-card">
          <span>商品主体</span>
          <h3>{{ detail.productName || '未命名商品' }}</h3>
          <p>{{ detail.productIntro || '暂无商品描述' }}</p>
          <div class="detail-meta">
            <span>分类：{{ detail.categoryName || '--' }}</span>
            <span>价格：{{ detail.salePrice ?? '--' }}</span>
            <span>库存：{{ detail.stockNum ?? '--' }}</span>
          </div>
          <div class="hero-actions">
            <el-button type="danger" round @click="$router.push('/cart')">加入购物车</el-button>
            <el-button round @click="$router.push('/compare')">去对比</el-button>
          </div>
        </div>
        <JsonPanel :data="detail" title="原始返回" />
      </div>
    </SectionPanel>

    <SectionPanel title="知识库摘要" subtitle="对接 `/product/knowledge/detail/{productId}`。" accent="#125d5c">
      <JsonPanel :data="knowledgeDetail" />
    </SectionPanel>

    <SectionPanel title="用户评价" subtitle="对接 `/review/productReviews` 的分页评论。" accent="#ff9d2e">
      <el-table :data="reviews" border>
        <el-table-column prop="rating" label="评分" width="80" />
        <el-table-column prop="content" label="内容" min-width="280" />
        <el-table-column prop="replyContent" label="回复" min-width="220" />
      </el-table>
    </SectionPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { fetchKnowledgeDetail, fetchProductDetail } from '@/api/modules/product'
import { fetchProductReviews } from '@/api/modules/review'
import type { ProductDetail, ProductReview } from '@shared/types/mall'

const route = useRoute()
const detail = ref<ProductDetail>({} as ProductDetail)
const knowledgeDetail = ref<Record<string, unknown>>({})
const reviews = ref<ProductReview[]>([])

onMounted(async () => {
  const productId = String(route.params.productId)
  detail.value = await fetchProductDetail(productId)
  knowledgeDetail.value = await fetchKnowledgeDetail(productId)
  const reviewPage = await fetchProductReviews({ productId, pageNo: 1, pageSize: 10 })
  reviews.value = reviewPage.records || []
})
</script>

<style scoped>
.product-detail-page .detail-card {
  display: grid;
  gap: 14px;
}
.product-detail-page .detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--sm-muted);
}
</style>
