// wxt.config.ts — WXT 框架配置，Chrome 插件构建入口
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Browser Agent',
    description: '浏览器上下文感知 + 深度报告生成',
    action: {},
    permissions: ['activeTab', 'sidePanel', 'tabs'],
  },
});
