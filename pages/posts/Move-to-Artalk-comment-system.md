---
title: 迁移评论系统至 Artalk
date: 2024-1-2
description: 或许是换成 Waline 之后的一两年再度迁移评论系统。
banner: https://i.yecdn.com/images/2024/03/02/f267e7cee1ce32e3e125a3c11be2c2c9.webp
categories: 技术
---

::: tip

本文封面来自 [GitHub: ArtalkJS/Artalk](https://github.com/ArtalkJS/Artalk)，我后期使用 Photoshop 简单进行了 16:9 适配。

:::

## 缘由

我的博客原先使用 Waline 作为评论系统。到了一两个月前，也就是我重构网站那一会，我发现继续使用 Waline 将会面临以下两个问题：

- 由于我的 Waline 实例部署在 Vercel 上、借助 Serverless Functions 运行，在添加评论通知（仅邮件）的情况下评论需要大致 6s，而这 6s 包括了 Waline 处理邮件通知的时间和极大可能的 Serverless Functions 冷启动时间；
- Waline 的后端实在过于简单，当时迁移数据库到 TiDB Cloud 后出现了几个空账户我还没法删除，自己的个人邮箱更换新域名也没有办法在后端直接更改。

嘛，有困难就要找解决方法。正好在逛友站 **的友站** 时注意到了 Artalk 这一款评论系统，后端强大、功能完善使我十分心动，于是我就开始计划评论系统的迁移。 ~~哪知，当天有主意当天就做完了，令人感叹~~

## 部署

### 服务端部署

Artalk 2 后端采用 Go 编写，要想跑起来肯定是需要服务器的啦，我这里使用了 [表情酱](https://github.com/flyemoj1) 友情提供的虚拟主机来部署ww。

::: tip

Artalk 支持站点隔离，一个实例可提供多个站点的评论功能。

如果哪一天表情酱也开始搞博客了，我就拉他一起来用 Artalk 啦ww。

:::

为了方便管理，我这里采用了 Docker 部署。不过，因为后面的一些需求，我们这里要先来创建一个子网：

```shell
# 语法格式
docker network create --subnet=[网段] [子网名称]

# 示例
docker network create --subnet=172.20.0.0/16 rc-network
```

接着，拿到官方的 Docker 部署命令，来稍稍做一下修改：

```shell
docker run -d \
    --net rc-network \
    --ip 172.20.0.2 \
    --name artalk \
    -p 8080:23366 \
    -v $(pwd)/data:/data \
    --restart=always \
    artalk/artalk-go
```

容器创建完成后，你会发现它已经划到了 `rc-network` 子网并分配到了 `172.20.0.2` 这个 IP。这个到下面的部分我们才会用到，先不要着急，来配置一下 Artalk 的管理员账号：

```shell
docker exec -it artalk artalk admin
```

接下来它会提示你输入用户名、邮箱和密码以创建超级管理员。创建好之后访问 `服务器IP:8080` 并输入刚刚设定的超级管理员的邮箱和密码，即可进入 Artalk 后台。

### 配置 Cloudflare Tunnel

在开始完全计划的前一天，我尝试登录表情酱的这一台虚拟主机，但 ssh 总是显示连接超时；今天则是通过对应的域名登录上了这一台虚拟主机，也就是说我现在不知道这个虚拟主机的公网 IP 是什么。

不知道也不是不行，正好可以试一下 Cloudflare Tunnel，也就是之前的 Argo Tunnel，可以将内网资源安全的连接上 Cloudflare 网络。

首先前往 Cloudflare 的 [Zero Trust 仪表盘](https://one.dash.cloudflare.com/)，在侧边栏依次找到 `Access` → `Tunnels`，选择 `Create a tunnel` 以新建一个 Tunnel。创建时会要求你填一个 Tunnel 名字，我的建议是填一个比较方便辨认的；接下来就是在服务器上安装并运行 Tunnel connector，因为上面 Artalk 采用了 Docker 部署，所以在 Choose your environment 处选择 `Docker`，拿到 Docker 部署命令之后再来修改一下：

```shell
docker run -d \
    --net rc-network \
    --ip 172.20.0.3 \
    cloudflare/cloudflared:latest \
    tunnel \
    --no-autoupdate run \
    --token [你的密钥]
```

::: warning 提醒

只要新增 `--net` 和 `--ip` 两行即可，其它按照 Cloudflare Tunnel 给你的 Docker 部署命令来就行。

:::

这里将 Tunnel Connector 与 Docker 分配在了同一个子网中，易于管理。

执行上述的 Docker 部署命令并部署成功 Tunnel connector 后，返回 Zero Trust 仪表盘，你会发现底下的 Connectors 多出了一个服务器，点 Next 继续即可。最后便是设置 Tunnel 路由，默认是创建 Public Hostname 就不要变动了；上面的 Public hostname 按你自己喜好来设置，下方的 Services 我是设置了 `Type: HTTP` 以及 `URL: artalk:23366`。

::: tip

Docker 可以通过 `容器名称:端口` 来连接到这个容器，所以在这里就不用担心 Docker 容器 IP 的变动了。

:::

Tunnel 部署完成后，你可以尝试访问你设置的 public hostname 来验证是否能够访问到 Artalk 后端。

### 添加 Redis

为了让 Artalk 加载数据时速度更快，这里就来多加一个 Redis。

先来创建一个 Redis 容器：

```shell
docker run -d \
--net rc-network \
--ip 172.20.0.3 \
--name redis \
redis
```

执行命令后，一个没有用户密码的 Redis 容器就创建好了，因为仅 Artalk 使用所以也不需要认证。

访问 Artalk 后台，在设置里找到「缓存」一项。先勾选「启用缓存」，并将缓存类型设置为 redis，最后将缓存服务器地址设置为 `redis:6379` 并保存即可。记得注意「Redis 配置」的连接方式一定要是 TCP。

保存完毕后重启一次 Artalk 容器，如果没有什么问题，那就恭喜你完成部署这一部分啦~

## 接入到博客

因为 Artalk 的文档也采用了 VitePress，我这里只要参考 [官方的参考](https://artalk.js.org/guide/frontend/import-blog.html#vitepress) 即可，不要忘了在参考之前先在项目里 `pnpm add artalk` 喔。

接入后在本地 dev 测试可能会报 _请求无效，请检查 `trusted_domains` 配置项，无法获取评论列表数据_ 这一行字样，其实问题不是很大，部署到生产环境之后就没什么问题啦。

::: tip

~~由于 Vuetify 切换 暗色 / 亮色 主题的 DOM 实在太奇怪了（几乎是每一个组件都带有一个 `v-theme--dark`，不知道是不是我没配置好...），所以手动切换 暗色 / 亮色 主题后 Artalk 不会主动跟随，到时候我再想想怎么办吧。~~

修改本文时已切换到 Bulma，所以深色模式暂时取消。

:::

## 后记

因为没想到迁移 Artalk 所需要的时间这么短（几个小时不到），所以很多东西没来得及整，你留下的评论我并不能第一时间收到。

另外一个新域名可能不久就要来到了，到时候 Artalk 将会解析在上面，再慢慢整一些细节的东西吧~

> 本文于 2024/2/6 进行二次修改。
