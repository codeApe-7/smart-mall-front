<template>
  <section class="workbench-panel">
    <header v-if="title || $slots.actions" class="panel-head">
      <div>
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="panel-actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="panel-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})
</script>

<style scoped>
.workbench-panel { padding: 22px; border-radius: 24px; border: 1px solid var(--admin-border); background: var(--admin-surface); box-shadow: var(--admin-shadow); }
.panel-head { display:flex; justify-content:space-between; gap:16px; margin-bottom:18px; }
.panel-head h3 { margin:0 0 8px; font-size:20px; }
.panel-head p { margin:0; color: var(--admin-muted); }
.panel-body { display:grid; gap:16px; }
.panel-actions { display:flex; gap:12px; align-items:center; }
</style>
