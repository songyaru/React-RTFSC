## <span id="reactreconciler">ReactReconciler</span>
>用于发起顶层组件或子组件的挂载、卸载、重绘机制。

#### 依赖
* [ReactRef](#reactref)
>创建、销毁、比对reactElement的refs属性相关

#### 主要方法说明
```javascript
//line 39:
//ReactMount模块调用，用于挂载 react 组件 （组件的 render 方法）
//ReactCompositeComponent模块中调用，用于挂载已实例化的用户自定义组件下的指定子组件  todo
mountComponent: function(
  internalInstance,
  transaction,
  hostParent,
  hostContainerInfo,
  context,
  parentDebugID, // 0 in production and for roots
) {
  //将组件实例转化为DomLazyTree后添加到文档中，并执行componentDidMount方法 todo???
  var markup = internalInstance.mountComponent(
    transaction,
    hostParent,
    hostContainerInfo,
    context,
    parentDebugID,
  );
  //向ReactReconcileTransaction实例的 Transaction 包装方法中添加attachRefs回调函数，组件绘制完成后执行
  if (
    internalInstance._currentElement &&
    internalInstance._currentElement.ref != null
  ) {
    transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
  }
  return markup;
}
```
`transaction.getReactMountReady().enqueue` 参见 [ReactReconcileTransaction](#reactreconciletransaction)
```javascript
//line 131 : Update a component using a new element
receiveComponent: function(
  internalInstance,
  nextElement,
  transaction,
  context,
) {
  var prevElement = internalInstance._currentElement;

  if (nextElement === prevElement && context === internalInstance._context) {
    //无需更新
    return;
  }

  // 判断组件元素的refs属性是否需要更新
  var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);

  if (refsChanged) {
    //移除组件元素的refs属性
    ReactRef.detachRefs(internalInstance, prevElement);
  }

  //更新组件，内部调用 render 方法重新生成待挂载的元素ReactElement
  //当 internalInstance 为用户自定义组件时，其下包含的子节点也将更新
  internalInstance.receiveComponent(nextElement, transaction, context);

  if (
    refsChanged &&
    internalInstance._currentElement &&
    internalInstance._currentElement.ref != null
  ) {
    // 更新refs属性
    transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
  }
},
```
<span id="code_performupdateifnecessary"></span>
```javascript
//line 193 : Flush any dirty changes in a component.
performUpdateIfNecessary: function(
  internalInstance,
  transaction,
  updateBatchNumber,
) {
  //internalInstance._updateBatchNumber 把组件添加到脏组件时+1，重绘
  //updateBatchNumber 当 ReactUpdates.flushBatchedUpdates方法执行时+1
  //当组件被添加到脏组件的时候，须重绘组件，由 ReactUpdates.enqueueUpdate 方法完成
  if (internalInstance._updateBatchNumber !== updateBatchNumber) {
    // The component's enqueued batch number should always be the current
    // batch or the following one.
    return;
  }

  //internalInstance 包含 _pendingElement、_pendingStateQueue、_pendingForceUpdate 用以判断更新方式
  //_pendingStateQueue为state数据变化引起，由this.setState方法发起
  //_pendingForceUpdate 为调用this.forceUpdate方法发起

  //子组件递归调用ReactReconciler.receiveComponent方法
  //ReactCompositeComponent line  804 :
  internalInstance.performUpdateIfNecessary(transaction);
}
```
[ReactUpdates.runBatchedUpdates](#code_runbatchedupdates) 调用
[ReactCompositeComponent.performUpdateIfNecessary](#code_reactcompositecomponent_performupdateifnecessary) 调用

