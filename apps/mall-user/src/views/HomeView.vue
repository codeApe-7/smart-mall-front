<template>
  <section class="hero-panel">
    <div>
      <span class="eyebrow">淘宝式热闹氛围 × SmartMall 智能特色</span>
      <h2>今日会逛街的主场，
        搜索、推荐、比价和导购一起发力。</h2>
      <p>首页将承接商品推荐、智能导购、消息提醒和偏好刷新能力。</p>
      <div class="hero-actions">
        <el-button type="danger" round @click="$router.push('/products')">开始逛</el-button>
        <el-button round @click="$router.push('/assistant')">打开 AI 导购</el-button>
      </div>
    </div>
    <div class="hero-card-grid">
      <article v-for="card in cards" :key="card.title" class="hero-card">
        <span>{{ card.tag }}</span>
        <h3>{{ card.title }}</h3>
        <p>{{ card.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  { tag: '推荐', title: '千人千面橱窗', desc: '对接 /product/recommend 与 /preference/profile。' },
  { tag: '比价', title: '知识库对比', desc: '承接 /product/knowledge/compare 的横向决策。' },
  { tag: '消息', title: '订单通知流', desc: '联动 /message/list 与未读数提醒。' },
]
</script>
