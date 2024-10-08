<template>
  <a-image-preview-group v-if="config.id">
    <a-spin
      wrapperClassName="loading__container"
      :spinning="loading"
      tip="Loading..."
    >
      <a-card
        ref="cardContainerRef"
        bordered
        :loading="loading"
        :headStyle="{
          paddingRight: '40px',
          'min-height': selectedImgIds.length ? '94px' : '',
        }"
        class="card__container"
        :class="{ hasSelectedOp: selectedImgIds.length }"
      >
        <template v-if="config.id" #title>
          <div class="github__config">
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
              <a-tag color="blue">{{ nowDir }}</a-tag>
            </span>
            <span>
              图片数量:
              <a-tag color="blue">{{ imageContents.length }}</a-tag>
            </span>
          </div>
          <div class="selectedop__box" v-if="selectedImgIds.length">
            <div class="left__op">
              <a-checkbox
                v-model:checked="selectedAll"
                :indeterminate="indeterminate"
                @change="onSelectedAllChange"
              >
                全部
              </a-checkbox>
              <div>已选择 {{ selectedImgIds.length }} 张图片</div>
              <a-button type="link" @click.stop="cancelSelected"
                >取消选择</a-button
              >
            </div>
            <div class="right_btn">
              <a-space>
                <a-tooltip>
                  <template #title> 批量复制外链 </template>
                  <CopyOutlined
                    @click.stop="handleBatchCopyLink"
                    style="font-size: 24px"
                  />
                </a-tooltip>
                <a-tooltip>
                  <template #title> 批量删除图片 </template>
                  <DeleteFilled
                    @click.stop="handleBatchDelete"
                    style="font-size: 24px"
                  />
                </a-tooltip>
              </a-space>
            </div>
          </div>
        </template>
        <template #extra>
          <a-space size="middle">
            <a-tooltip>
              <template #title> 返回上一层 </template>
              <LeftOutlined
                @click.stop="handleBackFile"
                v-if="nowDir !== '/'"
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
          <a-checkbox-group v-model:value="selectedImgIds">
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
              class="card__grid card_img"
              :class="{
                card__block: showMode === 'block',
                card__list: showMode === 'list',
              }"
            >
              <a-spin :spinning="deleteLoadingIndex === index">
                <a-checkbox
                  :class="{ selected: selectedImgIds.includes(img.name) }"
                  class="img__selected_checkbox"
                  :value="img.name"
                />
                <a-image :src="getJsdelivrRawUrl(img.path)" />
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
              </a-spin>
            </a-card-grid>
          </a-checkbox-group>
        </div>

        <a-back-top :target="getBackTopTarget" />
      </a-card>
    </a-spin>
  </a-image-preview-group>
</template>
<script setup>
import { requestDeleteFile } from "../apis/github";
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import MarkdownIcon from "@/assets/imgs/markdown.svg";
import DirIcon from "@/assets/imgs/dir.svg";
import MarkdownIconActive from "@/assets/imgs/markdown-active.svg";
import {
  AppstoreFilled,
  DatabaseFilled,
  SyncOutlined,
  LeftOutlined,
  CopyOutlined,
  DeleteFilled,
} from "@ant-design/icons-vue";
import Icon from "@ant-design/icons-vue";
import { useThrottleFn, useClipboard } from "@vueuse/core";
import { ref, nextTick, onBeforeMount, toRaw } from "vue";
import {
  getGithubRawUrl,
  getJsdelivrRawUrl,
  useCopyExternalLinks,
} from "../utils/useCopExternalLinks";
import { message } from "ant-design-vue";

const userStore = useUserStore();

const loading = ref(false);

const cardContainerRef = ref();

const deleteLoadingIndex = ref(-1);

const { config, imageContents, dirsContents } = storeToRefs(userStore);

const selectedImgIds = ref([]);

const pageObj = ref({
  page: 0,
  pageSize: 40,
  countPage: 0,
});

// block 和 list 模式
const showMode = ref("block");

const selectedAll = ref(false);

const nowDir = ref("/");

onBeforeMount(async () => {
  if (!config.value.id) {
    message.warning({
      content: "请求登录",
    });
  }
  await getDirFileRequest();
});

const onSelectedAllChange = (e) => {
  let checked = e.target.checked;
  if (checked) {
    for (let i = 0; i < imageContents.value.length; i++) {
      selectedImgIds.value.push(imageContents.value[i].name);
    }
  } else {
    selectedImgIds.value = [];
  }
};

// 取消所选择的
const cancelSelected = () => {
  selectedImgIds.value = [];
};

// 批量删除
const handleBatchDelete = async () => {
  const imgIds = [...toRaw(selectedImgIds.value)];
  for (let i = 0; i < imgIds.length; i++) {
    try {
      deleteLoadingIndex.value = imageContents.value.findIndex(
        (item) => item.name === imgIds[i]
      );
      await requestDeleteFile({
        login: config.value.login,
        repo: config.value.selectedRepo,
        path: imageContents.value[deleteLoadingIndex.value].path,
        data: {
          message: `delete picture via PicR(${
            location.origin + location.pathname
          })`,
          owner: config.value.login,
          path: imageContents.value[deleteLoadingIndex.value].path,
          repo: config.value.selectedRepo,
          sha: imageContents.value[deleteLoadingIndex.value].sha,
        },
      });
      imageContents.value.shift();
      selectedImgIds.value.shift();
      message.success({
        content: `${
          imageContents.value[deleteLoadingIndex.value].name
        }文件删除成功`,
      });
    } catch (error) {
      console.log(error);
      message.error({
        content: `${
          imageContents.value[deleteLoadingIndex.value].name
        }文件删除失败`,
      });
    } finally {
      deleteLoadingIndex.value = -1;
    }
  }
};

// 批量复制外链
const handleBatchCopyLink = () => {
  let imgLinks = [];
  for (let i = 0; i < selectedImgIds.value.length; i++) {
    imgLinks.push(
      getJsdelivrRawUrl(imageContents.value[selectedImgIds.value[i]].path, true)
    );
  }
  const { copy, isSupported } = useClipboard({ source: imgLinks.join(",") });
  if (!isSupported) {
    message.warning({
      content: "抱歉你的浏览器不支持复制功能",
    });
    return;
  }
  copy()
    .then(() => {
      message.success({
        content: `cdn外链复制成功`,
      });
    })
    .catch(() => {
      message.error({
        content: `cdn外链复制失败`,
      });
    });
};

const handleToDir = async (index) => {
  nowDir.value = dirsContents.value[index].path;
  await getDirFileRequest();
  cancelSelected();
};

// 返回上一层的目录
const handleBackFile = async () => {
  let nowDirs = nowDir.value.split("/");
  if (nowDirs.length <= 1) {
    nowDir.value = "/";
  } else {
    nowDirs.pop();
    nowDir.value = nowDirs.join("/");
  }
  await getDirFileRequest();
  cancelSelected();
};

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
      repo: config.value.selectedRepo,
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
      .ant-card-head {
        .ant-card-head-wrapper {
          height: 100%;
          .ant-card-head-title {
            height: 100%;
            display: flex;
            justify-content: space-evenly;
            flex-direction: column;
            padding: 0;
            .selectedop__box {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .left__op {
                display: flex;
                align-items: center;
              }
              .right__btn {
                display: flex;
                align-items: center;
              }
            }
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
          .ant-checkbox-group {
            width: 100%;
          }
        }
      }
      &.hasSelectedOp {
        .ant-card-body {
          height: calc(100% - 94px);
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
        position: relative;
        .filename {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .card_img {
        &:hover {
          .img__selected_checkbox {
            display: block;
          }
        }
        .img__selected_checkbox {
          display: none;
          position: absolute;
          z-index: 10;
          left: 6px;
          top: 6px;
        }
        .selected {
          display: block;
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
        width: calc(50% - 24px);
        margin: 12px;
        display: flex;
        height: 164px;
        .ant-spin-nested-loading {
          width: 100%;
          height: 100%;
          .ant-spin-container {
            display: flex;
            height: 100%;
          }
        }
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
