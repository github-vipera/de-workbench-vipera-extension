'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement, createTextEditor } from '../element/index';
import { UIBaseComponent } from './UIComponent';
import { UIToolbar, UIToolbarButton } from './UIToolbar';
import * as _ from 'lodash';
import { LogLevel } from '../logger/Logger';
import { UISelect } from './UISelect';
const moment = require('moment');
export class BaseLogModel {
    constructor(maxLineCount) {
        this.listeners = [];
        this.logLines = [];
        this.maxLineCount = 500;
        if (maxLineCount) {
            this.maxLineCount = maxLineCount;
        }
    }
    appendLogLine(logLine) {
        this.logLines.push(logLine);
        if (this.logLines.length > this.maxLineCount) {
            let logLine = this.logLines[0];
            this.logLines = _.drop(this.logLines);
            this.fireRowDrop(logLine);
        }
        this.fireRowAdd(logLine);
    }
    getRowCount() {
        return this.logLines.length;
    }
    getRowAt(index) {
        return this.logLines[index];
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    removeListener(listener) {
        _.remove(this.listeners, function (single) {
            return single == listener;
        });
    }
    clear() {
        this.logLines = [];
        this.fireRowChanges();
    }
    fireRowAdd(logLine) {
        _.forEach(this.listeners, function (list) {
            list.rowAppended(logLine);
        });
    }
    fireRowDrop(logLine, index) {
        _.forEach(this.listeners, function (list) {
            list.rowDropped(logLine, index || 0);
        });
    }
    fireRowChanges() {
        _.forEach(this.listeners, function (list) {
            list.rowsChanged();
        });
    }
}
export class FilterableLogModel extends BaseLogModel {
    constructor(model) {
        super();
        this._listeners = [];
        this._logLines = [];
        this._filters = [];
        this._filteredList = [];
        this.model = model;
        this.model.addListener(this);
    }
    appendLogLine(logLine) {
        this.model.appendLogLine(logLine);
    }
    getRowCount() {
        if (this._filters.length > 0) {
            return this._filteredList.length;
        }
        return this.model.getRowCount();
    }
    getRowAt(index) {
        if (this._filters.length > 0) {
            return this._filteredList[index];
        }
        return this.model.getRowAt(index);
    }
    addListener(listener) {
        this._listeners.push(listener);
    }
    removeListener(listener) {
        _.remove(this._listeners, function (single) {
            return single == listener;
        });
    }
    rowAppended(logLine) {
        let newValue = this.applyFilterChain([logLine]);
        if (newValue.length > 0) {
            this._filteredList.push(newValue[0]);
            _.forEach(this._listeners, function (single) {
                single.rowAppended(logLine);
            });
        }
        // ELSE do nothing!!!!
    }
    rowDropped(line) {
        let update = this.applyFilterChain([line]).length > 0;
        if (update) {
            this._filteredList = _.drop(this._filteredList);
            _.forEach(this._listeners, function (single) {
                single.rowDropped(line);
            });
        }
    }
    clear() {
        this.model.clear();
    }
    rowsChanged() {
        this.evaluateAllFilters();
    }
    addFilter(filter) {
        this._filters.push(filter);
        this.evaluateAllFilters();
    }
    removeFilter(filter) {
        _.remove(this._filters, function (single) {
            return single == filter;
        });
    }
    clearAllFilters() {
        this._filters = [];
    }
    evaluateAllFilters() {
        this._filteredList = this.applyFilterChain(this.getOrigialValues());
        _.forEach(this._listeners, function (single) {
            single.rowsChanged();
        });
    }
    getOrigialValues() {
        let values = [];
        let count = this.model.getRowCount();
        for (let i = 0; i < count; i++) {
            values.push(this.model.getRowAt(i));
        }
        return values;
    }
    applyFilterChain(currentValues) {
        if (this._filters.length == 0) {
            return currentValues;
        }
        for (let filter of this._filters) {
            currentValues = _.filter(currentValues, filter.evaluateFilter.bind(filter));
        }
        return currentValues;
    }
}
export class UILogView extends UIBaseComponent {
    constructor(model) {
        super();
        this.autoscroll = true;
        this.model = model != null ? model : new BaseLogModel();
        this.model.addListener(this);
        this.initUI();
    }
    initUI() {
        this.mainElement = createElement('div', {
            className: "de-workbench-uilogger-loglines"
        });
    }
    isAutoscroll() {
        return this.autoscroll;
    }
    setAutoscroll(value) {
        this.autoscroll = value;
    }
    appendNewNode(newLine) {
        let cssClass = this.getClassByLevel(newLine.logLevel);
        let element = this.createLogLineElement(newLine.message, cssClass);
        this.element().appendChild(element);
        this.updateScroll();
    }
    updateScroll(force) {
        if (this.autoscroll || force) {
            this.mainElement.scrollTop = this.mainElement.scrollHeight;
        }
    }
    getClassByLevel(level) {
        switch (level) {
            case LogLevel.TRACE:
                return "trace";
            case LogLevel.DEBUG:
                return "debug";
            case LogLevel.INFO:
                return "info";
            case LogLevel.WARN:
                return "warn";
            case LogLevel.ERROR:
                return "error";
        }
        return "debug";
    }
    rowAppended(newLine) {
        this.appendNewNode(newLine);
    }
    rowDropped(line) {
        this.mainElement.removeChild(this.mainElement.firstChild);
    }
    rowsChanged() {
        console.log("rowsChanged", "repeat rendering");
        this.render();
    }
    render() {
        this.clearMainElement();
        const count = this.model.getRowCount();
        for (let i = 0; i < count; i++) {
            this.appendNewNode(this.model.getRowAt(i));
        }
    }
    clearMainElement() {
        if (!this.mainElement) {
            return;
        }
        while (this.mainElement.firstChild) {
            this.mainElement.removeChild(this.mainElement.firstChild);
        }
    }
    createLogLineElement(message, className) {
        return createElement('div', {
            elements: [
                createElement('div', {
                    elements: [
                        createText(message)
                    ],
                    className: "de-workbench-uilogger-logline-message"
                })
            ],
            className: "de-workbench-uilogger-logline " + (className ? className : '')
        });
    }
}
export class UILoggerComponent extends UIBaseComponent {
    constructor(showToolbar) {
        super();
        this.autoscroll = true;
        this.logModel = new FilterableLogModel(new BaseLogModel());
        this.logView = new UILogView(this.logModel);
        this.buildUI(showToolbar || false);
    }
    getFilterableModel() {
        return this.logModel;
    }
    buildUI(showToolbar) {
        if (showToolbar) {
            this.toolbar = new UILoggerToolbarComponent();
            this.toolbar.setTarget(this.logModel);
            this.toolbar.setActionDelegate((action) => {
                switch (action) {
                    case "toggleAutoscroll":
                        this.setAutoscroll(!this.autoscroll);
                        break;
                    case "clearLog":
                        this.logModel.clear();
                        break;
                }
            });
            this.mainElement = createElement('div', {
                elements: [
                    this.toolbar.element(),
                    this.logView.element()
                ],
                className: "de-workbench-uilogger-container"
            });
        }
        else {
            this.mainElement = createElement('div', {
                elements: [
                    this.logView.element()
                ],
                className: "de-workbench-uilogger-container"
            });
        }
    }
    addLog(message, level) {
        let completeMessage = UILoggerComponent.getFormattedTimestamp() + " - " + message;
        this.logModel.appendLogLine({
            message: completeMessage,
            logLevel: level || LogLevel.DEBUG,
        });
        return this;
    }
    static getFormattedTimestamp() {
        return moment().format('MM-DD hh:mm:ss.SSS');
    }
    updateScroll() {
        /*if (this.autoscroll){
          this.mainElement.scrollTop = this.mainElement.scrollHeight;
        }
        return this;*/
        this.logView.updateScroll(true);
        return this;
    }
    setAutoscroll(autoscroll) {
        this.logView.setAutoscroll(autoscroll);
        return this;
    }
}
//<input class='input-search' type='search' placeholder='Search'>
class TextFilter {
    constructor() {
        this.value = null;
        this.regexp = null;
    }
    setText(value) {
        this.value = value;
        if (value) {
            this.regexp = new RegExp(_.escapeRegExp(value));
        }
        else {
            this.regexp = null;
        }
    }
    evaluateFilter(log) {
        if (this.value == null || this.regexp == null) {
            return true;
        }
        return this.regexp.test(log.message || "");
    }
}
class LogLevelFilter {
    constructor(initialValue) {
        this.level = initialValue || LogLevel.TRACE;
    }
    getLogLevel() {
        return this.level;
    }
    setLogLevel(level) {
        this.level = level;
    }
    evaluateFilter(log) {
        return log.logLevel > this.level;
    }
}
class UILoggerToolbarComponent extends UIToolbar {
    constructor() {
        super();
        this.target = null;
        this.regexpfilter = new TextFilter();
        this.levelFilter = new LogLevelFilter();
        this.actionDelegate = null;
        this.setupToolbar();
    }
    setTarget(target) {
        this.target = target;
        this.target.addFilter(this.regexpfilter);
        this.target.addFilter(this.levelFilter);
    }
    setActionDelegate(delegate) {
        this.actionDelegate = delegate;
    }
    setupToolbar() {
        this.createAndAddSearchFilter(this);
        let subToolbar = this.createButtonToolbar();
        this.addElementNoSpace(subToolbar.element());
    }
    createAndAddSearchFilter(container) {
        let searchTextField = createTextEditor({
            type: 'search',
            placeholder: 'Filter log',
            change: (value) => {
                console.log("Value changed: ", value);
                this.regexpfilter.setText(value);
                setTimeout(() => {
                    this.target.evaluateAllFilters();
                });
            }
        });
        searchTextField.classList.add("de-workbench-uilogger-search-field");
        searchTextField.classList.add("inline-block");
        container.addElementNoSpace(searchTextField);
    }
    createAndAddLogLevelSelect(container) {
        let opts = this.createLoggerFilterOptions();
        let levelSelect = new UISelect(opts);
        levelSelect.addSelectListener(this);
        container.addElementNoSpace(levelSelect.element());
    }
    createButtonToolbar() {
        let buttonToolbar = new UIToolbar();
        this.createAndAddLogLevelSelect(buttonToolbar);
        let autoScrollButton = new UIToolbarButton();
        autoScrollButton.setId("autoScroll");
        autoScrollButton.setWithSpace(false);
        autoScrollButton.setIcon(" icon-move-down");
        autoScrollButton.handler = () => {
            if (this.actionDelegate) {
                this.actionDelegate("toggleAutoscroll");
            }
        };
        buttonToolbar.addButton(autoScrollButton);
        let clearLog = new UIToolbarButton();
        clearLog.setId("clearLog");
        clearLog.setIcon(" icon-trashcan");
        clearLog.setWithSpace(false);
        clearLog.handler = () => {
            if (this.actionDelegate) {
                this.actionDelegate("clearLog");
            }
        };
        buttonToolbar.addButton(clearLog);
        return buttonToolbar;
    }
    onItemSelected(value) {
        this.levelFilter.setLogLevel(parseInt(value));
        setTimeout(() => {
            this.target.evaluateAllFilters();
        });
    }
    createLoggerFilterOptions() {
        return [
            { name: 'verbose', value: LogLevel.TRACE.toString() },
            { name: 'debug', value: LogLevel.DEBUG.toString() },
            { name: 'info', value: LogLevel.INFO.toString() },
            { name: 'warn', value: LogLevel.WARN.toString() },
            { name: 'error', value: LogLevel.ERROR.toString() },
        ];
    }
}
//# sourceMappingURL=UILoggerComponent.js.map