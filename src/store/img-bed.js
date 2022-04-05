import {defineStore} from "pinia"
import {useUserStore} from "./user"
import {storeToRefs} from "pinia"
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
    getters:{
        imgList: (state) => {
            const userStore = useUserStore()
            const {setting} = storeToRefs(userStore)
            return state.uploadImgList.map(img => {
                img.isMarkdown = setting.value.isMarkdown
                return img
            })
        }
    },
    persist: {
        key: "PICR_IMGLIST",
        paths: ["uploadImgList"],
        storage: localStorage,
      },
})