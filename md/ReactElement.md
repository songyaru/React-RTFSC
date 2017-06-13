## <span id="reactelement">ReactElement</span>
> React 暴露的接口

#### 依赖
* [ReactCurrentOwner](#reactcurrentowner)

#### 主要方法说明
```javascript
//line 20 :
var REACT_ELEMENT_TYPE = require('ReactElementSymbol');
//ReactElementSymbol line 17 : Symbol 或者使用 0xeac7 标识 ReactElement
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;
```
```javascript
//line 183 : createElement
ReactElement.createElement = function(type, config, children) {
  //type 为用户自定义组件的构造函数,或者内部组件的字符串（如 div）
  /*
  line 22 : config 的参数
  var RESERVED_PROPS = {
    key: true,
    ref: true, //上层组件元素的引用
    __self: true,
    __source: true,
  };
  */
}
```
see [react-api#createElement](https://facebook.github.io/react/docs/react-api.html#createelement)
```javascript
//line 275 : createFactory


//line 286 : cloneAndReplaceKey

```