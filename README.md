# Shuffle Members Extension for Google Meet

![image](./public/icon.png)

[![build](https://github.com/SotaYamaguchi/shuffle-members-extension-for-google-meet/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/SotaYamaguchi/shuffle-members-extension-for-google-meet/actions/workflows/build.yml)

[chrome-extention.zip](https://github.com/SotaYamaguchi/shuffle-members-extension-for-google-meet/releases)

![image](https://user-images.githubusercontent.com/24993603/140242306-097d7d79-9df7-4bd5-8988-10e2a039b23d.png)

## 使い方

- ターミナルにて `npm run build` を実行する

- `chrome://extensions/` にアクセスし、「パッケージ化されていない拡張機能を取り込む」をクリック

- `shuffle-members-extension-for-google-meet/dist` ディレクトリを取り込む

ここまで行うと chrome の拡張機能に表示されます

---

Chrome Extension, TypeScript and Visual Studio Code

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Option

* [Visual Studio Code](https://code.visualstudio.com/)

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Import as Visual Studio Code project

...

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Test
`npx jest` or `npm run test`

## etc.

referenced from: <https://github.com/chibat/chrome-extension-typescript-starter>
