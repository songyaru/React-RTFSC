## <span id="reactinputselection">ReactInputSelection</span>
> 文本输入框选中文字的处理函数

#### 依赖
* [ReactDOMSelection](#reactdomselection)
* [containsNode](#containsNode)
* [focusNode](#focusNode)
* [getActiveElement](#getActiveElement)

#### 主要方法说明
```javascript
var ReactInputSelection = {
  //判断 elem 是否可以被选中
  hasSelectionCapabilities: function(elem) {
  },

  //获取焦点的元素，文字选中的信息
  getSelectionInformation: function() {
  },

  //以priorSelectionInformation={focusedElem,selectionRange} 的数据，选中节点及特定的文案
  restoreSelection: function(priorSelectionInformation) {
  },

  //获取输入框、文本框及contentEditable节点的选中文案，返回值为{start,end}形式
  getSelection: function(input) {
  },

  //根据offsets={start,end}设置输入框input的选中文本
  setSelection: function(input, offsets) {
  },
};

```