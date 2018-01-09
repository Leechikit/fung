# Fung

[![npm][npm]][npm-url]

[![node][node]][node-url]
[![downloads][downloads]][downloads-url]
[![builds][builds]][builds-url]
[![licenses][licenses]][licenses-url]

## What is Fung?

一个远程构建项目结构工具。

## Install

```
$ npm install --global fung
```

## Usage

### 创建项目模板仓库

仓库中的每一个分支代表一个项目模板，在项目模板的根目录下创建一个配置文件`fung-config.js`，在创建项目结构时可以根据用户输入替换内容。

```
{
    project: {
        type: "input",
        message: "请输入项目名："
    },
    system: {
        type: "list",
        message:"请选择项目类型：",        
        choices: [
            {
                name: "mobile",
                value: "mobile"
            },
            {
                name: "pc",
                value: "pc"
            }
        ]
    }
}
```
问题配置格式与[inquirer](https://www.npmjs.com/package/inquirer#question)模块一致。

A question object is a hash containing question related values:

* **type:** (String) Type of the prompt. Defaults: input - Possible values: input, confirm, list, rawlist, expand, checkbox, password, editor
* **name:** (String) The name to use when storing the answer in the answers hash. If the name contains periods, it will define a path in the answers hash.
* **message:** (String|Function) The question to print. If defined as a function, the first parameter will be the current inquirer session answers.
* **default:** (String|Number|Array|Function) Default value(s) to use if nothing is entered, or a function that returns the default value(s). If defined as a function, the first parameter will be the current inquirer session answers.
* **choices:** (Array|Function) Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current inquirer session answers. Array values can be simple strings, or objects containing a name (to display in list), a value (to save in the answers hash) and a short (to display after selection) properties. The choices array can also contain a Separator.
* **validate:** (Function) Receive the user input and answers hash. Should return true if the value is valid, and an error message (String) otherwise. If false is returned, a default error message is provided.
* **filter:** (Function) Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the Answers hash.
* **when:** (Function, Boolean) Receive the current user answers hash and should return true or false depending on whether or not this question should be asked. The value can also be a simple boolean.
* **pageSize:** (Number) Change the number of lines that will be rendered when using list, rawList, expand or checkbox.
* **prefix:** (String) Change the default prefix message.
* **suffix:** (String) Change the default suffix message.

### 配置项目模板仓库的地址
```
fung remote [repertory]
```

### 根据选择的项目模板创建项目结构
```
fung build [projectName]
```

* **projectName:** 需要构建的项目名即分支名，选填。

## Command

### fung remote [repertory]
配置项目模板仓库的地址

* **repertory:** 远程目录地址。

### fung list
累出项目模板仓库中所有项目模板，即分支。

### fung build [projectName]
根据选择的项目模板创建项目结构。

* **projectName:** 需要构建的项目名即分支名，选填。

### fung push
提交新的项目模板到项目模板仓库。

[npm]: https://img.shields.io/npm/v/fung.svg
[npm-url]: https://npmjs.com/package/fung

[node]: https://img.shields.io/node/v/fung.svg
[node-url]: https://nodejs.org

[downloads]: https://img.shields.io/npm/dm/fung.svg
[downloads-url]: https://www.npmjs.com/package/fung

[builds-url]: https://ci.appveyor.com/project/sokra/webpack/branch/master
[builds]: https://ci.appveyor.com/api/projects/status/github/webpack/webpack?svg=true

[licenses]: https://img.shields.io/npm/l/fung.svg
[licenses-url]: https://www.npmjs.com/package/fung