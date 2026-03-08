<template>
  <div class="admin-page">
    <AppPageHeader title="通知中心" description="草稿、发布、下线和删除流程严格按通知后台接口执行。">
      <template #actions><el-button type="primary" @click="openCreate">新建通知</el-button></template>
    </AppPageHeader>
    <WorkbenchPanel title="通知列表">
      <div class="toolbar">
        <el-input v-model="query.keyword" placeholder="标题/摘要关键词" clearable />
        <el-select v-model="query.messageType" placeholder="消息类型" clearable>
          <el-option label="公告" value="announcement" />
          <el-option label="系统消息" value="system" />
          <el-option label="活动通知" value="promotion" />
        </el-select>
        <el-select v-model="query.publishStatus" placeholder="发布状态" clearable>
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
          <el-option label="已下线" :value="2" />
        </el-select>
        <el-select v-model="query.targetType" placeholder="目标用户" clearable>
          <el-option label="全体用户" :value="0" />
          <el-option label="指定用户" :value="1" />
        </el-select>
        <el-button type="primary" @click="loadNotices">查询</el-button>
      </div>
      <el-table :data="notices.records || []">
        <el-table-column prop="noticeTitle" label="标题" min-width="200" />
        <el-table-column prop="messageTypeDesc" label="消息类型" min-width="120" />
        <el-table-column prop="targetTypeDesc" label="目标范围" min-width="120" />
        <el-table-column prop="publishStatusDesc" label="状态" min-width="120" />
        <el-table-column label="操作" min-width="320">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.noticeId)">详情</el-button>
            <el-button link @click="editNotice(scope.row.noticeId)">编辑</el-button>
            <el-button link type="success" @click="publish(scope.row.noticeId)">发布</el-button>
            <el-button link type="warning" @click="offline(scope.row.noticeId)">下线</el-button>
            <el-button link type="danger" @click="remove(scope.row.noticeId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </WorkbenchPanel>

    <el-drawer v-model="detailVisible" title="通知详情" size="42%">
      <KeyValueGrid :model="detail" />
    </el-drawer>

    <el-dialog v-model="editorVisible" :title="editor.noticeId ? '编辑通知' : '新建通知'" width="720">
      <el-form :model="editor" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="标题"><el-input v-model="editor.noticeTitle" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="消息类型"><el-select v-model="editor.messageType"><el-option label="公告" value="announcement" /><el-option label="系统消息" value="system" /><el-option label="活动通知" value="promotion" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="目标类型"><el-select v-model="editor.targetType"><el-option label="全体用户" :value="0" /><el-option label="指定用户" :value="1" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="目标用户ID"><el-input v-model="editor.targetUserId" placeholder="targetType=1 时填写" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="摘要"><el-input v-model="editor.noticeSummary" /></el-form-item>
        <el-form-item label="正文"><el-input v-model="editor.noticeContent" type="textarea" :rows="8" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNotice">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import KeyValueGrid from '@/components/KeyValueGrid.vue'
import { noticeApi } from '@/api/modules/admin'

const query = reactive({ pageNo: 1, pageSize: 10, keyword: '', messageType: '', publishStatus: undefined as number | undefined, targetType: undefined as number | undefined })
const notices = ref<any>({ records: [] })
const detailVisible = ref(false)
const detail = ref<Record<string, any>>({})
const editorVisible = ref(false)
const editor = reactive({ noticeId: '', noticeTitle: '', noticeSummary: '', noticeContent: '', messageType: 'announcement', targetType: 0, targetUserId: '' })

const loadNotices = async () => { notices.value = await noticeApi.list(query) }
const viewDetail = async (noticeId: string) => { detail.value = await noticeApi.detail(noticeId); detailVisible.value = true }
const openCreate = () => { Object.assign(editor, { noticeId: '', noticeTitle: '', noticeSummary: '', noticeContent: '', messageType: 'announcement', targetType: 0, targetUserId: '' }); editorVisible.value = true }
const editNotice = async (noticeId: string) => { Object.assign(editor, await noticeApi.detail(noticeId)); editorVisible.value = true }
const saveNotice = async () => { await noticeApi.save(editor); editorVisible.value = false; ElMessage.success('通知已保存'); loadNotices() }
const publish = async (noticeId: string) => { await noticeApi.publish(noticeId); ElMessage.success('通知已发布'); loadNotices() }
const offline = async (noticeId: string) => { await noticeApi.offline(noticeId); ElMessage.success('通知已下线'); loadNotices() }
const remove = async (noticeId: string) => { await noticeApi.remove(noticeId); ElMessage.success('通知已删除'); loadNotices() }

onMounted(loadNotices)
</script>
