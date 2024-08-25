<template>
  <a-card @paste="handlePase" class="container">
    <uploadLeft v-if="uploadImgList.length" />
    <div :class="{ 'page-upload-right': uploadImgList.length }" class="wrapper">
      <a-spin :spinning="compressLoading" tip="正在压缩中">
        <a-upload-dragger
          :beforeUpload="handleBeforeUpload"
          :accept="mimeImg"
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
      <div class="repo__container">
        <div v-if="config.id">
          <span>
            仓库:
            <a-tag color="blue">{{ config.selectedRepo }}</a-tag>
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
          已上传 {{ upadlodedCount }} / {{ imgList.length }}
        </div>
      </div>
      <div v-if="imgList.length" class="upload__list">
        <ul class="list__wrap">
          <li
            v-for="(img, index) in imgList"
            :key="img.id"
            class="upload__list-item"
          >
            <div class="upload__icon" :class="{ success: img.isUpload }">
              <CloudUploadOutlined
                v-if="img.isUpload === 'no'"
                rotate="-45"
                :style="{ color: 'white' }"
              />
              <LoadingOutlined v-else-if="img.isUpload === 'loading'" />
              <CheckOutlined v-else rotate="-45" />
            </div>
            <a-image class="img__box" :src="img.compressFile.base64" />
            <div class="right__info">
              <div class="top">
                <a-tooltip>
                  <template #title>
                    {{ getFileName(img) }}
                  </template>
                  <span class="filename">
                    {{ getFileName(img) }}
                  </span>
                </a-tooltip>

                <div class="img__info">
                  <span>
                    <del>{{ getFileSize(img.compressFile.origin.size) }}M</del>
                  </span>
                  <span>{{ getFileSize(img.compressFile.fileLen) }}M</span>
                  <span>
                    {{
                      useDateFormat(img.uploadDate, "YYYY-MM-DD HH:mm:ss").value
                    }}
                  </span>
                </div>
              </div>
              <div class="bottom">
                <div v-show="img.isUpload === 'no'" class="rename-box">
                  <div class="hash__rename">
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
                      @blur="handleRenameBlur(index)"
                      v-model:value="img.rename"
                      placeholder="请输入重新修改的文件名"
                    >
                      <template #addonAfter>
                        <DeleteOutlined @click.stop="onDeleteRename(img)" />
                      </template>
                    </a-input>
                  </div>
                  <div>
                    <DeleteOutlined
                      class="close__icon"
                      @click.stop="onDeleteImg(index)"
                    />
                  </div>
                </div>
                <div
                  v-show="img.isUpload === 'yes'"
                  class="copy-external-link-box"
                >
                  <div class="markdown__icon-box">
                    <a-tooltip>
                      <template #title> 点击转换markdown格式外链 </template>
                      <Icon
                        @click.stop="handleToMarkdown(index)"
                        class="markdown__icon"
                        :component="
                          !img.isMarkdown ? MarkdownIcon : MarkdownIconActive
                        "
                      />
                    </a-tooltip>
                  </div>
                  <div class="copy__btn--box">
                    <a-tooltip>
                      <template #title> 点击复制GitHub外链 </template>
                      <span
                        @click.stop="handleCopyExternalLinks('github', index)"
                        class="copy__btn"
                        >GitHub</span
                      >
                    </a-tooltip>
                    <a-tooltip>
                      <template #title> 点击复制CDN外链 </template>
                      <span
                        @click.stop="handleCopyExternalLinks('cdn', index)"
                        class="copy__btn"
                        >CDN</span
                      >
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <a-row justify="end">
        <a-col :span="4">
          <a-space class="btns-box">
            <a-button @click="onReset">重置</a-button>
            <a-button
              :loading="uploadBtnLoading"
              @click="onBtnUpload"
              type="primary"
              >上传</a-button
            >
          </a-space>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>
<script setup>
import {
  InboxOutlined,
  CloudUploadOutlined,
  CheckOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import MarkdownIcon from "@/assets/imgs/markdown.svg";
import MarkdownIconActive from "@/assets/imgs/markdown-active.svg";
import { ref } from "vue";
import { message } from "ant-design-vue";
import lrz from "lrz";
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useDateFormat } from "@vueuse/core";
import { requestUpload } from "../apis/github";
import Icon from "@ant-design/icons-vue";
import { useImgBedStore } from "../store/img-bed";
import { mimeImg } from "../config/index";
import {
  getFilePrefixName,
  getFileSubfixName,
  getFileName,
  getFileSize
} from "../utils/useFile";
import {
  useCopyExternalLinks,
  getGithubRawUrl,
  getJsdelivrRawUrl,
} from "../utils/useCopExternalLinks";
import uploadLeft from "../components/uploadLeft/index.vue";

const userStore = useUserStore();

const uploadBtnLoading = ref(false);

const upadlodedCount = ref(0);

const { config, setting } = storeToRefs(userStore);

const uploadRef = ref(null);

const compressLoading = ref(false);

const imgList = ref([]);

const imgBedStore = useImgBedStore();

const { uploadImgList } = storeToRefs(imgBedStore);

const handleSelectedDir = () => {
  return config.value.dirMode === 4
    ? config.value.selectedDirList.join("/")
    : config.value.selectedDir;
};

const handleUpload = async ({ file }) => {
  try {
    let filePrefixName = getFilePrefixName(file.name);
    let fileSubfixName = getFileSubfixName(file.name, setting.value.isHash);
    compressLoading.value = true;
    let compressFileRes = await lrz(file, {
      quality: setting.value.compressValue
    });
    if (
      compressFileRes.fileLen > 1024 * 1024 * 10 ||
      file.size > 1024 * 1024 * 10
    ) {
      message.warning({
        content: "文件不能超过10M",
      });
      return;
    }
    imgList.value.push({
      id: uuidv4(),
      isHash: setting.value.isHash,
      isRename: false,
      rename: filePrefixName,
      fileSubfixName,
      filePrefixName,
      uploadDate: Date.now(),
      isUpload: "no",
      compressFile: compressFileRes,
      isMarkdown: setting.value.isMarkdown,
      githubUrl: "",
      jsdelivrUrl: "",
    });
  } catch (error) {
    console.log(error);
  } finally {
    compressLoading.value = false;
  }
};

const onReset = () => {
  imgList.value = [];
};

// 点击上传按钮
const onBtnUpload = async () => {
  if (upadlodedCount.value === imgList.value.length) {
    message.info({
      content: "已全部上上传成功，无需重复上传",
    });
    return;
  }
  uploadBtnLoading.value = true;
  for (let i = 0; i < imgList.value.length; i++) {
    if (imgList.value[i].isUpload === "yes") {
      continue;
    }
    let filename = getFileName(imgList.value[i]);

    try {
      imgList.value[i].isUpload = "loading";
      let res = await requestUpload({
        login: config.value.login,
        repo: config.value.selectedRepo,
        branch: config.value.selectedBranch,
        dirs:
          config.value.dirMode === 4
            ? config.value.selectedDirList.join("/")
            : config.value.selectedDir,
        filename,
        message: `上传了${filename}文件，来源于${
          location.origin + location.pathname
        }`,
        content: imgList.value[i].compressFile.base64.split(",")[1],
      });
      message.success({
        content: `${filename}文件上传成功`,
      });
      imgList.value[i].sha = res.content.sha;
      imgList.value[i].isUpload = "yes";
      imgList.value[i].githubUrl = getGithubRawUrl(filename);
      imgList.value[i].jsdelivrUrl = getJsdelivrRawUrl(filename);
      imgList.value[i].name = res.content.name
      imgList.value[i].path = res.content.path
      upadlodedCount.value++;
      // 每一次的上传成功我需要更新数据结构通将他保存在本地
      imgBedStore.setUploadImgList(imgList.value[i]);
    } catch (error) {}
  }
  uploadBtnLoading.value = false;
};

// 删除上传文件的列表
const onDeleteImg = (index) => {
  imgList.value.splice(index, 1);
};

const handleRenameBlur = (index) => {
  imgList.value[index].filePrefixName = imgList.value[index].rename;
  imgList.value[index].isRename = false;
};

const handleToMarkdown = (index) => {
  imgList.value[index].isMarkdown = !imgList.value[index].isMarkdown;
};

// 点击复制外链
const handleCopyExternalLinks = (mode = "github", index) => {
  useCopyExternalLinks(mode, imgList.value[index]);
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
  uploadRef.value.customRequest({ file });
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  :deep(.ant-card-body) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 100%;
    .wrapper {
      margin: 0 auto;
      min-width: 555px;
      flex: auto;
      overflow: auto;
      &.page-upload-right {
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0px 0px 5.3px rgba(0, 0, 0, 0.032),
          0px 0px 17.9px rgba(0, 0, 0, 0.048), 0px 0px 80px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        @media screen and (max-width: 888px) {
          padding: 0;
          box-shadow: none;
          border-radius: 0;
        }
      }

      .ant-upload {
        height: 300px;
        border-radius: 4px;
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
          position: relative;
          overflow: hidden;
          .upload__icon {
            box-sizing: border-box;
            color: #fff;
            position: absolute;
            right: -17px;
            top: -7px;
            width: 46px;
            height: 26px;
            text-align: center;
            transform: rotate(45deg);
            box-shadow: 0 1px 1px #b3b3b3;
            background: #e6a23c;
            position: absolute;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 3px;
            &.success {
              background-color: #87d068;
            }
          }
          &:first-of-type {
            margin-top: 0;
          }
          .img__box {
            width: 56px;
            height: 56px;
            border: 1px solid #ccc;
            flex-shrink: 0;
            border-radius: 4px;
            overflow: hidden;
            box-sizing: border-box;
            margin-right: 12px;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
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
              align-items: center;
            }
            .bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rename-box {
                flex: 1;
                display: flex;
                justify-content: space-between;
                .hash__rename {
                  display: flex;
                  flex: 1;
                }
              }
              .copy-external-link-box {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .markdown__icon {
                  display: flex;
                  align-items: center;
                  svg {
                    font-size: 24px;
                  }
                }
                .copy__btn--box {
                  .copy__btn {
                    font-size: 12px;
                    border: 1px solid #50505c;
                    border-radius: 4px;
                    padding: 2px;
                    color: #50505c;
                    cursor: pointer;
                    &:hover {
                      background: #50505c;
                      color: #ffffff;
                    }
                    &:first-of-type {
                      margin-right: 8px;
                    }
                  }
                }
              }
            }
            .top {
              justify-content: space-between;
              color: #50505c;
              .filename {
                flex: 1;
                display: inline-block;
                min-width: 120px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              .img__info {
                margin-right: 12px;
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
  :deep(.btns-box) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .ant-space-item {
      flex: 1;
      button {
        width: 100%;
      }
    }
  }
}
</style>
