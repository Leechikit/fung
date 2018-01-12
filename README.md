# Fung

[![node][node]][node-url]
[![downloads][downloads]][downloads-url]
[![builds][builds]][builds-url]
[![npm][npm]][npm-url]
[![licenses][licenses]][licenses-url]

## What is Fung?

Fung helps you to kickstart new projects from a remote repertory,lets you quickly set up a project with sensible defaults and best practices.

To do so,you need to create a remote repertory that contains templates.read more informations about fung templates.

## Install

```
$ npm install --global fung
```

## Usage

```
// define a remote repertory url
fung remote https://github.com/Leechikit/fung-templates.git

// run it
fung build

// or build a template in current directory
fung build vuejs

// or build a template in a named directory
fung build vuejs my-project
```

## Command

### fung remote [repertory]
Define a remote repertory.

* `repertory`: a remote repertory url。

### fung list
List all templates in your own remote repertory.

### fung build
Build a project in your own remote repertory.

**Options**

* `--template`or`-t`: Print a template name.
* `--project`or`-p`: Print a project name.
* `--remote`or`-r`: Print a remote repertory url.

### fung push
Commit a new template to your own remote repertory.

**Options**

* `--template`or`-t`: Print a template name.
* `--project`or`-p`: Print a project name.
* `--remote`or`-r`: Print a remote repertory url.

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