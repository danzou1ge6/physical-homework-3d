import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App).mount('#app')

if (process.env.NODE_ENV === 'development') {
    if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
      // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
    }
  }