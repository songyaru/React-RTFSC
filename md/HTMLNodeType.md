## <span id="htmlnodetype">HTMLNodeType</span>
> elem.nodeType 返回值



#### 主要方法说明
```javascript
/*
* 1  | Element                | 元素
* 2  | Attr                   | 属性
* 3  | Text                   | 元素或属性中的文本内容
* 4  | CDATASection           | 文档中的 CDATA 部分（不会由解析器解析的文本）
* 5  | EntityReference        | 实体引用
* 6  | Entity                 | 实体
* 7  | ProcessingInstruction  | 处理指令
* 8  | Comment                | 注释
* 9  | Document               | 整个文档（DOM 树的根节点）
* 10 | DocumentType           | 向为文档定义的实体提供接口
* 11 | DocumentFragment       | 轻量级的 Document 对象，能够容纳文档的某个部分
* 12 | Notation               | DTD 中声明的符号
*/
var HTMLNodeType = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_FRAGMENT_NODE: 11,
};

```