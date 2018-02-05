# Fung

[![node][node]][node-url]
[![downloads][downloads]][downloads-url]
[![builds][builds]][builds-url]
[![npm][npm]][npm-url]
[![licenses][licenses]][licenses-url]

## 什么是 Fung?

Fung 是一个能从远程仓库拉取模板并快速构建项目的脚手架，用户通过填写或选择选项来定制化自己的项目。

在开始使用前，需要创建一个用于存放模板的远程的仓库，关于模板仓库请戳 [fung templates][fung-templates]

## 安装

```
$ npm install --global fung
```

## 使用

```
// 定义一个远程的模板仓库
fung remote https://github.com/Leechikit/fung-templates.git

// 直接运行选择模板安装
fung build

// 或指定一个模板安装到当前目录
fung build vuejs

// 或指定一个模板安装到指定目录
fung build vuejs my-project
```

## 命令

### fung remote [repertory]
定义一个远程的模板仓库。

* `repertory`: 远程仓库的地址

### fung list
列出远程模板仓库中的所有模板。

### fung build
从远程模板仓库中拉取，并生成一个自定制的项目目录。

**Options**

* `--template` or `-t`: 指定模板名字。
* `--project` or `-p`: 指定项目目录名字。
* `--remote` or `-r`: 指定远程模板仓库地址。

### fung push
Commit a new template to your own remote repertory.

**Options**

* `--template` or `-t`: 指定模板名字。
* `--project` or `-p`: 指定项目目录名字。
* `--remote` or `-r`: 指定远程模板仓库地址。

[npm]: https://img.shields.io/npm/v/fung.svg
[npm-url]: https://npmjs.com/package/fung

[node]: https://img.shields.io/node/v/fung.svg
[node-url]: https://nodejs.org

[downloads]: https://img.shields.io/npm/dm/fung.svg
[downloads-url]: https://www.npmjs.com/package/fung

[builds]: https://api.travis-ci.org/Leechikit/fung.svg?branch=master
[builds-url]: https://travis-ci.org/Leechikit/fung

[licenses]: https://img.shields.io/npm/l/fung.svg
[licenses-url]: https://www.npmjs.com/package/fung

[fung-templates]: https://github.com/Leechikit/fung-templates/blob/webpack-simple/README.md