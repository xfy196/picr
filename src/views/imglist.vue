<template>
  <a-image-preview-group>
    <a-spin
      wrapperClassName="loading__container"
      :spinning="loading"
      tip="Loading..."
    >
      <a-card
        ref="cardContainerRef"
        bordered
        :loading="loading"
        :headStyle="{ paddingRight: '40px' }"
        class="card__container"
      >
        <template v-if="config.id" #title>
          <div class="github__config">
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
              <a-tag color="blue">{{ nowDir }}</a-tag>
            </span>
          </div>
        </template>
        <template #extra>
          <a-space size="middle">
            <a-tooltip>
              <template #title>
                {{ showMode === "block" ? "切换列表" : "切换方块" }}
              </template>
              <DatabaseFilled
                @click.stop="handleChangeShowMode('block')"
                v-if="showMode === 'list'"
                :style="{ fontSize: '24px' }"
              />
              <AppstoreFilled
                v-else
                @click.stop="handleChangeShowMode('list')"
                :style="{ fontSize: '24px' }"
              />
            </a-tooltip>
            <a-tooltip>
              <template #title> 重新加载图片 </template>
              <SyncOutlined
                @click.stop="handleReload"
                :style="{ fontSize: '24px' }"
              />
            </a-tooltip>
          </a-space>
        </template>
        <a-card-grid
          :key="img.name"
          v-for="(img, index) in imageContents"
          class="card__grid card__block"
        >
          <template v-if="img.type === 'file'">
            <a-image :src="img.download_url" />
            <div class="filename">
              {{ img.name }}
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
          </template>
        </a-card-grid>
        <a-back-top :target="getBackTopTarget" />
      </a-card>
    </a-spin>
  </a-image-preview-group>
</template>
<script setup>
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import MarkdownIcon from "@/assets/imgs/markdown.svg";
import MarkdownIconActive from "@/assets/imgs/markdown-active.svg";
import {
  AppstoreFilled,
  DatabaseFilled,
  SyncOutlined,
} from "@ant-design/icons-vue";
import Icon from "@ant-design/icons-vue";
import { onMounted, ref, nextTick, onBeforeMount } from "vue";
import {
  getGithubRawUrl,
  getJsdelivrRawUrl,
  useCopyExternalLinks,
} from "../utils/useCopExternalLinks";

const userStore = useUserStore();

const loading = ref(false);

const cardContainerRef = ref();

const { config, imageContents } = storeToRefs(userStore);

// block 和 list 模式
const showMode = ref("block");

const nowDir = ref("/");

onBeforeMount(async () => {
  await getDirFileRequest();
});

const handleReload = () => {
  getDirFileRequest();
};

const getBackTopTarget = () => {
  return cardContainerRef.value.$el;
};

const handleToMarkdown = (index) => {
  imageContents.value[index].isMarkdown =
    !imageContents.value[index].isMarkdown;
};

const handleCopyExternalLinks = (mode, index) => {
  useCopyExternalLinks(
    mode,
    {
      isMarkdown: imageContents.value[index].isMarkdown,
      githubUrl: getGithubRawUrl(imageContents.value[index].path, true),
      jsdelivrUrl: getJsdelivrRawUrl(imageContents.value[index].path, true),
      filename: imageContents.value[index].name,
    },
    true
  );
};

const onScrollToBottom = () => {
  console.log("at bottom");
};

// 列表的模式转换
const handleChangeShowMode = (mode) => {
  showMode.value = mode;
};

const getDirFileRequest = async () => {
  try {
    loading.value = true;
    userStore.getBranchCatalogue({
      repo: config.value.selectedRepos,
      dir:
        config.value.dirMode === 4
          ? config.value.selectedDirList.join("/")
          : config.value.selectedDir,
      query: {
        ref: config.value.selectedBranch,
      },
    });
  } catch (error) {
  } finally {
    nextTick(() => {
      loading.value = false;
    });
  }
};
</script>
<style lang="scss" scoped>
.loading__container {
  height: 100%;
  :deep(.ant-spin-container) {
    height: 100%;
    .card__container {
      overflow: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      .ant-card-body {
        height: 100%;
        flex: 1;
        padding-bottom: 12px;
        box-sizing: border-box;
      }
      .card__block {
        width: calc(20% - 24px);
        height: 240px;
        margin: 12px;
        padding: 0;
        .ant-image {
          width: 100%;
          height: 164px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .filename {
          padding: 0 6px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .copy-external-link-box {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 6px;
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
    }
  }
}
</style>
