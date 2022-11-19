import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import Components from "unplugin-vue-components/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      // see https://github.com/antfu/unplugin-vue-components#typescript
      dts: false,
      resolvers: [IconsResolver()],
    }),
    Icons({
      // see https://github.com/antfu/unplugin-icons#configuration
      autoInstall: true,
      compiler: "vue3",
    }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
})
