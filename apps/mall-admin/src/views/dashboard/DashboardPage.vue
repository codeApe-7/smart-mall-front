<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import MetricCard from '@mall-admin/components/MetricCard.vue';
import { getDashboardOverview } from '@mall-admin/api/modules/dashboard';
import type { DashboardOverview } from '@shared/types/admin';

const overview = ref<DashboardOverview | null>(null);
const metricCards = computed(() => {
  const summary = (overview.value?.summary as Array<Record<string, unknown>>) || [];
  if (summary.length) {
    return summary.map((item) => ({ label: String(item.label || '指标'), value: String(item.value || 0), hint: String(item.trend || '') }));
  }
  return [
    { label: '销售额', value: '0', hint: '等待后端统计' },
    { label: '订单数', value: '0', hint: '等待后端统计' },
    { label: '退款数', value: '0', hint: '等待后端统计' },
    { label: '低库存', value: '0', hint: '等待后端统计' }
  ];
});

onMounted(async () => {
  overview.value = await getDashboardOverview().catch(() => null);
});
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h2>数据概览</h2>
      <p>看板对接 `/dashboard/overview`，优先展示后端聚合结果。</p>
    </header>
    <section class="dashboard-page__metrics">
      <MetricCard v-for="item in metricCards" :key="item.label" :label="item.label" :value="item.value" :hint="item.hint" />
    </section>
    <section class="dashboard-page__grid">
      <article class="admin-panel dashboard-page__panel">
        <div class="section-title"><h3>待发货订单</h3></div>
        <el-table :data="(overview?.pendingShipmentOrders as Array<Record<string, unknown>>) || []">
          <el-table-column prop="orderNo" label="订单号" min-width="160" />
          <el-table-column prop="userId" label="用户" width="120" />
          <el-table-column prop="payAmount" label="金额" width="120" />
        </el-table>
      </article>
      <article class="admin-panel dashboard-page__panel">
        <div class="section-title"><h3>库存预警</h3></div>
        <el-table :data="(overview?.lowStockProducts as Array<Record<string, unknown>>) || []">
          <el-table-column prop="productName" label="商品" min-width="160" />
          <el-table-column prop="stockNum" label="库存" width="120" />
        </el-table>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.dashboard-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.dashboard-page__panel {
  padding: 22px;
}
</style>
