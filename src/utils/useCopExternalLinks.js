import {useClipboard} from "@vueuse/core"
import {message} from "ant-design-vue"
import {getFileName} from "./useFile"
import { urlToMarkdown } from "../utils";

export const useCopyExternalLinks = (mode = "github", data) => {
    let filename = getFileName(data)
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
        content: `${filename}外链复制成功`,
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
  