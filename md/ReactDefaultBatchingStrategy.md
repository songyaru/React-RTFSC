## <span id="reactdefaultbatchingstrategy">ReactDefaultBatchingStrategy</span>
>暴露 [ReactDefaultBatchingStrategy.batchedUpdates](#code_reactdefaultbatchingstrategy) 方法,该方法中的 Transaction 包装方法为：RESET_BATCHED_UPDATES、FLUSH_BATCHED_UPDATES

#### 主要方法说明
```javascript
//line 19 :
//初始化 ReactDefaultBatchingStrategyTransaction ，预置 Transaction 包装方法

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false; //重置状态
  },
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates), //重绘 dirtyComponents 中脏组件
};

Object.assign(ReactDefaultBatchingStrategyTransaction.prototype, Transaction, {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },
});
var transaction = new ReactDefaultBatchingStrategyTransaction();
```
see [ReactUpdates.flushBatchedUpdates](#code_flushbatchedupdates)

<span id="code_reactdefaultbatchingstrategy"></span>
```javascript
//line 45 :
var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,
  batchedUpdates: function(callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
    // transtion closeAll 将此值重置为 false
    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      //只执行 callback 回调
      return callback(a, b, c, d, e);
    } else {
      //执行 ReactDefaultBatchingStrategyTransaction 的包装方法 （重置状态、重绘 dirtyComponents 中脏组件）
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  },
};
```