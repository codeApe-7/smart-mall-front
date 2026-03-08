<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserId } from '@shared/utils/session'
import SectionPanel from '@/components/SectionPanel.vue'
import JsonPanel from '@/components/JsonPanel.vue'
import { fetchPreferenceProfile, refreshPreferenceProfile } from '@/api/modules/preference'

const profile = ref<Record<string, unknown> | null>(null)

const load = async () => {
  profile.value = await fetchPreferenceProfile(getUserId())
}

const refresh = async () => {
  profile.value = await refreshPreferenceProfile(getUserId())
}

onMounted(load)
</script>

<template>
  <SectionPanel title="偏好档案" subtitle="展示后端偏好画像，并支持立即刷新。">
    <div class="toolbar" style="margin-bottom: 16px">
      <el-button type="primary" @click="load">加载画像</el-button>
      <el-button @click="refresh">刷新画像</el-button>
    </div>
    <JsonPanel v-if="profile" :data="profile" />
  </SectionPanel>
</template>
