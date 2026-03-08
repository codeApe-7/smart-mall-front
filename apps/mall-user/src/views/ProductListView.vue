<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import EmptyState from '@/components/EmptyState.vue'
import JsonPanel from '@/components/JsonPanel.vue'
import { compareProducts, fetchProductList, searchKnowledge } from '@/api/modules/product'

const router = useRouter()
const query = reactive({ pageNo: 1, pageSize: 9, productName: '', categoryIdOrPCategoryId: '', semanticSearch: false })
const compareForm = reactive({ productIds: '', keyword: '', semanticSearch: true })
const knowledgeForm = reactive({ keyword: '', productId: '', categoryIdOrPCategoryId: '', semanticSearch: true })
const products = ref<Array<Record<string, unknown>>>([])
const totalCount = ref(0)
const compareResult = ref<Record<string, unknown> | null>(null)
const knowledgeResult = ref<Record<string, unknown> | null>(null)

const loadProducts = async () => {
  const result = await fetchProductList(query)
  products.value = result.records
  totalCount.value = result.totalCount
}

const runCompare = async () => {
  compareResult.value = await compareProducts({
    productIds: compareForm.productIds.split(',').map((item) => item.trim()).filter(Boolean),
    keyword: compareForm.keyword || undefined,
    semanticSearch: compareForm.semanticSearch,
  })
}

const runKnowledgeSearch = async () => {
  knowledgeResult.value = await searchKnowledge({
    keyword: knowledgeForm.keyword || undefined,
    productId: knowledgeForm.productId || undefined,
    categoryIdOrPCategoryId: knowledgeForm.categoryIdOrPCategoryId || undefined,
    semanticSearch: knowledgeForm.semanticSearch,
    pageNo: 1,
    pageSize: 10,
  })
}

onMounted(loadProducts)
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="商品广场" subtitle="请求字段严格对齐后端 `ProductQueryDTO`，支持语义搜索和商品对比。">
      <div class="toolbar" style="margin-bottom: 16px">
        <el-input v-model="query.productName" placeholder="productName 商品名" clearable style="max-width: 240px" />
        <el-input v-model="query.categoryIdOrPCategoryId" placeholder="categoryIdOrPCategoryId" clearable style="max-width: 240px" />
        <el-switch v-model="query.semanticSearch" inline-prompt active-text="语义" inactive-text="常规" />
        <el-button type="primary" @click="loadProducts">查询商品</el-button>
      </div>
      <p class="muted">共 {{ totalCount }} 个商品结果</p>
      <div v-if="products.length" class="card-grid three">
        <ProductCard v-for="item in products" :key="String(item.productId || item.id)" :product="item">
          <div class="toolbar" style="margin-top: 14px">
            <el-button type="primary" @click="router.push(`/products/${item.productId}`)">详情</el-button>
          </div>
        </ProductCard>
      </div>
      <EmptyState v-else title="暂无商品" description="可调整 productName 或分类后重试。" />
    </SectionPanel>

    <div class="card-grid two">
      <SectionPanel title="知识搜索" subtitle="对应 `/product/knowledge/search`，适合让用户先问再逛。" accent="#ff5d00">
        <el-input v-model="knowledgeForm.keyword" type="textarea" :rows="4" placeholder="请输入 keyword，例如：学生平板" />
        <div class="toolbar" style="margin-top: 12px">
          <el-input v-model="knowledgeForm.productId" placeholder="productId 可选" style="max-width: 180px" />
          <el-input v-model="knowledgeForm.categoryIdOrPCategoryId" placeholder="categoryIdOrPCategoryId 可选" style="max-width: 220px" />
          <el-switch v-model="knowledgeForm.semanticSearch" inline-prompt active-text="语义" inactive-text="常规" />
        </div>
        <div class="toolbar" style="margin-top: 16px">
          <el-button type="primary" @click="runKnowledgeSearch">搜索知识</el-button>
        </div>
        <JsonPanel v-if="knowledgeResult" title="知识搜索返回" :data="knowledgeResult" style="margin-top: 18px" />
      </SectionPanel>

      <SectionPanel title="商品对比" subtitle="对应 `/product/knowledge/compare`，productIds 用英文逗号分隔。">
        <el-input v-model="compareForm.productIds" placeholder="productIds，例如 1001,1002" />
        <el-input v-model="compareForm.keyword" type="textarea" :rows="3" placeholder="keyword，可选" style="margin-top: 12px" />
        <div class="toolbar" style="margin-top: 12px">
          <el-switch v-model="compareForm.semanticSearch" inline-prompt active-text="语义" inactive-text="常规" />
        </div>
        <div class="toolbar" style="margin-top: 16px">
          <el-button type="primary" @click="runCompare">执行对比</el-button>
          <el-button @click="router.push('/compare')">前往对比页</el-button>
        </div>
        <JsonPanel v-if="compareResult" title="商品对比结果" :data="compareResult" style="margin-top: 18px" />
      </SectionPanel>
    </div>
  </div>
</template>
