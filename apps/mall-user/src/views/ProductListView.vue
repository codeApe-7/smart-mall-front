<template>
  <div class="page-grid">
    <SectionPanel title="商品广场" subtitle="对接 `/product/list`，保留关键词搜索与分页信息。">
      <div class="toolbar" style="margin-bottom: 16px">
        <el-input v-model="query.productName" placeholder="搜索商品名称" clearable style="max-width: 260px" />
        <el-input v-model="query.categoryIdOrPCategoryId" placeholder="分类 ID / 父分类 ID" clearable style="max-width: 260px" />
        <el-button type="danger" round @click="loadProducts">查询商品</el-button>
      </div>
      <div class="card-grid three">
        <ProductCard v-for="item in products" :key="item.productId" :product="item">
          <div class="hero-actions" style="margin-top: 12px">
            <el-button type="danger" text @click="$router.push(`/products/${item.productId}`)">查看详情</el-button>
          </div>
        </ProductCard>
      </div>
      <el-empty v-if="!products.length" description="暂无商品" />
      <div class="hero-actions" style="margin-top: 20px; justify-content: space-between">
        <span class="dimmed">共 {{ totalCount }} 件商品</span>
        <el-pagination v-model:current-page="query.pageNo" v-model:page-size="query.pageSize" layout="prev, pager, next" :total="totalCount" @current-change="loadProducts" />
      </div>
    </SectionPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { fetchProductList } from '@/api/modules/product'
import type { ProductListItem } from '@shared/types/mall'

const query = reactive({ pageNo: 1, pageSize: 9, productName: '', categoryIdOrPCategoryId: '' })
const products = ref<ProductListItem[]>([])
const totalCount = ref(0)

const loadProducts = async () => {
  const page = await fetchProductList({ ...query })
  products.value = page.records || []
  totalCount.value = page.totalCount || 0
}

onMounted(loadProducts)
</script>
