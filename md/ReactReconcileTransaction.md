## <span id="reactreconciletransaction">ReactReconcileTransaction</span>
>

#### 依赖
* [PooledClass](#pooledclass)
> 提供实例池，管理函数实例的生成和销毁
* [CallbackQueue](#callbackqueue)
> 回调队列的集中管理
* [ReactBrowserEventEmitter](#reactbrowsereventemitter) todo
> 默认使用 ReactEventListener模块的同名方法
* [Transaction](#transaction) todo
> 方法包装，类似 aop ,方法执行前先执行 initializeAll ，方法执行完成后再执行 closeAll
* [ReactUpdateQueue](#reactupdatequeue)
>
* [ReactInputSelection](#reactinputselection)
> 输入框的文字选中，获取焦点等工具方法
#### 主要方法说明
```javascript
//line 115 :
function ReactReconcileTransaction(useCreateElement) {
  // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactDOMTextComponent` checks it in `mountComponent`.`
  this.renderToStaticMarkup = false;

  //挂载组件生命期的回调函数
  this.reactMountReady = CallbackQueue.getPooled(null);

  //是否使用 document.createElement 方法
  this.useCreateElement = useCreateElement;
}
```
```javascript
//line 26 :
var SELECTION_RESTORATION = {
  initialize: ReactInputSelection.getSelectionInformation,
  close: ReactInputSelection.restoreSelection,
};
var EVENT_SUPPRESSION = {
  initialize: function() {
    var currentlyEnabled = ReactBrowserEventEmitter.isEnabled();
    ReactBrowserEventEmitter.setEnabled(false);//组件挂载（reconciliation）过程中中断事件的派发
    return currentlyEnabled;
  },
  close: function(previouslyEnabled) {
    ReactBrowserEventEmitter.setEnabled(previouslyEnabled);
  },
};
var ON_DOM_READY_QUEUEING = {
  initialize: function() {
    this.reactMountReady.reset();//reactMountReady 队列的初始化
  },
  close: function() {
    this.reactMountReady.notifyAll();
  },
};

//组件挂载过程中先执行 Transtion initialize ，完成后再执行 close
var TRANSACTION_WRAPPERS = [
  SELECTION_RESTORATION, //输入框的选中区域,先保存，组件挂载完成后重置保存的状态
  EVENT_SUPPRESSION,//组件挂载前截断事件派发，之后重置
  ON_DOM_READY_QUEUEING,//通过调用 this.reactMountReady.enqueue 注入componentDidMount和componentDidUpdate回调
];

//line 181 :
PooledClass.addPoolingTo(ReactReconcileTransaction);//通过PooledClass管理ReactReconcileTransaction实例
```