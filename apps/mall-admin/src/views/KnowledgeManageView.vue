<template>
  <div class="admin-page">
    <AppPageHeader title="知识索引管理" description="根据后端实际能力，这里提供商品知识详情、索引摘要、单品同步与全量重建；未发明不存在的保存接口。" />
    <WorkbenchPanel title="索引摘要" description="对接 `/knowledge/index/summary`">
      <template #actions>
        <el-button @click="loadSummary">刷新摘要</el-button>
        <el-button type="warning" @click="rebuild">全量重建</el-button>
      </template>
      <KeyValueGrid :model="summary" />
    </WorkbenchPanel>

    <WorkbenchPanel title="商品知识详情">
      <div class="toolbar">
        <el-input v-model="productId" placeholder="输入 productId" />
        <el-button type="primary" @click="loadKnowledge">查询详情</el-button>
        <el-button type="success" @click="syncProduct">同步该商品索引</el-button>
      </div>
      <pre class="json-box">{{ JSON.stringify(knowledge, null, 2) }}</pre>
    </WorkbenchPanel>

    <WorkbenchPanel title="最近同步结果">
      <pre class="json-box">{{ JSON.stringify(syncResult, null, 2) }}</pre>
    </WorkbenchPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import KeyValueGrid from '@/components/KeyValueGrid.vue'
import { aiApi } from '@/api/modules/admin'

const productId = ref('')
const summary = ref<Record<string, any>>({})
const knowledge = ref<Record<string, any>>({})
const syncResult = ref<Record<string, any>>({})

const loadSummary = async () => { summary.value = await aiApi.knowledgeSummary() }
const loadKnowledge = async () => {
  if (!productId.value) return ElMessage.warning('请先输入 productId')
  knowledge.value = await aiApi.knowledgeProduct(productId.value)
}
const syncProduct = async () => {
  if (!productId.value) return ElMessage.warning('请先输入 productId')
  syncResult.value = await aiApi.syncProduct(productId.value)
  ElMessage.success('商品知识索引同步完成')
}
const rebuild = async () => {
  syncResult.value = await aiApi.rebuildIndex()
  ElMessage.success('全量重建已触发')
}

onMounted(loadSummary)
</script>
