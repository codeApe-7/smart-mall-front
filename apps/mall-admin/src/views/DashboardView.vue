<template>
  <div class="admin-page">
    <AppPageHeader title="数据概览" description="聚合销售、退款、待发货与库存预警，作为运营台首屏入口。" />

    <section class="stat-grid">
      <article v-for="card in statCards" :key="card.label" class="stat-card">
        <small>{{ card.label }}</small>
        <strong>{{ card.value }}</strong>
        <span class="muted">{{ card.tip }}</span>
      </article>
    </section>

    <section class="chart-grid">
      <WorkbenchPanel title="销售趋势">
        <VChart class="chart" :option="salesOption" autoresize />
      </WorkbenchPanel>
      <WorkbenchPanel title="退款趋势">
        <VChart class="chart" :option="refundOption" autoresize />
      </WorkbenchPanel>
    </section>

    <section class="chart-grid">
      <WorkbenchPanel title="待发货订单" description="直接查看后台最需要跟进的履约单。">
        <el-table :data="overview.pendingShipmentOrders || []" empty-text="暂无待发货订单">
          <el-table-column prop="orderNo" label="订单号" min-width="160" />
          <el-table-column prop="userId" label="用户" min-width="110" />
          <el-table-column prop="payAmount" label="支付金额" min-width="120" />
          <el-table-column prop="createTime" label="下单时间" min-width="180" />
        </el-table>
      </WorkbenchPanel>
      <WorkbenchPanel title="低库存商品" description="帮助运营快速补货。">
        <el-table :data="overview.lowStockProducts || []" empty-text="暂无库存预警">
          <el-table-column prop="productName" label="商品" min-width="180" />
          <el-table-column prop="stock" label="库存" min-width="90" />
          <el-table-column prop="categoryName" label="分类" min-width="120" />
          <el-table-column prop="productId" label="商品ID" min-width="180" />
        </el-table>
      </WorkbenchPanel>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import { dashboardApi } from '@/api/modules/admin'

const overview = ref<Record<string, any>>({})

const firstLabel = (item: Record<string, any>, index: number) =>
  item.dayLabel || item.day || item.dateLabel || item.date || item.statDate || `#${index + 1}`
const firstValue = (item: Record<string, any>) => {
  const numericEntry = Object.entries(item).find(([, value]) => typeof value === 'number')
  return Number(numericEntry?.[1] ?? 0)
}

const buildLineOption = (title: string, seriesName: string, list: any[] = []) => ({
  tooltip: { trigger: 'axis' },
  title: { text: title, textStyle: { color: '#edf4ff', fontSize: 16 } },
  xAxis: { type: 'category', data: list.map(firstLabel), axisLabel: { color: '#91a0bc' } },
  yAxis: { type: 'value', axisLabel: { color: '#91a0bc' } },
  grid: { left: 48, right: 24, top: 48, bottom: 32 },
  series: [{ type: 'line', smooth: true, name: seriesName, data: list.map(firstValue), areaStyle: {}, lineStyle: { color: '#ff8b3d' } }],
})

const summary = computed(() => overview.value.summary ?? {})
const statCards = computed(() => [
  { label: '销售总额', value: summary.value.totalSalesAmount ?? 0, tip: '来自概览汇总' },
  { label: '订单总数', value: summary.value.totalOrderCount ?? 0, tip: '累计交易订单' },
  { label: '退款总额', value: summary.value.totalRefundAmount ?? 0, tip: '售后金额总览' },
  { label: '待处理退款', value: summary.value.pendingRefundCount ?? 0, tip: '需尽快审核' },
])
const salesOption = computed(() => buildLineOption('销售趋势', '销售额', overview.value.salesTrend || []))
const refundOption = computed(() => buildLineOption('退款趋势', '退款额', overview.value.refundTrend || []))

onMounted(async () => {
  overview.value = await dashboardApi.overview()
})
</script>

<style scoped>
.chart { height: 320px; }
</style>
