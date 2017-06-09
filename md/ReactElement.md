## <span id="reactelement">ReactElement</span>
> React 暴露的接口
#### 依赖
* [ReactBaseClasses](#reactbaseclasses)
* [ReactChildren](#reactchildren)
* [ReactElement](#reactelement)

#### 主要方法说明
```javascript
\\line 20 :
var REACT_ELEMENT_TYPE = require('ReactElementSymbol');
\\ReactElementSymbol line 17 : Symbol 或者使用 0xeac7 标识 ReactElement
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;
```
```javascript

```