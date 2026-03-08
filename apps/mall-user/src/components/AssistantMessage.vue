<script setup lang="ts">
defineProps<{
  role: 'user' | 'assistant'
  content: string
}>()
</script>

<template>
  <div class="message-row" :class="role">
    <div class="bubble">{{ content }}</div>
  </div>
</template>

<style scoped lang="scss">
.message-row {
  display: flex;
  margin-bottom: 14px;

  &.user {
    justify-content: flex-end;

    .bubble {
      background: linear-gradient(135deg, #ff7a00, #ff4d00);
      color: white;
      border-radius: 22px 22px 8px 22px;
    }
  }

  &.assistant .bubble {
    background: rgba(255, 255, 255, 0.92);
    border-radius: 22px 22px 22px 8px;
    color: #34231a;
  }
}

.bubble {
  max-width: min(640px, 100%);
  padding: 14px 16px;
  box-shadow: 0 16px 42px rgba(62, 38, 21, 0.08);
  line-height: 1.7;
  white-space: pre-wrap;
}
</style>
