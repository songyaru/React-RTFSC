## <span id="reactcontrolledcomponent">ReactControlledComponent TODO</span>
>

#### 依赖
* [EventPluginUtils](#eventpluginutils)

#### 主要方法说明
```javascript
function restoreStateOfTarget(target) {
  // We perform this translation at the end of the event loop so that we
  // always receive the correct fiber here
  var internalInstance = EventPluginUtils.getInstanceFromNode(target);
  if (!internalInstance) {
    // Unmounted
    return;
  }
  if (typeof internalInstance.tag === 'number') {
    const props = EventPluginUtils.getFiberCurrentPropsFromNode(
      internalInstance.stateNode,
    );
    fiberHostComponent.restoreControlledState(
      internalInstance.stateNode,
      internalInstance.type,
      props,
    );
    return;
  }
  invariant(
    typeof internalInstance.restoreControlledState === 'function',
    'The internal instance must be a React host component.',
  );
  // If it is not a Fiber, we can just use dynamic dispatch.
  internalInstance.restoreControlledState();
}
```

```javascript
var ReactControlledComponent = {
  //ReactDOMFiberEntry line 61 : ReactDOMFiberComponent
  injection: ReactControlledComponentInjection,

  enqueueStateRestore(target) {
    //多次 enqueue ，保存到 Queue 中
    if (restoreTarget) {
      if (restoreQueue) {
        restoreQueue.push(target);
      } else {
        restoreQueue = [target];
      }
    } else {
      restoreTarget = target;
    }
  },

  restoreStateIfNeeded() {
    if (!restoreTarget) {
      return;
    }
    var target = restoreTarget;
    var queuedTargets = restoreQueue;
    restoreTarget = null;
    restoreQueue = null;

    restoreStateOfTarget(target);
    if (queuedTargets) {
      for (var i = 0; i < queuedTargets.length; i++) {
        restoreStateOfTarget(queuedTargets[i]);
      }
    }
  },
};
```