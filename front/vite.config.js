import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({
    imports: ['vue', 'vue-router', {
      '@/utils/index.js': [
        'requireAssets'
      ],
    }
    ],
    dts: "src/auto-import.d.ts",
  }), Components({
    // 引入组件的,包括自定义组件
    // 存放的位置
    dts: "src/components.d.ts",
  })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'images': resolve(__dirname, 'src/assets/images'),
    }
  },
  server: {
    host: "0.0.0.0",

  }
})
