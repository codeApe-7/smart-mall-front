<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { fetchOrderReviews, submitReview } from '@/api/modules/review'
import { applyRefund, getRefundDetail, getShippingDetail, getOrderDetail, confirmReceive } from '@/api/modules/order'
import { useSessionStore } from '@/stores/sessionStore'

const route = useRoute()
const sessionStore = useSessionStore()
const detail = ref<Record<string, unknown> | null>(null)
const shipping = ref<Record<string, unknown> | null>(null)
const refund = ref<Record<string, unknown> | null>(null)
const reviews = ref<Array<Record<string, unknown>>>([])
const reviewForm = reactive({ rating: 5, content: '' })

const loadData = async () => {
  const userId = sessionStore.profile?.userId
  const orderId = String(route.params.orderId)
  if (!userId) return
  detail.value = await getOrderDetail(userId, orderId)
  shipping.value = await getShippingDetail(userId, orderId)
  refund.value = await getRefundDetail(userId, orderId)
  reviews.value = await fetchOrderReviews(userId, orderId) as Array<Record<string, unknown>>
}

const handleConfirm = async () => {
  const userId = sessionStore.profile?.userId
  if (!userId) return
  await confirmReceive({ userId, orderId: String(route.params.orderId) })
  await loadData()
}

const handleRefund = async () => {
  const userId = sessionStore.profile?.userId
  if (!userId) return
  await applyRefund({ userId, orderId: String(route.params.orderId), refundReason: '前端订单详情页发起退款' })
  await loadData()
}

const handleReview = async () => {
  const userId = sessionStore.profile?.userId
  if (!userId) return
  await submitReview({ userId, orderId: String(route.params.orderId), reviews: [{ itemId: 'manual-item', productId: String(detail.value?.productId || ''), rating: reviewForm.rating, content: reviewForm.content }] })
  await loadData()
}

onMounted(loadData)
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="订单详情" subtitle="联动订单、物流、退款和评价信息。">
      <div class="toolbar" style="margin-bottom: 16px">
        <el-button type="primary" @click="handleConfirm">确认收货</el-button>
        <el-button plain @click="handleRefund">申请退款</el-button>
        <el-button plain @click="loadData">刷新</el-button>
      </div>
      <JsonPanel v-if="detail" :data="detail" title="订单详情" />
    </SectionPanel>

    <div class="card-grid two">
      <SectionPanel title="物流详情" subtitle="对应 `/shipping/detail`。" accent="#2b7a78">
        <JsonPanel v-if="shipping" :data="shipping" />
      </SectionPanel>
      <SectionPanel title="退款详情" subtitle="对应 `/refund/detail`。" accent="#ff8c38">
        <JsonPanel v-if="refund" :data="refund" />
      </SectionPanel>
    </div>

    <SectionPanel title="订单评价" subtitle="支持查看与补提评价。">
      <el-form inline>
        <el-form-item label="rating"><el-input-number v-model="reviewForm.rating" :min="1" :max="5" /></el-form-item>
        <el-form-item label="content"><el-input v-model="reviewForm.content" style="width: 320px" /></el-form-item>
        <el-form-item><el-button type="primary" @click="handleReview">提交评价</el-button></el-form-item>
      </el-form>
      <JsonPanel :data="reviews" title="已有关联评价" />
    </SectionPanel>
  </div>
</template>
