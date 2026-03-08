<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAiMonitorOverview } from '@mall-admin/api/modules/ai';
import type { AdminAiMonitorOverview } from '@shared/types/admin';

const overview = ref<AdminAiMonitorOverview | null>(null);

onMounted(async () => {
  overview.value = await getAiMonitorOverview().catch(() => null);
});
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>AI 监控</h2><p>监控页展示最近事件和配置状态，对接 `/ai-monitor/overview`。</p></header>
    <section class="category-page__grid">
      <article class="admin-panel category-page__panel">
        <div class="section-title"><h3>关键指标</h3></div>
        <el-tag v-for="item in overview?.summaryList || []" :key="String(item.label)" style="margin-right: 8px; margin-bottom: 8px">{{ item.label }}：{{ item.value }}</el-tag>
      </article>
      <article class="admin-panel category-page__panel">
        <div class="section-title"><h3>最近事件</h3></div>
        <el-table :data="overview?.recentEvents || []">
          <el-table-column prop="eventSource" label="来源" width="120" />
          <el-table-column prop="eventType" label="类型" width="120" />
          <el-table-column prop="eventCode" label="编码" width="140" />
          <el-table-column prop="eventMessage" label="描述" min-width="220" />
        </el-table>
      </article>
    </section>
  </div>
</template>
