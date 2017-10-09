'use babel';
import { createElement } from '../element/index';
import { EventEmitter } from 'events';
export var ServerStatus;
(function (ServerStatus) {
    ServerStatus[ServerStatus["Stopped"] = 0] = "Stopped";
    ServerStatus[ServerStatus["Starting"] = 1] = "Starting";
    ServerStatus[ServerStatus["Running"] = 2] = "Running";
    ServerStatus[ServerStatus["Stopping"] = 3] = "Stopping";
})(ServerStatus || (ServerStatus = {}));
export class FakeMOTIFServerProvider {
    constructor() {
    }
    createInstance(configuration) {
        return new FakeMotifServer();
    }
    getProviderName() {
        return "(Fake)MOTIF Vipera Server";
    }
    destroyInstance(instance) {
    }
}
class FakeMotifServer {
    constructor() {
        this.status = ServerStatus.Stopped;
        this.events = new EventEmitter();
        this.configurator = new FooConfigurator();
    }
    start() {
        console.log("FOOSERVER start called");
        this.status = ServerStatus.Starting;
        this.events.emit('onDidStatusChange', this);
        setTimeout(() => { this.doStarted(); }, 3000);
    }
    stop() {
        console.log("FOOSERVER stop called");
        this.status = ServerStatus.Stopping;
        this.events.emit('onDidStatusChange', this);
        setTimeout(() => { this.doStopped(); }, 3000);
    }
    doStarted() {
        this.status = ServerStatus.Running;
        this.events.emit('onDidStatusChange', this);
    }
    doStopped() {
        this.status = ServerStatus.Stopped;
        this.events.emit('onDidStatusChange', this);
    }
    configure() {
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
}
class FooConfigurator {
    constructor() {
        this.events = new EventEmitter();
    }
    initUI() {
        this.inputA = createElement('input', {
            className: 'input-text native-key-bindings'
        });
        this.inputA.setAttribute('type', 'text');
        this.inputA.setAttribute('placeholder', 'Server URL');
        this.inputA.addEventListener('keydown', (evt) => {
            this.fireConfigChanged();
        });
        let spacer = createElement('div', {});
        spacer.style.height = "10px";
        this.inputB = createElement('input', {
            className: 'input-text native-key-bindings'
        });
        this.inputB.setAttribute('type', 'text');
        this.inputB.setAttribute('placeholder', 'Configuration file');
        this.inputB.addEventListener('keydown', (evt) => {
            this.fireConfigChanged();
        });
        this.mainElement = createElement('div', {
            elements: [this.inputA, spacer, this.inputB]
        });
        this.updateUI();
    }
    addEventListener(event, listener) {
        this.events.addListener(event, listener);
    }
    removeEventListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    applyConfiguration(configuration) {
        this.currentConfig = configuration;
        if (this.mainElement) {
            this.updateUI();
        }
    }
    getConfigurationPane() {
        if (!this.mainElement) {
            this.initUI();
        }
        return this.mainElement;
    }
    updateUI() {
        if (this.currentConfig.url) {
            this.inputA["value"] = this.currentConfig.url;
        }
        if (this.currentConfig.configPath) {
            this.inputB["value"] = this.currentConfig.configPath;
        }
    }
    fireConfigChanged() {
        this.events.emit("didConfigurationChange", this);
    }
    revertChanges() {
        this.updateUI();
    }
    getConfiguration() {
        return { url: this.inputA["value"], configPath: this.inputB["value"] };
    }
}
//# sourceMappingURL=FooServerProvider.js.map