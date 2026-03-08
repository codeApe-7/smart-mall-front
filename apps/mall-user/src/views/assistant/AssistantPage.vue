<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { chatAssistantAgent, createAssistantSocket, getAssistantHistory } from '@mall-user/api/modules/assistant';
import { STORAGE_KEYS } from '@shared/constants/storage';
import { getStorage, setStorage } from '@shared/utils/storage';
import type { AssistantChatResponse, AssistantHistoryItem } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const sessionStore = useMallUserSessionStore();
const sessionId = ref(getStorage(STORAGE_KEYS.assistantSessionId, ''));
const input = ref('我想买一台适合通勤的轻薄笔记本');
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const history = ref<AssistantHistoryItem[]>([]);
let socket: WebSocket | null = null;

function applyResponse(payload: AssistantChatResponse) {
  sessionId.value = payload.sessionId;
  setStorage(STORAGE_KEYS.assistantSessionId, payload.sessionId);
  messages.value.push({ role: 'assistant', content: payload.reply || '已收到你的问题，我正在继续完善回答。' });
}

async function sendMessage() {
  if (!sessionStore.profile?.userId || !input.value.trim()) {
    ElMessage.warning('请先登录并输入问题');
    return;
  }
  const message = input.value;
  messages.value.push({ role: 'user', content: message });
  input.value = '';

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ userId: sessionStore.profile.userId, sessionId: sessionId.value, message }));
    return;
  }

  const payload = await chatAssistantAgent({ userId: sessionStore.profile.userId, sessionId: sessionId.value, message });
  applyResponse(payload);
}

async function loadHistory() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  const result = await getAssistantHistory({ userId: sessionStore.profile.userId, sessionId: sessionId.value, pageNo: 1, pageSize: 10 });
  history.value = result.records;
}

onMounted(() => {
  socket = createAssistantSocket(applyResponse, () => {
    socket = null;
  });
  loadHistory().catch(() => undefined);
});

onBeforeUnmount(() => {
  socket?.close();
});
</script>

<template>
  <div class="assistant-page">
    <section class="assistant-page__chat mall-panel">
      <div class="section-title">
        <h3>智能导购</h3>
        <span class="dimmed">优先使用 `/ws/assistant`，失败时回退 `/assistant/agent/chat`</span>
      </div>
      <div class="assistant-page__stream">
        <div v-for="(message, index) in messages" :key="index" :class="['assistant-page__bubble', `is-${message.role}`]">
          {{ message.content }}
        </div>
      </div>
      <div class="assistant-page__composer">
        <el-input v-model="input" type="textarea" :rows="3" placeholder="输入想买什么、预算和场景" />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </section>
    <aside class="assistant-page__history mall-panel">
      <div class="section-title"><h3>历史记录</h3></div>
      <el-empty v-if="!history.length" description="暂无历史会话" />
      <el-timeline v-else>
        <el-timeline-item v-for="item in history" :key="item.sessionId + item.createTime" :timestamp="item.createTime">
          <strong>{{ item.question || '对话记录' }}</strong>
          <p>{{ item.answer }}</p>
        </el-timeline-item>
      </el-timeline>
    </aside>
  </div>
</template>

<style scoped>
.assistant-page {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 22px;
}
.assistant-page__chat,
.assistant-page__history {
  padding: 24px;
}
.assistant-page__stream {
  display: grid;
  gap: 12px;
  min-height: 440px;
  max-height: 560px;
  overflow: auto;
}
.assistant-page__bubble {
  max-width: 80%;
  padding: 14px 16px;
  border-radius: 20px;
  line-height: 1.7;
}
.assistant-page__bubble.is-user {
  justify-self: end;
  background: rgba(255, 106, 43, 0.14);
}
.assistant-page__bubble.is-assistant {
  background: rgba(15, 127, 116, 0.12);
}
.assistant-page__composer {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}
</style>
