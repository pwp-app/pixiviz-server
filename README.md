<div align="center"><img width="100" src="https://img.backrunner.top/pixiv-c/logo.png"></div>
<h1 align="center">Pixiviz</h1>

## 概述

Pixiviz 本身是一个使用了 Pixivic 接口的纯前端项目，但是由于他们的接口在一些功能上做了权限，加上站点PV/UV也有增长，为了维系站点的运作，这个后端项目就这么诞生了。

我会逐渐把项目的API进行切割，逐渐对接到这边。

## Docker 部署

```bash
cd /home
git clone https://github.com/pwp-app/pixiviz-server.git

cd pixiviz-server

# 修改 docker-compose.yml 里的 redis 密码和暴露端口等

mkdir redis

# 确保 docker 有 redis 目录的权限

docker compose build
docker compose up -d
```

## 技术说明

服务器基于 Node + Egg.js，封装的是 Pixiv iOS Client 的 API。

由于站点完全无盈利，属于技术交流的项目，为了避免服务器接口被滥用，服务器依赖 egg-security 设置了 CORS  限制。

如果你需要使用相关的 API，可以克隆本项目自行部署代码在你的服务器上。

## 特别感谢

非常感谢 [pixiv-api-client](https://github.com/alphasp/pixiv-api-client) 给本项目提供的灵感。

## 许可证

Apache 2.0