/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

// import PostcssPxToViewport from 'postcss-px-conversion'

import PostcssPxToViewport from './postcss-px-extend-media.mjs'

export default defineConfig({
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    VueMacros({
      defineOptions: false,
      defineModels: false,
      plugins: {
        vue: Vue({
          script: {
            propsDestructure: true,
            defineModel: true,
          },
        }),
      },
    }),

    // https://github.com/posva/unplugin-vue-router
    VueRouter(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      dirs: ['src/components', 'src/views'],
      directoryAsNamespace: true,
      // globs: [
      // '!src/components/**/modules/*.vue',
      // 'src/components/*.vue',
      // 'src/components/**/index.vue',
      // ],
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
  css: {
    postcss: {
      plugins: [
        PostcssPxToViewport({
          viewportWidth: 750,
          unitPrecision: 8,
          includeFiles: [/\/mobile\//, /mobile.vue/i],
          allowMediaQuery: true,
          // unitToConvert: 'px', // 需要转换的单位，默认为"px"
          // viewportWidth: 750, //  设计稿的视口宽度
          // unitPrecision: 8, // 单位转换后保留的精度
          // propList: ['*'], // 能转化为vw的属性列表
          // viewportUnit: 'vw', //  希望使用的视口单位
          // fontViewportUnit: 'vw', // 字体使用的视口单位
          // selectorBlackList: [], // 需要忽略的CSS选择器
          // minPixelValue: 1, // 最小的转换数值，如果为1的话，只有大于1的值会被转换
          // mediaQuery: false, // 媒体查询里的单位是否需要转换单位
          // replace: true, // 是否直接更换属性值，而不添加备用属性
          // exclude: undefined, // 忽略某些文件夹下的文件或特定文件
          // include: [/\/mobile\//], // 如果设置了include，那将只有匹配到的文件才会被转换，例如只转换 'src/mobile' 下的文件 (include: /\/src\/mobile\//)
          // landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
          // landscapeUnit: 'vw', // 横屏时使用的单位
        }),
      ],
    },
  },
})
