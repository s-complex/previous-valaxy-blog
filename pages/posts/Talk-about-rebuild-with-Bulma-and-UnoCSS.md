---
title: 也来谈谈这次的 Bulma + UnoCSS 界面重写
date: 2024-01-28
description: 在一遍一遍的思想斗争中，我还是用 Bulma + UnoCSS 重写了博客的界面。这次就顺便来谈谈相关方面的东西。
banner: https://i.yecdn.com/images/2024/03/02/e59ffdbbe2a8d1b1e9fd94959a582435.webp
categories: 技术
---

## Why UnoCSS

UnoCSS 是 Anthony Fu 出品的 Atomic CSS 引擎。相比于 Tailwind CSS，Atomic CSS 会为每一个 CSS 对应一条独立的 CSS 规则。这一点体现在规则复用率不断上升后，CSS 产物相比 Tailwind CSS 要小了许多。

而在使用了 UnoCSS 提供的 `@unocss/preset-uno` 预设后，绝大部分的使用方法基本与 Tailwind CSS 无异，我可以很轻松的从 Tailwind CSS 转移到 UnoCSS 上。

## 让 UnoCSS 辅助 Bulma

在前期尝试 MDUI 2 + Tailwind CSS 的时候，由于 MDUI 2 并没有提供一个比较方便的 Grid System，所以当时我的做法便是让 MDUI 仅负责主要的 UI，Tailwind CSS 为其打辅助。

虽然这次是用的 Bulma，Grid System 之类的东西还是有的，但全量引用 Bulma 的 CSS 打包体积大小也是十分惊人的。那套路也很简单，按需引入 Bulma 的 sass 样式文件、让其仅负责主要的 UI，UnoCSS 为其打辅助就可以啦。

## Navbar 的设计

Bulma 的 Navbar Menu 只会在台式机窗口尺寸显示，往下的小尺寸将会作隐藏处理。这也是很久很久之前，我用 Bulma 简单写主页和初版 Library 并没有考虑到的事情，当时甚至很蠢的在想为什么它就是不显示。

不过这次我可不是笨蛋啦。我参考了 [hexo-theme-icarus](https://github.com/ppoffice/hexo-theme-icarus) 并通过一种邪门的方式改成了这样：

![Navbar on Mobile](https://bu.dusays.com/2024/01/28/65b61f293ec05.webp)

这个的原理便是叠加一个 Navbar 元素，如果没到 `lg` 断点便默认显示，反之则隐藏；不使用 `navbar-menu` class 并直接在上面置入 Menu Items，最后和标题一样进行置中处理即可。

## 总体排版的设计

总体排版我还是遵循了 MDx 主题，但稍微有所改动：

- 文章列表的文章日期挪到了文章标题的下方；
- 首页头图实际上是 Bulma 的 Hero 样式，用 Hero 作为图片容器；
- 文章页不再在头图部分加载当前文章的封面，而是在文章详情的卡片顶部加载，标题与日期同理。

## 版权声明的设计

这一部分参考了 [Sukka](https://blog.skk.moe) 的设计，自己用上了 Bulma 的 Level 于是变成了这样：

![Copyright](https://i.yecdn.com/images/2024/03/02/0d0ff9f5b2cd904f29fcf0631e421ba8.webp)

标题和链接直接照搬了，作者、发布日期和版权协议就由 Level 来排，最后写一句我自己在 Library 上整的版权细则就完工了。

## 深色模式暂时取消

我的博客目前是用了 Bulma 的 0.9.4 版本，而直到 1.0 推出才有原生的 Dark Mode Support，让我自己写 CSS 那估计就是完整的大脑融化成了一滩水（雾）。

恰好我有申请 Bulma 1.0 的 beta 版测试，而 Bulma 版本迁移并不会特别难，故此先把博客的深色模式给摘掉了。个人主页和 Library 目前暂无重写计划，所以没有影响。

## 解析的更换与缓存配置

前几天用上了 [fgaoxing](https://www.yt-blog.top) 的 Vercel Anycast，网站速度得到了一个质的提升，小小推荐一下他的这个 [Vercel Anycast](https://www.yt-blog.top/9952/)。

缓存方面根据他的配置重新做了调整，将 assets 的内容缓存进行了调整。重新提一下，在 DevTools 分析的时候，我的博客的资源基本上都是从 assets 出来的，所以我仅配置了这个地方的缓存。
