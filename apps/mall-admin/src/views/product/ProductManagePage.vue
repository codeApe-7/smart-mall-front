<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { deleteProduct, listProducts, saveProduct } from '@mall-admin/api/modules/product';
import { formatCurrency } from '@shared/utils/format';
import type { AdminProductItem } from '@shared/types/admin';

const query = reactive({ pageNo: 1, pageSize: 10, productName: '', categoryIdOrPCategoryId: '', status: undefined as number | undefined });
const products = ref<AdminProductItem[]>([]);
const totalCount = ref(0);
const dialogVisible = ref(false);
const form = reactive<Record<string, unknown>>({ productName: '', categoryId: '', salePrice: 0, status: 1, skuList: [], propertyValueList: [] });

async function loadData() {
  const result = await listProducts(query);
  products.value = result.records;
  totalCount.value = result.totalCount;
}

async function submitProduct() {
  await saveProduct(form);
  ElMessage.success('商品已保存');
  dialogVisible.value = false;
  await loadData();
}

async function removeProduct(productId: string) {
  await deleteProduct(productId);
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h2>商品管理</h2>
      <p>商品查询对接 `/product/loadProductList`，新增编辑走 `/product/save`。</p>
    </header>
    <section class="admin-panel product-page__toolbar">
      <el-form inline>
        <el-form-item label="商品名"><el-input v-model="query.productName" /></el-form-item>
        <el-form-item label="分类"><el-input v-model="query.categoryIdOrPCategoryId" /></el-form-item>
        <el-form-item><el-button type="primary" @click="loadData">查询</el-button></el-form-item>
        <el-form-item><el-button plain @click="dialogVisible = true">新增商品</el-button></el-form-item>
      </el-form>
    </section>
    <section class="admin-panel product-page__table">
      <el-table :data="products">
        <el-table-column prop="productName" label="商品名" min-width="220" />
        <el-table-column prop="categoryName" label="分类" width="140" />
        <el-table-column label="价格" width="120"><template #default="scope">{{ formatCurrency(scope.row.salePrice) }}</template></el-table-column>
        <el-table-column prop="stockNum" label="库存" width="120" />
        <el-table-column label="操作" width="160">
          <template #default="scope"><el-button link @click="Object.assign(form, scope.row); dialogVisible = true">编辑</el-button><el-button link type="danger" @click="removeProduct(scope.row.productId)">删除</el-button></template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next, total" :total="totalCount" :page-size="query.pageSize" :current-page="query.pageNo" @current-change="(page: number) => { query.pageNo = page; loadData(); }" />
    </section>
    <el-dialog v-model="dialogVisible" title="商品编辑" width="720px">
      <el-form label-position="top">
        <el-form-item label="商品名"><el-input v-model="form.productName as string" /></el-form-item>
        <el-form-item label="分类 ID"><el-input v-model="form.categoryId as string" /></el-form-item>
        <el-form-item label="售价"><el-input-number v-model="form.salePrice as number" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status as number" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitProduct">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped>
.product-page__toolbar,
.product-page__table {
  padding: 20px;
}
</style>

