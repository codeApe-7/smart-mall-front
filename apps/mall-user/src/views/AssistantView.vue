<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import JsonPanel from '@/components/JsonPanel.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import { chatAssistant, chatAssistantAgent, fetchAssistantHistory } from '@/api/modules/assistant'
import type { AssistantChatResponse, AssistantHistoryItem } from '@shared/types/mall'
import { useSessionStore } from '@/stores/sessionStore'

const sessionStore = useSessionStore()
const form = reactive({ message: '', useAgent: true })
const sessionId = ref('')
const history = ref<AssistantHistoryItem[]>([])
const response = ref<AssistantChatResponse | null>(null)
const loading = ref(false)

const loadHistory = async () => {
  const userId = sessionStore.profile?.userId
  if (!userId) return
  const result = await fetchAssistantHistory({ userId, sessionId: sessionId.value || undefined, pageNo: 1, pageSize: 10 })
  history.value = result.records || []
}

const submit = async () => {
  const userId = sessionStore.profile?.userId
  if (!userId || !form.message) {
    ElMessage.warning('请先登录并输入问题')
    return
  }
  loading.value = true
  try {
    const payload = { userId, sessionId: sessionId.value || undefined, message: form.message }
    response.value = form.useAgent ? await chatAssistantAgent(payload) : await chatAssistant(payload)
    sessionId.value = String(response.value?.sessionId || sessionId.value)
    form.message = ''
    await loadHistory()
  } finally {
    loading.value = false
  }
}

onMounted(loadHistory)
</script>

<template>
  <div class="page-grid">
    <SectionPanel title="智能助手" subtitle="优先支持 `/assistant/chat`、`/assistant/agent/chat` 和 `/assistant/history`。">
      <el-form label-position="top">
        <el-form-item label="message"><el-input v-model="form.message" type="textarea" :rows="4" placeholder="比如：帮我比较两款手机，或者查询订单退款进度" /></el-form-item>
        <div class="toolbar">
          <el-switch v-model="form.useAgent" active-text="Agent 模式" />
          <el-button type="primary" :loading="loading" @click="submit">发送</el-button>
          <el-button plain @click="loadHistory">刷新历史</el-button>
        </div>
      </el-form>
    </SectionPanel>

    <div class="card-grid two">
      <SectionPanel title="本次结果" subtitle="推荐商品、比较结果和订单结果都以原始结构稳定展示。">
        <JsonPanel v-if="response" :data="response" />
      </SectionPanel>
      <SectionPanel title="会话历史" subtitle="对应 `/assistant/history`。" accent="#2b7a78">
        <JsonPanel :data="history" />
      </SectionPanel>
    </div>
  </div>
</template>
