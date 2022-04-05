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
            <span>
              图片数量:
              <a-tag color="blue">{{ imageContents.length }}</a-tag>
            </span>
          </div>
        </template>
        <template #extra>
          <a-space size="middle">
            <a-tooltip>
              <template #title>
                返回上一层
              </template>
              <LeftOutlined 
              @click.stop="handleBackFile"
              v-if="nowDir!=='/'"
                :style="{ fontSize: '24px' }"
               />
            </a-tooltip>
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
        <div @scroll="handleBottomPage" class="card__body">
          <a-card-grid
            class="card__grid card__dir"
            :class="{
              card__block: showMode === 'block',
              card__list: showMode === 'list',
            }"
            v-for="(dir, index) in dirsContents"
            :key="dir.name"
          >
            <a-tooltip>
              <template #title> 双击进入 </template>
              <Icon
                @dblclick.stop="handleToDir(index)"
                class="dir__icon"
                :style="{ fontSize: '120px' }"
                :component="DirIcon"
              ></Icon>
            </a-tooltip>
            <div class="filename">{{ dir.name }}</div>
          </a-card-grid>
          <a-card-grid
            :key="img.name"
            v-for="(img, index) in imageContents.slice(
              0,
              (pageObj.page + 1) * pageObj.pageSize
            )"
            class="card__grid"
            :class="{
              card__block: showMode === 'block',
              card__list: showMode === 'list',
            }"
          >
            <a-image :src="img.download_url" />
            <div class="filename">
              <a-tooltip>
                <template #title> {{ img.name }} </template>
                {{ img.name }}
              </a-tooltip>
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
          </a-card-grid>
        </div>

        <a-back-top :target="getBackTopTarget" />
      </a-card>
    </a-spin>
  </a-image-preview-group>
</template>
<script setup>
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import MarkdownIcon from "@/assets/imgs/markdown.svg";
import DirIcon from "@/assets/imgs/dir.svg";
import MarkdownIconActive from "@/assets/imgs/markdown-active.svg";
import {
  AppstoreFilled,
  DatabaseFilled,
  SyncOutlined,
  LeftOutlined
} from "@ant-design/icons-vue";
import Icon from "@ant-design/icons-vue";
import { now, useThrottleFn } from "@vueuse/core";
import { ref, nextTick, onBeforeMount } from "vue";
import {
  getGithubRawUrl,
  getJsdelivrRawUrl,
  useCopyExternalLinks,
} from "../utils/useCopExternalLinks";

const userStore = useUserStore();

const loading = ref(false);

const cardContainerRef = ref();

const { config, imageContents, dirsContents } = storeToRefs(userStore);

const pageObj = ref({
  page: 0,
  pageSize: 40,
  countPage: 0,
});

// block 和 list 模式
const showMode = ref("block");

const nowDir = ref("/");

onBeforeMount(async () => {
  await getDirFileRequest();
});

const handleToDir = async (index) => {
  nowDir.value = dirsContents.value[index].path;
  await getDirFileRequest();
};


// 返回上一层的目录
const handleBackFile = async () => {
  let nowDirs = nowDir.value.split("/")
  if(nowDirs.length <=1){
    nowDir.value = "/"
  }else {
    nowDirs.pop()
    nowDir.value = nowDirs.join("/")
  }
  await getDirFileRequest()
}

const handleReload = () => {
  pageObj.value.page = 0;
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

// 触底分页函数
const handleBottomPage = useThrottleFn((e) => {
  pageObj.value.countPage = Math.ceil(
    imageContents.value.length / pageObj.value.pageSize
  );
  if (pageObj.value.page >= pageObj.value.countPage) {
    return;
  }
  if (
    e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop <=
    200
  ) {
    pageObj.value.page++;
  }
});

// 列表的模式转换
const handleChangeShowMode = (mode) => {
  showMode.value = mode;
};

const getDirFileRequest = async () => {
  try {
    loading.value = true;
    userStore.getBranchCatalogue({
      repo: config.value.selectedRepos,
      dir: nowDir.value,
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
      height: 100%;
      display: flex;
      flex-direction: column;
      .ant-card-head{
        .ant-card-head-wrapper{
          height: 100%;
          .ant-card-head-title{
            height: 100%;
            display: flex;
            align-items: center;
          }
        }
      }
      .ant-card-body {
        height: calc(100% - 48px);
        flex: 1;
        padding: 0;
        .card__body {
          height: 100%;
          overflow: auto;
        }
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
      .card__grid {
        .filename {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .card__dir {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        &.card__list {
          flex-direction: row;
        }
        .dir__icon {
          user-select: none;
          cursor: pointer;
        }
      }
      .card__list {
        width: 100%;
        display: flex;
        height: 164px;
        .ant-image {
          width: 120px;
          height: 120px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .filename {
          flex: 3;
          display: flex;
          align-items: center;
          margin-left: 12px;
        }
        .copy-external-link-box {
          display: flex;
          align-items: center;
        }
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
