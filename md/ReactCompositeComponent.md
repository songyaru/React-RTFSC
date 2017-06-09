## <span id="reactcompositecomponent">ReactCompositeComponent</span>
>用于实例化组件、及完成组件元素的挂载、重绘组件 （extends React.Component 的用户自定义组件）

#### 依赖
* [ReactReconciler](#reactreconciler)
>用于发起顶层组件或子组件的挂载、卸载、重绘机制。


#### 主要方法说明
```javascript
//Lazily allocates the refs object and stores `component` as `ref`.
//line 1322 : 对外提供接口，用于向组件实例 ReactComponentInstance 添加 this.refs 属性
attachRef: function(ref, component) {
  var inst = this.getPublicInstance();
  invariant(inst != null, 'Stateless function components cannot have refs.');
  var publicComponentInstance = component.getPublicInstance();// 子组件的实例
  var refs = inst.refs === emptyObject ? (inst.refs = {}) : inst.refs;
  refs[ref] = publicComponentInstance;
}
```

<span id="code_reactcompositecomponent_performupdateifnecessary"></span>
```javascript
//line 804 :
performUpdateIfNecessary: function(transaction) {
  // ReactDom.render方法渲染时包裹元素由 react 组件渲染，将待渲染的元素 push 到 _pendingElement中
  if (this._pendingElement != null) {
    ReactReconciler.receiveComponent(
      this,
      this._pendingElement,
      transaction,
      this._context,
    );
  } else if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
    // 通过调用组件的setState、replaceState、forceUpdate方法重绘组件
    this.updateComponent(
      transaction,
      this._currentElement,
      this._currentElement,
      this._context,
      this._context,
    );
  } else {
    var callbacks = this._pendingCallbacks;
    this._pendingCallbacks = null;
    if (callbacks) {
      for (var j = 0; j < callbacks.length; j++) {
        transaction
          .getReactMountReady()
          .enqueue(callbacks[j], this.getPublicInstance());
      }
    }
    this._updateBatchNumber = null;
  }
}
```