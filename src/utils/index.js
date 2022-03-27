import {token} from "../config"
import {useUserStore} from "../store/user"
export const useAuthorOwn = () => {
    const userStore = useUserStore()
    return userStore.config.token === token
}