---
title: 使用 Valaxy 重构我的博客
date: 2024-02-17
description: 原先的 VitePress 博客在不断推进度后，凭我的智商难以再继续向前推进度。正好在 [Big_Cake](https://lihaoyu.cn) 的推荐下，我计划将博客迁移到 Valaxy。有一说一，Valaxy 是一个很好用的博客框架，虽然自己也在这其中踩过不少的坑。也是趁着博客的 UI / UX 基本稳定下来后，我想着写（shui）一篇文章，分享一下自己写主题的过程好了。
banner: https://i.yecdn.com/images/2024/03/02/271c7b9f46482eb79d684296e2417cd6.webp
categories: 技术
---

::: tip 本文提到的功能可能不完整

在这篇文章发表时，我并没有给博客添加完所有我需要的功能。

下文提到的功能是截至本文章发表时，我已经给博客添加的功能。

:::

## 首先，如何开始？

在此之前，Valaxy 只提供了以下选择给用户：

- 开箱即用的 Valaxy 博客模板，配备 valaxy-theme-yun 主题；
- 面向主题开发者的 Valaxy 模板，默认配备 valaxy-theme-starter 主题；
- 面向插件开发者的 Valaxy 模板，主题是什么我也不知道（戳手）。

但是，在一两个月之前，我的博客已经改为闭源，目前只有部分人可以查看到源码，所以如果我要写主题那肯定也不会开源；而 Valaxy 给主题开发者的模板是带有 NPM 上传的选项的，也就是说如果我要写主题那我必须得开源，甚至是面向公众、之后还得维护，作为一个懒虫我肯定不能接受。

但现在，这不是问题。云游君提供了一个本地写主题的 [模板](https://github.com/YunYouJun/valaxy/tree/main/demo/custom)，上述的问题完美解决，我也开始筹备迁移工作。

![过年还真光写代码了](https://i.yecdn.com/images/2024/03/02/1d61d2d8b3705e9513604970a51d6dd1.webp)

## 新手入门

### Valaxy 的 Layout

> 接下来要假设你的位置在根目录，请多加注意（

在普遍的 Vue 项目中，我们都是在 `App.vue` 里编写 Layout；而在 Valaxy，我们需要在 `valaxy-theme-custom/components/layout.vue` 里编写，而编写的内容则与前者无异。

再到内容渲染，Valaxy 使用 Vue Router 作为路由系统，那么用过 Vue Router 的访客们都熟悉了，需要用 `<RouterView />` 或 `<router-view />` 来渲染当前页面内容。

```vue
<slot>
  <RouterView />
</slot>
```

同时，Valaxy 允许你创建多个 Layout 模板，并且它们存放在 `valaxy-theme-custom/layouts` 目录下。至于这有什么用处，下面就会提到了。

### Valaxy 的 Pages

上面提到，Valaxy 使用 Vue Router 作为路由系统，所以不出意外的，你会在主题目录（代指 `valaxy-theme-custom` 目录）下看到一个 `pages` 文件夹。你可以在这里创建所需要的页面组件，比如 `index.vue`, `tags.vue`, `categories.vue` 等。

如果你浏览 valaxy-theme-starter 主题的 `pages` 目录的 `index.vue` 页面组件的话，你会发现有这么几行内容：

```vue
<route lang="yaml">
meta:
  layout: home
</route>
```

它的用途便是结合你创建的 Layout 模板，上述代码便是指定 `index.vue` 使用名为 `home` 的 layout 组件。

到这里，你应该能够理解 Valaxy 的 Layout 和 Pages 了，这对我们接下来的主题编写很有帮助。

## 开始写主题

### 获取站点信息和主题信息

在根目录下，你会发现有 `site.config.ts` 和 `valaxy.config.ts` 两个配置文件。其中，前者是站点信息的配置文件，后者是站点主题的配置文件。而在编写主题时，譬如站点标题、作者信息之类的内容肯定要从这其中提取。

#### 获取站点信息

Valaxy 给予了一个 `useSiteStore` 的函数，并允许你通过这个函数获取站点信息。那么，先来引用这一个函数：

```typescript
import { useSiteStore } from "valaxy";

const site = useSiteStore();
```

这样，你就可以通过这个函数来引用并输出站点信息了。比如，你可以这样输出站点信息：

```vue
<template>
  <p>{{ site.title }}</p>
</template>
```

如果你的组件是类似 `<component title="Site Title" />` 这样输出文本的话，那你可以这么做：

```vue
<template>
  <component :title="site.title" />
</template>
```

#### 获取主题信息

`valaxy-theme-custom/types` 下有一个 TypeScript 声明文件，指定了你的主题配置项；而 `valaxy-theme-custom/composables` 下有两个相关的配置文件，让你能够通过它们用一个名为 `useThemeConfig` 的函数引用主题信息。

还是老样子，先来引用这一个函数

```typescript
import { useThemeConfig } from "../composables";

const themeConfig = useThemeConfig();
```

::: tip 细节

- 这里假设你的 Vue 组件放置在 `valaxy-theme-custom/components` 路径下；
- `useThemeConfig` 函数是由 `valaxy-theme-custom/composables` 下的配置文件给予的。但因为另外一个配置文件 `config.ts` 已经在 `index.ts` 中 export，所以你可以直接从 `../composables` 引用；
- 具体的主题配置需要在 `valaxy-theme-custom/node` 下的 TypeScript 声明文件指定。

:::

这样，你就可以通过这个函数来引用并输出主题信息了。比如，`valaxy.config.ts` 下有一个页脚的站点创建年份：

```typescript
export default defineValaxyConfig<ThemeConfig>({
  /* ... */
  themeConfig: {
    footer: {
      since: 2019,
    },
  },

  /* ... */
});
```

你可以通过这样输出：

```vue
<template>
  <p>{{ themeConfig.footer.since }}</p>
</template>
```

原理上是和上面的站点信息差不多的。

### 获取文章相关信息

#### 生成文章列表

在 Vue 中，文章列表这种东西肯定是要靠遍历生成的啦。这里我们要借助 Valaxy 的 `useSiteStore` 函数来生成文章列表。

> 如果你想分页也一起兼顾的话，那就请看下一部分。

在我编写主题过程中，我参考了 valaxy-theme-starter 的相关源码，最后得出如下代码：

```vue
/*- PostList.vue -*/
<script setup lang="ts">
import { computed } from "vue";
import { useSiteConfig, useSiteStore } from "valaxy";
import type { Post } from "valaxy/types";

// 定义 props
const props = withDefaults(
  defineProps<{
    type?: string;
    posts?: Post[];
  }>
);

// 数据源
const site = useSiteStore();
const siteConfig = useSiteConfig();
const posts = computed(() =>
  (props.posts || site.postList).filter((post) =>
    import.meta.env.DEV ? true : !post.hide
  )
);
</script>

// 通过遍历生成文章列表
<template>
  <ul class="space-y-4">
    <li v-for="(post, index) in posts" :key="post.path">
      <PostCard :post="post" />
    </li>
  </ul>
</template>
```

```vue
/*- PostCard.vue -*/
<script setup lang="ts">
// 导入 Post 的 TypeScript 声明
import type { Post } from "valaxy";

// 定义 props
defineProps<{
  post: Post;
}>();

// 格式化日期的 script，返回中国时间格式
const formatDate = (date: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("zh-CN", options);
};
</script>

<template>
  <RouterLink v-if="post.path" :to="post.path">
    <div class="card">
      <div class="card-image">
        <figure class="image h-80">
          <img
            style="width:100%;height:100%;object-fit:cover;"
            :src="post.banner ?? '默认封面链接'"
            alt="Post banner image"
          />
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">{{ post.title }}</p>
            <p class="subtitle is-6">
              {{ formatDate(post.date as Date) }} ·
              {{ post.categories ?? "未分类" }}
            </p>
          </div>
        </div>
        <div class="content">
          {{ post.description }}
        </div>
      </div>
    </div>
  </RouterLink>
</template>
```

> 与之前写 VitePress 博客主题相比，我将文章卡片从文章列表中拆离、单独成为一个组件，并在文章列表的组件中引用卡片组件。这样，在后续修改中，我就不用翻代码翻到两眼一黑。

#### 为文章列表添加分页

一般的博客都是固定一页显示多少篇文章，而不是全部文章长长一条堆积在首页，所以分页是十分重要的。

Valaxy 提供有一个 `<ValaxyPagination />` 组件供你使用，但一些诸如页面数量计算的 script 还是需要自己补充的。这里参考了 valaxy-theme-yun 主题的相关代码，并融合上面文章列表的代码，最后如下：

```vue
/*- PostList.vue -*/
<script setup lang="ts">
import { computed } from "vue";
import { useSiteConfig, useSiteStore } from "valaxy";
import type { Post } from "valaxy/types";

const props = withDefaults(
  defineProps<{
    type?: string;
    posts?: Post[];
    curPage?: number;
  }>(),
  {
    curPage: 1,
  }
);

const site = useSiteStore();
const siteConfig = useSiteConfig();
const pageSize = computed(() => siteConfig.value.pageSize);

const posts = computed(() =>
  (props.posts || site.postList).filter((post) =>
    import.meta.env.DEV ? true : !post.hide
  )
);

const displayedPosts = computed(() =>
  posts.value.slice(
    (props.curPage - 1) * pageSize.value,
    props.curPage * pageSize.value
  )
);
</script>

<template>
  <ul class="space-y-4">
    <li
      v-for="(post, index) in displayedPosts"
      :key="post.path"
      :class="{ 'mb-0': index === posts.length - 1 }"
    >
      <PostCard :post="post" />
    </li>
  </ul>
  <ValaxyPagination
    class="mt-4"
    :cur-page="curPage"
    :page-size="pageSize"
    :total="posts.length"
  />
</template>
```

::: tip

因为主题需要，所以我在 `<li />` 遍历时添加了这一行：`:class="{ 'mb-0': index === posts.length - 1}"`。 你可以按自己的需求参考或保留。

:::

::: warning 提醒

`<ValaxyPagination />` 如果在你的主题上调整不当，构建后其样式可能会变得异常奇怪。我建议查找它的源码，并自己重新写一个，至少我是这么做的。

:::

#### 获取文章和分类的数量

我的侧边栏的站长卡片会展示我的文章数量和分类数量。而要做到这种效果，只需要计算它们的 length 就可以了。

这里我们会用到 `useSiteStore` 和 `useCategories` 两个函数。前者老样子用于文章，后者则用于分类。

```typescript
import { useSiteStore, useCategories } from "valaxy";

// 获取数据
const site = useSiteStore();
const categories = useCategories();

// 处理文章数据
const posts = computed(() =>
  (props.posts || site.postList).filter((post) =>
    import.meta.env.DEV ? true : !post.hide
  )
);
```

这样，你就可以通过这两个函数来引用并输出主题信息了。以下是输出方法：

```vue
<template>
  <p>{{ posts.length }}</p> // 文章数量
  <p>{{ (Array.from(categories.children).length) }}</p>
</template>
```

> 理论上 tags 可以用 `{{ (Array.from(tags).length) }}` 获取，但是我这边因为一些奇怪的问题报错了。加上我不是很喜欢用 Tag 分类，如果你有这类需求就麻烦你自行研究了（（（

#### 获取近期四篇文章

还是我的侧边栏，有一个「近期文章」的卡片，会列出从新到旧的四篇文章。

获取文章就很简单了，和上面生成文章列表一样，用 `useSiteStore` 函数获取，最后再 `slice` 出四篇文章。

```vue
<script setup lang="ts">
import { useSiteStore } from "valaxy";

const site = useSiteStore();
const recentPosts = computed(() => (props.posts || site.postList).slice(0, 4));
</script>

<template>
  <div class="p-4">
    <div class="mb-3 text-sm">近期文章</div>
    <ul>
      <template v-for="post in recentPosts" :key="post.path">
        <li>
          <ul>
            <li class="text-sm">{{ formatDate(post.date as Date) }}</li>
            <RouterLink v-if="post.path" :to="post.path"
              ><span class="text-sm">{{ post.title }}</span>
            </RouterLink>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>
```

#### 生成文章目录

浏览文章的时候，目录肯定是必不可少的啦。这里需要用到 `useOutline` 函数，同时还有一个 `MenuItem` 的 TypeScript 声明。

```vue
<script setup lang="ts">
import { useOutline } from "valaxy";

const { headers, handleClick } = useOutline();
</script>

<template>
  <div class="p-4">
    <div class="mb-3 text-sm">目录</div>
    <div style="max-height:200px;overflow:scroll;">
      <OutlineItem :headers="headers" :on-click="handleClick" root />
    </div>
  </div>
</template>
```

```vue
/*- OutlineItem.vue -*/
<script setup lang="ts">
import type { MenuItem } from "valaxy";

defineProps<{
  headers: MenuItem[];
  onClick: (e: MouseEvent) => void;
  root?: boolean;
}>();
</script>

<template>
  <ul :class="root ? 'root' : 'nested'" class="toc">
    <li
      v-for="{ children, link, title, lang } in headers"
      :key="link"
      class="va-toc-item"
      :lang="lang || 'zh-CN'"
    >
      <a class="outline-link" :href="link" @click="onClick">
        {{ title }}
      </a>
      <template v-if="children?.length">
        <OutlineItem :headers="children" :on-click="onClick" />
      </template>
    </li>
  </ul>
</template>
```

> 这里不用 `<RouterLink />` 是因为点击之后并不会触发。

#### 文章导航

当你阅览完文章之后，如果尚有兴趣，肯定会向上或向下一篇文章继续阅读。Valaxy 专门提供了一个 `usePrevNext` 函数，供我们制作这个文章导航。

```vue
<script setup lang="ts">
import { usePrevNext } from "valaxy";

const [prev, next] = usePrevNext();
</script>

<template>
  <div class="my-4">
    <div class="grid grid-cols-2">
      <div class="text-left">
        <div class="font-bold">上一篇文章</div>
        <RouterLink v-if="prev" :to="prev.path || ''" :title="prev.title">
          {{ prev.title }}
        </RouterLink>
        <div v-else>别看了，没有了</div>
      </div>
      <div class="text-right">
        <div class="font-bold">下一篇文章</div>
        <RouterLink v-if="next" :to="next.path || ''">
          <span class="i-ic-baseline-home"></span>
          {{ next.title }}
        </RouterLink>
        <div v-else>别看了，没有了</div>
      </div>
    </div>
  </div>
</template>
```

### 制作返回顶部的按钮

经过对大多数博客的观察后，我认为我对返回顶部按钮的需求是：长期至于页面右下角，并且优先级高于所有元素，不论遮挡。而这个按钮的实现方式并不复杂，因为 `<a href="#" />` 会强制让你返回到顶部。

```vue
<template>
    <div class="fixed bottom-0 right-0 m-8 z-50">
        <a href="#" class="button is-large is-info">
            <span class="icon i-ic-baseline-arrow-upward"></span>
        </a>
  </div>
</template>
```

## End

在前天刚发布这一篇文章的时候，写的水分实在太高了。虽然我发这篇文章的目的就是要水文，但就按那样子写可能真的不会给人多大帮助，虽然这一篇修改过后的文章也不会有多大帮助就是了。

虽然手头上还有很多特性和 Bug 等待处理，但不得不说，Valaxy 真的是一个非常好用的博客框架，如果你已经跃跃欲试的话，我建议你立即行动起来。

以及，我的博客今后不会再开源，只有对应仓库访问权限的人才能够看到源码。但上述部分我放出了很多我的博客所使用的原始代码，虽然在不断的 Bug 修复后已经逐渐改变。还是那句话：希望对你有所帮助。
