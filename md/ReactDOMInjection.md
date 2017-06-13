## <span id="reactdominjection">ReactDOMInjection</span>
> ReactDom inject 方法的入口

#### 依赖
* [ARIADOMPropertyConfig](#ariadompropertyconfig)
* [BeforeInputEventPlugin](#beforeinputeventplugin)
* [DOMProperty](#domproperty)
* [ChangeEventPlugin](#changeeventplugin)
* [DOMEventPluginOrder](#domeventpluginorder)
* [EnterLeaveEventPlugin](#enterleaveeventplugin)
* [EventPluginHub](#eventpluginhub)
* [EventPluginUtils](#eventpluginutils)
* [HTMLDOMPropertyConfig](#htmldompropertyconfig)
* [ReactBrowserEventEmitter](#reactbrowsereventemitter)
* [ReactDOMComponentTree](#reactdomcomponenttree)
* [ReactDOMEventListener](#reactdomeventlistener)
* [SVGDOMPropertyConfig](#svgdompropertyconfig)
* [SelectEventPlugin](#selecteventplugin)
* [SimpleEventPlugin](#simpleeventplugin)

#### 主要方法说明
```javascript
//line 32 : inject 入口
function inject() {
  ReactDOMEventListener.setHandleTopLevel(
    ReactBrowserEventEmitter.handleTopLevel,
  );

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  EventPluginHub.injection.injectEventPluginOrder(DOMEventPluginOrder);
  EventPluginUtils.injection.injectComponentTree(ReactDOMComponentTree);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  EventPluginHub.injection.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin,
  });

  DOMProperty.injection.injectDOMPropertyConfig(ARIADOMPropertyConfig);
  DOMProperty.injection.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
  DOMProperty.injection.injectDOMPropertyConfig(SVGDOMPropertyConfig);
}

module.exports = {
  inject: inject,
};
```