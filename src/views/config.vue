<template>
  <a-card class="container">
    <div class="label">个性设置：</div>
    <div class="config">
      <a-switch v-model:checked="setting.isHash" :disabled="disabled" />
      <span class="config__txt">上传时默认给图片加上哈希码</span>
    </div>
    <div class="config">
      <a-switch v-model:checked="setting.isMarkdown" :disabled="disabled" />
      <span class="config__txt"> 上传后默认开启 Markdown 格式的外链</span>
    </div>
    <div class="label">压缩配置：</div>
    <div class="config">
      <a-input-number
        step="0.1"
        v-model:value="setting.compressValue"
        :min="0"
        :max="1"
      />

      <span class="config__txt">图片压缩质量</span>
    </div>
  </a-card>
</template>
<script setup>
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { setting } = storeToRefs(userStore);
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  .label {
    margin-bottom: 12px;
  }
  .config {
    margin-bottom: 12px;
    .config__txt {
      margin-left: 6px;
    }
  }
}
</style>