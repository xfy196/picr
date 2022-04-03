import CryptoJS from "crypto-js";
import path from "path-browserify"
export const getFilePrefixName = (filename) => {
    return filename.substring(0, filename.indexOf(path.extname(filename)))
  };
  
  export const getFileSubfixName = (filename, isHash = true) => {
    // 生成上传的文件名字
    // let fileNameLastIndex = filename.lastIndexOf(".");
    return isHash
      ? "." +
          CryptoJS.SHA256(Date.now().toString()).toString().substr(0, 16) +
          filename.indexOf(path.extname(filename))
      : path.extname(filename);
  };
  // 获取文件名
export const getFileName = (img, isRename=false) => {
    return (img.isRename || isRename ? img.rename : img.filePrefixName) + img.fileSubfixName;
};
// 获取文件尺寸
export const getFileSize = (size) => {
  return (size / 1024).toFixed(2)
} 