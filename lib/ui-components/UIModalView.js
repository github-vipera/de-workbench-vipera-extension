'use babel';
'use babel';
import { createText, createElement, insertElement } from '../element/index';
export class UIModalView {
    constructor(title) {
        this.modalContainer = null;
        this.title = title;
        this.initModalBaseUI();
    }
    initModalBaseUI() {
        this.modalContainer = createElement('div', {
            className: 'de-workbench-modal-container'
        });
        // Add header
        this.addHeader();
        // Add content
        this.addContent();
        // Add footer
        this.addFooter();
        let modalWindow = createElement('div', {
            className: 'de-workbench-modal-window'
        });
        insertElement(modalWindow, this.modalContainer);
        this.element = createElement('div', {
            elements: [modalWindow],
            className: 'de-workbench-modal'
        });
        let modalConfig = {
            item: this.element,
            visible: false
        };
        modalConfig['className'] = 'de-workbench-modal';
        this.panel = atom.workspace.addModalPanel(modalConfig);
    }
    show() {
        this.panel.show();
    }
    hide() {
        this.panel.hide();
    }
    isVisible() {
        return this.panel.isVisible();
    }
    destroy() {
        if (this.panel.isVisible()) {
            this.panel.hide();
        }
        this.destroyModalContainer();
        this.panel['destroy']();
        this.panel = null;
    }
    destroyModalContainer() {
        this.modalContainer.remove();
    }
    addHeader() {
        // Watermark Icon
        let watermarkEl = createElement('div', {
            className: 'de-workbench-modal-watermark'
        });
        insertElement(this.modalContainer, watermarkEl);
        // Modal Title
        let title = createElement('div', {
            elements: [createText(this.title)],
            className: 'de-workbench-modal-title'
        });
        insertElement(this.modalContainer, title);
    }
    addContent() {
        //NOP
    }
    addFooter() {
        //NOP
    }
}
//# sourceMappingURL=UIModalView.js.map