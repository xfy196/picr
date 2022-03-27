<template>
  <a-layout-sider theme="light" v-model:collapsed="collapsed" collapsible>
     <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="light"
      @click="handleMenuClick"
      :inline-collapsed="collapsed"
    >
      <a-menu-item v-for="item in routes" :key="item.path">
        <template #icon>
          <Icon :icon="item.meta.icon"></Icon>
        </template>
        <span>{{item.meta.title}}</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script setup>
import { ref, watch } from "vue";
import {useRouter, useRoute} from "vue-router"
import {Icon} from "../components/Icon"
const collapsed = ref(false);
const route = useRoute()
const router = useRouter()
const selectedKeys = ref([])
let routes = router.getRoutes()
routes = routes.filter((route) => route.path !== "/" )
watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath]
}, {
  immediate: true
})
const handleMenuClick = (item) => {
  router.push(item.key)
}
</script>
<style lang="scss" scoped></style>
