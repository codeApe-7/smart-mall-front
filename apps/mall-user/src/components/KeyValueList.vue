<script setup lang="ts">
defineProps<{
  data: Record<string, unknown>
}>()
</script>

<template>
  <dl class="kv-grid">
    <template v-for="(value, key) in data" :key="String(key)">
      <dt>{{ key }}</dt>
      <dd>{{ Array.isArray(value) ? value.join('、') : value ?? '--' }}</dd>
    </template>
  </dl>
</template>

<style scoped lang="scss">
.kv-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 20px;
  margin: 0;

  dt {
    font-size: 12px;
    color: #8b776e;
  }

  dd {
    margin: 4px 0 0;
    font-weight: 500;
    color: #34231a;
    line-height: 1.5;
  }
}
</style>
