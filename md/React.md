## <span id="react">React</span>
> React 暴露的接口
#### 依赖
* [ReactBaseClasses](#reactbaseclasses)
* [ReactChildren](#reactchildren)
* [ReactElement](#reactelement)
* [ReactCurrentOwner](#reactcurrentowner)

#### 主要方法说明
```javascript
var React = {
  //props.children 或者 props 属性
  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild,
  },

  Component: ReactBaseClasses.Component,
  PureComponent: ReactBaseClasses.PureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  createFactory: createFactory,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: require('ReactCurrentOwner'),
  },
};
```