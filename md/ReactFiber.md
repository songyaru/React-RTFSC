## <span id="reactfiber">ReactFiber</span>
> ReactDom 暴露的接口

#### 依赖

#### 主要方法说明
<span id="code_reactfiber_createfiber"></span>
```javascript
// This is a constructor of a POJO instead of a constructor function for a few
// reasons:
// 1) Nobody should add any instance methods on this. Instance methods can be
//    more difficult to predict when they get optimized and they are almost
//    never inlined properly in static compilers.
// 2) Nobody should rely on `instanceof Fiber` for type testing. We should
//    always know when it is a fiber.
// 3) We can easily go from a createFiber call to calling a constructor if that
//    is faster. The opposite is not true.
// 4) We might want to experiment with using numeric keys since they are easier
//    to optimize in a non-JIT environment.
// 5) It should be easy to port this to a C struct and keep a C implementation
//    compatible.
var createFiber = function(
  tag: TypeOfWork,
  key: null | string,
  internalContextTag: TypeOfInternalContext,
): Fiber {
  var fiber: Fiber = {
    tag: tag,
    key: key,
    type: null,
    stateNode: null,
    'return': null,
    child: null,
    sibling: null,
    index: 0,
    ref: null,
    pendingProps: null,
    memoizedProps: null,
    updateQueue: null,
    memoizedState: null,
    internalContextTag,
    effectTag: NoEffect,
    nextEffect: null,
    firstEffect: null,
    lastEffect: null,
    pendingWorkPriority: NoWork,
    progressedPriority: NoWork,
    progressedChild: null,
    progressedFirstDeletion: null,
    progressedLastDeletion: null,
    alternate: null
  };

  return fiber;
};
```