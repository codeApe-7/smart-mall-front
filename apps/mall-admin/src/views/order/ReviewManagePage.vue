<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { deleteReview, listReviews, replyReview } from '@mall-admin/api/modules/review';
import type { AdminReviewItem } from '@shared/types/admin';

const query = reactive({ pageNo: 1, pageSize: 10, orderNo: '', productId: '', userId: '', rating: undefined as number | undefined, replied: undefined as boolean | undefined });
const reviews = ref<AdminReviewItem[]>([]);

async function loadData() {
  const result = await listReviews(query);
  reviews.value = result.records;
}

async function reply(item: AdminReviewItem) {
  const result = await ElMessageBox.prompt('请输入回复内容', `回复评价 ${item.reviewId}`);
  await replyReview({ reviewId: item.reviewId, replyContent: result.value });
  await loadData();
}

async function remove(reviewId: string) {
  await deleteReview(reviewId);
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header"><h2>评价管理</h2><p>评价详情、回复与删除全部对齐后台接口。</p></header>
    <section class="admin-panel product-page__table">
      <el-table :data="reviews">
        <el-table-column prop="productName" label="商品" min-width="180" />
        <el-table-column prop="orderNo" label="订单号" min-width="160" />
        <el-table-column prop="rating" label="评分" width="100" />
        <el-table-column prop="content" label="内容" min-width="260" />
        <el-table-column label="操作" width="160"><template #default="scope"><el-button link @click="reply(scope.row)">回复</el-button><el-button link type="danger" @click="remove(scope.row.reviewId)">删除</el-button></template></el-table-column>
      </el-table>
    </section>
  </div>
</template>
