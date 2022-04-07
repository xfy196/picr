<template>
  <div v-show="isShow" class="site-count" ref="siteCountDom">
    累计访问数:
    <span id="busuanzi_value_site_uv" class="uv"></span>
    浏览次数:
    <span id="busuanzi_value_site_pv" class="pv"></span>
  </div>
</template>
<script setup>
import { ref, nextTick, onMounted } from "vue";
const siteCountDom = ref(null);
// 是否展示统计dom
const isShow = ref(false);

onMounted(() => {
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
  siteCountDom.value.appendChild(script);
  script.onload = function () {
    nextTick(() => {
      isShow.value = true;
    });
  };
});
</script>
<style lang="scss" scoped></style>
