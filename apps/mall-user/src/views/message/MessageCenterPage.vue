<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElDrawer } from 'element-plus';
import { getMessageDetail, listMessages, readMessage } from '@mall-user/api/modules/message';
import type { MallMessage } from '@shared/types/mall';
import { formatDateTime } from '@shared/utils/format';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const sessionStore = useMallUserSessionStore();
const messages = ref<MallMessage[]>([]);
const active = ref<MallMessage | null>(null);
const drawerVisible = ref(false);

async function loadMessages() {
  if (!sessionStore.userToken) {
    return;
  }
  const result = await listMessages(sessionStore.userToken, { pageNo: 1, pageSize: 20 });
  messages.value = result.records;
}

async function openMessage(item: MallMessage) {
  if (!sessionStore.userToken) {
    return;
  }
  active.value = await getMessageDetail(sessionStore.userToken, item.noticeId);
  await readMessage(sessionStore.userToken, item.noticeId);
  drawerVisible.value = true;
  await loadMessages();
}

onMounted(loadMessages);
</script>

<template>
  <div class="admin-page">
    <div class="section-title"><h3>消息中心</h3></div>
    <section class="mall-panel message-page__panel">
      <el-timeline>
        <el-timeline-item v-for="item in messages" :key="item.noticeId" :timestamp="formatDateTime(item.publishedTime)">
          <div class="message-page__item">
            <div>
              <strong>{{ item.noticeTitle }}</strong>
              <p class="dimmed">{{ item.noticeSummary }}</p>
            </div>
            <el-button plain @click="openMessage(item)">查看详情</el-button>
          </div>
        </el-timeline-item>
      </el-timeline>
    </section>
    <el-drawer v-model="drawerVisible" title="消息详情" size="40%">
      <h3>{{ active?.noticeTitle }}</h3>
      <p class="dimmed">{{ active?.noticeSummary }}</p>
      <div>{{ active?.noticeContent }}</div>
    </el-drawer>
  </div>
</template>

<style scoped>
.message-page__panel {
  padding: 24px;
}
.message-page__item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
</style>
