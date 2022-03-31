import {token} from "../config"
import {useUserStore} from "../store/user"
export const useAuthorOwn = () => {
    const userStore = useUserStore()
    return userStore.config.token === token
}
// url转markdown格式
export const urlToMarkdown = (url, filename) => {
    return `![${filename}](${url})`
}