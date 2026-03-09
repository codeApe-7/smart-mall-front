<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { getOrderDetail, getRefundDetail, getShippingDetail } from '@/api/modules/order'
import { useMallUserSessionStore } from '@/stores/session'

const route = useRoute()
const router = useRouter()
const sessionStore = useMallUserSessionStore()

const loading = ref(false)
const refund = ref<Record<string, unknown> | null>(null)
const order = ref<Record<string, unknown> | null>(null)
const shipping = ref<Record<string, unknown> | null>(null)

const orderId = computed(() => String(route.params.orderId || ''))
const refundTitle = computed(() => String(refund.value?.refundStatusDesc || '退款详情'))

async function loadData() {
  if (!sessionStore.userId || !orderId.value) {
    refund.value = null
    order.value = null
    shipping.value = null
    return
  }

  loading.value = true
  try {
    const [refundDetail, orderDetail, shippingDetail] = await Promise.all([
      getRefundDetail(sessionStore.userId, orderId.value),
      getOrderDetail(sessionStore.userId, orderId.value),
      getShippingDetail(sessionStore.userId, orderId.value),
    ])
    refund.value = refundDetail
    order.value = orderDetail
    shipping.value = shippingDetail
  } finally {
    loading.value = false
  }
}

watch(orderId, () => {
  void loadData()
})

onMounted(loadData)
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="退款服务单" subtitle="用户侧退款详情当前以后端 `orderId` 为查询主键。" accent="#ff6a2b">
      <template #extra>
        <div class="toolbar">
          <el-button plain @click="router.push('/orders')">返回订单列表</el-button>
          <el-button type="primary" @click="router.push(`/orders/${orderId}`)">查看订单详情</el-button>
        </div>
      </template>

      <div v-if="refund" class="refund-overview">
        <article class="refund-overview__card">
          <span>退款状态</span>
          <strong>{{ refundTitle }}</strong>
        </article>
        <article class="refund-overview__card">
          <span>退款单号</span>
          <strong>{{ refund.refundId || '--' }}</strong>
        </article>
        <article class="refund-overview__card">
          <span>订单编号</span>
          <strong>{{ refund.orderNo || order?.orderNo || '--' }}</strong>
        </article>
      </div>

      <EmptyState
        v-else-if="!loading"
        title="暂未查询到退款记录"
        description="如果你刚提交退款申请，可稍后刷新，或回到订单详情再次确认。"
      />
    </SectionPanel>

    <div class="card-grid two">
      <SectionPanel title="退款原始数据" subtitle="保持与后端退款接口返回结构一致。">
        <JsonPanel v-if="refund" :data="refund" />
        <EmptyState v-else title="暂无退款数据" />
      </SectionPanel>

      <SectionPanel title="订单与物流上下文" subtitle="方便核对订单、履约和退款链路是否一致。" accent="#0f7f74">
        <div class="page-grid">
          <JsonPanel v-if="order" :data="order" title="订单详情" />
          <JsonPanel v-if="shipping" :data="shipping" title="物流详情" />
          <EmptyState v-if="!order && !shipping" title="暂无履约信息" />
        </div>
      </SectionPanel>
    </div>
  </div>
</template>

<style scoped lang="scss">
.refund-overview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.refund-overview__card {
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 106, 43, 0.12), rgba(255, 255, 255, 0.9));
  border: 1px solid rgba(255, 106, 43, 0.12);

  span {
    display: block;
    margin-bottom: 12px;
    color: var(--mall-muted);
    font-size: 13px;
  }

  strong {
    font-size: 22px;
    color: var(--mall-text);
  }
}

@media (max-width: 1080px) {
  .refund-overview {
    grid-template-columns: 1fr;
  }
}
</style>
