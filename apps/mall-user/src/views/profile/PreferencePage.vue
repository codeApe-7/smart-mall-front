<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getPreferenceProfile, refreshPreference } from '@mall-user/api/modules/preference';
import { formatCurrency } from '@shared/utils/format';
import type { UserPreference } from '@shared/types/mall';
import { useMallUserSessionStore } from '@mall-user/stores/session';

const sessionStore = useMallUserSessionStore();
const profile = ref<UserPreference | null>(null);

async function loadProfile() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  profile.value = await getPreferenceProfile(sessionStore.profile.userId);
}

async function refreshProfile() {
  if (!sessionStore.profile?.userId) {
    return;
  }
  profile.value = await refreshPreference(sessionStore.profile.userId);
  ElMessage.success('偏好画像已刷新');
}

onMounted(loadProfile);
</script>

<template>
  <div v-if="profile" class="preference-page">
    <section class="mall-panel preference-page__summary">
      <div>
        <p class="dimmed">偏好档案 / `/preference/profile`</p>
        <h2>你的购物偏好已经被整理成推荐语义。</h2>
        <el-button type="primary" @click="refreshProfile">刷新画像</el-button>
      </div>
      <div class="preference-page__stats">
        <div>
          <strong>{{ profile.orderCount || 0 }}</strong>
          <span>累计订单</span>
        </div>
        <div>
          <strong>{{ profile.reviewCount || 0 }}</strong>
          <span>累计评价</span>
        </div>
        <div>
          <strong>{{ profile.averageRating || 0 }}</strong>
          <span>平均评分</span>
        </div>
      </div>
    </section>
    <section class="preference-page__grid">
      <article class="mall-panel preference-page__card">
        <div class="section-title"><h3>偏好分类</h3></div>
        <el-tag v-for="item in profile.favoriteCategoryNames || []" :key="item" style="margin-right: 8px">{{ item }}</el-tag>
      </article>
      <article class="mall-panel preference-page__card">
        <div class="section-title"><h3>价格区间</h3></div>
        <p>{{ formatCurrency(profile.minPricePreference) }} - {{ formatCurrency(profile.maxPricePreference) }}</p>
      </article>
      <article class="mall-panel preference-page__card">
        <div class="section-title"><h3>搜索关键词</h3></div>
        <el-tag v-for="item in profile.recentSearchKeywords || []" :key="item" effect="plain" style="margin-right: 8px">{{ item }}</el-tag>
      </article>
      <article class="mall-panel preference-page__card">
        <div class="section-title"><h3>偏好标签</h3></div>
        <el-tag v-for="item in profile.preferenceTags || []" :key="item" type="success" effect="dark" style="margin-right: 8px">{{ item }}</el-tag>
      </article>
    </section>
  </div>
</template>

<style scoped>
.preference-page {
  display: grid;
  gap: 22px;
}
.preference-page__summary {
  display: flex;
  justify-content: space-between;
  padding: 28px;
}
.preference-page__stats {
  display: flex;
  gap: 18px;
}
.preference-page__stats div {
  width: 120px;
  height: 120px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 106, 43, 0.1), rgba(15, 127, 116, 0.1));
}
.preference-page__stats strong {
  font-size: 32px;
}
.preference-page__stats span {
  color: var(--mall-muted);
}
.preference-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.preference-page__card {
  padding: 24px;
}
</style>
