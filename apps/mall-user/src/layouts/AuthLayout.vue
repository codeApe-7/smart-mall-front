<template>
  <div class="auth-layout">
    <div class="auth-panel">
      <div class="auth-copy">
        <span>SMARTMALL MARKET</span>
        <h2>像逛淘宝一样顺手，
          但更懂你的下一笔心动。</h2>
        <p>红橙热力主场、AI 智能导购、订单消息一站式闭环。</p>
      </div>
      <div class="auth-form-shell">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
