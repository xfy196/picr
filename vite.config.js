import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import svgLoader from 'vite-svg-loader'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader(),Components({ resolvers: [AntDesignVueResolver()] })],
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src/"),
    },
  },
  base:'/picr',
});
