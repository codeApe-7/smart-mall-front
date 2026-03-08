<template>
  <div class="admin-page">
    <AppPageHeader title="AI 服务监控" description="覆盖聊天量、活跃用户、回退统计、错误码、工具调用、日趋势与最近事件。" />
    <section class="stat-grid">
      <article v-for="card in cards" :key="card.label" class="stat-card">
        <small>{{ card.label }}</small>
        <strong>{{ card.value }}</strong>
        <span class="muted">{{ card.tip }}</span>
      </article>
    </section>
    <section class="chart-grid">
      <WorkbenchPanel title="每日聊天趋势"><VChart class="chart" :option="trendOption" autoresize /></WorkbenchPanel>
      <WorkbenchPanel title="错误码分布"><VChart class="chart" :option="errorOption" autoresize /></WorkbenchPanel>
    </section>
    <section class="chart-grid">
      <WorkbenchPanel title="服务状态"><pre class="json-box">{{ JSON.stringify(overview.serviceStatuses || [], null, 2) }}</pre></WorkbenchPanel>
      <WorkbenchPanel title="最近事件"><pre class="json-box">{{ JSON.stringify(overview.recentEvents || [], null, 2) }}</pre></WorkbenchPanel>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import { aiApi } from '@/api/modules/admin'

const overview = ref<Record<string, any>>({})

const cards = computed(() => [
  { label: '总对话量', value: overview.value.totalChatCount ?? 0, tip: '累计聊天请求' },
  { label: 'Agent 对话量', value: overview.value.aiAgentChatCount ?? 0, tip: 'Agent 处理占比' },
  { label: '今日对话量', value: overview.value.todayChatCount ?? 0, tip: '当天请求波峰' },
  { label: '今日活跃用户', value: overview.value.todayActiveUserCount ?? 0, tip: '当天活跃用户数' },
])
const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: (overview.value.dailyTrends || []).map((item: any) => item.dayLabel || item.date || item.day) },
  yAxis: { type: 'value' },
  series: [{ type: 'line', smooth: true, data: (overview.value.dailyTrends || []).map((item: any) => item.chatCount || item.totalCount || 0) }],
}))
const errorOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{ type: 'pie', radius: ['42%', '70%'], data: (overview.value.errorCodeStats || []).map((item: any) => ({ name: item.label || item.metricLabel || item.metricKey, value: item.value || item.metricValue || 0 })) }],
}))

onMounted(async () => { overview.value = await aiApi.monitorOverview() })
</script>

<style scoped>.chart{height:320px;}</style>
