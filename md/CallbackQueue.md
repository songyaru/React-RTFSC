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