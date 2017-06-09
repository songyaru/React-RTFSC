## <span id="instantiatereactcomponent">instantiateReactComponent</span>
>将ReactNode转化为用于挂载、更新到页面视图上的实例

#### 依赖
* [ReactCompositeComponent](#reactcompositecomponent)
>用于创建用户自定义的 react 组件

* ReactEmptyComponent
>用于创建React封装的空组件

```javascript
// ReactDOMStackInjection  line 49 :
ReactEmptyComponent.injection.injectEmptyComponentFactory(function(instantiate) {
  return new ReactDOMEmptyComponent(instantiate);
});
```

* ReactHostComponent
>用于创建React封装过的 DOM 标签组件、文本组件

```javascript
//ReactDOMStackInjection  line 45 :
ReactHostComponent.injection.injectGenericComponentClass(ReactDOMComponent);
ReactHostComponent.injection.injectTextComponentClass(ReactDOMTextComponent);
```

#### 主要方法说明
```javascript
//line 44 : 判断是否为内部组件
function isInternalComponentType(type) {
  //react 内部组件原型上都挂有 mountComponent 和  receiveComponent 方法
  return (
    typeof type === 'function' &&
    typeof type.prototype !== 'undefined' &&
    typeof type.prototype.mountComponent === 'function' &&
    typeof type.prototype.receiveComponent === 'function'
  );
}
```
```javascript
//line 62 :
function instantiateReactComponent(node, shouldHaveDebugID) {
  //初始化 react 组件 : 空组件、dom、文本、内部、自定义这几类组件
}

```

#### TODO
* `instantiateReactComponent` 调用关系[ReactMount._renderNewRootComponent](#reactmount) [ReactCompositeComponent](#reactcompositecomponent)
