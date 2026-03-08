<template>
  <div class="page-header">
    <div>
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <p class="description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  eyebrow: { type: String, default: 'SMARTMALL CONSOLE' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<style scoped>
.page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.eyebrow { margin:0 0 8px; color: var(--admin-primary); letter-spacing: .22em; font-size: 12px; }
h2 { margin:0; font-size: 28px; }
.description { margin:10px 0 0; color: var(--admin-muted); max-width: 720px; line-height: 1.6; }
.actions { display:flex; gap:12px; align-items:center; }
</style>
