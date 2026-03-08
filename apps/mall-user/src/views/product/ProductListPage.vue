<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@mall-user/components/ProductCard.vue';
import { listProducts } from '@mall-user/api/modules/product';
import type { ProductListItem } from '@shared/types/mall';

const router = useRouter();
const query = reactive({ productName: '', categoryIdOrPCategoryId: '', pageNo: 1, pageSize: 12, status: 1, semanticSearch: false });
const products = ref<ProductListItem[]>([]);
const totalCount = ref(0);
const loading = ref(false);

async function loadProducts() {
  loading.value = true;
  try {
    const result = await listProducts(query);
    products.value = result.records;
    totalCount.value = result.totalCount;
  } finally {
    loading.value = false;
  }
}

onMounted(loadProducts);
</script>

<template>
  <div class="product-list-page">
    <div class="section-title"><h3>商品库</h3><span class="dimmed">请求映射 `POST /api/product/list`</span></div>
    <section class="mall-panel product-list__filters">
      <el-form inline>
        <el-form-item label="商品名"><el-input v-model="query.productName" placeholder="搜索商品" /></el-form-item>
        <el-form-item label="分类"><el-input v-model="query.categoryIdOrPCategoryId" placeholder="分类 ID" /></el-form-item>
        <el-form-item><el-switch v-model="query.semanticSearch" active-text="语义搜索" /></el-form-item>
        <el-form-item><el-button type="primary" @click="loadProducts">查询</el-button></el-form-item>
      </el-form>
    </section>
    <div v-loading="loading" class="product-list__grid">
      <div v-for="product in products" :key="product.productId" @click="router.push(`/products/${product.productId}`)">
        <ProductCard :product="product" />
      </div>
    </div>
    <el-pagination layout="prev, pager, next, total" :total="totalCount" :page-size="query.pageSize" :current-page="query.pageNo" @current-change="(page: number) => { query.pageNo = page; loadProducts(); }" />
  </div>
</template>

<style scoped>
.product-list__filters { padding: 22px 24px 4px; }
.product-list__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
</style>
