<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { callbackPayment } from '@/api/modules/payment'

const route = useRoute()
const router = useRouter()
const form = reactive({ paymentNo: '', callbackStatus: 'SUCCESS', gatewayTradeNo: '', callbackContent: '' })
const result = ref<Record<string, unknown> | null>(null)

const submit = async () => {
  await callbackPayment(form)
  result.value = { success: true, ...form }
  ElMessage.success('支付回调已提交')
}

onMounted(() => {
  form.paymentNo = String(route.query.paymentNo || '')
  form.gatewayTradeNo = `MOCK-${Date.now()}`
  form.callbackContent = JSON.stringify({ orderId: route.query.orderId || '', paymentNo: form.paymentNo, callbackStatus: form.callbackStatus })
})
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="支付回调页" subtitle="对接 `/payment/callback`，用于本地联调支付成功场景。">
      <el-form label-position="top">
        <el-form-item label="paymentNo"><el-input v-model="form.paymentNo" /></el-form-item>
        <el-form-item label="callbackStatus"><el-input v-model="form.callbackStatus" /></el-form-item>
        <el-form-item label="gatewayTradeNo"><el-input v-model="form.gatewayTradeNo" /></el-form-item>
        <el-form-item label="callbackContent"><el-input v-model="form.callbackContent" type="textarea" :rows="4" /></el-form-item>
        <div class="toolbar">
          <el-button type="primary" @click="submit">提交回调</el-button>
          <el-button plain @click="router.push('/orders')">回订单中心</el-button>
        </div>
      </el-form>
    </SectionPanel>
    <SectionPanel v-if="result" title="回调结果" subtitle="本地模拟结果。" accent="#ff8c38">
      <JsonPanel :data="result" />
    </SectionPanel>
  </div>
</template>
