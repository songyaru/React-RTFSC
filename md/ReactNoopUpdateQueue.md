## <span id="reactnoopupdatequeue">ReactNoopUpdateQueue</span>
>定义了 update queue 的 API 接口

#### 主要方法说明
```javascript
//请阅读注释
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   */
  isMounted: function(publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   */
  enqueueForceUpdate: function(publicInstance, callback, callerName) {
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   */
  enqueueReplaceState: function(
    publicInstance,
    completeState,
    callback,
    callerName,
  ) {
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   */
  enqueueSetState: function(
    publicInstance,
    partialState,
    callback,
    callerName,
  ) {
  },
};
```