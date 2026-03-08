<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { createOrder, previewOrder, submitPayment } from '@/api/modules/order'
import { formatCurrency } from '@shared/utils/format'
import type { OrderPreview, PaymentSubmitResult } from '@shared/types/mall'
import { useSessionStore } from '@/stores/sessionStore'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()
const preview = ref<OrderPreview | null>(null)
const paymentResult = ref<PaymentSubmitResult | null>(null)
const creating = ref(false)
const form = reactive({ receiverName: '', receiverPhone: '', receiverAddress: '', orderRemark: '' })

const userId = computed(() => sessionStore.profile?.userId || '')
const cartIds = computed(() => String(route.query.cartIds || '').split(',').map((item) => item.trim()).filter(Boolean))

const loadPreview = async () => {
  if (!userId.value || !cartIds.value.length) return
  preview.value = await previewOrder({ userId: userId.value, cartIds: cartIds.value }) as OrderPreview
}

const submit = async () => {
  if (!userId.value || !cartIds.value.length) return
  creating.value = true
  try {
    const orderResult = await createOrder({ userId: userId.value, cartIds: cartIds.value, ...form })
    paymentResult.value = await submitPayment({ userId: userId.value, orderId: String((orderResult as Record<string, unknown>).orderId || ''), payChannel: 'MOCK_ALIPAY' }) as PaymentSubmitResult
    ElMessage.success('订单已创建，支付单已生成')
  } finally {
    creating.value = false
  }
}

const openCallback = () => {
  if (!paymentResult.value?.paymentNo) return
  router.push({ path: '/payment/callback', query: { paymentNo: String(paymentResult.value.paymentNo || ''), orderId: String((paymentResult.value as Record<string, unknown>).orderId || '') } })
}

onMounted(loadPreview)
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="确认订单" subtitle="对应 `/order/preview`、`/order/create`、`/payment/submit`。">
      <div class="card-grid two">
        <div>
          <el-form label-position="top">
            <el-form-item label="receiverName"><el-input v-model="form.receiverName" /></el-form-item>
            <el-form-item label="receiverPhone"><el-input v-model="form.receiverPhone" /></el-form-item>
            <el-form-item label="receiverAddress"><el-input v-model="form.receiverAddress" type="textarea" :rows="3" /></el-form-item>
            <el-form-item label="orderRemark"><el-input v-model="form.orderRemark" /></el-form-item>
            <div class="toolbar">
              <el-button type="primary" :loading="creating" @click="submit">提交订单并发起支付</el-button>
              <el-button plain @click="loadPreview">刷新预览</el-button>
            </div>
          </el-form>
        </div>
        <div>
          <p>待支付金额：<strong>{{ formatCurrency(preview?.payAmount || 0) }}</strong></p>
          <JsonPanel v-if="preview" :data="preview" title="订单预览" />
        </div>
      </div>
    </SectionPanel>

    <SectionPanel v-if="paymentResult" title="支付单结果" subtitle="支持跳到本地支付回调页完成联调。" accent="#ff8c38">
      <div class="toolbar" style="margin-bottom: 16px">
        <el-button type="primary" @click="openCallback">模拟支付成功回跳</el-button>
      </div>
      <JsonPanel :data="paymentResult" />
    </SectionPanel>
  </div>
</template>
