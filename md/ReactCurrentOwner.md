## <span id="reactcurrentowner">ReactCurrentOwner</span>
> 用户自定义组件 ReactCompositeComponent 的实例

#### 主要方法说明
```javascript
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: (null: null | ReactInstance | Fiber),
};
```