<template>
  <a-image-preview-group>
    <a-card
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
            <SyncOutlined @click.stop="handleReload" :style="{ fontSize: '24px' }" />
          </a-tooltip>
        </a-space>
      </template>

      <a-card-grid
        :key="img.name"
        v-for="img in imageContents"
        bordered
        style="width: 25%; height: 240px; text-align: center"
      >
        <template v-if="img.type === 'file'">
          <a-image :src="img.download_url" />
        </template>
      </a-card-grid>
    </a-card>
  </a-image-preview-group>
</template>
<script setup>
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import {
  AppstoreFilled,
  DatabaseFilled,
  SyncOutlined,
} from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";

const userStore = useUserStore();

const loading = ref(false);

const { config, imageContents } = storeToRefs(userStore);

// block 和 list 模式
const showMode = ref("block");

const nowDir = ref("/");

onMounted(async () => {
  await getDirFileRequest();
});

const handleReload = () => {
    getDirFileRequest()
}

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
    loading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.card__container {
  height: 100%;
}
</style>