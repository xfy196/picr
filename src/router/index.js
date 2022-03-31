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
          component: () => import("@/views/setting.vue"),
          meta: {
            title: "图床配置",
            icon: "SettingOutlined",
          },
        },
        {
          path: "/upload",
          component: () => import("@/views/upload.vue"),
          meta: {
            title: "图片上传",
            icon: "EditOutlined",
            keepAlive: true
          },
        },
        {
          path: "/bedmanager",
          component: () => import("@/views/bedmanager.vue"),
          meta: {
            title: "图床管理",
            icon: "SettingOutlined",
            keepAlive: true
          },
        },
      ],
    },
  ],
});
export default router;
