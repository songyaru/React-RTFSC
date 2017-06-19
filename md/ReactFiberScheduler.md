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
<span id="code_reactfiberscheduler_scheduleroot"></span>
```javascript
function scheduleRoot(root: FiberRoot, priorityLevel: PriorityLevel) {
  if (priorityLevel === NoWork) {
    return;
  }

  if (!root.isScheduled) {
    root.isScheduled = true;
    if (lastScheduledRoot) {
      // Schedule ourselves to the end.
      lastScheduledRoot.nextScheduledRoot = root;
      lastScheduledRoot = root;
    } else {
      // We're the only work scheduled.
      nextScheduledRoot = root;
      lastScheduledRoot = root;
    }
  }
}
```
<span id="code_reactfiberscheduler_scheduleupdate"></span>
```javascript
function scheduleUpdate(fiber: Fiber, priorityLevel: PriorityLevel) {
  if (priorityLevel <= nextPriorityLevel) {
    // We must reset the current unit of work pointer so that we restart the
    // search from the root during the next tick, in case there is now higher
    // priority work somewhere earlier than before.
    nextUnitOfWork = null;
  }

  let node = fiber;
  let shouldContinue = true;
  while (node !== null && shouldContinue) {
    // Walk the parent path to the root and update each node's priority. Once
    // we reach a node whose priority matches (and whose alternate's priority
    // matches) we can exit safely knowing that the rest of the path is correct.
    shouldContinue = false;
    if (
      node.pendingWorkPriority === NoWork ||
      node.pendingWorkPriority > priorityLevel
    ) {
      // Priority did not match. Update and keep going.
      shouldContinue = true;
      node.pendingWorkPriority = priorityLevel;
    }
    if (node.alternate !== null) {
      if (
        node.alternate.pendingWorkPriority === NoWork ||
        node.alternate.pendingWorkPriority > priorityLevel
      ) {
        // Priority did not match. Update and keep going.
        shouldContinue = true;
        node.alternate.pendingWorkPriority = priorityLevel;
      }
    }
    if (node.return === null) {
      if (node.tag === HostRoot) {
        const root: FiberRoot = (node.stateNode: any);
        scheduleRoot(root, priorityLevel);
        // Depending on the priority level, either perform work now or
        // schedule a callback to perform work later.
        switch (priorityLevel) {
          case SynchronousPriority:
            performWork(SynchronousPriority, null);
            return;
          case TaskPriority:
            // TODO: If we're not already performing work, schedule a
            // deferred callback.
            return;
          case AnimationPriority:
            scheduleAnimationCallback(performAnimationWork);
            return;
          case HighPriority:
          case LowPriority:
          case OffscreenPriority:
            scheduleDeferredCallback(performDeferredWork);
            return;
        }
      } else {
        return;
      }
    }
    node = node.return;
  }
}
```
see [ReactFiberScheduler.scheduleRoot](#code_reactfiberscheduler_scheduleroot),
[ReactFiberScheduler.performwork](#code_reactfiberscheduler_performwork)

<span id="code_reactfiberscheduler_unbatchedupdates"></span>
```javascript
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

<span id="code_reactfiberscheduler_performwork"><span>
```javascript
function performWork(
  priorityLevel: PriorityLevel,
  deadline: Deadline | null,
) {
  isPerformingWork = true;
  const isPerformingDeferredWork = !!deadline;

  // This outer loop exists so that we can restart the work loop after
  // catching an error. It also lets us flush Task work at the end of a
  // deferred batch.
  while (priorityLevel !== NoWork && !fatalError) {
    // Before starting any work, check to see if there are any pending
    // commits from the previous frame.
    if (pendingCommit !== null && !deadlineHasExpired) {
      commitAllWork(pendingCommit);
    }

    // Nothing in performWork should be allowed to throw. All unsafe
    // operations must happen within workLoop, which is extracted to a
    // separate function so that it can be optimized by the JS engine.
    priorityContextBeforeReconciliation = priorityContext;
    let error = null;

    try {
      workLoop(priorityLevel, deadline);
    } catch (e) {
      error = e;
    }

    // Reset the priority context to its value before reconcilation.
    priorityContext = priorityContextBeforeReconciliation;

    if (error !== null) {
      // We caught an error during either the begin or complete phases.
      const failedWork = nextUnitOfWork;

      if (failedWork !== null) {
        // "Capture" the error by finding the nearest boundary. If there is no
        // error boundary, the nearest host container acts as one. If
        // captureError returns null, the error was intentionally ignored.
        const maybeBoundary = captureError(failedWork, error);
        if (maybeBoundary !== null) {
          const boundary = maybeBoundary;

          // Complete the boundary as if it rendered null. This will unmount
          // the failed tree.
          beginFailedWork(boundary.alternate, boundary, priorityLevel);

          // The next unit of work is now the boundary that captured the error.
          // Conceptually, we're unwinding the stack. We need to unwind the
          // context stack, too, from the failed work to the boundary that
          // captured the error.
          // TODO: If we set the memoized props in beginWork instead of
          // completeWork, rather than unwind the stack, we can just restart
          // from the root. Can't do that until then because without memoized
          // props, the nodes higher up in the tree will rerender unnecessarily.
          unwindContexts(failedWork, boundary);
          nextUnitOfWork = completeUnitOfWork(boundary);
        }
        // Continue performing work
        continue;
      } else if (fatalError === null) {
        // There is no current unit of work. This is a worst-case scenario
        // and should only be possible if there's a bug in the renderer, e.g.
        // inside resetAfterCommit.
        fatalError = error;
      }
    }

    // Stop performing work
    priorityLevel = NoWork;

    // If have we more work, and we're in a deferred batch, check to see
    // if the deadline has expired.
    if (
      nextPriorityLevel !== NoWork &&
      isPerformingDeferredWork &&
      !deadlineHasExpired
    ) {
      // We have more time to do work.
      priorityLevel = nextPriorityLevel;
      continue;
    }

    // There might be work left. Depending on the priority, we should
    // either perform it now or schedule a callback to perform it later.
    switch (nextPriorityLevel) {
      case SynchronousPriority:
      case TaskPriority:
        // Perform work immediately by switching the priority level
        // and continuing the loop.
        priorityLevel = nextPriorityLevel;
        break;
      case AnimationPriority:
        scheduleAnimationCallback(performAnimationWork);
        // Even though the next unit of work has animation priority, there
        // may still be deferred work left over as well. I think this is
        // only important for unit tests. In a real app, a deferred callback
        // would be scheduled during the next animation frame.
        scheduleDeferredCallback(performDeferredWork);
        break;
      case HighPriority:
      case LowPriority:
      case OffscreenPriority:
        scheduleDeferredCallback(performDeferredWork);
        break;
    }
  }

  const errorToThrow = fatalError || firstUncaughtError;

  // We're done performing work. Time to clean up.
  isPerformingWork = false;
  deadlineHasExpired = false;
  fatalError = null;
  firstUncaughtError = null;
  capturedErrors = null;
  failedBoundaries = null;

  // It's safe to throw any unhandled errors.
  if (errorToThrow !== null) {
    throw errorToThrow;
  }
}
```
see [ReactFiberScheduler.workLoop](#code_reactfiberscheduler_workloop),


<span id="code_reactfiberscheduler_workloop"></span>
```javascript
function workLoop(priorityLevel, deadline: Deadline | null) {
  // Clear any errors.
  clearErrors();//TODO 分析

  if (nextUnitOfWork === null) {
    nextUnitOfWork = findNextUnitOfWork();
  }

  // If there's a deadline, and we're not performing Task work, perform work
  // using this loop that checks the deadline on every iteration.
  if (deadline !== null && priorityLevel > TaskPriority) {
    // The deferred work loop will run until there's no time left in
    // the current frame.
    while (nextUnitOfWork !== null && !deadlineHasExpired) {
      if (deadline.timeRemaining() > timeHeuristicForUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        // In a deferred work batch, iff nextUnitOfWork returns null, we just
        // completed a root and a pendingCommit exists. Logically, we could
        // omit either of the checks in the following condition, but we need
        // both to satisfy Flow.
        if (nextUnitOfWork === null && pendingCommit !== null) {
          // If we have time, we should commit the work now.
          if (deadline.timeRemaining() > timeHeuristicForUnitOfWork) {
            commitAllWork(pendingCommit);
            nextUnitOfWork = findNextUnitOfWork();
            // Clear any errors that were scheduled during the commit phase.
            clearErrors();
          } else {
            deadlineHasExpired = true;
          }
          // Otherwise the root will committed in the next frame.
        }
      } else {
        deadlineHasExpired = true;
      }
    }
  } else {
    // If there's no deadline, or if we're performing Task work, use this loop
    // that doesn't check how much time is remaining. It will keep running
    // until we run out of work at this priority level.
    while (
      nextUnitOfWork !== null &&
      nextPriorityLevel !== NoWork &&
      nextPriorityLevel <= priorityLevel
    ) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      if (nextUnitOfWork === null) {
        nextUnitOfWork = findNextUnitOfWork();
        // performUnitOfWork returned null, which means we just committed a
        // root. Clear any errors that were scheduled during the commit phase.
        clearErrors();
      }
    }
  }
}
```