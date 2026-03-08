<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  hint?: string;
}>();
</script>

<template>
  <article class="metric-card admin-panel">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
    <small>{{ hint }}</small>
  </article>
</template>

<style scoped>
.metric-card {
  padding: 22px;
}
.metric-card span,
.metric-card small {
  color: var(--admin-muted);
}
.metric-card strong {
  display: block;
  margin: 10px 0;
  font-size: 34px;
}
</style>
