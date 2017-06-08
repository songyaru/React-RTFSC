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