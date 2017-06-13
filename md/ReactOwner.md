## <span id="reactowner">ReactOwner</span>
>用于调用ReactCompositeComponent实例的attachRef、detachRef方法，向用户自定义组件的实例添加或移除refs。被ReactRef调用。

#### 依赖
* ReactTypeOfWork
```javascript
module.exports = {
  IndeterminateComponent: 0, // Before we know whether it is functional or class
  FunctionalComponent: 1,
  ClassComponent: 2,
  HostRoot: 3, // Root of a host tree. Could be nested inside another node.
  HostPortal: 4, // A subtree. Could be an entry point to a different renderer.
  HostComponent: 5,
  HostText: 6,
  CoroutineComponent: 7,
  CoroutineHandlerPhase: 8,
  YieldComponent: 9,
  Fragment: 10,
};
```
see [React Components, Elements, and Instances](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html)

#### 主要方法说明
```javascript
//line 28 :
function isValidOwner(object: any): boolean {
  //通过判断是否含有 attachRef 和 detachRef 来确定是否是用户自定义的组件(ReactCompositeComponent实例)
  return !!(object &&
    typeof object.attachRef === 'function' &&
    typeof object.detachRef === 'function');
}
```
```javascript
//line 74 :
addComponentAsRefTo: function(
  component: ReactInstance,
  ref: string,
  owner: ReactInstance | Fiber,
): void {
  //如果有 tag 标记是用户自定义组件
  //ReactFiberBeginWork.js #556
  //mountIndeterminateComponent(...){... workInProgress.tag = ClassComponent;...}
  if (owner && (owner: any).tag === ClassComponent) {
  	refs[ref] = component.getPublicInstance(); //todo 如何理解？？
  } else {
		//向用户自定义组件的实例添加refs
    	(owner: any).attachRef(ref, component); // 调用 ReactCompositeComponent.attachRef
  }
}
```
```javascript
//line 104 :
removeComponentAsRefFrom //同上，调用 (owner: any).detachRef(ref);
```

#### TODO
* see [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)

