<template>
  <a-card @paste="handlePase" class="container">
    <a-upload-dragger
      ref="uploadRef"
      name="file"
      :multiple="true"
      :customRequest="handleUpload"
      :showUploadList="false"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">拖拽、粘贴、或者点击此处上传</p>
    </a-upload-dragger>
  </a-card>
</template>
<script setup>
import { InboxOutlined } from "@ant-design/icons-vue";
import { ref } from "vue-demi";
import {message} from "ant-design-vue"
const uploadRef = ref(null);
const handleUpload = (file) => {
  console.log(file);
};
const handlePase = (event) => {
  const items = (event.clipboardData || window.clipboardData).items;
  let file = null;

  if (!items || items.length === 0) {
    message.error({
        content: '当前浏览器不支持本地'
    });
    return;
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      file = items[i].getAsFile();
      break;
    }
  }
  if (!file) {
    message.error({
        content: '粘贴内容非图片'
    });
    return;
  }
  uploadRef.value.customRequest(file)
};
</script>
<style lang="scss">
.container {
  height: 100%;
  .ant-upload {
    margin: 0 auto;
    max-width: 888px;
    height: 300px;
    border-radius: 16px;
  }
}
</style>