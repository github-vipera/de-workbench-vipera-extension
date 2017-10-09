'use babel';
import { createElement } from '../element/index';
import { EventEmitter } from 'events';
import { UIInput } from '../ui-components/UIInput';
import { UIToggle } from '../ui-components/UIToggle';
export class MOTIFServerConfigUI {
    constructor() {
        this.initUI();
    }
    initUI() {
        this.events = new EventEmitter();
        this.txtServerPort = new UIInput({
            caption: "Server Port",
            placeholder: "Server Port"
        });
        this.txtMockModulePath = new UIInput({
            caption: "Mock Module File",
            placeholder: "Mock Module File",
            browseFor: "file",
            visible: false
        });
        this.txtMotifServerUrl = new UIInput({
            caption: "Motif Server Url",
            placeholder: "Ex: 'http://localhost:8080/json'",
            visible: true
        });
        this.txtLibraryLoaderPath = new UIInput({
            caption: "Library Loader File",
            placeholder: "Library Loader File",
            browseFor: "file",
            visible: false
        });
        this.txtLocalDbPath = new UIInput({
            caption: "Local Database Path",
            placeholder: "Local Database  Path",
            browseFor: "folder",
            visible: false
        });
        this.mockEnabled = new UIToggle({
            caption: 'Use mock'
        });
        this.mockEnabled.onDidValueChange(() => {
            this.updateMockUI();
        });
        this.liveReloadEnabled = new UIToggle({
            caption: 'Live reload'
        });
        this.mainElement = createElement('div', {
            elements: [this.txtServerPort.element,
                this.txtMockModulePath.element,
                this.txtMotifServerUrl.element,
                this.mockEnabled.element,
                this.liveReloadEnabled.element,
                this.txtLibraryLoaderPath.element,
                this.txtLocalDbPath.element
            ]
        });
    }
    fireConfigChanged() {
        this.events.emit("didConfigurationChange", this);
    }
    updateUI(config) {
        this.portNumber = config.port || -1;
        this.isMockEnabled = config.isMockEnabled;
        this.mockModulePath = config.mockModulePath || "";
        this.libraryLoaderPath = config.libraryLoaderPath || "";
        this.localDBPath = config.localDBPath || "";
        this.liveReload = config.liveReload;
        this.serverUrl = config.serverUrl || "";
    }
    addEventListener(event, listener) {
        this.events.addListener(event, listener);
    }
    removeEventListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    getConfiguration() {
        let ret = {
            port: this.portNumber,
            isMockEnabled: this.isMockEnabled,
            mockModulePath: this.mockModulePath,
            libraryLoaderPath: this.libraryLoaderPath,
            localDBPath: this.localDBPath,
            liveReload: this.liveReload,
            serverUrl: this.serverUrl
        };
        return ret;
    }
    get portNumber() {
        try {
            return parseInt(this.txtServerPort.value);
        }
        catch (err) {
            alert("Invalid server port number defined");
        }
    }
    get mockModulePath() {
        return this.txtMockModulePath.value;
    }
    get libraryLoaderPath() {
        return this.txtLibraryLoaderPath.value;
    }
    get localDBPath() {
        return this.txtLocalDbPath.value;
    }
    get isMockEnabled() {
        return this.mockEnabled.value;
    }
    get liveReload() {
        return this.liveReloadEnabled.value;
    }
    get serverUrl() {
        return this.txtMotifServerUrl.value;
    }
    set portNumber(value) {
        this.txtServerPort.value = "" + (value > 0 ? value : "");
    }
    set mockModulePath(value) {
        this.txtMockModulePath.value = value;
    }
    set libraryLoaderPath(value) {
        this.txtLibraryLoaderPath.value = value;
    }
    set localDBPath(value) {
        this.txtLocalDbPath.value = value;
    }
    set isMockEnabled(value) {
        this.mockEnabled.value = value;
        this.updateMockUI();
    }
    set liveReload(value) {
        this.liveReloadEnabled.value = value;
    }
    set serverUrl(value) {
        this.txtMotifServerUrl.value = value;
    }
    updateMockUI() {
        if (!this.isMockEnabled) {
            this.txtMockModulePath.setVisible(false);
            this.txtLocalDbPath.setVisible(false);
            this.txtLibraryLoaderPath.setVisible(false);
            this.txtMotifServerUrl.setVisible(true);
        }
        else {
            this.txtMockModulePath.setVisible(true);
            this.txtLocalDbPath.setVisible(true);
            this.txtLibraryLoaderPath.setVisible(true);
            this.txtMotifServerUrl.setVisible(false);
        }
    }
}
//# sourceMappingURL=MOTIFServerConfigUI.js.map