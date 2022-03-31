import CryptoJS from "crypto-js";

export const getFilePrefixName = (filename) => {
    let fileNameLastIndex = filename.lastIndexOf(".");
    let filePrefixName = filename.substring(0, fileNameLastIndex);
    return filePrefixName;
  };
  
  export const getFileSubfixName = (filename, isHash = true) => {
    // 生成上传的文件名字
    let fileNameLastIndex = filename.lastIndexOf(".");
    return isHash
      ? "." +
          CryptoJS.SHA256(Date.now().toString()).toString().substr(0, 16) +
          filename.substring(fileNameLastIndex, filename.length)
      : filename.substring(fileNameLastIndex, filename.length);
  };
  // 获取文件名
export const getFileName = (img) => {
    return (img.isRename ? img.rename : img.filePrefixName) + img.fileSubfixName;
};
  