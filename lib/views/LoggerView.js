'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createElement, insertElement } from '../element/index';
import { EventEmitter } from 'events';
import { Logger } from '../logger/Logger';
import { UILoggerComponent } from '../ui-components/UILoggerComponent';
export class LoggerView {
    constructor() {
        //this.bindWihtLogger();
        Logger.getInstance().info("LoggerView initializing...");
        this.atomWorkspace = atom.workspace;
        this.events = new EventEmitter();
        this.initUI();
        this.bindWithLogger();
    }
    bindWithLogger() {
        console.log("bindWithLogger");
        Logger.getInstance().addLoggingListener(this);
        Logger.getInstance().debug("LoggerView -> bind with log done");
    }
    onLogging(level, msg) {
        this.loggerComponent.addLog(msg, level);
    }
    /**
     * Initialize the UI
     */
    initUI() {
        Logger.getInstance().debug("LoggerView initUI called...");
        this.loggerComponent = new UILoggerComponent(true);
        // Create the main UI
        this.element = createElement('div', {
            elements: []
        });
        insertElement(this.element, this.loggerComponent.element());
    }
    /**
     * Open this view
     */
    open() {
        Logger.getInstance().debug("LoggerView open called...");
        if (this.item) {
            this.atomWorkspace.toggle(this.item);
        }
        else {
            const prefix = "dewb";
            const uri = prefix + '//' + '_loggerview';
            this.item = {
                activatePane: true,
                searchAllPanes: true,
                location: 'bottom',
                element: this.element,
                getTitle: () => 'DE Workbench Log Inspector',
                getURI: () => uri,
                getDefaultLocation: () => 'bottom',
                getAllowedLocations: () => ['bottom', 'top', 'left', 'right']
            };
            this.atomWorkspace.open(this.item).then((view) => {
                this.loggerComponent.updateScroll();
            });
        }
    }
    /**
     * close this view
     */
    close() {
        this.panel.hide();
    }
}
//# sourceMappingURL=LoggerView.js.map