<template>
  <a-card class="container">
    <a-form
      ref="formRef"
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
      :rules="rules"
      autocomplete="off"
    >
      <a-form-item label="Token" name="token">
        <a-input v-model:value="form.token" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
        <a-button @click.stop="onConfirmToken" type="primary"
          >确认Token</a-button
        >
      </a-form-item>
      <a-spin
        style="width: 100%;, min-height: 100px;"
        :spinning="loading"
        tip="Loading..."
      >
        <div v-if="config.id">
          <a-form-item label="用户名" name="login">
            <a-input readonly v-model:value="form.login" />
          </a-form-item>
          <a-form-item name="selectedRepo" label="选择图床仓库">
            <a-select
              @popupScroll="popupScroll"
              show-search
              v-model:value="form.selectedRepo"
            >
              <a-select-option
                v-for="repo in repos"
                :key="repo.id"
                :value="repo.name"
                >{{ repo.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item name="selectedBranch" label="选择仓库分支">
            <a-select show-search v-model:value="form.selectedBranch">
              <a-select-option
                v-for="branch in branches"
                :key="branch.name"
                :value="branch.name"
                >{{ branch.name }}</a-select-option
              >
            </a-select></a-form-item
          >
          <a-form-item
            v-if="form.selectedBranch"
            name="dirMode"
            label="目录方式"
          >
            <a-radio-group
              @change="onChangeDirMode"
              v-model:value="form.dirMode"
            >
              <a-tooltip>
                <template #title>手动创建一个目录</template>
                <a-radio :value="1">
                  {{ dirModeName[1] }}
                </a-radio>
              </a-tooltip>
              <a-tooltip>
                <template #title>存放在根目录</template>
                <a-radio :value="2">
                  {{ dirModeName[2] }}
                </a-radio>
              </a-tooltip>
              <a-tooltip>
                <template #title>根据日期自动创建YYYYMMDD格式</template>
                <a-radio :value="3">
                  {{ dirModeName[3] }}
                </a-radio>
              </a-tooltip>
              <a-tooltip>
                <template #title
                  >选择{{ form.selectedBranch }}分支下的一个目录</template
                >
                <a-radio :value="4">
                  {{ dirModeName[4] }}
                </a-radio>
              </a-tooltip>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="form.selectedBranch && form.dirMode !== 4"
            name="selectedDir"
            :label="dirModeName[form.dirMode]"
          >
            <a-input
              :readonly="form.dirMode !== 1"
              v-model:value="form.selectedDir"
            />
          </a-form-item>
          <a-form-item
            v-else
            name="selectedDirList"
            :label="dirModeName[form.dirMode]"
          >
            <a-cascader
              change-on-select
              :options="contents"
              :load-data="loadData"
              v-model:value="form.selectedDirList"
              placeholder="请选择目录"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
            <a-space>
              <a-button @click.stop="onReset">重置</a-button>
              <a-button @click.stop="onCompleteConfigure" type="primary"
                >完成配置</a-button
              >
            </a-space>
          </a-form-item>
        </div>
      </a-spin>
    </a-form>
  </a-card>
</template>
<script setup>
import { useRouter } from "vue-router";

import { useUserStore } from "../store/user";

import { ref, onMounted, watch } from "vue";

import { storeToRefs } from "pinia";

import {
  useThrottleFn,
  useDateFormat,
  useNow,
  useDebounceFn,
} from "@vueuse/core";

const userStore = useUserStore();

const { config, repos, branches } = storeToRefs(userStore);

const contents = ref([]);

const loading = ref(false);

const formRef = ref(null);

const router = useRouter();

const rules = ref({
  selectedRepo: [
    { required: true, message: "请选择文件上传的仓库", trigger: "blur" },
  ],
  selectedBranch: [
    { required: true, message: "请选择仓库的分支", trigger: "blur" },
  ],
  selectedDir: [
    {
      required: true,
      message: "请输入上传文件的目录",
      trigger: "blur",
      type: "string",
    },
  ],
  selectedDirList: [
    {
      required: true,
      message: "请选择上传文件的目录",
      trigger: "blur",
      type: "array",
    },
  ],
});

const form = ref({
  token: config.value.token,

  login: config.value.login,

  dirMode: config.value.dirMode,

  selectedDir: config.value.selectedDir,

  selectedRepo: config.value.selectedRepo,

  selectedBranch: config.value.selectedBranch,

  selectedDirList: config.value.selectedDirList,
});

const dirModeName = ref({
  1: "新建目录",

  2: "根目录",

  3: "自动目录",

  4: `选择${config.value.selectedRepo}仓库目录`,
});

const onConfirmToken = useThrottleFn(
  async () => {
    loading.value = true;

    await userStore.getUser(form.value.token);

    form.value.token = config.value.token;

    form.value.login = config.value.login;

    await userStore.getRepos();

    loading.value = false;
  },

  1000,

  false
);

const popupScroll = useThrottleFn(async (e) => {
  const bootomHeight =
    e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
  if (bootomHeight < 50 && userStore.repoHasMore) {
    userStore.setRepoPage(userStore.repoPage + 1);
    await userStore.getRepos();
  }
});
// 完成配置
const onCompleteConfigure = async () => {
  try {
    await formRef.value.validate();
    userStore.updateConfig({
      dirMode: form.value.dirMode,
      selectedDir: form.value.selectedDir,
      selectedRepo: form.value.selectedRepo,
      selectedBranch: form.value.selectedBranch,
      selectedDirList: form.value.selectedDirList,
    });
    router.push({
      path: "/upload",
    });
  } catch (error) {
    console.log(error);
  }
};

// 重置
const onReset = () => {
  formRef.value.resetFields();
  userStore.logout();
};

const onChangeDirMode = () => {
  if (form.value.dirMode === 2) {
    form.value.selectedDir = "/";
  } else if (form.value.dirMode === 3) {
    form.value.selectedDir = useDateFormat(useNow(), "YYYY/MM/DD").value;
  } else if (form.value.dirMode === 1) {
    form.value.selectedDir = "xxx";
  } else if (form.value.dirMode === 4) {
    form.value.selectedDirList = [];
  }
};

const loadData = async (selectedOptions) => {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  let contentsResult = await userStore.getBranchCatalogue({
    repo: form.value.selectedRepo,
    dir: form.value.selectedDirList.join("/"),
    query: {
      ref: form.value.selectedBranch,
    },
  });
  targetOption.loading = false;

  let mergeContents = mergeBranchCatalogue(contentsResult);
  if (mergeContents.length === 0) {
    targetOption.isLeaf = true;
    return;
  }
  targetOption.children = mergeContents;
};

const mergeBranchCatalogue = (contents) => {
  return contents
    .filter((content) => content.type === "dir")
    .map((content) => {
      let c = {};
      c.label = content.name;
      c.value = content.name;
      c.isLeaf = false;
      return c;
    });
};

watch(
  () => form.value.selectedBranch,
  async (val) => {
    form.value.selectedDirList = [];
    if (val.trim()) {
      let contentsResult = await userStore.getBranchCatalogue({
        repo: form.value.selectedRepo,
        dir: "",
        query: {
          ref: val,
        },
      });
      contents.value = mergeBranchCatalogue(contentsResult);
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => form.value.selectedRepo,
  async (val) => {
    if (val.trim()) {
      if (config.value.selectedRepo !== val) {
        form.value.selectedBranch = "";
      }
      await userStore.getBranches(val);
    }
  },
  {
    immediate: true,
  }
);

onMounted(async () => {
  if (config.value.id) {
    await userStore.getRepos();
  }
});
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
