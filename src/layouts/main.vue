<template>
  <a-layout-content class="layout__container">
    <router-view v-slot="{ Component }">
      <keep-alive v-if="route.meta.keepAlive">
        <Suspense>
          <template #default>
            <component :is="Component" :key="route.path" />
          </template>
          <template #fallback>Loading ...</template>
        </Suspense>
      </keep-alive>
      <template v-else>
        <Suspense>
          <template #default>
            <component :is="Component" :key="route.path" />
          </template>
          <template #fallback>Loading ...</template>
        </Suspense>
      </template>
    </router-view>
  </a-layout-content>
</template>
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<style lang="scss" scoped>
.layout__container {
  height: calc(100vh - 64px);
  overflow: hidden;
}
</style>
