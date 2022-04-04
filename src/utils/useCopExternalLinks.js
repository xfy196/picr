import { useClipboard } from "@vueuse/core";
import { message } from "ant-design-vue";
import { getFileName } from "./useFile";
import { urlToMarkdown } from "../utils";
import path from "path-browserify";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user";
import { githubRaw, jsdelivrRaw } from "../config/index";

// 获取githubraw地址
export const getGithubRawUrl = (filename, isGithubOrigin = false) => {
  const userStore = useUserStore();
  const { config } = storeToRefs(userStore);
  let pathFilename = `${
    config.value.dirMode === 4
      ? config.value.selectedDirList.join("/")
      : config.value.selectedDir
  }/${filename}`;
  if (isGithubOrigin) {
    pathFilename = filename;
  }
  return path.join(
    githubRaw,
    `/${config.value.login}/${config.value.selectedRepos}/${config.value.selectedBranch}/${filename}`
  );
};

export const getJsdelivrRawUrl = (filename, isGithubOrigin = false) => {
  const userStore = useUserStore();
  const { config } = storeToRefs(userStore);
  let pathFilename = `${
    config.value.dirMode === 4
      ? config.value.selectedDirList.join("/")
      : config.value.selectedDir
  }/${filename}`;
  if (isGithubOrigin) {
    pathFilename = filename;
  }
  return path.join(
    jsdelivrRaw,
    `/${config.value.login}/${config.value.selectedRepos}@${config.value.selectedBranch}/${pathFilename}`
  );
};

export const useCopyExternalLinks = (mode = "github", data, isGithubOrigin = false) => {
  let filename = isGithubOrigin ? data.filename : getFileName(data);
  if (mode === "github") {
    let githubUrl = data.githubUrl;
    if (data.isMarkdown) {
      githubUrl = urlToMarkdown(githubUrl, filename);
    }
    const { copy, isSupported } = useClipboard({
      source: githubUrl,
    });
    if (!isSupported) {
      message.warning({
        content: "抱歉你的浏览器不支持复制功能",
      });
      return;
    }
    message.success({
      content: `${filename}${mode}外链复制成功`,
    });
    copy();
  } else {
    let jsdelivrUrl = data.jsdelivrUrl;
    if (data.isMarkdown) {
      jsdelivrUrl = urlToMarkdown(jsdelivrUrl, filename);
    }
    const { copy, isSupported } = useClipboard({
      source: jsdelivrUrl,
    });
    if (!isSupported) {
      message.warning({
        content: "抱歉你的浏览器不支持复制功能",
      });
      return;
    }
    message.success({
      content: `${filename}外链复制成功`,
    });
    copy();
  }
};
