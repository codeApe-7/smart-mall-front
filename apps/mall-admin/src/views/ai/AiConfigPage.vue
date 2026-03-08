<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getAiConfig, saveAiConfig } from '@mall-admin/api/modules/ai';

const form = reactive<Record<string, unknown>>({ assistantAgentEnabled: false, semanticSearchEnabled: false, openaiBaseUrl: '', mcpUrl: '' });

onMounted(async () => {
  Object.assign(form, await getAiConfig().catch(() => ({})));
});

async function submit() {
  await saveAiConfig(form);
  ElMessage.success('AI 配置已保存');
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>AI 配置</h2><p>配置页直接对接 `/ai-config/detail` 与 `/ai-config/save`。</p></header>
    <section class="admin-panel category-page__panel">
      <el-form label-position="top">
        <el-form-item label="启用智能 Agent"><el-switch v-model="form.assistantAgentEnabled as boolean" /></el-form-item>
        <el-form-item label="启用语义搜索"><el-switch v-model="form.semanticSearchEnabled as boolean" /></el-form-item>
        <el-form-item label="OpenAI Base URL"><el-input v-model="form.openaiBaseUrl as string" /></el-form-item>
        <el-form-item label="MCP URL"><el-input v-model="form.mcpUrl as string" /></el-form-item>
        <el-button type="primary" @click="submit">保存配置</el-button>
      </el-form>
    </section>
  </div>
</template>
