'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { EventEmitter } from 'events';
export class EventBus {
    // Configuration events
    static get EVT_CONFIG_CHANGED() { return "dewb.vipext.configurationChanged"; }
    constructor() {
        this.eventEmitter = new EventEmitter();
    }
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    subscribe(topic, callback) {
        this.eventEmitter.on(topic, callback);
    }
    publish(topic, ...args) {
        //this._eventBus.publish(topic, args)
        this.eventEmitter.emit(topic, args);
    }
    unsubscribe(topic, callback) {
        this.eventEmitter.removeListener(topic, callback);
    }
}
//# sourceMappingURL=EventBus.js.map