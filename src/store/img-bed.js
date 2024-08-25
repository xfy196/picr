import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { storeToRefs } from "pinia";
import { requestDeleteFile } from "@/apis/github";
export const useImgBedStore = defineStore("imgBed", {
  state: () => ({
    uploadImgList: [],
  }),
  actions: {
    setUploadImgList(payload) {
      this.uploadImgList.push(payload);
    },
    updateImgList(payload, index) {
      this.updateImgList[index] = payload;
    },
    async deleteImage(payload, index) {
      const res = await requestDeleteFile(payload);
      console.log("🚀 ~ deleteImage ~ res:", res);
      const [img] = this.uploadImgList.splice(index, 1);
      return img;
    },
  },
  getters: {
    imgList: (state) => {
      const userStore = useUserStore();
      const { setting } = storeToRefs(userStore);
      return state.uploadImgList.map((img) => {
        img.isMarkdown = setting.value.isMarkdown;
        return img;
      });
    },
  },
  persist: {
    key: "PICR_IMGLIST",
    paths: ["uploadImgList"],
    storage: localStorage,
  },
});
