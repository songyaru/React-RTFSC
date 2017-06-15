## <span id="reactfiberhostcontext">ReactFiberHostContext TODO</span>
>

#### 依赖
* [ReactFiberStack](#reactfiberstack)

#### 主要方法说明
<span id="code_reactfiberhostcontext"></span>
```typescript
module.exports = function<T, P, I, TI, PI, C, CX, PL>(
  config: HostConfig<T, P, I, TI, PI, C, CX, PL>,
): HostContext<C, CX> {

  // ReactFiberStack.createCursor({}) 返回 {current:{}}
  let contextStackCursor: StackCursor<CX | NoContextT> = createCursor(
    NO_CONTEXT,
  );
  let contextFiberStackCursor: StackCursor<Fiber | NoContextT> = createCursor(
    NO_CONTEXT,
  );
  let rootInstanceStackCursor: StackCursor<C | NoContextT> = createCursor(
    NO_CONTEXT,
  );

  function requiredContext<Value>(c: Value | NoContextT): Value {
    return (c: any);
  }

  function getRootHostContainer(): C {
    const rootInstance = requiredContext(rootInstanceStackCursor.current);
    return rootInstance;
  }

  function pushHostContainer(fiber: Fiber, nextRootInstance: C) {
    // Push current root instance onto the stack;
    // This allows us to reset root when portals are popped.
    push(rootInstanceStackCursor, nextRootInstance, fiber);

    const nextRootContext = getRootHostContext(nextRootInstance);

    // Track the context and the Fiber that provided it.
    // This enables us to pop only Fibers that provide unique contexts.
    push(contextFiberStackCursor, fiber, fiber);
    push(contextStackCursor, nextRootContext, fiber);
  }

  function popHostContainer(fiber: Fiber) {
    pop(contextStackCursor, fiber);
    pop(contextFiberStackCursor, fiber);
    pop(rootInstanceStackCursor, fiber);
  }

  function getHostContext(): CX {
    const context = requiredContext(contextStackCursor.current);
    return context;
  }

  function pushHostContext(fiber: Fiber): void {
    const rootInstance = requiredContext(rootInstanceStackCursor.current);
    const context = requiredContext(contextStackCursor.current);
    const nextContext = getChildHostContext(context, fiber.type, rootInstance);

    // Don't push this Fiber's context unless it's unique.
    if (context === nextContext) {
      return;
    }

    // Track the context and the Fiber that provided it.
    // This enables us to pop only Fibers that provide unique contexts.
    push(contextFiberStackCursor, fiber, fiber);
    push(contextStackCursor, nextContext, fiber);
  }

  function popHostContext(fiber: Fiber): void {
    // Do not pop unless this Fiber provided the current context.
    // pushHostContext() only pushes Fibers that provide unique contexts.
    if (contextFiberStackCursor.current !== fiber) {
      return;
    }

    pop(contextStackCursor, fiber);
    pop(contextFiberStackCursor, fiber);
  }

  function resetHostContainer() {
    contextStackCursor.current = NO_CONTEXT;
    rootInstanceStackCursor.current = NO_CONTEXT;
  }

  return {
    getHostContext,
    getRootHostContainer,
    popHostContainer,
    popHostContext,
    pushHostContainer,
    pushHostContext,
    resetHostContainer,
  };
};
```