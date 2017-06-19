## <span id="reactfiberroot">ReactFiberRoot</span>
> ReactDom 暴露的接口

#### 依赖
* [ReactFiber](#reactfiber)

#### 主要方法说明
<span id="code_reactfiberroot_createfiberroot"></span>
```javascript
exports.createFiberRoot = function(containerInfo: any): FiberRoot {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  // ReactFiber.createHostRootFiber
  const uninitializedFiber = createHostRootFiber();//fiber.tag = 3
  const root = {
    current: uninitializedFiber,
    containerInfo: containerInfo,
    isScheduled: false,
    nextScheduledRoot: null,
    context: null,
    pendingContext: null,
  };
  uninitializedFiber.stateNode = root;//root.current.stateNode == root
  return root;
};
```