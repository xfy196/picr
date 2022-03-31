import {defineStore} from "pinia"

export const useImgBedStore = defineStore("imgBed", {
    state: () => ({
        uploadImgList: []
    }),
    actions: {
        setUploadImgList(payload){
            console.log(payload)
            this.uploadImgList.push(payload)
        }
    },
    persist: {
        key: "PICR_IMGLIST",
        paths: ["uploadImgList"],
        storage: localStorage,
      },
})