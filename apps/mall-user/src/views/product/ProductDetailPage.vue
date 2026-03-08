<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { addToCart } from '@mall-user/api/modules/cart';
import { getProductDetail, getProductReviews } from '@mall-user/api/modules/product';
import { formatCurrency } from '@shared/utils/format';
import type { ProductDetail, ProductReview } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const route = useRoute();
const router = useRouter();
const sessionStore = useMallUserSessionStore();
const detail = ref<ProductDetail | null>(null);
const reviews = ref<ProductReview[]>([]);
const quantity = ref(1);
const productId = computed(() => route.params.productId as string);

async function loadDetail() {
  detail.value = await getProductDetail(productId.value);
  const reviewResult = await getProductReviews({ productId: productId.value, pageNo: 1, pageSize: 5 });
  reviews.value = reviewResult.records || [];
}

async function handleAddCart() {
  const userId = typeof (sessionStore.profile as { userId?: string } | null)?.userId === 'string' ? (sessionStore.profile as { userId?: string }).userId! : '';
  if (!userId) {
    router.push('/login');
    return;
  }
  await addToCart({ userId, productId: productId.value, quantity: quantity.value });
  ElMessage.success('已加入购物车');
}

onMounted(loadDetail);
</script>

<template>
  <div v-if="detail" class="product-detail">
    <section class="product-detail__summary mall-panel">
      <div class="product-detail__media"></div>
      <div>
        <p class="dimmed">商品详情 / `GET /api/product/detail/{productId}`</p>
        <h2>{{ detail.productName }}</h2>
        <p class="product-detail__intro">{{ detail.productIntro || '后端暂无商品简介，先展示基础字段。' }}</p>
        <h3 class="price-text">{{ formatCurrency(detail.salePrice ?? detail.price) }}</h3>
        <div class="product-detail__actions">
          <el-input-number v-model="quantity" :min="1" />
          <el-button type="primary" @click="handleAddCart">加入购物车</el-button>
          <el-button plain @click="router.push('/assistant')">让 AI 解读这件商品</el-button>
        </div>
      </div>
    </section>
    <section class="product-detail__content">
      <div class="mall-panel product-detail__properties">
        <div class="section-title"><h3>商品属性</h3></div>
        <el-descriptions :column="2" border>
          <el-descriptions-item v-for="property in detail.propertyList || []" :key="property.propertyName" :label="property.propertyName">{{ property.propertyValue }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="mall-panel product-detail__reviews">
        <div class="section-title"><h3>用户评价</h3></div>
        <el-timeline>
          <el-timeline-item v-for="review in reviews" :key="review.reviewId" :timestamp="review.createTime">
            <strong>{{ review.productName || '商品评价' }}</strong>
            <p>{{ review.content || '暂无评价内容' }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </section>
  </div>
</template>

<style scoped>
.product-detail { display: grid; gap: 22px; }
.product-detail__summary { display: grid; grid-template-columns: 420px 1fr; gap: 26px; padding: 26px; }
.product-detail__media { border-radius: 28px; min-height: 380px; background: linear-gradient(140deg, rgba(255, 106, 43, 0.16), rgba(15, 127, 116, 0.18)); }
.product-detail__intro { color: var(--mall-muted); line-height: 1.8; }
.product-detail__actions { display: flex; gap: 12px; align-items: center; }
.product-detail__content { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 22px; }
.product-detail__properties, .product-detail__reviews { padding: 24px; }
</style>
