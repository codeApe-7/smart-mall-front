<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { addCategory, addProperty, deleteCategory, deleteProperty, listCategories } from '@mall-admin/api/modules/product';
import type { SysCategoryNode } from '@shared/types/admin';

const categories = ref<SysCategoryNode[]>([]);
const loading = ref(false);
const categoryForm = reactive({ categoryName: '', pCategoryId: '0', sort: 0 });
const propertyForm = reactive({ propertyName: '', categoryId: '', pCategoryId: '0', coverType: 0 });

async function loadData() {
  loading.value = true;
  try {
    const result = await listCategories({ tree: true, withProperty: true, pageNo: 1, pageSize: 100 });
    categories.value = Array.isArray(result) ? result : result.records;
  } finally {
    loading.value = false;
  }
}

async function createCategory() {
  await addCategory(categoryForm);
  ElMessage.success('分类已新增');
  categoryForm.categoryName = '';
  await loadData();
}

async function createProperty() {
  await addProperty(propertyForm);
  ElMessage.success('属性已新增');
  propertyForm.propertyName = '';
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <h2>分类管理</h2>
      <p>映射 `/category/list`、`/category/add`、`/category/property/add` 等后端接口。</p>
    </header>
    <section class="category-page__grid">
      <article class="admin-panel category-page__panel">
        <div class="section-title"><h3>新增分类</h3></div>
        <el-form label-position="top">
          <el-form-item label="分类名称"><el-input v-model="categoryForm.categoryName" /></el-form-item>
          <el-form-item label="父分类 ID"><el-input v-model="categoryForm.pCategoryId" /></el-form-item>
          <el-button type="primary" @click="createCategory">新增分类</el-button>
        </el-form>
      </article>
      <article class="admin-panel category-page__panel">
        <div class="section-title"><h3>新增属性</h3></div>
        <el-form label-position="top">
          <el-form-item label="属性名称"><el-input v-model="propertyForm.propertyName" /></el-form-item>
          <el-form-item label="分类 ID"><el-input v-model="propertyForm.categoryId" /></el-form-item>
          <el-button type="primary" @click="createProperty">新增属性</el-button>
        </el-form>
      </article>
    </section>
    <section class="admin-panel category-page__panel">
      <div class="section-title"><h3>分类树</h3></div>
      <el-table v-loading="loading" :data="categories" row-key="categoryId" default-expand-all>
        <el-table-column prop="categoryName" label="分类名" min-width="220" />
        <el-table-column label="属性" min-width="260">
          <template #default="scope">
            <el-tag v-for="property in scope.row.properties || []" :key="property.propertyId" style="margin-right: 8px" closable @close="deleteProperty(property.propertyId!)">{{ property.propertyName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button link type="danger" @click="deleteCategory(scope.row.categoryId).then(loadData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<style scoped>
.category-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.category-page__panel {
  padding: 22px;
}
</style>
