# react 源码分析 --未完待续
> react js 源码分析 v16.0.0-alpha.13

### 自动生成 markdown 和 html 文档使用说明
在 build/md/ 目录下生成 markdown 文档
```shell
node script [文件名] #文件名默认为 React
```


同时生成 HTML 和 markdown 文档

```shell
npm install #安装需要的依赖包

npm run html [文件名]
#如需要 ReactDOMFiberEntry 的文档 则执行：npm run html ReactDOMFiberEntry
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
    entry: 'src/isomorphic/ReactEntry.js',
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
    entry: 'src/renderers/dom/fiber/ReactDOMFiberEntry.js',
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
发现 `React` 和 `ReactDOM` 的打包入口 js 分别是 `src/isomorphic/ReactEntry.js` 和 `src/renderers/dom/fiber/ReactDOMFiberEntry.js`

源码的分析就从这两个文件入手，执行 `node script` 和 `node script ReactDOMFiberEntry` 生成这两个文件的 markdown 文档。

补充：减少 development 开发环境生成代码中 `__DEV__` 部分的干扰，build 手动去除掉
```javascript
//scripts/error-codes/dev-expression-with-codes.js line 62 :
//path.replaceWith(DEV_EXPRESSION); 替换成 :
path.replaceWithSourceString("false");
```
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