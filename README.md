# Member Sort Extension for Google Meet

![build](https://github.com/SotaYamaguchi/member-sort-extension-for-google-meet/workflows/build/badge.svg)

[chrome-extention.zip](https://github.com/SotaYamaguchi/member-sort-extension-for-google-meet/releases)

![image](https://user-images.githubusercontent.com/24993603/124685156-aae99080-df0b-11eb-94fd-aa7fcdc861e8.png)

## 使い方

- `dist` ディレクトリが生成されていること

  - `dist` ディレクトリがない場合は下に記載のある Setup・Build を実行する

- `chrome://extensions/` にアクセスし、「パッケージ化されていない拡張機能を取り込む」をクリック

- `chrome-extension-typescript-starter/dist` ディレクトリを取り込む

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
