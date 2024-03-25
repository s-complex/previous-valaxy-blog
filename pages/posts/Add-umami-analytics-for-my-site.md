---
title: 记一次给网站添加 Umami 统计
date: 2024-2-21
description: 日常滚答辩山，但是这一次有了新发现（？
banner: https://i.yecdn.com/images/2024/03/02/eac3dc442b26a318138f02bc3a3583cc.webp
categories: 技术
---

之前在 Vercel 和 Cloudflare Workers Site 中飘忽不定，最后是因为 Cloudflare Workers 的 script 难写 + 速度不理想，将网站定居在了 Vercel。但是，虽然 Vercel 的文档有说「可以使用 Cloudflare 的代理为你的 Vercel 解析作反代」，但那速度可想而知。

这还不是重点，重点是如果不走 Cloudflare 的代理，域名的请求量访客量什么的全都是 0，而我需要一个统计服务来统计我的网站访客数据。好嘛，之前看到 Artalk 的时候也看到了一个叫做 Umami 的统计服务，干脆就继续薅 [表情酱](https://flyemoji.moe) 的机子搭这玩意了。

## 在服务器上部署

老样子，还是用 Docker 进行搭建。但我们先来看一个前情提要：

> 因为 Umami 提供了一个 Docker Compose 配置文件，所以我只需一行 `docker compose up -d` 就能轻轻松松的部署了。但是，在我配置 Cloudflare Tunnel 的时候，尽管我再三确认地址什么的没有错（容器默认叫 `umami-umami-1`，端口是 3000，所以地址是 `umami-umami-1:3000`），但访问就只跳出来一个 HTTP 502，反倒是直接访问源地址就没有问题。
>
> 一查才知道，Umami 要和 `cloudflared` 处在同一个子网下，这下糖完了。

前情提要看完了，我们该做什么也知道了。首先就是来看一下这个 `docker-compose.yml`：

```yaml
---
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: replace-me-with-a-random-string
    depends_on:
      db:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "curl http://localhost:3000/api/heartbeat"]
      interval: 5s
      timeout: 5s
      retries: 5
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
volumes:
  umami-db-data:
```

上面也提到了，我们要将 Umami 容器塞到 `cloudflared` 所在的子网内。假设这个子网名为 `rc-network`，那么需要对容器进行子网配置：

```yaml{16,31,39,40,41}
---
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: replace-me-with-a-random-string
    depends_on:
      db:
        condition: service_healthy
    restart: always
    networks: rc-network
    healthcheck:
      test: ["CMD-SHELL", "curl http://localhost:3000/api/heartbeat"]
      interval: 5s
      timeout: 5s
      retries: 5
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    restart: always
    networks: rc-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
volumes:
  umami-db-data:
networks:
  rc-network:
    external: true
```

这样，执行 `docker compose up -d` 之后，Umami 容器就会顺理成章的丢在 `rc-network` 下了，此时你也可以正常通过 Cloudflare Tunnel 链接并访问这个容器。

## 在项目上配置

因为我的项目基本都是基于 Vite + Vue 3，所以这里提供一个在 `App.vue` 中应用的方式。

在添加网站后，进入对应网站的设置，在 跟踪代码 这一个 Tab 里会给你一个 `<script>` 代码：

```html
<script async src="https://umami.yourdomain/script.js" data-website-id="your-website-id"></script>
```

原本我也是想学别人，在根目录里加一个 `index.html` 然后丢这个代码进去。但想了想，好像有点多余，最后在查资料下决定用 `onMounted` 函数实现相同的效果：

```vue
<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://umami.yourdomain/script.js'
  script.dataset.websiteId = 'your-website-id'
  document.head.appendChild(script)
})
</script>
```

这样你就可以在你的项目上成功添加 Umami 统计了。
