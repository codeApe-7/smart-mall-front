<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="state-block mall-panel">
    <h4>{{ title }}</h4>
    <p>{{ description || '稍后再试，或检查后端服务状态。' }}</p>
    <slot />
  </div>
</template>

<style scoped>
.state-block {
  padding: 28px;
  text-align: center;
}
.state-block h4 {
  margin: 0 0 8px;
  font-size: 20px;
}
.state-block p {
  margin: 0;
  color: var(--mall-muted);
}
</style>
