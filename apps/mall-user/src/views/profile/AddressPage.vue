<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { deleteAddress, listAddresses, saveAddress, setDefaultAddress } from '@mall-user/api/modules/account';
import type { UserAddress } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const sessionStore = useMallUserSessionStore();
const addresses = ref<UserAddress[]>([]);
const dialogVisible = ref(false);
const form = reactive<UserAddress>({ receiverName: '', receiverPhone: '', detailAddress: '', addressLabel: '', province: '', city: '', region: '', defaultAddress: 0 });

async function loadAddresses() {
  const token = String((sessionStore as any).userToken || '');
  if (!token) return;
  addresses.value = await listAddresses(token);
}

function editAddress(item?: UserAddress) {
  Object.assign(form, item || { receiverName: '', receiverPhone: '', detailAddress: '', addressLabel: '', province: '', city: '', region: '', defaultAddress: 0, addressId: undefined });
  dialogVisible.value = true;
}

async function submitAddress() {
  const token = String((sessionStore as any).userToken || '');
  if (!token) return;
  await saveAddress(token, { ...form, province: form.province || '', city: form.city || '' });
  ElMessage.success('地址已保存');
  dialogVisible.value = false;
  await loadAddresses();
}

async function removeAddress(id?: string) {
  const token = String((sessionStore as any).userToken || '');
  if (!token || !id) return;
  await deleteAddress(token, id);
  await loadAddresses();
}

async function markDefault(id?: string) {
  const token = String((sessionStore as any).userToken || '');
  if (!token || !id) return;
  await setDefaultAddress(token, id);
  await loadAddresses();
}

onMounted(loadAddresses);
</script>

<template>
  <div class="address-page">
    <div class="section-title"><h3>地址管理</h3><el-button type="primary" @click="editAddress()">新增地址</el-button></div>
    <section class="address-page__grid">
      <article v-for="item in addresses" :key="item.addressId" class="mall-panel address-page__card">
        <div class="section-title"><h3>{{ item.receiverName }}</h3><el-tag v-if="item.defaultAddress === 1" type="success">默认</el-tag></div>
        <p>{{ item.receiverPhone }}</p>
        <p class="dimmed">{{ item.fullAddress || item.detailAddress }}</p>
        <div class="address-page__actions"><el-button link @click="editAddress(item)">编辑</el-button><el-button link @click="markDefault(item.addressId)">设为默认</el-button><el-button link type="danger" @click="removeAddress(item.addressId)">删除</el-button></div>
      </article>
    </section>
    <el-dialog v-model="dialogVisible" title="编辑地址" width="640px">
      <el-form label-position="top">
        <el-form-item label="收货人"><el-input v-model="form.receiverName" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.receiverPhone" /></el-form-item>
        <el-form-item label="省"><el-input v-model="form.province" /></el-form-item>
        <el-form-item label="市"><el-input v-model="form.city" /></el-form-item>
        <el-form-item label="区"><el-input v-model="form.region" /></el-form-item>
        <el-form-item label="详细地址"><el-input v-model="form.detailAddress" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="form.addressLabel" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitAddress">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped>
.address-page__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.address-page__card { padding: 22px; }
.address-page__actions { display: flex; gap: 10px; }
</style>

