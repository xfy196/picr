import request from "../utils/request"
// 通过token获取的用户信息
export const requestUserInfo = async () => {
    return request({
        url: "/user"
    })
}
// 获取仓库列表
export const requestRepos = (params) => {
    return request({
        url: `/users/${params.login}/repos`
    })
} 
// 获取选择仓库的分支
export const requetsBranches = (params) => {
    return request({
        url: `/repos/${params.login}/${params.repo}/branches`
    })
}
// 获取分支下的文件目录
export const requestBranchCatalogue = async (params) => {
    return request({
        url: `/repos/${params.login}/${params.repo}/contents/${params.dir}`,
        params: params.query
    })
}