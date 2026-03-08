<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getKnowledgeSummary, rebuildKnowledge, syncKnowledge } from '@mall-admin/api/modules/ai';
import type { AdminKnowledgeSummary } from '@shared/types/admin';

const summary = ref<AdminKnowledgeSummary | null>(null);
const productId = ref('');

async function loadSummary() {
  summary.value = await getKnowledgeSummary().catch(() => null);
}

async function syncOne() {
  await syncKnowledge(productId.value);
  ElMessage.success('单商品索引同步已触发');
  await loadSummary();
}

async function rebuildAll() {
  await rebuildKnowledge();
  ElMessage.success('全量重建已触发');
  await loadSummary();
}

loadSummary();
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>知识索引</h2><p>知识索引摘要、单商品同步与全量重建全都对齐后端 AI 知识模块。</p></header>
    <section class="category-page__grid">
      <article class="admin-panel category-page__panel">
        <div class="section-title"><h3>索引摘要</h3></div>
        <p>商品总数：{{ summary?.totalProductCount || 0 }}</p>
        <p>已索引：{{ summary?.indexedProductCount || 0 }}</p>
        <p>最近同步：{{ summary?.lastSyncTime || '—' }}</p>
      </article>
      <article class="admin-panel category-page__panel">
        <div class="section-title"><h3>同步操作</h3></div>
        <el-input v-model="productId" placeholder="输入商品 ID 后同步单商品索引" />
        <div style="margin-top: 16px; display: flex; gap: 12px">
          <el-button type="primary" @click="syncOne">同步单商品</el-button>
          <el-button plain @click="rebuildAll">全量重建</el-button>
        </div>
      </article>
    </section>
  </div>
</template>
