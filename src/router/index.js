import { createRouter, createWebHashHistory } from "vue-router";
import Layouts from "../layouts/index.vue";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Layouts,
      redirect: "/upload",
      children: [
        {
          path: "/setting",
          name: "setting",
          component: () => import("@/views/setting.vue"),
          meta: {
            title: "图床配置",
            icon: "SettingOutlined",
          },
        },
        {
          path: "/upload",
          name: "upload",
          component: () => import("@/views/upload.vue"),
          meta: {
            title: "图片上传",
            icon: "EditOutlined",
          },
        },
        {
          path: "/imglist",
          name: "imglist",
          component: () => import("@/views/imglist.vue"),
          meta: {
            title: "图床管理",
            icon: "SettingOutlined",
          },
        },
        {
          path: "/config",
          name: "config",
          component: () => import("@/views/config.vue"),
          meta: {
            title: "用户配置",
            icon: "SettingOutlined"
          }
        }
      ],
    },
  ],
});
export default router;
