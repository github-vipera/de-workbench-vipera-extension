'use babel';
export class EventBus {
    // Project events
    static get EVT_PROJECT_CHANGED() { return "dewb.project.workspace.projectChanged"; }
    static get EVT_PATH_CHANGED() { return "dewb.project.workspace.pathChanged"; }
    static get EVT_PLUGIN_ADDED() { return "dewb.project.cordova.pluginAdded"; }
    static get EVT_PLUGIN_REMOVED() { return "dewb.project.cordova.pluginRemoved"; }
    static get EVT_PLATFORM_ADDED() { return "dewb.project.cordova.platformRemoved"; }
    static get EVT_PLATFORM_REMOVED() { return "dewb.project.cordova.platformRemoved"; }
    // Workbench events
    static get EVT_WORKBENCH_PLUGIN_ADDED() { return "dewb.workbench.plugins.pluginAdded"; }
    constructor() {
        let EvtBusModule = require('@nsisodiya/eventbus');
        this._eventBus = new EvtBusModule();
    }
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    subscribe(topic, callback) {
        this._eventBus.subscribe(topic, callback);
    }
    subscribeAll(callback) {
        this._eventBus.subscribeAll(callback);
    }
    publish(topic, ...args) {
        this._eventBus.publish(topic, args);
    }
}
//# sourceMappingURL=EventBus.js.map