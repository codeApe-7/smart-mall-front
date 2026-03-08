<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { deleteNotice, listNotices, offlineNotice, publishNotice, saveNotice } from '@mall-admin/api/modules/notice';
import type { AdminNoticeItem } from '@shared/types/admin';
import { formatDateTime } from '@shared/utils/format';

const notices = ref<AdminNoticeItem[]>([]);
const dialogVisible = ref(false);
const form = reactive({ noticeId: '', noticeTitle: '', noticeSummary: '', noticeContent: '', messageType: 'SYSTEM', targetType: 0, targetUserId: '' });

async function loadData() {
  const result = await listNotices({ pageNo: 1, pageSize: 20 });
  notices.value = result.records;
}

async function submit() {
  await saveNotice(form);
  dialogVisible.value = false;
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>消息通知</h2><p>通知草稿、发布、下线和删除都对齐 `/notice/*` 接口。</p></header>
    <section class="admin-panel product-page__toolbar">
      <el-button type="primary" @click="dialogVisible = true">新建通知</el-button>
    </section>
    <section class="admin-panel product-page__table">
      <el-table :data="notices">
        <el-table-column prop="noticeTitle" label="标题" min-width="220" />
        <el-table-column prop="messageType" label="类型" width="120" />
        <el-table-column prop="publishStatusDesc" label="状态" width="120" />
        <el-table-column label="发布时间" width="180"><template #default="scope">{{ formatDateTime(scope.row.publishedTime) }}</template></el-table-column>
        <el-table-column label="操作" width="220"><template #default="scope"><el-button link @click="Object.assign(form, scope.row); dialogVisible = true">编辑</el-button><el-button link @click="publishNotice(scope.row.noticeId).then(loadData)">发布</el-button><el-button link @click="offlineNotice(scope.row.noticeId).then(loadData)">下线</el-button><el-button link type="danger" @click="deleteNotice(scope.row.noticeId).then(loadData)">删除</el-button></template></el-table-column>
      </el-table>
    </section>
    <el-dialog v-model="dialogVisible" title="通知编辑" width="720px">
      <el-form label-position="top">
        <el-form-item label="标题"><el-input v-model="form.noticeTitle" /></el-form-item>
        <el-form-item label="摘要"><el-input v-model="form.noticeSummary" /></el-form-item>
        <el-form-item label="正文"><el-input v-model="form.noticeContent" type="textarea" :rows="6" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="form.messageType"><el-option label="系统公告" value="SYSTEM" /><el-option label="订单消息" value="ORDER" /><el-option label="活动通知" value="MARKETING" /></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>
  </div>
</template>
