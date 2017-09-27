'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement, insertElement } from '../element/index';
import { EventEmitter } from 'events';
export class UIToggle {
    constructor(options) {
        this.options = options;
        this.events = new EventEmitter();
        this.initUI();
    }
    initUI() {
        this.mainElement = createElement('div', {
            className: 'de-wb-vipera-ext-ui-toggle-container'
        });
        this.toggleInput = createElement('input', {
            className: 'input-toggle'
        });
        this.toggleInput.setAttribute('type', 'checkbox');
        if (this.options.value) {
            this.toggleInput.setAttribute('checked', '');
        }
        this.toggleInput.addEventListener('change', () => {
            this.fireValueChange(this.value);
        });
        //<label class='input-label'><input class='input-toggle' type='checkbox' checked> Toggle</label>
        this.lblCaption = createElement('label', {
            elements: [this.toggleInput, createText(this.options.caption)],
            className: 'input-label'
        });
        insertElement(this.mainElement, this.lblCaption);
    }
    get element() {
        return this.mainElement;
    }
    get value() {
        return this.toggleInput["checked"];
    }
    set value(value) {
        if (value) {
            this.toggleInput.setAttribute('checked', '');
        }
        else {
            this.toggleInput.removeAttribute('checked');
        }
    }
    fireValueChange(value) {
        this.events.emit('didValueChanged', value);
    }
    onDidValueChange(listener) {
        this.addEventListener("didValueChanged", listener);
    }
    addEventListener(event, listener) {
        this.events.addListener(event, listener);
    }
    removeEventListener(event, listener) {
        this.events.removeListener(event, listener);
    }
}
//# sourceMappingURL=UIToggle.js.map