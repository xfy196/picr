<template>
  <div class="upload-page-container">
    <ul class="imgList">
      <a-image-preview-group>
        <li class="imgItem" v-for="(img, index) in imgList" :key="img.id">
          <div class="more" :ref="getMoreRefs.bind(null, index)">
            <a-dropdown-button
              :getPopupContainer="moreDropdownFunc.bind(null, index)"
              trigger="click"
              class="more__btn"
              @click="handleButtonClick"
            >
              <template #overlay>
                <a-menu @click="handleImgMenuClick">
                  <a-menu-item :key="`delete-${index}`"> 删除 </a-menu-item>
                  <a-menu-item :key="`rename-${index}`"> 重命名 </a-menu-item>
                  <a-menu-item :key="`attribute-${index}`"> 属性 </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown-button>
          </div>

          <a-image class="img" :src="img.compressFile.base64" />
          <template v-if="renameIndex !== index">
            <div class="filename">
              <a-tooltip>
                <template #title>
                  {{ getFileName(img) }}
                </template>
                {{ getFileName(img) }}
              </a-tooltip>
            </div>
          </template>
          <div class="rename__input" v-show="renameIndex === index">
            <a-input
              :ref="pushRenameRefs"
              @blur="handleRenameBlur(index)"
              v-model:value="img.rename"
              placeholder="请输入新的名字"
            />
          </div>
          <div class="copy-external-link-box">
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
                <template #title> 点击下载 </template>
                <CloudDownloadOutlined
                  @click.stop="handleDownLoadImg(index)"
                  :style="{ fontSize: '14px' }"
                  class="copy__btn"
                />
              </a-tooltip>
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
          <a-modal
            centered
            :footer="null"
            v-model:visible="attrVisible"
            title="图片属性"
          >
            <div>
              图片名称：<strong>{{ getFileName(imgList[index]) }}</strong>
            </div>
            <div>
              图片大小：<strong
                >{{
                  getFileSize(imgList[index].compressFile.fileLen)
                }}
                KB</strong
              >
            </div>
          </a-modal>
        </li>
      </a-image-preview-group>
    </ul>
  </div>
</template>
<script setup>
import MarkdownIcon from "@/assets/imgs/markdown.svg";
import MarkdownIconActive from "@/assets/imgs/markdown-active.svg";
import { useImgBedStore } from "@/store/img-bed";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import Icon, { CloudDownloadOutlined } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import { getFileName, getFileSize } from "@/utils/useFile";
import { useCopyExternalLinks } from "@/utils/useCopExternalLinks";
import { nextTick, ref, createVNode } from "vue";
import { requestUpload } from "@/apis/github";
import { useUserStore } from "@/store/user";
import { githubRaw, jsdelivrRaw } from "@/config/index";
import path from "path-browserify";
import { download } from "../../utils";
const imgBedStore = useImgBedStore();

const userStore = useUserStore();

const { config } = storeToRefs(userStore);

const renameIndex = ref(-1);

const renameRefs = ref([]);

const attrVisible = ref(false);

const moreRefs = ref([]);

const { imgList } = storeToRefs(imgBedStore);

const handleToMarkdown = (index) => {
  imgList.value[index].isMarkdown = !imgList.value[index].isMarkdown;
};

// 点击复制外链
const handleCopyExternalLinks = (mode = "github", index) => {
  useCopyExternalLinks(mode, imgList.value[index]);
};

// 图片的删除操作
const handleImgMenuClick = async ({ key }) => {
  let [attr, index] = key.split("-");
  switch (attr) {
    case "delete":
      // `/repos/${body.login}/${body.repo}/contents/${body.dirs}/${body.filename}`

      const img = await imgBedStore.deleteImage(
        {
          login: config.value.login,
          repo: config.value.selectedRepo,
          path: imgList.value[index].path,
          filename: imgList.value[index].name,
          data: {
            message: `delete picture via PicR(${
              location.origin + location.pathname
            })`,
            owner: config.value.login,
            path: imgList.value[index].path,
            repo: config.value.selectedRepo,
            sha: imgList.value[index].sha,
          },
        },
        index
      );
      message.success({
        content: `${getFileName(img)}文件删除成功`,
      });
      break;
    case "rename":
      renameIndex.value = Number(index);
      nextTick(() => {
        renameRefs.value[Number(index)].focus();
      });
      break;
    case "attribute":
      attrVisible.value = true;
      break;
  }
};

const moreDropdownFunc = (index) => moreRefs.value[index];

const getMoreRefs = (index, el) => {
  moreRefs.value[index] = el;
};

/**
 * @description: 点击下载图片
 * @author 小小荧 <xfy196@outlook.com>
 * @param {number} [index]
 * @return {void}
 * @date 2023-08-17 20:02
 */
const handleDownLoadImg = (index) => {
  const imgData = imgList.value[index];
  download(
    imgData.jsdelivrUrl,
    imgData.filePrefixName + imgData.fileSubfixName
  );
  console.log(
    "🚀 ~ file: index.vue:183 ~ handleDownLoadImg ~ imgData:",
    imgData
  );
};

// 重命名的输入框失焦
const handleRenameBlur = (index) => {
  let filename = getFileName(imgList.value[index], true);

  Modal.confirm({
    title: "重命名提示",
    icon: createVNode(ExclamationCircleOutlined),
    content: `确认重命名为${filename}?`,
    okText: "确认",
    cancelText: "取消",
    confirmLoading: true,
    onOk: async () => {
      try {
        // 发送请求
        let res = await requestUpload({
          login: config.value.login,
          repo: config.value.selectedRepo,
          branch: config.value.selectedBranch,
          dirs:
            config.value.dirMode === 4
              ? config.value.selectedDirList.join("/")
              : config.value.selectedDir,
          filename,
          message: `更新了${filename}文件，来源于${
            location.origin + location.pathname
          }`,
          content: imgList.value[index].compressFile.base64.split(",")[1],
          sha: imgList.value[index].sha,
        });
        message.success({
          content: `更新${filename}成功`,
        });
        imgList.value[index].sha = res.content.sha;
        imgList.value[index].filePrefixName = imgList.value[index].rename;
        imgList.value[index].githubUrl = path.join(
          githubRaw,
          `/${config.value.login}/${config.value.selectedRepo}/${
            config.value.selectedBranch
          }/${
            config.value.dirMode === 4
              ? config.value.selectedDirList.join("/")
              : config.value.selectedDir
          }/${filename}`
        );
        imgList.value[index].jsdelivrUrl = path.join(
          jsdelivrRaw,
          `/${config.value.login}/${config.value.selectedRepo}@${
            config.value.selectedBranch
          }/${
            config.value.dirMode === 4
              ? config.value.selectedDirList.join("/")
              : config.value.selectedDir
          }/${filename}`
        );
        imgBedStore.updateImgList(imgList.value[index], index);
      } catch (error) {
        message.error({
          content: error.message,
        });
      } finally {
        renameIndex.value = -1;
      }
    },
    onCancel: () => {
      renameIndex.value = -1;
    },
  });
};
const pushRenameRefs = (el) => {
  renameRefs.value.push(el);
};
</script>
<style lang="scss" scoped>
.upload-page-container {
  width: 280px;
  height: 100%;
  margin-right: 16px;
  box-shadow: 0px 0px 5.3px rgba(0, 0, 0, 0.032),
    0px 0px 17.9px rgba(0, 0, 0, 0.048), 0px 0px 80px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: auto;
  .imgList {
    display: flex;
    align-items: center;
    flex-direction: column;
    .imgItem {
      width: 220px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.045),
        0px 0px 80px rgba(0, 0, 0, 0.09);
      margin-top: 12px;
      border-radius: 6px;
      padding-bottom: 6px;
      overflow: hidden;
      position: relative;
      :deep(.ant-image) {
        width: 100%;
        height: 240px;
        .img {
          height: 100%;
          object-fit: cover;
        }
      }
      .more {
        position: absolute;
        right: 8px;
        display: none;
        top: 8px;
        z-index: 100;
        :deep(.more__btn) {
          button {
            border-radius: 100%;
          }
        }
      }
      &:hover {
        box-shadow: 0px 0px 5.3px rgba(0, 0, 0, 0.101),
          0px 0px 17.9px rgba(0, 0, 0, 0.149), 0px 0px 80px rgba(0, 0, 0, 0.25);
        .more {
          display: block;
        }
      }
      &:last-of-type {
        margin-bottom: 12px;
      }
      .rename__input {
        padding: 0 6px;
        margin: 6px 0;
      }
      .filename {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 6px;
        margin: 12px 0;
      }
      .copy-external-link-box {
        padding: 0 6px;
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        :deep(.markdown__icon) {
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
  }
}
@media screen and (max-width: 888px) {
  .upload-page-container {
    display: none;
  }
}
</style>
