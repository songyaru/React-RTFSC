## <span id="reactfiberscheduler">ReactFiberScheduler TODO</span>
>

#### 依赖
* [ReactFiber](#reactfiber)
* [ReactFiberHostContext](#reactfiberhostcontext)
* [ReactFiberHydrationContext](#reactfiberhydrationcontext)
* [ReactFiberBeginWork](#reactfiberbeginwork)
* [ReactFiberCompleteWork](#reactfibercompletework)

#### 主要方法说明
<span id="code_reactfiberscheduler"></span>
```javascript
module.exports = function<T, P, I, TI, PI, C, CX, PL>(
  config: HostConfig<T, P, I, TI, PI, C, CX, PL>,
) {
  const hostContext = ReactFiberHostContext(config);
  const hydrationContext: HydrationContext<C> = ReactFiberHydrationContext(
    config,
  );
  const {popHostContainer, popHostContext, resetHostContainer} = hostContext;
  const {beginWork, beginFailedWork} = ReactFiberBeginWork(
    config,
    hostContext,
    hydrationContext,
    scheduleUpdate,
    getPriorityContext,
  );
  const {completeWork} = ReactFiberCompleteWork(
    config,
    hostContext,
    hydrationContext,
  );
  const {
    commitPlacement,
    commitDeletion,
    commitWork,
    commitLifeCycles,
    commitAttachRef,
    commitDetachRef,
  } = ReactFiberCommitWork(config, captureError);
  const {
    scheduleAnimationCallback: hostScheduleAnimationCallback,
    scheduleDeferredCallback: hostScheduleDeferredCallback,
    useSyncScheduling,
    prepareForCommit,
    resetAfterCommit,
  } = config;

  return {
    scheduleUpdate: scheduleUpdate,
    getPriorityContext: getPriorityContext,
    performWithPriority: performWithPriority,
    batchedUpdates: batchedUpdates,
    unbatchedUpdates: unbatchedUpdates,
    syncUpdates: syncUpdates,
    deferredUpdates: deferredUpdates,
  };
};

```
<span id="code_reactfiberscheduler_unbatchedupdates"></span>
```typescript
function unbatchedUpdates<A>(fn: () => A): A {
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = false;
  try {
    return fn();
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
  }
}
```