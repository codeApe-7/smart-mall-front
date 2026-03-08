<template>
  <dl class="kv-grid">
    <template v-for="entry in entries" :key="entry.key">
      <dt>{{ entry.label }}</dt>
      <dd>{{ formatValue(entry.value) }}</dd>
    </template>
  </dl>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDateTime } from '@shared/utils/format'

const props = defineProps<{ model: Record<string, any> | null | undefined; labels?: Record<string, string> }>()

const entries = computed(() =>
  Object.entries(props.model ?? {}).map(([key, value]) => ({
    key,
    label: props.labels?.[key] ?? key,
    value,
  })),
)

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '--'
  if (Array.isArray(value)) return value.join('，') || '--'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  if (String(value).includes('GMT') || String(value).includes('T')) return formatDateTime(value as string)
  return String(value)
}
</script>

<style scoped>
.kv-grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 20px; margin:0; }
dt { color: var(--admin-muted); font-size: 13px; }
dd { margin: 6px 0 0; padding: 10px 12px; border-radius: 14px; background: rgba(255,255,255,.04); white-space: pre-wrap; word-break: break-all; }
</style>
