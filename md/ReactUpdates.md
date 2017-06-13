## <span id="reactupdates">ReactUpdates</span>
> 约定组件重绘过程的 Transaction 包装方法

#### 依赖
* [PooledClass](#pooledclass)
* [Transaction](#transaction)
* [ReactReconciler](#reactreconciler)
* [ReactReconcileTransaction](#reactreconciletransaction)
* [ReactDefaultBatchingStrategy](#reactdefaultbatchingstrategy)
#### 主要方法说明
```javascript
//line 33 :
var NESTED_UPDATES = {
  initialize: function() {
    this.dirtyComponentsLength = dirtyComponents.length;
  },
  close: function() {
    if (this.dirtyComponentsLength !== dirtyComponents.length) {
      // Additional updates were enqueued by componentDidUpdate handlers or
      // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
      // these new updates so that if A's componentDidUpdate calls setState on
      // B, B will update before the callback A's updater provided when calling
      // setState.
      // 在组件重绘过程中，再度添加脏组件，剔除 dirtyComponents 中已重绘的组件，调用 flushBatchedUpdates 重绘新添加的脏组件
      dirtyComponents.splice(0, this.dirtyComponentsLength);
      flushBatchedUpdates();
    } else {
      dirtyComponents.length = 0;
    }
  },
};
```
see [flushBatchedUpdates](#code_flushbatchedupdates)
```javascript
//line 198 : 注入 ReactReconcileTransaction 和 ReactDefaultBatchingStrategy
var ReactUpdatesInjection = {
  //ReactReconcileTransaction
  injectReconcileTransaction: function(ReconcileTransaction) {
    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
  },

  //ReactDefaultBatchingStrategy
  injectBatchingStrategy: function(_batchingStrategy) {
    batchingStrategy = _batchingStrategy;
  },
};
//由 ReactDOMInjection line 55 调用
ReactUpdates.injection.injectReconcileTransaction(ReactReconcileTransaction);
ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);
```
```javascript
//line 103 :
function batchedUpdates(callback, a, b, c, d, e) {
  ensureInjected();
  return batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
}
```
see [ReactDefaultBatchingStrategy.batchedUpdates](#code_reactdefaultbatchingstrategy)

<span id="code_runbatchedupdates"></span>
```javascript
//line 120 :
// 调用dirtyComponents中各组件的performUpdateIfNecessary以重绘该组件
// 并将该组件更新完成的回调_pendingCallbacks添加到ReactUpdatesFlushTransaction后置钩子中
function runBatchedUpdates(transaction) {
  var len = transaction.dirtyComponentsLength;

  // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.
  // 以组件的挂载顺序排序
  dirtyComponents.sort(mountOrderComparator);

  // Any updates enqueued while reconciling must be performed after this entire
  // batch. Otherwise, if dirtyComponents is [A, B] where A has children B and
  // C, B could update twice in a single batch if C's render enqueues an update
  // to B (since B would have already updated, we should skip it, and the only
  // way we can know to do so is by checking the batch counter).
  updateBatchNumber++;

  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, it will still
    // be here, but we assume that it has cleared its _pendingCallbacks and
    // that performUpdateIfNecessary is a noop.
    var component = dirtyComponents[i];

    ReactReconciler.performUpdateIfNecessary(
      component,
      transaction.reconcileTransaction,//ReactUpdatesFlushTransaction ->
      updateBatchNumber,
    );
  }
}
```
see [ReactReconciler.performUpdateIfNecessary](#code_performupdateifnecessary)

<span id="code_flushbatchedupdates"></span>
```javascript
//line 162 :
var flushBatchedUpdates = function() {
   // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
   // array and perform any updates enqueued by mount-ready handlers (i.e.,
   // componentDidUpdate) but we need to check here too in order to catch
   // updates enqueued by setState callbacks.
   while (dirtyComponents.length) {
     var transaction = ReactUpdatesFlushTransaction.getPooled();
     transaction.perform(runBatchedUpdates, null, transaction);
     ReactUpdatesFlushTransaction.release(transaction);
   }
 };
```
see [runbatchedupdates](#code_runbatchedupdates)
