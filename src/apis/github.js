import request from "../utils/request"
import path from "path-browserify"
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
        url: path.join(`/repos/${params.login}/${params.repo}/contents/${params.dir}`),
        params: params.query
    })
}
// 文件上传 同时支持新增和修改
export const requestUpload = async (body) => {
    return request({
        url: path.join(`/repos/${body.login}/${body.repo}/contents/${body.dirs}/${body.filename}`),
        method: "PUT",
        data: {
            branch: body.branch,
            message: body.message,
            content: body.content
        }
    })
}
// 删除文件
export const requestDeleteFile = async (body) => {
    return request({
        url: path.join(`/repos/${body.login}/${body.repo}/contents/${body.dirs}/${body.filename}`),
        data: body.data,
        method: "DELETE"
    })
}