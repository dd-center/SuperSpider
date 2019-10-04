module.exports = {
  title: 'BiliSC 文档',
  description: 'BiliSC 文档与教程站。',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  plugins: [
    '@vuepress/active-header-links',
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom',
    '@vuepress/nprogress'
  ],
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'BiliSC 文档',
      description: 'BiliSC 文档与教程站。'
    }
  },
  themeConfig: {
    smoothScroll: true,
    repo: 'dd-center/SuperSpider',
    docsDir: 'packages/superspider-docs/docs',
    sidebarDepth: 2,
    locales: {
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用.',
            buttonText: '刷新'
          }
        },
        lastUpdated: '上次更新',
        algolia: {},
        repoLabel: '查看项目',
        editLinks: true,
        editLinkText: '帮助我们改善此页面！',
        nav: [
          { text: '实时监控', link: '/monitor/' },
          { text: '后台管理', link: '/dashboard/' },
          { text: '数据分析', link: '/analyze/' }
        ],
        sidebar: {
          '/monitor/': ['', 'config'],
          '/dashboard/': [''],
          '/analyze/': ['']
        }
      }
    }
  }
}
