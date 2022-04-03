<template>
  <a-layout-header class="header">
    <div class="header__left">
      <h1 @click.stop="router.push('/')">
        <img src="../assets/logo.png" class="logo" alt="" />
      </h1>
      <h2 class="logo__txt">PicR</h2>
      <SiteCount />
    </div>
    <div class="login__box">
      <span v-if="!config.id" class="no__login--text">未登录</span>
      <span v-else class="userinfo">{{ config.login }}</span>
      <a-avatar v-if="!config.id" :size="48">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-dropdown v-else>
        <a-avatar :src="config.avatarUrl" :size="48" />
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a-button @click.stop="handleLogout" type="link">退出登录</a-button>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>
<script setup>
import {useRouter} from "vue-router"

import { UserOutlined } from "@ant-design/icons-vue";

import { useUserStore } from "../store/user";

import SiteCount from "../components/site-count/index.vue";

import { storeToRefs } from "pinia";

const userStore = useUserStore();

const router = useRouter()

const { config } = storeToRefs(userStore);

const handleLogout = () => {

    userStore.logout()

}

</script>
<style lang="scss" scoped>
.header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header__left {
    display: flex;
    align-items: center;
    h1 {
      display: flex;
      align-items: center;
      .logo {
        width: 46px;
        height: 46px;
      }
    }
    .logo__txt {
      font-size: 36px;
      margin-left: 15px;
      margin-right: 15px;
    }
  }
  .login__box {
    font-size: 16px;
    .no__login--text {
      margin-right: 10px;
    }
    .userinfo {
      margin-right: 10px;
    }
  }
}
</style>
