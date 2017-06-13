## <span id="reactdomfiber">ReactDOMFiber</span>
> ReactDom 暴露的接口

#### 依赖
* [ReactBrowserEventEmitter](#reactbrowsereventemitter)
* [ReactControlledComponent](#reactcontrolledcomponent)
* [ReactDOMComponentTree](#reactdomcomponenttree)
* [ReactDOMFiberComponent](#reactdomfibercomponent)
* [ReactDOMFrameScheduling](#reactdomframescheduling)
* [ReactDOMInjection](#reactdominjection)
* [ReactGenericBatching](#reactgenericbatching)
* [ReactFiberReconciler](#reactfiberreconciler)
* [ReactInputSelection](#reactinputselection)
* [ReactInstanceMap](#reactinstancemap)
* [ReactPortal](#reactportal)
* [findDOMNode](#finddomnode)


#### 主要方法说明
```javascript
ReactDOMInjection.inject();//方法 inject
ReactControlledComponent.injection.injectFiberControlledHostComponent(
  ReactDOMFiberComponent,
);
findDOMNode._injectFiber(function(fiber: Fiber) {
  return DOMRenderer.findHostInstance(fiber);
});
```
see [ReactDOMInjection](#reactdominjection),
[ReactDOMFiberComponent](#reactdomfibercomponent),
[findDOMNode](#finddomnode)

```javascript
var DOMRenderer = ReactFiberReconciler({
  //返回 DOMNamespaces
  getRootHostContext(rootContainerInstance: Container): HostContext {
    let type;
    let namespace;
    if (rootContainerInstance.nodeType === DOCUMENT_NODE) {
      type = '#document';
      let root = (rootContainerInstance: any).documentElement;
      namespace = root ? root.namespaceURI : getChildNamespace(null, '');
    } else {
      const ownNamespace = (rootContainerInstance: any).namespaceURI || null;
      type = (rootContainerInstance: any).tagName;
      //ReactDOMFiberComponent.getChildNamespace
      namespace = getChildNamespace(ownNamespace, type);
    }
    return namespace;//DOMNamespaces
  },
  //根据 parentNamespace 获取子节点的 DOMNamespaces
  getChildHostContext(
    parentHostContext: HostContext,
    type: string,
  ): HostContext {
    const parentNamespace = ((parentHostContext: any): HostContextProd);
    return getChildNamespace(parentNamespace, type);
  },

  createInstance(
    type: string,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: Object,
  ): Instance {
    let parentNamespace: string;
    parentNamespace = ((hostContext: any): HostContextProd);

    //ReactDOMFiberComponent.createElement : 创建 DOM 节点
    const domElement: Instance = createElement(
      type,
      props,
      rootContainerInstance,
      parentNamespace,
    );

    //see ReactDOMComponentTree.precacheFiberNode :
    //domElement[internalInstanceKey] = internalInstanceHandle;
    precacheFiberNode(internalInstanceHandle, domElement);

    //see ReactDOMComponentTree.updateFiberProps :
    //domElement[internalEventHandlersKey] = props;
    updateFiberProps(domElement, props);
    return domElement;
  },


  finalizeInitialChildren(
    domElement: Instance,
    type: string,
    props: Props,
    rootContainerInstance: Container,
  ): boolean {
    //ReactDOMFiberComponent.setInitialProperties :
    //todo 分析
    setInitialProperties(domElement, type, props, rootContainerInstance);
    //'button','input','select','textarea' 返回 props.autoFocus,其余返回 false
    return shouldAutoFocusHostComponent(type, props);
  },

  prepareUpdate(
    domElement: Instance,
    type: string,
    oldProps: Props,
    newProps: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
  ): null | Array<mixed> {
    //see ReactDOMFiberComponent.diffProperties
    //比较两个对象之间的差异
    return diffProperties(
      domElement,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
    );
  },

  commitUpdate(
    domElement: Instance,
    updatePayload: Array<mixed>,
    type: string,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: Object,
  ): void {
    // Update the props handle so that we know which props are the ones with
    // with current event handlers.
    //see ReactDOMComponentTree.updateFiberProps :
    //domElement[internalEventHandlersKey] = newProps;
    updateFiberProps(domElement, newProps);

    // Apply the diff to the DOM node.
    //see ReactDOMFiberComponent.updateProperties :
    updateProperties(domElement, updatePayload, type, oldProps, newProps);
  }

});


ReactGenericBatching.injection.injectFiberBatchedUpdates(
  DOMRenderer.batchedUpdates,
);
```
see [ReactFiberReconciler](#reactfiberreconciler),
[ReactDOMComponentTree](#reactdomcomponenttree)
[ReactFiberScheduler.batchedUpdates TODO](#reactfiberscheduler)

```javascript

//ReactDom render 方法的内部调用
function renderSubtreeIntoContainer(
  parentComponent: ?ReactComponent<any, any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  callback: ?Function,
) {

  let root = container._reactRootContainer;
  if (!root) {
    // First clear any existing content.
    // TODO: Figure out the best heuristic here.
    if (!shouldReuseContent(container)) {
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }
    }
    const newRoot = DOMRenderer.createContainer(container);
    root = container._reactRootContainer = newRoot;
    // Initial mount should not be batched.
    DOMRenderer.unbatchedUpdates(() => {
      DOMRenderer.updateContainer(children, newRoot, parentComponent, callback);
    });
  } else {
    DOMRenderer.updateContainer(children, root, parentComponent, callback);
  }
  return DOMRenderer.getPublicRootInstance(root);
}
```
```javascript
//暴露接口
var ReactDOM = {
  render(
    element: ReactElement<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {
    return renderSubtreeIntoContainer(null, element, container, callback);
  },

  unstable_renderSubtreeIntoContainer(
    parentComponent: ReactComponent<any, any, any>,
    element: ReactElement<any>,
    containerNode: DOMContainer,
    callback: ?Function,
  ) {
    return renderSubtreeIntoContainer(
      parentComponent,
      element,
      containerNode,
      callback,
    );
  },

  unmountComponentAtNode(container: DOMContainer) {
    if (container._reactRootContainer) {
      // Unmount should not be batched.
      DOMRenderer.unbatchedUpdates(() => {
        renderSubtreeIntoContainer(null, null, container, () => {
          container._reactRootContainer = null;
        });
      });
      // If you call unmountComponentAtNode twice in quick succession, you'll
      // get `true` twice. That's probably fine?
      return true;
    } else {
      return false;
    }
  },

  findDOMNode: findDOMNode,

  unstable_createPortal(
    children: ReactNodeList,
    container: DOMContainer,
    key: ?string = null,
  ) {
    // TODO: pass ReactDOM portal implementation as third argument
    return ReactPortal.createPortal(children, container, null, key);
  },

  unstable_batchedUpdates: ReactGenericBatching.batchedUpdates,

  unstable_deferredUpdates: DOMRenderer.deferredUpdates,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    // For TapEventPlugin which is popular in open source
    EventPluginHub: require('EventPluginHub'),
    // Used by test-utils
    EventPluginRegistry: require('EventPluginRegistry'),
    EventPropagators: require('EventPropagators'),
    ReactControlledComponent,
    ReactDOMComponentTree,
    ReactDOMEventListener: require('ReactDOMEventListener'),
  },
};
```
