## <span id="reactref">ReactRef</span>
>用于向顶层用户自定义组件实例添加或移除refs、或比较refs是否需要更新。通过ReactRonconcile模块间接被ReactCompositeComponent模块调用。

#### 依赖
* [ReactOwner](#reactowner)
创建、销毁、比对reactElement的refs属性相关
* ReactInstanceType 、ReactElementType
用于 react 代码静态检测，可忽略。
#### 主要方法说明
```javascript
ReactRef.attachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  if (element === null || typeof element !== 'object') {
    return;
  }
  var ref = element.ref;
  if (ref != null) {
    attachRef(ref, instance, element._owner);
  }
};

//其中element._owner 指的是用户自定义组件的实例，代码调用如下：
//ReactElement line 183 :
ReactElement.createElement = function(){
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current, //参数传入 element._owner = ReactCurrentOwner.current
    props,
  );
}

//ReactCurrentOwner.current 则由 _renderValidatedComponent 设置（组件挂载和更新的时候执行）
//ReactCompositeComponent line 1294 :
_renderValidatedComponent: function() {
  if (
    __DEV__ ||
    this._compositeType !== ReactCompositeComponentTypes.StatelessFunctional
  ) {
    ReactCurrentOwner.current = this;
}
```
```javascript
function attachRef(ref, component, owner) {
  if (typeof ref === 'function') {
  //由用户自定义组件owner调用ReactReconciler中方法执行，this指向owner //todo ??
  ref(component.getPublicInstance());
  } else {
  	//最终是调用 ReactCompositeComponent.attachRef，向用户自定义组件实例添加this.refs[ref]属性
  	//参见 ReactOwner 分析
  	ReactOwner.addComponentAsRefTo(component, ref, owner);
  }
}
```
see [ReactOwner](#reactowner)