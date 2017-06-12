## <span id="reactbaseclasses">ReactBaseClasses</span>
>暴露 Component 和 PureComponent
#### 主要方法说明
```javascript
//line 24 :
function ReactComponent(props, context, updater) {
  //组件实例化时将 this.updater 赋值为 ReactUpdateQueue
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

ReactComponent.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};


//ReactPureComponent 和 ReactComponent 类似，多一个标识
//ReactCompositeComponent 模块中用于区别组件,当组件继承的是 ReactPureComponent ，使用 shallowCompare 浅比较组件是否需要重绘
ReactPureComponent.prototype.isPureReactComponent = true;
```

see [ReactCompositeComponent](#reactcompositecomponent) [ReactUpdateQueue](#reactupdatequeue)
