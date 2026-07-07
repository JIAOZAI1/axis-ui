import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * 双模式:
 *   vite / vite build           → demo 演示站
 *   vite build --mode lib       → 组件库产物(dist/)
 */
export default defineConfig(({ mode }) => {
  const common = {
    plugins: [vue()],
    resolve: {
      alias: {
        'axis-ui': fileURLToPath(new URL('./src/index.ts', import.meta.url))
      }
    }
  }

  if (mode === 'lib') {
    return {
      ...common,
      build: {
        lib: {
          entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
          name: 'AxisUI',
          fileName: 'axis-ui'
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: { vue: 'Vue' },
            exports: 'named' as const
          }
        }
      }
    }
  }

  return {
    ...common,
    build: {
      outDir: 'dist-demo'
    }
  }
})
