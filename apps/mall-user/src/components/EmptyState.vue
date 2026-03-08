<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">✦</div>
    <h4>{{ title }}</h4>
    <p>{{ description || '暂无数据，稍后再试。' }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: grid;
  place-items: center;
  min-height: 180px;
  text-align: center;
  color: #7d6960;
}

.empty-icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 122, 0, 0.12);
  color: #ff7a00;
  font-size: 24px;
}

h4 {
  margin: 16px 0 8px;
  color: #341f14;
}

p {
  margin: 0;
}
</style>
