## <span id="reactchildren">ReactChildren 未完成</span>
>处理 props.children
#### 依赖
* [PooledClass](#pooledclass)
* [ReactElement](#reactelement)
* [traverseAllChildren](#traverseallchildren)

#### 主要方法说明
```javascript
//line 48 :
function forEachSingleChild(bookKeeping, child, name) {
  var {func, context} = bookKeeping;
  func.call(context, child, bookKeeping.count++);
}
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(
    forEachFunc,
    forEachContext,
  );
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

```
```javascript
var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray,
};
```