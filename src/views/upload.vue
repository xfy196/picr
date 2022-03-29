<template>
  <a-card @paste="handlePase" class="container">
    <div class="wrapper">
      <a-spin :spinning="compressLoading" tip="正在压缩中">
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
      </a-spin>
      <div v-if="config.id" class="repo__container">
        <div>
          <span>
            仓库:
            <a-tag color="blue">{{ config.selectedRepos }}</a-tag>
          </span>
          <span>
            分支:
            <a-tag color="blue">{{ config.selectedBranch }}</a-tag>
          </span>
          <span>
            目录:
            <a-tag color="blue">{{ handleSelectedDir() }}</a-tag>
          </span>
        </div>
        <div v-if="imgList.length" class="upload__count">
          {{ upadlodedCount }} / {{ imgList.length }}
        </div>
      </div>
      <div v-if="imgList.length" class="upload__list">
        <ul class="list__wrap">
          <li v-for="img in imgList" :key="img.id" class="upload__list-item">
            <div class="img__box">
              <img :src="img.compressFile.base64" alt="" />
            </div>
            <div class="right__info">
              <div class="top">
                <a-tooltip>
                  <template #title>
                    {{ img.isRename ? img.rename : img.filePrefixName
                    }}{{ img.fileSubfixName }}
                  </template>
                  <span class="filename">
                    {{ img.isRename ? img.rename : img.filePrefixName
                    }}{{ img.fileSubfixName }}
                  </span>
                </a-tooltip>

                <div class="img__info">
                  <span>
                    <del>{{ img.compressFile.origin.size }}KB</del>
                  </span>
                  <span>{{ img.compressFile.fileLen }}KB</span>
                  <span>{{
                    useDateFormat(img.uploadDate, "YYYY-MM-DD HH:mm:ss").value
                  }}</span>
                </div>
              </div>
              <div class="bottom">
                <a-checkbox
                  @change="onHashNameChange(img)"
                  v-model:checked="img.isHash"
                  >哈希化</a-checkbox
                >
                <a-checkbox
                  @change="onRename(img)"
                  v-model:checked="img.isRename"
                  >重命名</a-checkbox
                >
                <a-input
                  v-if="img.isRename"
                  size="small"
                  style="max-width: 240px"
                  allow-clear
                  v-model:value="img.rename"
                  placeholder="请输入重新修改的文件名"
                >
                  <template #addonAfter>
                    <DeleteOutlined @click.stop="onDeleteRename(img)" />
                  </template>
                </a-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <a-row justify="end">
        <a-col :span="2">
          <a-button style="width: 100%" @click="onBtnUpload" type="primary"
            >上传</a-button
          >
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>
<script setup>
import { InboxOutlined } from "@ant-design/icons-vue";
import { ref } from "vue-demi";
import { message } from "ant-design-vue";
import lrz from "lrz";
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { useDateFormat } from "@vueuse/core";
const userStore = useUserStore();

const upadlodedCount = ref(0);

const { config } = storeToRefs(userStore);

const uploadRef = ref(null);

const compressLoading = ref(false);

const imgList = ref([]);

const handleSelectedDir = () => {
  return config.value.dirMode === 4
    ? config.value.selectedDirList.join("/")
    : config.value.selectedDir;
};

const handleUpload = async ({ file }) => {
  try {
    compressLoading.value = true;
    let filePrefixName = getFilePrefixName(file.name);
    let fileSubfixName = getFileSubfixName(file.name);
    const compressFileRes = await lrz(file);
    imgList.value.push({
      id: uuidv4(),
      isHash: true,
      isRename: false,
      rename: "xxx",
      fileSubfixName,
      filePrefixName,
      uploadDate: Date.now(),
      compressFile: compressFileRes,
    });
  } catch (error) {
    console.log(error);
  } finally {
    compressLoading.value = false;
  }
};

// 点击上传按钮
const onBtnUpload = () => {
  console.log(imgList.value);
};

const getFilePrefixName = (filename) => {
  let fileNameLastIndex = filename.lastIndexOf(".");
  let filePrefixName = filename.substring(0, fileNameLastIndex);
  return filePrefixName;
};

const getFileSubfixName = (filename, isHash = true) => {
  // 生成上传的文件名字
  let fileNameLastIndex = filename.lastIndexOf(".");
  return isHash
    ? "." +
        CryptoJS.SHA256(Date.now().toString()).toString().substr(0, 16) +
        filename.substring(fileNameLastIndex, filename.length)
    : filename.substring(fileNameLastIndex, filename.length);
};
// 是否hash变化
const onHashNameChange = (data) => {
  data.fileSubfixName = getFileSubfixName(
    data.compressFile.origin.name,
    data.isHash
  );
};

// 重命名事件
const onRename = (data) => {};

const onDeleteRename = (data) => {
  data.isRename = false;
};

const handlePase = (event) => {
  const items = (event.clipboardData || window.clipboardData).items;
  let file = null;

  if (!items || items.length === 0) {
    message.error({
      content: "当前浏览器不支持本地",
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
      content: "粘贴内容非图片",
    });
    return;
  }
  uploadRef.value.customRequest(file);
};
</script>
<style lang="scss">
.container {
  height: 100%;
  .wrapper {
    margin: 0 auto;
    max-width: 888px;
    .ant-upload {
      height: 300px;
    }
    .repo__container {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
    }
    .upload__list {
      border: 1px solid #ccc;
      padding: 8px 12px;
      box-sizing: border-box;
      margin-top: 12px;
      margin-bottom: 12px;
      border-radius: 4px;
      .upload__list-item {
        height: 68px;
        border: 1px solid #ccc;
        margin-top: 12px;
        border-radius: 4px;
        padding: 4px 8px;
        box-sizing: border-box;
        display: flex;
        &:first-of-type {
          margin-top: 0;
        }
        .img__box {
          width: 56px;
          height: 56px;
          border: 1px solid #ccc;
          border-radius: 4px;
          overflow: hidden;
          box-sizing: border-box;
          margin-right: 12px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right__info {
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-evenly;
          .top,
          .bottom {
            display: flex;
          }
          .top {
            justify-content: space-between;
            color: #50505c;
            .filename {
              display: inline-block;
              max-width: 240px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .img__info {
              span {
                padding: 2px 4px;
                background: #e6e6e6;
                margin: 0 6px;
                border-radius: 4px;
                font-size: 12px;
                color: #50505c;
                &:nth-of-type(2) {
                  color: #228eff;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>