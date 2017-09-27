'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement, insertElement } from '../element/index';
const remote = require('remote');
const dialog = remote.require('electron').dialog;
const DEFAULT_DISPLAY_OPTIONS = "block";
const HIDE_DISPLAY_OPTIONS = "none";
export class UIInput {
    constructor(options) {
        this.options = options;
        this.initUI();
    }
    initUI() {
        this.mainElement = createElement('div', {
            className: 'de-wb-vipera-ext-ui-input-container'
        });
        if (this.options.visible === false) {
            this.mainElement.style.display = 'none';
        }
        if (this.options && this.options.caption) {
            this.lblCaption = createElement('label', {
                elements: [createText(this.options.caption)]
            });
            insertElement(this.mainElement, this.lblCaption);
        }
        let inputContainer = createElement('div', {
            className: 'de-wb-vipera-ext-ui-input-inline-control'
        });
        this.txtInput = createElement('input', {
            className: 'input-text native-key-bindings de-wb-vipera-ext-ui-input'
        });
        this.txtInput.setAttribute('type', 'text');
        if (this.options && this.options.placeholder) {
            this.txtInput.setAttribute('placeholder', this.options.placeholder);
        }
        this.txtInput.addEventListener('keydown', (evt) => {
            //this.fireConfigChanged()
        });
        insertElement(inputContainer, this.txtInput);
        if (this.options && this.options.browseFor) {
            this.actionButton = this.createActionButtonFor(this.options.browseFor);
            insertElement(inputContainer, this.actionButton);
        }
        insertElement(this.mainElement, inputContainer);
    }
    createActionButtonFor(action) {
        if (action === "folder") {
            return this.createActionButtonForFolder();
        }
        else if (action === "file") {
            return this.createActionButtonForFile();
        }
    }
    createActionButtonForFolder() {
        let button = this.createActionButton('Browse...');
        button.addEventListener('click', () => {
            this.chooseFolder();
        });
        return button;
    }
    createActionButtonForFile() {
        let button = this.createActionButton('Browse...');
        button.addEventListener('click', () => {
            this.chooseFile();
        });
        return button;
    }
    createActionButton(caption) {
        let button = createElement('button', {
            elements: [createText(caption)],
            className: 'btn btn-sm de-wb-vipera-ext-ui-input-action-button'
        });
        button.style["margin-left"] = "10px";
        return button;
    }
    chooseFolder() {
        var path = dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (path && path.length > 0) {
            this.value = path;
        }
    }
    chooseFile() {
        var path = dialog.showOpenDialog({
            properties: ['openFile']
        });
        if (path && path.length > 0) {
            this.value = path;
        }
    }
    get element() {
        return this.mainElement;
    }
    get value() {
        return this.txtInput["value"];
    }
    set value(value) {
        this.txtInput["value"] = value;
    }
    setVisible(value, defaultDisplay) {
        if (value) {
            this.mainElement.style.display = defaultDisplay || DEFAULT_DISPLAY_OPTIONS;
        }
        else {
            this.mainElement.style.display = HIDE_DISPLAY_OPTIONS;
        }
    }
}
//# sourceMappingURL=UIInput.js.map