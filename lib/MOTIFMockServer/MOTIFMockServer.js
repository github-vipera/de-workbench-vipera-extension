'use babel';
import { EventEmitter } from 'events';
import { MOTIFServerConfigUI } from './MOTIFServerConfigUI';
const { allowUnsafeEval, allowUnsafeNewFunction } = require('loophole');
const { ServerManagerFactory, ServerManager } = allowUnsafeNewFunction(() => allowUnsafeEval(() => require('de-mock-server-lib')));
const fs = require('fs');
const path = require('path');
const basePath = process.cwd();
export var ServerStatus;
(function (ServerStatus) {
    ServerStatus[ServerStatus["Stopped"] = 0] = "Stopped";
    ServerStatus[ServerStatus["Starting"] = 1] = "Starting";
    ServerStatus[ServerStatus["Running"] = 2] = "Running";
    ServerStatus[ServerStatus["Stopping"] = 3] = "Stopping";
})(ServerStatus || (ServerStatus = {}));
export class MotifMockServerProvider {
    constructor() {
    }
    createInstance(configuration) {
        return new MotifMockServer(configuration);
    }
    getProviderName() {
        return "Vipera MOTIF Mock Server";
    }
    destroyInstance(instance) {
    }
}
class MotifMockServer {
    constructor(config) {
        this.status = ServerStatus.Stopped;
        this.events = new EventEmitter();
        this.config = config;
        this.initConfigurator();
    }
    initConfigurator() {
        this.configurator = new MotifFMockConfigurator();
    }
    validateConfiguration() {
        if (!this.config) {
            throw ("Unable to start the server because it is not yet properly configured.");
        }
    }
    start() {
        if (this.status === ServerStatus.Stopped) {
            this.validateConfiguration();
            console.log("Starting MOTIF Mock server: ", basePath);
            this.resolvePaths(this.config);
            this.serverManager = ServerManagerFactory.createServerManager();
            this.serverManager.start(this.config);
            this.status = ServerStatus.Running;
            this.fireStatusChange();
        }
        else {
        }
    }
    stop() {
        if (this.status === ServerStatus.Running) {
            console.log("Stopping MOTIF Mock server: ", basePath);
            this.status = ServerStatus.Stopping;
            this.serverManager.stop();
            this.serverManager = null;
            this.status = ServerStatus.Stopped;
            this.fireStatusChange();
        }
        else {
        }
    }
    configure() {
        this.config = this.configurator.getConfiguration();
    }
    addEventListener(event, listener) {
        this.events.addListener(event, listener);
    }
    removeEventListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    getConfigurator(configuration) {
        return this.configurator;
    }
    fireStatusChange() {
        this.events.emit('onDidStatusChange', this);
        this.fireLogEvent("Server is " + this.statusStr);
    }
    get statusStr() {
        if (this.status == ServerStatus.Stopped) {
            return "Stopped";
        }
        else if (this.status == ServerStatus.Running) {
            return "Running";
        }
        else if (this.status == ServerStatus.Starting) {
            return "Starting";
        }
        else if (this.status == ServerStatus.Stopping) {
            return "Stopping";
        }
    }
    fireLogEvent(message) {
        this.events.emit('onDidLogEvent', { "instance": this, "message": message });
    }
    resolvePaths(config) {
        if (config.mockModulePath) {
            config.mockModulePath = path.resolve(basePath, config.mockModulePath);
        }
        if (config.libraryLoaderPath) {
            config.libraryLoaderPath = path.resolve(basePath, config.libraryLoaderPath);
        }
        if (config.mockModulePath) {
            config.localDBPath = path.resolve(basePath, config.localDBPath);
        }
    }
}
class MotifFMockConfigurator {
    constructor() {
        this.events = new EventEmitter();
    }
    initUI() {
        this.configUI = new MOTIFServerConfigUI();
        this.updateUI();
    }
    getConfiguration() {
        return this.configUI.getConfiguration();
    }
    addEventListener(event, listener) {
        this.events.addListener(event, listener);
    }
    removeEventListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    applyConfiguration(configuration) {
        this.currentConfig = configuration;
        if (this.configUI) {
            this.updateUI();
        }
    }
    getConfigurationPane() {
        if (!this.configUI) {
            this.initUI();
        }
        return this.configUI.mainElement;
    }
    updateUI() {
        if (this.configUI) {
            this.configUI.updateUI(this.currentConfig);
        }
    }
    fireConfigChanged() {
        this.events.emit("didConfigurationChange", this);
    }
    revertChanges() {
        this.updateUI();
    }
}
//# sourceMappingURL=MOTIFMockServer.js.map