import { defineValaxyConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-custom'

const safelist = [
  'i-ic-baseline-home',
  'i-ic-baseline-rss-feed'
]

export default defineValaxyConfig<ThemeConfig>({
  siteConfig: {
    url: "https://blog.gxres.net/",
    lang: "zh-CN",
    title: "Restent's Notebook",
    favicon: "https://library.gxres.net/images/icons/favicon.webp",
    author: {
      name: "Restent Ou",
      avatar: "https://library.gxres.net/images/icons/avatar.webp",
    },
    description: "Blog of Restent Ou, lost in the desolation.",
    timezone: "Asia/Shanghai",
  
  
    feed: {
      favicon: "https://library.gxres.net/images/icons/favicon.webp",
    },
    search: {
      enable: false,
    },
    mediumZoom: {
      enable: true,
    }
  },


  theme: 'custom',

  themeConfig: {
    pages: [
      {
        "name": "归档",
        "url": "/archives"
      },
      {
        name: "友链",
        url: "https://library.gxres.net/links.html"
      }
    ],

    quickAccess: [
      {
        name: "Ou's Intro",
        url: "https://www.gxres.net",
        icon: "i-ic-baseline-home"
      },
      {
        name: "Site RSS",
        url: "/atom.xml",
        icon: "i-ic-baseline-rss-feed"
      }
    ],

    announcement: {
      enable: false,
      content: "由于意料之外的问题发生，您在访问本站时可能会遇到一些问题。给您带来不便，敬请谅解。"
    },

    author: {
      slogan: "静寂に問う 答えを求めて"
    },

    postBanner: "",

    footer: {
      since: 2019,
    },
  },

  unocss: { safelist },

  markdown: {
    theme: "one-dark-pro",
  },

  features: {
    katex: false,
  }
})
