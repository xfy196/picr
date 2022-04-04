<template>
  <a-layout-content class="layout__container">
    <!-- <router-view /> -->
    <router-view v-slot="{ Component }">
      <keep-alive v-if="route.meta.keepAlive">
        <transition name="fade">
          <component :is="Component" :key="route.name" />
        </transition>
      </keep-alive>
      <template v-else>
        <transition name="fade">
          <component :is="Component" :key="route.name" />
        </transition>
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
  .fade-enter-active,
  .fade-leave-active {
    transition: all 300ms cubic-bezier(0.55, 0, 0.1, 1);
    position: absolute;
    backface-visibility: hidden;
    opacity: 1;
  }
  .fade-enter-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .fade-leave-active {
    opacity: 0;
    transform: translate3d(-3%, 0, 0);
  }
}
</style>
