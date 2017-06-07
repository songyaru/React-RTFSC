
# 未完待更新

## 目录 _字母排序_
* [CallbackQueue](#callbackqueue)
* [PooledClass](#pooledclass)
* [ReactCompositeComponent](#reactcompositecomponent)
* [ReactDefaultBatchingStrategy](#reactdefaultbatchingstrategy)
* [ReactOwner](#reactowner)
* [ReactReconciler](#reactreconciler)
* [ReactReconcileTransaction](#reactreconciletransaction)
* [ReactRef](#reactref)
* [ReactUpdates](#reactupdates)
* [ReactUpdateQueue](#reactupdatequeue)
* [Transaction](#transaction)
* [instantiateReactComponent](#instantiateReactComponent)


## instantiateReactComponent
>将ReactNode转化为用于挂载、更新到页面视图上的实例

#### 依赖
* [ReactCompositeComponent](#reactcompositecomponent)
>用于创建用户自定义的 react 组件 

* ReactEmptyComponent
>用于创建React封装的空组件
```javascript
// ReactDOMStackInjection  line 49 ：
ReactEmptyComponent.injection.injectEmptyComponentFactory(function(instantiate){
	return new ReactDOMEmptyComponent(instantiate);
});
```

* ReactHostComponent
>用于创建React封装过的 DOM 标签组件、文本组件
```javascript
//ReactDOMStackInjection  line 45 ：
ReactHostComponent.injection.injectGenericComponentClass(ReactDOMComponent);
ReactHostComponent.injection.injectTextComponentClass(ReactDOMTextComponent);
```

#### 主要方法说明
```javascript
//line 44 : 判断是否为内部组件
function isInternalComponentType(type) {
  // react 内部组件原型上都挂有 mountComponent 和  receiveComponent 方法
  return (
    typeof type === 'function' &&
    typeof type.prototype !== 'undefined' &&
    typeof type.prototype.mountComponent === 'function' &&
    typeof type.prototype.receiveComponent === 'function'
  );
}
```
```javascript
//line 62 :
function instantiateReactComponent(node, shouldHaveDebugID) {
    //初始化 react 组件 : 空组件、dom、文本、内部、自定义这几类组件
}

```

#### TODO
* `instantiateReactComponent` 调用关系 [ReactCompositeComponent](#reactcompositecomponent)

## <span id="reactCompositecomponent">ReactCompositeComponent _TODO_</span>
>用于实例化组件、及完成组件元素的挂载、重绘组件 （extends React.Component 的用户自定义组件）

#### 依赖
* [ReactReconciler](#reactreconciler)
>用于发起顶层组件或子组件的挂载、卸载、重绘机制。


#### 主要方法说明
```javascript
//todo
```



## <span id="reactreconciler">ReactReconciler</span>
>用于发起顶层组件或子组件的挂载、卸载、重绘机制。

#### 依赖
* [ReactRef](#reactref)
>创建、销毁、比对reactElement的refs属性相关 

#### 主要方法说明
```javascript
//line 39:
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




## <span id="reactref">ReactRef</span>
用于向顶层用户自定义组件实例添加或移除refs、或比较refs是否需要更新。通过ReactRonconcile模块间接被ReactCompositeComponent模块调用。
#### 依赖
* [ReactOwner](#reactowner)
创建、销毁、比对reactElement的refs属性相关 
* ReactInstanceType 、ReactElementType
用于 react 代码静态检测，可忽略。
#### 主要方法说明
```javascript
ReactRef.attachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  if (element === null || typeof element !== 'object') {
    return;
  }
  var ref = element.ref;
  if (ref != null) {
    attachRef(ref, instance, element._owner);
  }
};

//其中element._owner 指的是用户自定义组件的实例，代码调用如下：
//ReactElement line 183 :
ReactElement.createElement = function(){
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current, //参数传入 element._owner = ReactCurrentOwner.current
    props,
  );
}

//ReactCurrentOwner.current 则由 _renderValidatedComponent 设置（组件挂载和更新的时候执行）
//ReactCompositeComponent line 1294 :
_renderValidatedComponent: function() {
    if (
      __DEV__ ||
      this._compositeType !== ReactCompositeComponentTypes.StatelessFunctional
    ) {
      ReactCurrentOwner.current = this;

}
```
```javascript
function attachRef(ref, component, owner) {
	if (typeof ref === 'function') {
    //由用户自定义组件owner调用ReactReconciler中方法执行，this指向owner //todo ??
    ref(component.getPublicInstance());
	} else {
    	//最终是调用 ReactCompositeComponent.attachRef，向用户自定义组件实例添加this.refs[ref]属性
    	//参见 ReactOwner 分析
    	ReactOwner.addComponentAsRefTo(component, ref, owner);
  	}
}
```
see [ReactOwner](#ReactOwner)


## <span id="reactowner">ReactOwner</span>
用于调用ReactCompositeComponent实例的attachRef、detachRef方法，向用户自定义组件的实例添加或移除refs。被ReactRef调用。

#### 依赖
* ReactTypeOfWork
```javascript
module.exports = {
  IndeterminateComponent: 0, // Before we know whether it is functional or class
  FunctionalComponent: 1,
  ClassComponent: 2,
  HostRoot: 3, // Root of a host tree. Could be nested inside another node.
  HostPortal: 4, // A subtree. Could be an entry point to a different renderer.
  HostComponent: 5,
  HostText: 6,
  CoroutineComponent: 7,
  CoroutineHandlerPhase: 8,
  YieldComponent: 9,
  Fragment: 10,
};
```
see [React Components, Elements, and Instances](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html)

#### 主要方法说明
```javascript
//line 28 :
function isValidOwner(object: any): boolean {
  //通过判断是否含有 attachRef 和 detachRef 来确定是否是用户自定义的组件(ReactCompositeComponent实例) 
  return !!(object &&
    typeof object.attachRef === 'function' &&
    typeof object.detachRef === 'function');
}
```
```javascript
//line 74 :
addComponentAsRefTo: function(
    component: ReactInstance,
    ref: string,
    owner: ReactInstance | Fiber,
  ): void {
    //如果有 tag 标记是用户自定义组件 
    //ReactFiberBeginWork.js #556
    //mountIndeterminateComponent(...){... workInProgress.tag = ClassComponent;...}
    if (owner && (owner: any).tag === ClassComponent) {    	
    	refs[ref] = component.getPublicInstance(); //todo 如何理解？？
    } else {
 		//向用户自定义组件的实例添加refs
      	(owner: any).attachRef(ref, component); // 调用 ReactCompositeComponent.attachRef
    }
 }
```
```javascript
//line 104 :
removeComponentAsRefFrom //同上，调用 (owner: any).detachRef(ref);
```

#### TODO
* see [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)


## <span id="reactreconciletransaction">ReactReconcileTransaction</span>

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


## <span id="transaction">Transaction</span>
> 类似 aop 包装一个方法，在方法执行的时候先执行 initializeAll,再执行方法，最后执行 closeAll
#### 主要方法说明
```javascript
  /*
  *                       wrappers (injected at creation time)
  *                                      +        +
  *                                      |        |
  *                    +-----------------|--------|--------------+
  *                    |                 v        |              |
  *                    |      +---------------+   |              |
  *                    |   +--|    wrapper1   |---|----+         |
  *                    |   |  +---------------+   v    |         |
  *                    |   |          +-------------+  |         |
  *                    |   |     +----|   wrapper2  |--------+   |
  *                    |   |     |    +-------------+  |     |   |
  *                    |   |     |                     |     |   |
  *                    |   v     v                     v     v   | wrapper
  *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
  * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
  * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
  *                    | |   | |   |   |         |   |   | |   | |
  *                    | |   | |   |   |         |   |   | |   | |
  *                    | |   | |   |   |         |   |   | |   | |
  *                    | +---+ +---+   +---------+   +---+ +---+ |
  *                    |  initialize                    close    |
  *                    +-----------------------------------------+
  */
```

## <span id="pooledclass">PooledClass</span>
> 提供实例池，管理函数实例的生成和销毁
#### 主要方法说明
```javascript
//line 26 :
var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};
//line 70 :
// 销毁实例数据，并将实例保存在实例池 Klass.instancePool 中
var standardReleaser = function(instance) {
  var Klass = this;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

//line 103 :
var addPoolingTo = function<T>(
  CopyConstructor: Class<T>,
  pooler: Pooler,
){
  var NewKlass = (CopyConstructor: any);
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER; //默认 oneArgumentPooler
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;//10
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};
```
```javascript
//示例 :
class Foo {
  constructor(arg) {
    this.bar = arg;
  }
  destructor() {
    this.bar = null;
  }
}

PooledClass.addPoolingTo(Foo);//如果有多个参数:addPoolingTo(Foo, PooledClass.twoArgumentPooler)
let foo = Foo.getPooled("someVar"); //执行constructor foo.bar = "someVar"
Foo.release(foo); //释放实例，将实例放回池中,执行destructor foo.bar = null;
//再次执行 Foo.getPooled 会直接从缓存池里面取出对象，不需要再实例化 Foo

```

## <span id="callbackqueue">CallbackQueue</span>
>回调函数队列

#### 依赖
* [PooledClass](#pooledclass)
#### 主要方法说明
```javascript
//line 49 :
enqueue(callback: () => void, context: T) {
	this._callbacks = this._callbacks || [];
	this._callbacks.push(callback);
	this._contexts = this._contexts || [];
	this._contexts.push(context);
}

notifyAll() {
  var callbacks = this._callbacks;
  var contexts = this._contexts;
  var arg = this._arg;
  if (callbacks && contexts) {
    invariant(
      callbacks.length === contexts.length, //个数必须一致
      'Mismatched list of contexts in callback queue',
    );
    this._callbacks = null;
    this._contexts = null;
    for (var i = 0; i < callbacks.length; i++) {
      validateCallback(callbacks[i]);
      callbacks[i].call(contexts[i], arg);
    }
    callbacks.length = 0;
    contexts.length = 0;
  }
}

module.exports = PooledClass.addPoolingTo(CallbackQueue);  
```
```javascript
//示例 :
var queue = CallbackQueue.getPooled();
var foo = {
    bar: 0
}
var plusBar = function() {
    if (typeof(this.bar) !== "undefined") {
        this.bar++;
    }
}
queue.enqueue(plusBar, foo);
queue.enqueue(plusBar, foo);
queue.notifyAll();// foo.bar = 2;
CallbackQueue.release(queue);//释放 queue
```


## <span id="reactupdatequeue">ReactUpdateQueue</span>
>
#### 依赖
* [ReactUpdates](#reactupdates)
#### 主要方法说明


## <span id="reactupdates">ReactUpdates</span>
> 约定组件重绘过程的 Transaction 包装方法
#### 依赖
* [PooledClass](#pooledclass)
* [Transaction](#transaction)	
* [ReactReconciler](#reactreconciler)
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
//line 198 :
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
//由 ReactDOMStackInjection #55 调用，默认传入 ReactReconcileTransaction、ReactDefaultBatchingStrategy
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



## <span id="reactdefaultbatchingstrategy">ReactDefaultBatchingStrategy</span>
>暴露 [ReactDefaultBatchingStrategy.batchedUpdates](#code_reactdefaultbatchingstrategy) 方法,该方法中的 Transaction 包装方法为：RESET_BATCHED_UPDATES、FLUSH_BATCHED_UPDATES
#### 主要方法说明
```javascript
//line 19 :
// 初始化 ReactDefaultBatchingStrategyTransaction ，预置 Transaction 包装方法 

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



## <span id="xx"></span>

#### 依赖
*	
#### 主要方法说明
