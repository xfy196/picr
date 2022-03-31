<template>
  <a-layout-content class="layout__container">
    <!-- <router-view /> -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component
          :is="Component"
          :key="route.name"
          v-if="route.meta.keepAlive"
        />
      </keep-alive>
      <component
        :is="Component"
        :key="route.name"
        v-if="!route.meta.keepAlive"
      />
    </router-view>
  </a-layout-content>
</template>
<script setup>
import {useRoute} from "vue-router"
const route = useRoute()
</script>
<style lang="scss" scoped>
.layout__container{
  height: calc(100vh - 64px)
}
</style>
