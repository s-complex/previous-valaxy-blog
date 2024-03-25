---
title: 浅谈给博客做的小优化
date: 2024-01-20
description: 前几天用 MDUI 2 + Tailwind CSS 给博客重写了主题，顺带做了一些小优化，访问速度应该能说是得到了一个质的提升。这次趁着水文章的功夫，来分享一下我给博客做的一系列小优化。
banner: https://i.yecdn.com/images/2024/03/02/4c6d29764729a5cc0a3ba26be63028d4.webp
categories: 技术
---

## 网站的托管与缓存

### 托管

除开个人觉得用起来复杂的 GitHub Pages、初见就印象不好的 Netlify 和只拿来搭过节点的 Heroku，我曾用过 Cloudflare Workers, Cloudflare Pages 和 Vercel 托管我的网站。其中 Cloudflare Pages 现在应该也基于 Workers，并且用的时间不是很长，这里就不再赘述。

年末那会，我又将网站从 Cloudflare Workers Site 移动到了 Vercel。移动到 Vercel 后的网站关联的是 `gxres.net` 这个域名，而原本托管在 Cloudflare Workers Site 上的网站并没有撤掉，关联的还是 `restent.win` 这个旧域名，我就突发好奇心给它们来了一个 Lighthouse 对比（包括 [PageSpeed Insights](https://pagespeed.web.dev) 和浏览器 Devtools 内置的 Lighthouse），结果便是 Vercel 的访问速度更胜一筹。

既然结果已经知晓，那么今后如果不出意外的话，[Ou's Intro](https://www.gxres.net), [Restent's Notebook](https://blog.gxres.net) 和 [SliverRiver's Library](https://library.gxres.net) 都会托管在 Vercel 上，给访客们有一个更好的访问速度。

::: tip

虽说 Vercel 的访问速度更胜一筹，但 Cloudflare Workers 这样只是慢一点点的资源也不能浪费，所以除了上述三个网站之外的服务都会放在 Cloudflare Workers 上，亦或是 Cloudflare Pages。

:::

### 缓存

Vercel 可以通过根目录的 `vercel.json` 设置响应头，我便给一些静态资源设置了缓存：

``` json
{
  "headers": [
    {
      "source": "/assets/(.*).(ttf|otf|woff2)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/assets/(.*).(css|js)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=864000, immutable"
        }
      ]
    },
    {
      "source": "/assets/chunks/(.*).(js)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

我将我的字体和不重要的 JS 文件（有本地 build 之后检查过）缓存了一年，而 CSS 样式文件缓存了 10 天。目前这样的缓存方法是足够我使用了的，如果后续实在不行再考虑缓存全站内容。

## 资源按需引入

### UI 组件

如开头所说，MDUI 2 是我博客的主力 UI 组件库。虽然它的 CSS 和 JavaScript 在 gzip 后仅 85KB，但是它支持按需引入组件和函数以进一步减小打包体积：

``` typescript
# 去掉这一行
import "mdui"

# 按需引入
import "mdui/components/menu.js"
```

所以我在重写主题时汇总了我所需要用到的组件，再一一将它们引入到项目即可。

### 图标

对于图标，一般的使用方法便是引用其 CSS 样式文件，但一个 CSS 样式文件里包含了所有可用的图标（可能几千甚至上万个），而一个小网站绝对不可能用到这么多个图标。

::: tip 举个例子

我需要使用 Material Icons，所以我通过 NPM 安装了 `material-icons` 这个图标包，并引用其 CSS 样式文件。但是，仅引入 Filled 变体的图标都会有几百个图标我用不到，更不用说引入全部的图标变体。所以可想而知，如果直接引用 CSS 样式文件，打包体积会反向增大。

:::

好在当下也有像 `@mdi/js` 的、将 SVG 图标打包成组件形式并按需引入到项目的图标包。相比引入全量的 CSS 样式文件，按需引入可以进一步减小打包体积的好处就无需再谈啦。按需引入也可以随意引入任何一个变体的图标，甚至是多个变体的图标混搭，而不需要引入全量的、所有图标变体的 CSS 样式文件。

MDUI 发行了一个 `@mdui/icons` 独立包，其作用原理和上述相同，引入方式和 MDUI 的组件也是完全相同的。但图标这个东西并不是特别重要，所以我选择将它们异步引用，让组件能够优先加载。经过查阅资料后，我通过 `Promise.all` 将它们异步引用：

``` javascript
// 异步加载 JavaScript 文件
const bookmarkIcon = import('@mdui/icons/bookmark.js');
const personIcon = import('@mdui/icons/person.js');
const libraryBooksIcon = import('@mdui/icons/library-books.js');
const contactPageIcon = import('@mdui/icons/contact-page.js');
const linkIcon = import('@mdui/icons/link.js');
const analyticsIcon = import('@mdui/icons/analytics.js');
const menuIcon = import('@mdui/icons/menu.js');
const rssFeedIcon = import('@mdui/icons/rss-feed.js');
const contrastIcon = import('@mdui/icons/contrast.js');
const wbSunnyIcon = import('@mdui/icons/wb-sunny.js');
const nightlightIcon = import('@mdui/icons/nightlight.js');
const computerIcon = import('@mdui/icons/computer.js');
const accessTimeFilledIcon = import('@mdui/icons/access-time-filled.js');
const copyrightIcon = import('@mdui/icons/copyright.js');
const arrowBackIcon = import('@mdui/icons/arrow-back.js');
const arrowForwardIcon = import('@mdui/icons/arrow-forward.js');
const accessTimeIcon = import('@mdui/icons/access-time.js');


// 等待所有 JavaScript 文件加载完成
Promise.all([
  bookmarkIcon,
  personIcon,
  libraryBooksIcon,
  contactPageIcon,
  linkIcon,
  analyticsIcon,
  menuIcon,
  rssFeedIcon,
  contrastIcon,
  wbSunnyIcon,
  nightlightIcon,
  computerIcon,
  accessTimeFilledIcon,
  copyrightIcon,
  arrowBackIcon,
  arrowForwardIcon,
  accessTimeIcon
])
```

## 图片资源

### 存储

前期因为找不到合适的图床存放图片，到去年 9 月的时候博文的图片基本丢得差不多了，故所有的博文都处于无图状态。现在因为主题开发，图片的引用量有可能会变得更多，图床再次成为了我要考虑的一个问题。现在不是问题了，我使用了来自杜老师的去不图床~

::: tip
我从去年下半年那会开始对杜老师有所印象，11 月开始有悄悄拜访他的博客，现在决定用去不图床来存储图片也在我的预料之中。

去不图床 1GB 存储量只要 10r，最高的 5GB 也只要 30r，速度又非常的快快快，这下图片存储终于有着落了（捂脸）。
:::

但是，经过了解，去不图床目前安装了 WAF，发起请求后需要等待至少 100ms 才会加载出图片，而这一段时间用户将会看到一片空白，观感上确实有点不太好的说。所以我最后规划了这一套方案：

- 站内公共资源（例如头像、图标、首页头图和文章默认封面）继续存放在 SliverRiver's Library；
- 文章特定封面和文章内容插入的图片存放在去不图床，并且在 VitePress 配置文章图片懒加载。

### 压缩

当然，虽然有了一套比较完善的图片存储方案，但是图片占地太大也是忍不了的哦（笑脸龙图）。那么来稍稍讲一下我的首页头图和文章默认封面吧：

- 首页头图是我 7 月在南宁游玩时随手用相机拍摄的照片，在 16:9 裁切、缩小到 1080p、色彩微调并使用 Topaz Denoise AI 处理过后的 JPEG 格式图片大小为 2MB，在 Picdiet 默认 75% 压缩并使用 Convertio 将其转到 WebP 后占用 43.5KB；
- 文章默认封面是某次爬山的时候拍的日出（有点丑），同样用处理首页头图方式后的 JPEG 格式图片占用大约 900KB，Picdiet 压缩并在 Convertio 转格式后占用 70.8KB。

控制好大小后，用户在访问我的网站时就无需太多时间等待图片加载。

## 尾声

算是一篇真的很水的优化介绍了。很多优化可能都微不足道（甚至可以说是有点答辩），但也希望能够给你带来一点帮助（
