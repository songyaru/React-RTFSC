## <span id="reactfiberreconciler">ReactFiberReconciler TODO</span>
> ReactDom 暴露的接口

#### 依赖
* [ReactFiberUpdateQueue](#reactfiberupdatequeue)
* [ReactFiberContext](#reactfiberupdatequeue)
* [ReactFiberContext](#reactfibercontext)
* [ReactFiberRoot](#reactfiberroot)
* [ReactFiberScheduler](#reactfiberscheduler)
* [ReactFiberTreeReflection](#reactfibertreereflection)
* [getContextForSubtree](#getcontextforsubtree)



#### 主要方法说明

```javascript
//定义 Reconciler 接口
module.exports = function<T, P, I, TI, PI, C, CX, PL>(
  config: HostConfig<T, P, I, TI, PI, C, CX, PL>,
): Reconciler<C, I, TI> {
  var {getPublicInstance} = config;

  var {
    scheduleUpdate,
    getPriorityContext,
    performWithPriority,
    batchedUpdates,
    unbatchedUpdates,
    syncUpdates,
    deferredUpdates,
  } = ReactFiberScheduler(config);

  function scheduleTopLevelUpdate() {
    //...
  }

  return {
    createContainer(containerInfo: C): OpaqueRoot {
      return createFiberRoot(containerInfo);
    },

    updateContainer(
      element: ReactNodeList,
      container: OpaqueRoot,
      parentComponent: ?ReactComponent<any, any, any>,
      callback: ?Function,
    ): void {
      // TODO: If this is a nested container, this won't be the root.
      const current = container.current;

      const context = getContextForSubtree(parentComponent);
      if (container.context === null) {
        container.context = context;
      } else {
        container.pendingContext = context;
      }

      scheduleTopLevelUpdate(current, element, callback);
    },

    performWithPriority,

    batchedUpdates,

    unbatchedUpdates,

    syncUpdates,

    deferredUpdates,

    getPublicRootInstance(
      container: OpaqueRoot,
    ): ReactComponent<any, any, any> | PI | null {
      const containerFiber = container.current;
      if (!containerFiber.child) {
        return null;
      }
      switch (containerFiber.child.tag) {
        case HostComponent:
          return getPublicInstance(containerFiber.child.stateNode);
        default:
          return containerFiber.child.stateNode;
      }
    },

    findHostInstance(fiber: Fiber): PI | null {
      const hostFiber = findCurrentHostFiber(fiber);
      if (hostFiber === null) {
        return null;
      }
      return hostFiber.stateNode;
    },
  };
};
```
see [ReactFiberScheduler 构造方法](#code_reactfiberscheduler)

<span id="code_reactfiberreconciler_updatecontainer"></span>
```javascript
updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?ReactComponent<any, any, any>,
  callback: ?Function,
): void {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  scheduleTopLevelUpdate(current, element, callback);
}
```
see [getContextForSubtree](#getcontextforsubtree),
[ReactFiberReconciler.scheduleTopLevelUpdate](#code_reactfiberreconciler_scheduletoplevelupdate),

<span id="code_reactfiberreconciler_scheduletoplevelupdate"></span>
```javascript
function scheduleTopLevelUpdate(
  current: Fiber,
  element: ReactNodeList,
  callback: ?Function,
) {
  // Check if the top-level element is an async wrapper component. If so, treat
  // updates to the root as async. This is a bit weird but lets us avoid a separate
  // `renderAsync` API.
  const forceAsync =
    ReactFeatureFlags.enableAsyncSubtreeAPI &&
    element != null &&
    element.type != null &&
    (element.type: any).unstable_asyncUpdates === true;
  const priorityLevel = getPriorityContext(current, forceAsync);// ReactFiberScheduler.getPriorityContext
  const nextState = {element};
  callback = callback === undefined ? null : callback;

  //TODO
  addTopLevelUpdate(current, nextState, callback, priorityLevel);// ReactFiberUpdateQueue.addTopLevelUpdate
  scheduleUpdate(current, priorityLevel);// ReactFiberScheduler.scheduleUpdate
}
```
see [ReactFiberScheduler.getPriorityContext](#reactfiberscheduler),
[ReactFiberUpdateQueue.addTopLevelUpdate](#code_reactfiberupdatequeue_addtoplevelupdate),
[ReactFiberScheduler.scheduleUpdate](#code_reactfiberscheduler_scheduleupdate),