import {defineStore} from "pinia"

export const useImgBedStore = defineStore("imgBed", {
    state: () => ({
        uploadImgList: []
    }),
    actions: {
        setUploadImgList(payload){
            this.uploadImgList.push(payload)
        },
        updateImgList(payload, index){
            this.updateImgList[index] = payload
        }
    },
    persist: {
        key: "PICR_IMGLIST",
        paths: ["uploadImgList"],
        storage: localStorage,
      },
})