'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement, insertElement } from '../element/index';
import { UIBaseComponent } from './UIComponent';
export class UIStackedView extends UIBaseComponent {
    constructor() {
        super();
        this.buildUI();
    }
    buildUI() {
        // create the header
        this.titleElement = createText('');
        this.titleIcon = createElement('a', {
            className: 'icon icon-plus'
        });
        this.headerElement = createElement('div', {
            elements: [
                this.titleIcon,
                this.titleElement
            ],
            className: "de-workbench-stacked-view-header-section section-heading"
        });
        // the main element
        this.mainElement = createElement('div', {
            elements: [
                this.headerElement
            ],
            className: "de-workbench-stacked-view"
        });
    }
    addHeaderClassName(className) {
        this.headerElement.classList.add(className);
        return this;
    }
    setIconClassName(className) {
        this.iconClassName = className;
        //TODO!! change icon
        return this;
    }
    setTitle(title) {
        this.title = title;
        this.titleElement.textContent = title;
        return this;
    }
    setInnerView(view) {
        this.innerView = view;
        insertElement(this.mainElement, view);
        return this;
    }
    setSubtleView(view) {
        this.subtleView = view;
        //TODO!!
        return this;
    }
    destroy() {
        super.destroy();
    }
}
//# sourceMappingURL=UIStackedView.js.map