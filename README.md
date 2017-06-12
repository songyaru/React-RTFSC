# 未完待续
> react js 源码分析 和 reactNative Android 源码分析

### 自动生成 markdown 文档使用说明
>默认在 build 文件夹生成 React.md

```shell
node script
```
或者 :

```shell
npm run build 
```
>如需要生成特定文件的 markdown ，如 ReactComponet.md 执行：

```shell
node script ReactComponet
```
或者 :
```shell
npm run build ReactComponet
```

### react-js 编译脚本简单分析
从 `pacakage.json`中发现代码合并入口在 build.js 中
```json
{
  "scripts": {
    "build": "npm run version-check && node scripts/rollup/build.js",
  }
}
```
```javascript
//build.js line 461 : 为了减少生成代码的干扰，可以把一些不需要生成的文件注释掉，只保留 dev 环境下的 umd 代码
const tasks = [
  // Packaging.createFacebookWWWBuild,
  // Packaging.createReactNativeBuild,
];
for (const bundle of Bundles.bundles) {
  tasks.push(
    () => createBundle(bundle, UMD_DEV)
    // ,() => createBundle(bundle, UMD_PROD),
    // () => createBundle(bundle, NODE_DEV),
    // () => createBundle(bundle, NODE_PROD),
    // () => createBundle(bundle, FB_DEV),
    // () => createBundle(bundle, FB_PROD),
    // () => createBundle(bundle, RN_DEV),
    // () => createBundle(bundle, RN_PROD)
  );
}
// 其中 Bundles 由 bundles.js 定义
```
```javascript
//bundles.js line 36 :
const bundles = [
  /******* Isomorphic *******/
  {
    config: {
      destDir: 'build/',
      moduleName: 'React',
      sourceMap: false,
    },
    entry: 'src/isomorphic/React.js',
    externals: [
      'create-react-class/factory',
      'prop-types',
      'prop-types/checkPropTypes',
    ],
    fbEntry: 'src/fb/ReactFBEntry.js',
    paths: [
      'src/isomorphic/**/*.js',

      'src/ReactVersion.js',
      'src/shared/**/*.js',
    ],
  },

  /******* React DOM *******/
  {
    babelOpts: babelOptsReact,
    bundleTypes: [UMD_DEV, UMD_PROD, NODE_DEV, NODE_PROD, FB_DEV, FB_PROD],
    config: {
      destDir: 'build/',
      globals: {
        react: 'React',
      },
      moduleName: 'ReactDOM',
      sourceMap: false,
    },
    entry: 'src/renderers/dom/fiber/ReactDOMFiber.js',
    externals: ['prop-types', 'prop-types/checkPropTypes'],
    fbEntry: 'src/fb/ReactDOMFiberFBEntry.js',
    paths: [
      'src/renderers/dom/**/*.js',
      'src/renderers/shared/**/*.js',

      'src/ReactVersion.js',
      'src/shared/**/*.js',
    ],
  }
}
```
发现 `React` 和 `ReactDOM` 的打包入口 js 分别是 `src/isomorphic/React.js` 和 `src/renderers/dom/fiber/ReactDOMFiber.js`

源码的分析就从这两个文件入手，执行 `node script` 和 `node script ReactDOMFiber` 生成这两个文件的 markdown 文档。

### 利用 chrome 调试源码
创建一个 html，引入 build 目录下生成的源码打包文件
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script type="text/javascript" src="../build/dist/react.development.js"></script>
  <script type="text/javascript" src="../build/dist/react-dom.development.js"></script>
  <!--<script type="text/javascript" src="babel.min.js"></script>-->
</head>
<body>
<div id="example"></div>

<!--<script type="text/babel" src="./main.js"></script>-->
<script type="text/javascript" src="./main.js"></script>
</body>
</html>
```
如果浏览器不支持 ES6 的语法，可以引入`babel.js`，使用`<script type="text/babel" src="./main.js"></script>`的方式来运行

chrome 当前最新版已经支持 ES6（当前是v59，再往前推几个版本也是支持的），打开支持的方式如下：
```
访问 chrome://flags/
搜索 #enable-javascript-harmony
点击 "启用"
```
另外也可以安装 `JetBrains IDE Support` 这个浏览器插件，在 intellij 或者 webstorm 里面调试。请参见[WebStorm强大的调试JavaScript功能](http://blog.csdn.net/sujun10/article/details/54139560).