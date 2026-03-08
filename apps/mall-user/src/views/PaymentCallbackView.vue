<script setup lang="ts">
import { reactive, ref } from 'vue'
import SectionPanel from '@/components/SectionPanel.vue'
import JsonPanel from '@/components/JsonPanel.vue'
import { callbackPayment } from '@/api/modules/payment'

const form = reactive<Record<string, unknown>>({ orderId: '', tradeStatus: 'SUCCESS', mock: true })
const result = ref<Record<string, unknown> | null>(null)

const submit = async () => {
  result.value = await callbackPayment(form)
}
</script>

<template>
  <SectionPanel title="支付回调占位页" subtitle="用于前端联调 mock 支付回调。">
    <el-form label-position="top">
      <el-form-item label="orderId"><el-input v-model="form.orderId" /></el-form-item>
      <el-form-item label="tradeStatus"><el-input v-model="form.tradeStatus" /></el-form-item>
      <el-button type="primary" @click="submit">模拟回调</el-button>
    </el-form>
    <JsonPanel v-if="result" title="回调返回" :data="result" style="margin-top: 18px" />
  </SectionPanel>
</template>
