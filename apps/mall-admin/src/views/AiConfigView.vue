<template>
  <div class="admin-page">
    <AppPageHeader title="AI 配置" description="直接对应 `AdminAiConfigSaveDTO` 三段结构：助手、搜索、知识配置。" />
    <WorkbenchPanel title="配置编辑">
      <el-form label-position="top">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="助手启用"><el-switch v-model="form.assistantConfig.enabled" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="知识问答启用"><el-switch v-model="form.productKnowledgeConfig.enabled" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="System Prompt"><el-input v-model="form.assistantConfig.systemPrompt" type="textarea" :rows="5" /></el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="语义检索开关"><el-switch v-model="form.productSearchConfig.semanticEnabled" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="候选数"><el-input-number v-model="form.productSearchConfig.semanticCandidateSize" :min="1" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Elasticsearch URI"><el-input v-model="form.productSearchConfig.elasticsearchUri" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="索引名"><el-input v-model="form.productSearchConfig.productIndexName" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="默认分页数"><el-input-number v-model="form.productKnowledgeConfig.defaultPageSize" :min="1" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="最大评论片段"><el-input-number v-model="form.productKnowledgeConfig.maxReviewSnippetCount" :min="1" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="最大属性片段"><el-input-number v-model="form.productKnowledgeConfig.maxPropertySnippetCount" :min="1" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="最大对比数"><el-input-number v-model="form.productKnowledgeConfig.maxCompareCount" :min="1" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="售后亮点（每行一条）"><el-input v-model="afterSalesText" type="textarea" :rows="6" /></el-form-item>
      </el-form>
      <template #actions>
        <el-button @click="loadConfig">重载</el-button>
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
      </template>
    </WorkbenchPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import { aiApi } from '@/api/modules/admin'

const form = reactive<any>({
  assistantConfig: { enabled: true, systemPrompt: '' },
  productSearchConfig: { semanticEnabled: true, elasticsearchUri: '', productIndexName: '', semanticCandidateSize: 10 },
  productKnowledgeConfig: { enabled: true, defaultPageSize: 5, maxReviewSnippetCount: 5, maxPropertySnippetCount: 8, maxCompareCount: 3, afterSalesHighlights: [] },
})
const afterSalesText = ref('')

const loadConfig = async () => {
  const payload = await aiApi.configDetail()
  Object.assign(form, payload)
  afterSalesText.value = (payload.productKnowledgeConfig?.afterSalesHighlights || []).join('\n')
}
const saveConfig = async () => {
  form.productKnowledgeConfig.afterSalesHighlights = afterSalesText.value.split('\n').map((item: string) => item.trim()).filter(Boolean)
  await aiApi.saveConfig(form)
  ElMessage.success('AI 配置已保存')
}

onMounted(loadConfig)
</script>
