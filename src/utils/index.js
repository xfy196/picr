import { token } from "../config";
import { useUserStore } from "../store/user";
export const useAuthorOwn = () => {
  const userStore = useUserStore();
  return userStore.config.token === token;
};
// url转markdown格式
export const urlToMarkdown = (url, filename) => {
  return `![${filename}](${url})`;
};
/**
 * @description: 下载文件
 * @author 小小荧 <xfy196@outlook.com>
 * @param {string} [url]
 * @param {string} [name]
 * @param {string} [type]
 * @return {void}
 * @date 2023-08-17 20:13
 */
export const download = (url, name, type = "") => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer"; // 返回类型blob
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let blob = this.response;
      // 转换一个blob链接
      let u = window.URL.createObjectURL(
        new Blob([blob], { type: setFileType(name, type) })
      );
      let a = document.createElement("a");
      a.download = name;
      a.href = u;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };
  xhr.send();
};
export const setFileType = (fileName, type) => {
  // 未设置文件类型时自动解析匹配
  const suffix = fileName.substring(fileName.lastIndexOf("."));

  return type ? type : fileTypeEnum[suffix];
};
export const fileTypeEnum = {
  ".txt": "text/plain",
  ".ppt": "application/vnd.ms-powerpoint",
  ".xls": "application/vnd.ms-excel",
  ".doc": "application/msword",
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  ".gif": "image/gif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".bmp": "image/bmp",

  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".avi": "application/vnd.amazon.ebook",

  ".rar": "application/x-rar-compressed",
  ".zip": "application/zip",
  ".7z": "application/x-7z-compressed",
};
