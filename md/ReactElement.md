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

  //处理 config 参数，
  //RESERVED_PROPS 对应的4个参数 ref,key,__self,__source 赋值
  //其余的参数赋值给 props 对象
  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  //处理第三个 children 参数
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    //只有3个参数，直接赋值
    props.children = children;
  } else if (childrenLength > 1) {
    //大于3个参数，支持 createElement(type, config, children1, children2...)的传参形式
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  //如果定义了 type.defaultProps 默认值，props 对象添加未参入参数的默认值
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
};
```
see [react-api#createElement](https://facebook.github.io/react/docs/react-api.html#createelement)
