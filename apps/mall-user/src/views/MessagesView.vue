<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getUserToken } from '@shared/utils/session'
import SectionPanel from '@/components/SectionPanel.vue'
import JsonPanel from '@/components/JsonPanel.vue'
import { fetchMessageDetail, fetchMessageList, readMessage } from '@/api/modules/message'

const query = reactive({ pageNo: 1, pageSize: 10 })
const messages = ref<Array<Record<string, unknown>>>([])
const detail = ref<Record<string, unknown> | null>(null)

const loadMessages = async () => {
  const result = await fetchMessageList(getUserToken(), query)
  messages.value = result.records
}

const openDetail = async (noticeId: string) => {
  detail.value = await fetchMessageDetail(getUserToken(), noticeId)
}

const markRead = async (noticeId: string) => {
  await readMessage(getUserToken(), noticeId)
  await loadMessages()
  await openDetail(noticeId)
}

onMounted(loadMessages)
</script>

<template>
  <div class="card-grid two">
    <SectionPanel title="消息列表" subtitle="对应消息列表、已读和未读能力。">
      <el-table :data="messages" border>
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="noticeTypeName" label="类型" width="120" />
        <el-table-column prop="readStatus" label="已读" width="90" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <div class="toolbar">
              <el-button text type="primary" @click="openDetail(String(scope.row.noticeId))">详情</el-button>
              <el-button text @click="markRead(String(scope.row.noticeId))">已读</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </SectionPanel>
    <SectionPanel title="消息详情" subtitle="对应 `/message/detail/{noticeId}`" accent="#ff5d00">
      <JsonPanel v-if="detail" :data="detail" />
    </SectionPanel>
  </div>
</template>
