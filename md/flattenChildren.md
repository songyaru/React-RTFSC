## <span id="flattenchildren">flattenChildren</span>
>将 props.children 子节点根据 key 值扁平化后输出。

#### 依赖
* [traverseAllChildren](#traverseallchildren)

#### 主要方法说明
```javascript
function flattenSingleChildIntoContext(
  traverseContext: mixed,
  child: ReactElement<any>,
  name: string,
  selfDebugID?: number,
): void {
  // We found a component instance.
  if (traverseContext && typeof traverseContext === 'object') {
    const result = traverseContext;
    const keyUnique = result[name] === undefined;
    if (keyUnique && child != null) {
      result[name] = child;
    }
  }
}
/**
 * Flattens children that are typically specified as `props.children`. Any null
 * children will not be included in the resulting object.
 * @return {!object} flattened children keyed by name.
 */
function flattenChildren(
  children: ReactElement<any>,
  selfDebugID?: number,
): ?{[name: string]: ReactElement<any>} {
  if (children == null) {
    return children;
  }
  var result = {};
  traverseAllChildren(children, flattenSingleChildIntoContext, result);
  return result;
}
```