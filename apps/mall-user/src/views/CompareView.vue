<script setup lang="ts">
import { reactive, ref } from 'vue'
import SectionPanel from '@/components/SectionPanel.vue'
import JsonPanel from '@/components/JsonPanel.vue'
import { compareProducts } from '@/api/modules/product'

const form = reactive({ productIds: '', keyword: '', semanticSearch: true })
const result = ref<Record<string, unknown> | null>(null)

const submit = async () => {
  result.value = await compareProducts({
    productIds: form.productIds.split(',').map((item) => item.trim()).filter(Boolean),
    keyword: form.keyword || undefined,
    semanticSearch: form.semanticSearch,
  })
}
</script>

<template>
  <SectionPanel title="商品对比页" subtitle="这个页面专注做深度对比，强调 AI 对比结论和差异高亮。">
    <div class="toolbar">
      <el-input v-model="form.productIds" placeholder="productIds, 例如 1001,1002" />
      <el-button type="primary" @click="submit">开始对比</el-button>
    </div>
    <el-input v-model="form.keyword" type="textarea" :rows="4" placeholder="keyword，例如：通勤 视频会议" style="margin-top: 12px" />
    <div class="toolbar" style="margin-top: 12px">
      <el-switch v-model="form.semanticSearch" inline-prompt active-text="语义" inactive-text="常规" />
    </div>
    <JsonPanel v-if="result" title="对比结果" :data="result" style="margin-top: 18px" />
  </SectionPanel>
</template>
