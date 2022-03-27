import { defineStore } from "pinia";
import { requestBranchCatalogue, requestRepos, requestUserInfo, requetsBranches } from "../apis/github";
export const useUserStore = defineStore("user", {
  state: () => ({
    config: {
      id: null,
      token: "",
      login: "",
      name: "",
      avatarUrl: "",
      selectedDir: "xxx",
      selectedDirList: [],
      selectedRepos: "",
      dirMode: 1,
      selectedBranch: ""
    },
    repos: [],
    branches: [],
  }),
  actions: {
    async getUser(token) {
      localStorage.setItem("GITHUB__TOKEN", token);
      try {
        let user = await requestUserInfo();
        this.config.id = user.id;
        this.config.avatarUrl = user.avatar_url;
        this.config.login = user.login;
        this.config.name = user.name;
        this.config.token = token;
      } catch (error) {}
    },
    async logout() {
      localStorage.clear();
      location.reload()
    },
    updateConfig(payload){
      this.config = {
        ...this.config,
        ...payload
      }
    },
    async getRepos(){
      try {
        let repos = await requestRepos({
          login: this.config.login
        })
        // 是作者自己的账号
        // if(this.config.token === token || this.config.login === "xfy196"){
        //   repos = repos.filter(repo =>  repo.name==="images")
        // }
        this.repos = repos
      } catch (error) {
        
      }
    },
    async getBranches(repo){
      try {
        let branches = await requetsBranches({
          login: this.config.login,
          repo
        })
        this.branches = branches
      } catch (error) {
        
      }
    },
    async getBranchCatalogue(params){
      try {
        let contents = await requestBranchCatalogue({
          login: this.config.login,
          ...params
        })
        return contents
      } catch (error) {
        
      }
    }
  },
  persist: {
    key: "PICR_CONFIG",
    paths: ["config"],
    storage: localStorage,
  },
});
