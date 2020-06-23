<div align="center"><img width="100" src="https://img.backrunner.top/pixiv-c/logo.png"></div>
<h1 align="center">Pixiv C</h1>

## 概述

Pixiv-C 本身是一个使用了 Pixivic 接口的纯前端项目，但是由于他们的接口近期在一些功能上做了权限，为了维系站点的运作，这个后端项目就这么诞生了。

对于无法正常使用的接口，Pixiv-C Server会提供相关的替代接口。

## 技术说明

服务器基于Node + Egg.js，封装的是Pixiv iOS Client的API。

由于站点完全无盈利，属于技术交流的项目，为了避免服务器接口被滥用，服务器依赖egg-security设置了CORS限制。

如果你需要使用相关的API，可以克隆本项目自行部署代码在你的服务器上。

## 许可证

Apache 2.0