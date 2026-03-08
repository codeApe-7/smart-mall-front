<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  accent?: string
}>()
</script>

<template>
  <section class="section-panel" :style="accent ? { '--panel-accent': accent } : undefined">
    <header class="section-head">
      <div>
        <p class="section-kicker">SmartMall</p>
        <h3>{{ title }}</h3>
        <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
      </div>
      <slot name="extra" />
    </header>
    <div class="section-body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-panel {
  --panel-accent: #ff7a00;
  background: rgba(255, 255, 255, 0.86);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 22px 80px rgba(24, 18, 14, 0.08);
  padding: 24px;
  backdrop-filter: blur(18px);
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  h3 {
    margin: 4px 0 8px;
    font: 600 24px/1.2 'Microsoft YaHei UI', sans-serif;
    color: #2f2118;
  }
}

.section-kicker {
  margin: 0;
  color: var(--panel-accent);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-subtitle {
  margin: 0;
  color: #7a675f;
  line-height: 1.6;
}
</style>
