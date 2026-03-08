<template>
  <div class="admin-page">
    <AppPageHeader title="分类与属性管理" description="树形分类、属性项和排序接口全部对应后端 `SysCategoryController`。">
      <template #actions>
        <el-button @click="openBatchSort">批量排序</el-button>
        <el-button type="primary" @click="openAddCategory()">新增分类</el-button>
      </template>
    </AppPageHeader>

    <WorkbenchPanel title="分类树">
      <div class="toolbar">
        <el-input v-model="query.categoryName" placeholder="分类名称" clearable />
        <el-switch v-model="query.withProperty" active-text="带属性" />
        <el-button type="primary" @click="loadCategories">查询</el-button>
      </div>
      <el-table :data="categories" row-key="categoryId" default-expand-all :tree-props="{ children: 'children' }">
        <el-table-column prop="categoryName" label="分类名称" min-width="220" />
        <el-table-column prop="categoryId" label="分类ID" min-width="180" />
        <el-table-column prop="pCategoryId" label="父分类ID" min-width="160" />
        <el-table-column prop="sort" label="排序" min-width="90" />
        <el-table-column label="属性数" min-width="90">
          <template #default="scope">{{ scope.row.properties?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="360" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openAddCategory(scope.row.categoryId)">加子分类</el-button>
            <el-button link @click="openEditCategory(scope.row)">编辑</el-button>
            <el-button link type="warning" @click="openPropertyDialog(scope.row)">属性管理</el-button>
            <el-button link type="danger" @click="removeCategory(scope.row.categoryId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </WorkbenchPanel>

    <el-dialog v-model="categoryDialogVisible" :title="categoryForm.categoryId ? '编辑分类' : '新增分类'" width="520">
      <el-form :model="categoryForm" label-position="top">
        <el-form-item label="分类名称"><el-input v-model="categoryForm.categoryName" /></el-form-item>
        <el-form-item label="父分类ID"><el-input v-model="categoryForm.pCategoryId" placeholder="根节点可留空或填 0" /></el-form-item>
        <el-form-item v-if="categoryForm.categoryId" label="完整 JSON（更新时可补充 sort 等字段）">
          <el-input v-model="categoryJson" type="textarea" :rows="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="propertyDialogVisible" title="属性管理" width="780">
      <div class="toolbar">
        <el-input v-model="propertyForm.propertyName" placeholder="属性名称" />
        <el-input-number v-model="propertyForm.coverType" :min="0" :max="1" />
        <el-button type="primary" @click="addProperty">新增属性</el-button>
      </div>
      <el-table :data="selectedCategory?.properties || []">
        <el-table-column prop="propertyName" label="属性名" min-width="180" />
        <el-table-column prop="propertyId" label="属性ID" min-width="180" />
        <el-table-column prop="coverType" label="封面类型" min-width="100" />
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-button link @click="editProperty(scope.row)">更新</el-button>
            <el-button link type="danger" @click="removeProperty(scope.row.propertyId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-alert type="info" :closable="false" title="更新属性时会弹出 JSON 编辑器，以便补齐后端实体字段。" />
    </el-dialog>

    <el-dialog v-model="propertyEditVisible" title="更新属性" width="680">
      <el-input v-model="propertyEditJson" type="textarea" :rows="16" />
      <template #footer>
        <el-button @click="propertyEditVisible = false">取消</el-button>
        <el-button type="primary" @click="savePropertyUpdate">保存属性</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="sortDialogVisible" title="批量排序" width="640">
      <el-input v-model="sortText" type="textarea" :rows="12" placeholder="按新顺序输入分类 ID，支持逗号或换行分隔。" />
      <template #footer>
        <el-button @click="sortDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSort">提交排序</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import { categoryApi } from '@/api/modules/admin'

const query = reactive({ categoryName: '', tree: true, withProperty: true })
const categories = ref<any[]>([])
const selectedCategory = ref<any | null>(null)

const categoryDialogVisible = ref(false)
const categoryForm = reactive({ categoryId: '', categoryName: '', pCategoryId: '' })
const categoryJson = ref('{}')

const propertyDialogVisible = ref(false)
const propertyEditVisible = ref(false)
const propertyForm = reactive({ propertyName: '', pCategoryId: '', categoryId: '', coverType: 0 })
const propertyEditJson = ref('{}')
const sortDialogVisible = ref(false)
const sortText = ref('')

const loadCategories = async () => {
  categories.value = await categoryApi.list({ ...query, tree: true })
}

const openAddCategory = (pCategoryId = '') => {
  Object.assign(categoryForm, { categoryId: '', categoryName: '', pCategoryId })
  categoryJson.value = '{}'
  categoryDialogVisible.value = true
}

const openEditCategory = (row: any) => {
  Object.assign(categoryForm, { categoryId: row.categoryId, categoryName: row.categoryName, pCategoryId: row.pCategoryId || '' })
  categoryJson.value = JSON.stringify(row, null, 2)
  categoryDialogVisible.value = true
}

const saveCategory = async () => {
  if (!categoryForm.categoryName) return ElMessage.warning('请填写分类名称')
  if (!categoryForm.categoryId) {
    await categoryApi.add({ categoryName: categoryForm.categoryName, pCategoryId: categoryForm.pCategoryId || undefined })
  } else {
    const payload = { ...JSON.parse(categoryJson.value || '{}'), categoryId: categoryForm.categoryId, categoryName: categoryForm.categoryName, pCategoryId: categoryForm.pCategoryId || undefined }
    await categoryApi.update(payload)
  }
  categoryDialogVisible.value = false
  loadCategories()
}

const removeCategory = async (categoryId: string) => {
  await ElMessageBox.confirm('确认删除该分类及其子分类吗？', '提示', { type: 'warning' })
  await categoryApi.remove(categoryId)
  ElMessage.success('分类已删除')
  loadCategories()
}

const openPropertyDialog = (row: any) => {
  selectedCategory.value = row
  Object.assign(propertyForm, { propertyName: '', pCategoryId: row.pCategoryId, categoryId: row.categoryId, coverType: 0 })
  propertyDialogVisible.value = true
}

const addProperty = async () => {
  await categoryApi.addProperty({ ...propertyForm })
  ElMessage.success('属性已新增')
  propertyForm.propertyName = ''
  loadCategories()
}

const editProperty = (row: any) => {
  propertyEditJson.value = JSON.stringify(row, null, 2)
  propertyEditVisible.value = true
}

const savePropertyUpdate = async () => {
  await categoryApi.updateProperty(JSON.parse(propertyEditJson.value || '{}'))
  propertyEditVisible.value = false
  ElMessage.success('属性已更新')
  loadCategories()
}

const removeProperty = async (propertyId: string) => {
  await categoryApi.removeProperty(propertyId)
  ElMessage.success('属性已删除')
  loadCategories()
}

const openBatchSort = () => {
  sortText.value = categories.value.flatMap((item) => [item.categoryId, ...(item.children || []).map((child: any) => child.categoryId)]).join('\n')
  sortDialogVisible.value = true
}

const submitSort = async () => {
  const ids = sortText.value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
  await categoryApi.changeSortByList(ids)
  sortDialogVisible.value = false
  ElMessage.success('排序已提交')
  loadCategories()
}

onMounted(loadCategories)
</script>
