'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createElement } from '../element/index';
import { UIBaseComponent } from '../ui-components/UIComponent';
export class UIInputFormElement extends UIBaseComponent {
    constructor() {
        super();
        this.buildUI();
    }
    buildUI() {
        this.label = createElement('label', {
            elements: []
        });
        this.inputEditor = createElement('atom-text-editor', {});
        this.inputEditor.setAttribute('mini', '');
        this.inputEditor.setAttribute('tabindex', '-1');
        this.mainElement = createElement('div', {
            elements: [
                this.label,
                this.inputEditor
            ],
            className: 'block control-group'
        });
    }
    setCaption(caption) {
        this.label.innerText = caption;
        return this;
    }
    setValue(value) {
        this.getModel().setText(value);
        return this;
    }
    getValue() {
        return this.getModel().getText();
    }
    setWidth(width) {
        this.mainElement.style.width = width;
        return this;
    }
    setPlaceholder(placeholder) {
        this.getModel().setPlaceholderText(placeholder);
        return this;
    }
    getModel() {
        return this.inputEditor['getModel']();
    }
    addChangeListener(listener) {
        if (!this.listeners) {
            this.listeners = new Array();
            this.getModel().emitter.on('did-change', (evt) => {
                for (var i = 0; i < this.listeners.length; i++) {
                    this.listeners[i](this);
                }
            });
        }
        this.listeners.push(listener);
        return this;
    }
}
//# sourceMappingURL=UIInputFormElement.js.map