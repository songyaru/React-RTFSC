## <span id="reactdomframescheduling">ReactDOMFrameScheduling</span>
>暴露 requestAnimationFrame 和 requestIdleCallback

```javascript
exports.rAF = rAF;//requestAnimationFrame
exports.rIC = rIC;//requestIdleCallback
//当不支持的时候，利用 postMessage 模拟，详见代码注释 :

// This a built-in polyfill for requestIdleCallback. It works by scheduling
// a requestAnimationFrame, store the time for the start of the frame, then
// schedule a postMessage which gets scheduled after paint. Within the
// postMessage handler do as much work as possible until time + frame rate.
// By separating the idle call into a separate event tick we ensure that
// layout, paint and other browser work is counted against the available time.
// The frame rate is dynamically adjusted.
```
see
[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)，
[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)，
[使用requestIdleCallback](http://www.cnblogs.com/galenyip/p/4856996.html)
