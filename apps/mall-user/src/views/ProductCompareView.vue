<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { compareProducts } from '@/api/modules/product'

const form = reactive({ productIds: '', keyword: '' })
const result = ref<Record<string, unknown> | null>(null)

const productIdList = computed(() => form.productIds.split(',').map((item) => item.trim()).filter(Boolean))
const dimensions = computed(() => (result.value?.dimensions as Array<Record<string, unknown>>) || [])
const products = computed(() => (result.value?.products as Array<Record<string, unknown>>) || [])
const suggestions = computed(() => (result.value?.decisionSuggestions as string[]) || [])

const submit = async () => {
  result.value = await compareProducts({ productIds: productIdList.value, keyword: form.keyword || undefined, semanticSearch: true })
}
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="商品对比" subtitle="对接 `/product/knowledge/compare`，用表格和建议承接对比结果。">
      <el-form inline>
        <el-form-item label="productIds">
          <el-input v-model="form.productIds" style="width: 360px" placeholder="逗号分隔两个或多个商品 ID" />
        </el-form-item>
        <el-form-item label="keyword">
          <el-input v-model="form.keyword" style="width: 240px" placeholder="例如：续航、拍照、性价比" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">开始对比</el-button>
        </el-form-item>
      </el-form>
    </SectionPanel>

    <SectionPanel v-if="result" title="对比摘要" subtitle="大模型总结 + 决策建议。" accent="#ff8c38">
      <p>{{ result.compareSummary || result.comparisonText || '暂无摘要' }}</p>
      <el-tag v-for="item in suggestions" :key="item" style="margin-right: 8px; margin-top: 8px">{{ item }}</el-tag>
    </SectionPanel>

    <SectionPanel v-if="dimensions.length" title="差异维度" subtitle="结构不确定时以稳健表格呈现。">
      <el-table :data="dimensions" border>
        <el-table-column prop="dimensionName" label="维度" min-width="180" />
        <el-table-column prop="winnerProductName" label="更优商品" min-width="180" />
        <el-table-column prop="compareResult" label="结论" min-width="260" />
      </el-table>
    </SectionPanel>

    <div class="card-grid two" v-if="products.length || result">
      <SectionPanel title="参与对比商品" subtitle="原始商品知识对象。">
        <JsonPanel :data="products" />
      </SectionPanel>
      <SectionPanel title="原始返回" subtitle="便于继续联调字段。" accent="#2b7a78">
        <JsonPanel :data="result" />
      </SectionPanel>
    </div>
  </div>
</template>
