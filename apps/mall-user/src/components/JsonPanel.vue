<script setup lang="ts">
defineProps<{
  title?: string
  data: unknown
}>()
</script>

<template>
  <div class="json-panel">
    <p v-if="title" class="json-title">{{ title }}</p>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>

<style scoped lang="scss">
.json-panel {
  padding: 18px;
  border-radius: 20px;
  background: #221710;
  color: #fff8f0;
  overflow: auto;
}

.json-title {
  margin: 0 0 12px;
  color: #ffb57a;
}

pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
}
</style>
