<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DataAnalysis, Goods, Histogram, Management, MessageBox, Setting, TrendCharts, User, Files } from '@element-plus/icons-vue';
import { logout } from '@mall-admin/api/modules/account';
import { useAdminSessionStore } from '@mall-admin/stores/session';

const route = useRoute();
const router = useRouter();
const sessionStore = useAdminSessionStore();

const groups = [
  { title: '总览', items: [{ label: '数据概览', path: '/dashboard', icon: DataAnalysis }] },
  { title: '商品', items: [{ label: '分类管理', path: '/product/category', icon: Goods }, { label: '商品管理', path: '/product/list', icon: Management }] },
  { title: '交易', items: [{ label: '订单管理', path: '/order/list', icon: Histogram }, { label: '退款管理', path: '/refund/list', icon: TrendCharts }, { label: '评价管理', path: '/review/list', icon: MessageBox }] },
  { title: '运营', items: [{ label: '用户管理', path: '/user/list', icon: User }, { label: '消息通知', path: '/notice/list', icon: MessageBox }] },
  { title: 'AI', items: [{ label: 'AI 配置', path: '/ai/config', icon: Setting }, { label: '知识索引', path: '/ai/knowledge', icon: Files }, { label: 'AI 监控', path: '/ai/monitor', icon: TrendCharts }] },
  { title: '权限', items: [{ label: '账号管理', path: '/authority/account', icon: User }, { label: '角色管理', path: '/authority/role', icon: User }, { label: '审计日志', path: '/audit/list', icon: Files }] }
];

const adminName = computed(() => sessionStore.profile?.nickname || sessionStore.profile?.accountName || '管理员');

async function handleLogout() {
  await logout().catch(() => undefined);
  sessionStore.clearSession();
  router.push('/login');
}
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-layout__aside admin-panel">
      <div class="admin-layout__brand">
        <p>SMARTMALL OPS</p>
        <h1>星淘控台</h1>
      </div>
      <div v-for="group in groups" :key="group.title" class="admin-layout__group">
        <small>{{ group.title }}</small>
        <RouterLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          class="admin-layout__link"
          :class="{ 'is-active': route.path === item.path }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </aside>
    <section class="admin-layout__main">
      <header class="admin-layout__top admin-panel">
        <div>
          <h2>{{ adminName }}</h2>
          <p>登录态由 `adminToken` 驱动，菜单权限以后端 `permissionCodes` 为准。</p>
        </div>
        <el-button plain @click="handleLogout">退出登录</el-button>
      </header>
      <main>
        <RouterView />
      </main>
    </section>
  </div>
</template>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  min-height: 100vh;
  padding: 20px;
}
.admin-layout__aside {
  padding: 22px;
}
.admin-layout__brand p {
  margin: 0;
  letter-spacing: 0.22em;
  color: var(--admin-primary);
}
.admin-layout__brand h1 {
  margin: 8px 0 24px;
}
.admin-layout__group {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}
.admin-layout__group small {
  color: var(--admin-muted);
}
.admin-layout__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  color: var(--admin-muted);
}
.admin-layout__link.is-active {
  background: rgba(217, 93, 37, 0.12);
  color: var(--admin-text);
  font-weight: 700;
}
.admin-layout__main {
  display: grid;
  gap: 20px;
}
.admin-layout__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
}
.admin-layout__top h2 {
  margin: 0 0 8px;
}
.admin-layout__top p {
  margin: 0;
  color: var(--admin-muted);
}
</style>
