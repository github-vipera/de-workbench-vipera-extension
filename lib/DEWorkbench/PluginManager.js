'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { EventBus } from '../DEWorkbench/EventBus';
export class PluginManager {
    constructor() {
        this.plugins = [];
    }
    registerPlugin(plugin) {
        this.plugins.push(plugin);
        // lifecycle method
        plugin.onRegistration();
        EventBus.getInstance().publish(EventBus.EVT_WORKBENCH_PLUGIN_ADDED, plugin);
    }
}
//# sourceMappingURL=PluginManager.js.map