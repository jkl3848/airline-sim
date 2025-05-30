import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import ReactivityTransform from "@vue-macros/reactivity-transform/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), ReactivityTransform()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@modules": fileURLToPath(new URL("./src/modules", import.meta.url)),
      "@stores": fileURLToPath(new URL("./stores", import.meta.url)),
    },
  },
});
