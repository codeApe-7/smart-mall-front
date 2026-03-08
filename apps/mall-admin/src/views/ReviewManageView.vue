<template>
  <div class="admin-page">
    <AppPageHeader title="评价管理" description="回复、删除等操作严格对应 `AdminReviewQueryDTO` 与 `AdminReviewReplyDTO`。" />
    <WorkbenchPanel title="评价列表">
      <div class="toolbar">
        <el-input v-model="query.orderNo" placeholder="订单号" clearable />
        <el-input v-model="query.productId" placeholder="商品ID" clearable />
        <el-input v-model="query.userId" placeholder="用户ID" clearable />
        <el-input-number v-model="query.rating" :min="1" :max="5" />
        <el-select v-model="query.replied" placeholder="回复状态" clearable>
          <el-option label="未回复" :value="false" />
          <el-option label="已回复" :value="true" />
        </el-select>
        <el-button type="primary" @click="loadReviews">查询</el-button>
      </div>
      <el-table :data="reviews.records || []">
        <el-table-column prop="productName" label="商品" min-width="180" />
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="rating" label="评分" min-width="90" />
        <el-table-column prop="replyContent" label="回复" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" min-width="260">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.reviewId)">详情</el-button>
            <el-button link type="warning" @click="openReply(scope.row.reviewId)">回复</el-button>
            <el-button link type="danger" @click="remove(scope.row.reviewId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </WorkbenchPanel>

    <el-drawer v-model="detailVisible" title="评价详情" size="42%">
      <KeyValueGrid :model="detail" />
    </el-drawer>

    <el-dialog v-model="replyVisible" title="回复评价" width="560">
      <el-form label-position="top">
        <el-form-item label="评价ID"><el-input v-model="replyForm.reviewId" disabled /></el-form-item>
        <el-form-item label="回复内容"><el-input v-model="replyForm.replyContent" type="textarea" :rows="5" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">提交回复</el-button>
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
import { reviewApi } from '@/api/modules/admin'

const query = reactive({ pageNo: 1, pageSize: 10, orderNo: '', productId: '', userId: '', rating: undefined as number | undefined, replied: undefined as boolean | undefined })
const reviews = ref<any>({ records: [] })
const detail = ref<Record<string, any>>({})
const detailVisible = ref(false)
const replyVisible = ref(false)
const replyForm = reactive({ reviewId: '', replyContent: '' })

const loadReviews = async () => { reviews.value = await reviewApi.list(query) }
const viewDetail = async (reviewId: string) => { detail.value = await reviewApi.detail(reviewId); detailVisible.value = true }
const openReply = (reviewId: string) => { replyForm.reviewId = reviewId; replyForm.replyContent = ''; replyVisible.value = true }
const submitReply = async () => { await reviewApi.reply(replyForm); replyVisible.value = false; ElMessage.success('回复成功'); loadReviews() }
const remove = async (reviewId: string) => { await reviewApi.remove(reviewId); ElMessage.success('评价已删除'); loadReviews() }

onMounted(loadReviews)
</script>
