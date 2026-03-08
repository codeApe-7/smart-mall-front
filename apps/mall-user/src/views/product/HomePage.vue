<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@mall-user/components/ProductCard.vue';
import StateBlock from '@mall-user/components/StateBlock.vue';
import { listProducts, recommendProducts } from '@mall-user/api/modules/product';
import type { ProductListItem } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const router = useRouter();
const sessionStore = useMallUserSessionStore();
const trending = ref<ProductListItem[]>([]);
const products = ref<ProductListItem[]>([]);
const loading = ref(false);

async function loadData() {
  loading.value = true;
  try {
    const profile = (sessionStore.profile || {}) as Record<string, unknown>;
    trending.value = await recommendProducts(typeof profile.userId === 'string' ? profile.userId : undefined, 4);
    const result = await listProducts({ pageNo: 1, pageSize: 8, status: 1 });
    products.value = result.records;
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="home-page">
    <section class="home-page__hero mall-panel">
      <div>
        <p>今日推荐 / PERSONALIZED DISCOVERY</p>
        <h2>从热卖单品，到 AI 解释为什么适合你。</h2>
        <span class="dimmed">用户端对接 `/product/recommend`、`/product/list`、`/assistant/*` 与偏好画像能力。</span>
      </div>
      <div class="home-page__actions">
        <el-button type="primary" @click="router.push('/products')">进入商品库</el-button>
        <el-button plain @click="router.push('/assistant')">试试智能导购</el-button>
      </div>
    </section>

    <section>
      <div class="section-title"><h3>猜你喜欢</h3></div>
      <div v-if="!loading && trending.length" class="home-page__grid">
        <div v-for="product in trending" :key="product.productId" @click="router.push(`/products/${product.productId}`)">
          <ProductCard :product="product" />
        </div>
      </div>
      <StateBlock v-else-if="!loading" title="暂无推荐商品" description="等后端商品与偏好数据准备好后，这里会展示个性化推荐。" />
    </section>

    <section>
      <div class="section-title"><h3>热门好物</h3></div>
      <div class="home-page__grid">
        <div v-for="product in products" :key="product.productId" @click="router.push(`/products/${product.productId}`)">
          <ProductCard :product="product" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page { display: grid; gap: 22px; }
.home-page__hero { display: flex; align-items: end; justify-content: space-between; padding: 30px; background: linear-gradient(120deg, rgba(255, 106, 43, 0.14), rgba(15, 127, 116, 0.16)); }
.home-page__hero p { margin: 0 0 10px; color: var(--mall-secondary); letter-spacing: 0.2em; }
.home-page__hero h2 { margin: 0 0 10px; font-size: 36px; }
.home-page__actions { display: flex; gap: 12px; }
.home-page__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
</style>

