## <span id="reactfiberstack">ReactFiberStack</span>
>

#### 依赖
* [ReactFiber](#reactfiber)

#### 主要方法说明
```javascript
exports.createCursor = function<T>(defaultValue: T): StackCursor<T> {
  return {
    current: defaultValue,
  };
};
```