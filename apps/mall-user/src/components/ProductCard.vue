<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@shared/utils/format'

const props = defineProps<{
  product: Record<string, unknown>
}>()

const cover = computed(
  () =>
    String(
      props.product.mainImage ||
        props.product.cover ||
        props.product.productCover ||
        'https://dummyimage.com/600x600/f5d4b6/8a4f1d&text=SmartMall',
    ),
)

const currentPrice = computed(() => Number(props.product.salePrice ?? props.product.price ?? props.product.currentPrice ?? 0))
const saleCount = computed(() => Number(props.product.saleCount ?? props.product.sales ?? 0))
const title = computed(() => String(props.product.productName || props.product.name || '未命名商品'))
const categoryName = computed(() => String(props.product.categoryName || '精选好物'))
const description = computed(() => String(props.product.simpleDesc || props.product.description || '探索更懂你的智能购物推荐。'))
</script>

<template>
  <article class="product-card">
    <img :src="cover" :alt="title" />
    <div class="product-body">
      <p class="product-tag">{{ categoryName }}</p>
      <h4>{{ title }}</h4>
      <p class="product-desc">{{ description }}</p>
      <div class="product-meta">
        <strong>{{ formatCurrency(currentPrice) }}</strong>
        <span>销量 {{ saleCount }}</span>
      </div>
      <slot />
    </div>
  </article>
</template>

<style scoped lang="scss">
.product-card {
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,244,238,0.95));
  border: 1px solid rgba(255, 137, 61, 0.18);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 50px rgba(255, 122, 0, 0.18);
  }

  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    background: #f9d7bf;
  }
}

.product-body {
  padding: 18px;

  h4 {
    margin: 6px 0 10px;
    font-size: 18px;
    color: #301f16;
  }
}

.product-tag {
  margin: 0;
  color: #ff7a00;
  font-size: 12px;
}

.product-desc {
  min-height: 42px;
  margin: 0 0 14px;
  color: #7d6960;
  line-height: 1.5;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;

  strong {
    color: #ff5a00;
    font-size: 24px;
  }

  span {
    color: #8b776e;
    font-size: 13px;
  }
}
</style>
