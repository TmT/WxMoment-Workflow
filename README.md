WxMoment-Workflow 是由微信朋友圈广告团队基于 Gulp 面向广告落地页开发者提供的工作流。

工作流集成了前端开发中的常见任务，并对资源进行压缩合并优化。

### 安装 NodeJS

前往 [NodeJS 官网](https://nodejs.org/) 下载安装包并按指南安装。

### 下载工作流

下载最新的 [工作流压缩包](https://github.com/TmT/WxMoment-Workflow/releases)。

### 安装依赖

Windows 用户可以双击执行工作流目录中的 `安装.bat` 文件即可开始安装依赖。

或者执行以下命令安装：

```bash
$ cd WxMoment-Workflow
$ npm install gulp -g --registry=https://r.cnpmjs.org
$ npm install --registry=https://r.cnpmjs.org
```

### 任务介绍

**开发过程**

Windows 用户可以双击执行工作流目录中的 project 文件夹下的 `开发.bat` 开始执行任务。

或者执行命令：

```bash
$ cd WxMoment-Workflow/project
$ gulp build_dev
```

**打包**

开发完成后，执行 `project/打包.bat` 即可在 project 目录下生成 `dist.zip` 压缩包。

或者执行命令：

```bash
$ cd WxMoment-Workflow/project
$ gulp zip
```

### 更多功能介绍

**雪碧图自动合并**

**JavaScript 合并**