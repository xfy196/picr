<template>
  <a-layout-content class="layout__container">
    <router-view v-slot="{ Component }">
      <keep-alive v-if="route.meta.keepAlive">
        <Suspense>
          <template #default>
            <transition name="fade">
              <component :is="Component" :key="route.name" />
            </transition>
          </template>
          <template #fallback>Loading ...</template>
        </Suspense>
      </keep-alive>
      <template v-else>
        <Suspense>
          <template #default>
            <transition name="fade">
              <component :is="Component" :key="route.name" />
            </transition>
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
  .fade-leave-active,
  .fade-enter-active {
    transition: all 0.5s;
  }

  .fade-enter {
    opacity: 0;
    transform: translateX(-30px);
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
