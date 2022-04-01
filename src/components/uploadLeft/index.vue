<template>
  <div class="upload-page-container">
    <ul class="imgList">
      <li class="imgItem" v-for="(img, index) in uploadImgList" :key="img.id">
        <div class="more">
          <a-dropdown-button
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
        <img class="img" :src="img.compressFile.base64" alt="" />
        <a-tooltip>
          <template #title>
            {{ getFileName(img) }}
          </template>
          <div class="filename">{{ getFileName(img) }}</div>
        </a-tooltip>
        <div class="copy-external-link-box">
          <div class="markdown__icon-box">
            <a-tooltip>
              <template #title> 点击转换markdown格式外链 </template>
              <Icon
                @click.stop="handleToMarkdown(index)"
                class="markdown__icon"
                :component="!img.isMarkdown ? MarkdownIcon : MarkdownIconActive"
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
      </li>
    </ul>
  </div>
</template>
<script setup>
import MarkdownIcon from "@/assets/imgs/markdown.svg";
import MarkdownIconActive from "@/assets/imgs/markdown-active.svg";
import { useImgBedStore } from "@/store/imgBed";
import {message} from "ant-design-vue"
import Icon from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import { getFileName } from "@/utils/useFile";
import { useCopyExternalLinks } from "@/utils/useCopExternalLinks";
const imgBedStore = useImgBedStore();
const { uploadImgList } = storeToRefs(imgBedStore);

const handleToMarkdown = (index) => {
  uploadImgList.value[index].isMarkdown =
    !uploadImgList.value[index].isMarkdown;
};

// 点击复制外链
const handleCopyExternalLinks = (mode = "github", index) => {
  useCopyExternalLinks(mode, uploadImgList.value[index]);
};

// 图片的删除操作
const handleImgMenuClick = ({key}) => {
  let [attr, index] = key.split("-")
  switch (attr) {
    case "delete":
      let [img] = uploadImgList.value.splice(index, 1)
      message.success({
        content: `${getFileName(img)}文件删除成功`
      })
      break;
    case "rename":
      console.log("重命名");
      break;
    case "attribute":
      console.log("attribute");
  }
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
      .more {
        position: absolute;
        right: 8px;
        display: none;
        top: 8px;
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
      .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
</style>
