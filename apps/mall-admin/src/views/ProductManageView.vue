<template>
  <div class="admin-page">
    <AppPageHeader title="商品管理" description="对接商品分页、详情、保存和删除接口；复杂字段以 JSON 区块编辑。">
      <template #actions>
        <el-button type="primary" @click="openCreate">新增商品</el-button>
      </template>
    </AppPageHeader>

    <WorkbenchPanel title="商品列表">
      <div class="toolbar">
        <el-input v-model="query.productName" placeholder="商品名称" clearable />
        <el-select v-model="query.categoryIdOrPCategoryId" placeholder="分类" clearable>
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.status" placeholder="状态" clearable>
          <el-option label="下架" :value="0" />
          <el-option label="上架" :value="1" />
        </el-select>
        <el-select v-model="query.commendType" placeholder="推荐类型" clearable>
          <el-option label="普通" :value="0" />
          <el-option label="推荐" :value="1" />
        </el-select>
        <el-button type="primary" @click="loadProducts">查询</el-button>
      </div>
      <el-table :data="products.records || []">
        <el-table-column prop="productName" label="商品名称" min-width="200" />
        <el-table-column prop="categoryName" label="分类" min-width="120" />
        <el-table-column prop="productId" label="商品ID" min-width="180" />
        <el-table-column prop="status" label="状态" min-width="90" />
        <el-table-column prop="stock" label="库存" min-width="90" />
        <el-table-column label="操作" min-width="260" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.productId)">详情</el-button>
            <el-button link @click="editProduct(scope.row.productId)">编辑</el-button>
            <el-button link type="danger" @click="removeProduct(scope.row.productId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="query.pageNo"
        v-model:page-size="query.pageSize"
        :total="products.totalCount || 0"
        layout="total, prev, pager, next"
        @current-change="loadProducts"
      />
    </WorkbenchPanel>

    <el-drawer v-model="detailVisible" title="商品详情" size="45%">
      <KeyValueGrid :model="detail" />
      <WorkbenchPanel title="原始详情">
        <pre class="json-box">{{ JSON.stringify(detail, null, 2) }}</pre>
      </WorkbenchPanel>
    </el-drawer>

    <el-dialog v-model="editorVisible" :title="editor.productInfo.productId ? '编辑商品' : '新增商品'" width="860">
      <el-form label-position="top">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="商品名称"><el-input v-model="editor.productInfo.productName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="封面图"><el-input v-model="editor.productInfo.cover" placeholder="可手填或上传" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="分类ID"><el-input v-model="editor.productInfo.categoryId" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="父分类ID"><el-input v-model="editor.productInfo.pCategoryId" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="商品描述"><el-input v-model="editor.productInfo.productDesc" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="上传封面">
          <input type="file" accept="image/*" @change="uploadCover" />
        </el-form-item>
        <el-form-item label="属性值 JSON（`productPropertyList`）"><el-input v-model="propertyJson" type="textarea" :rows="8" /></el-form-item>
        <el-form-item label="SKU JSON（`skuList`）"><el-input v-model="skuJson" type="textarea" :rows="8" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AppPageHeader from '@/components/AppPageHeader.vue'
import WorkbenchPanel from '@/components/WorkbenchPanel.vue'
import KeyValueGrid from '@/components/KeyValueGrid.vue'
import { categoryApi, fileApi, productApi } from '@/api/modules/admin'

const query = reactive({ pageNo: 1, pageSize: 10, productName: '', categoryIdOrPCategoryId: '', commendType: undefined as number | undefined, status: undefined as number | undefined })
const products = ref<any>({ records: [], totalCount: 0 })
const categoryOptions = ref<{ label: string; value: string }[]>([])
const detailVisible = ref(false)
const detail = ref<Record<string, any>>({})
const editorVisible = ref(false)
const editor = reactive<any>({ productInfo: { productId: '', productName: '', productDesc: '', cover: '', categoryId: '', pCategoryId: '' } })
const propertyJson = ref('[]')
const skuJson = ref('[]')

const flattenTree = (list: any[], prefix = ''): { label: string; value: string }[] =>
  list.flatMap((item) => [
    { label: prefix ? `${prefix} / ${item.categoryName}` : item.categoryName, value: item.categoryId },
    ...flattenTree(item.children || [], prefix ? `${prefix} / ${item.categoryName}` : item.categoryName),
  ])

const loadCategories = async () => {
  const tree = await categoryApi.tree()
  categoryOptions.value = flattenTree(tree)
}

const loadProducts = async () => {
  products.value = await productApi.list(query)
}

const viewDetail = async (productId: string) => {
  detail.value = await productApi.detail(productId)
  detailVisible.value = true
}

const openCreate = () => {
  Object.assign(editor, { productInfo: { productId: '', productName: '', productDesc: '', cover: '', categoryId: '', pCategoryId: '' } })
  propertyJson.value = '[]'
  skuJson.value = '[]'
  editorVisible.value = true
}

const editProduct = async (productId: string) => {
  const payload = await productApi.detail(productId)
  Object.assign(editor, { productInfo: {
    productId: payload.productId,
    productName: payload.productName,
    productDesc: payload.productDesc,
    cover: payload.cover,
    categoryId: payload.categoryId,
    pCategoryId: payload.pCategoryId,
  } })
  propertyJson.value = JSON.stringify(payload.productPropertyList || payload.propertyValueList || [], null, 2)
  skuJson.value = JSON.stringify(payload.skuList || [], null, 2)
  editorVisible.value = true
}

const saveProduct = async () => {
  await productApi.save({
    productInfo: editor.productInfo,
    productPropertyList: JSON.parse(propertyJson.value || '[]'),
    skuList: JSON.parse(skuJson.value || '[]'),
  })
  editorVisible.value = false
  ElMessage.success('商品已保存')
  loadProducts()
}

const removeProduct = async (productId: string) => {
  await ElMessageBox.confirm('确认删除该商品吗？', '提示', { type: 'warning' })
  await productApi.remove(productId)
  ElMessage.success('商品已删除')
  loadProducts()
}

const uploadCover = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const payload = await fileApi.uploadImage(file)
  editor.productInfo.cover = payload.filePath || payload.url || ''
  ElMessage.success('封面上传成功')
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadProducts()])
})
</script>
