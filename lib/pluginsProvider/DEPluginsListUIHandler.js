'use babel';
import { createText, createElement } from '../element/index';
import { DESDKRegistry } from './DESDKRegistry';
import { EventBus } from '../utils/EventBus';
const remote = require('remote');
const dialog = remote.require('electron').dialog;
const fs = require('fs');
export class DEPlusinsListUIHandler {
    constructor() {
        this.initUI();
    }
    initUI() {
        // offline toggle
        this.offlineToggleInput = createElement('input', {
            className: 'input-toggle'
        });
        this.offlineToggleInput.setAttribute('type', 'checkbox');
        let offlineToggle = createElement('label', {
            elements: [
                this.offlineToggleInput,
                createText('Offline SDK')
            ],
            className: 'input-label deweb-dynamicengine-plugins-offlinemode-toggle-label'
        });
        this.offlineToggleInput.addEventListener('change', (evt) => {
            let checkValue = evt.srcElement.checked;
            this.setOfflineSDK(checkValue);
        });
        // offline toggle input
        // Offline Management
        this.offlineSDKLocation = createElement('span', {
            elements: [
                createText("/"),
            ],
            className: 'deweb-dynamicengine-plugins-offlinemode-currentpath highlight'
        });
        this.offlineSettingsContainer = createElement('div', {
            elements: [
                createText("Current SDK location: "),
                this.offlineSDKLocation,
            ],
            className: 'deweb-dynamicengine-plugins-settings-container offline front'
        });
        this.offlineButtonSDKPathSelector = createElement('button', {
            elements: [
                createElement('span', {
                    className: 'icon icon-package'
                }),
                createText('Set Vipera SDK location')
            ],
            className: 'inline-block btn'
        });
        this.offlineButtonSDKPathSelector.addEventListener('click', () => {
            this.selectSDKOfflinePath();
        });
        // Offline Management
        // NPM registry Management
        this.btnViperaRegistrySelector = createElement('button', {
            elements: [
                createElement('span', {
                    className: 'icon icon-repo-clone'
                }),
                createText('Set Vipera NPM Registry')
            ],
            className: 'inline-block btn'
        });
        this.btnViperaRegistrySelector.addEventListener('click', () => {
            DESDKRegistry.getInstance().installViperaNPMRegistry();
        });
        this.btnDefaultRegistrySelector = createElement('button', {
            elements: [
                createElement('span', {
                    className: 'icon icon-repo-clone'
                }),
                createText('Restore Default NPM Registry')
            ],
            className: 'inline-block btn'
        });
        this.btnDefaultRegistrySelector.addEventListener('click', () => {
            DESDKRegistry.getInstance().restoreDefaultNPMRegistry();
        });
        this.currentNPMRegistry = createElement('span', {
            elements: [
                createText("https://---"),
            ],
            className: 'deweb-dynamicengine-plugins-offlinemode-currentpath highlight'
        });
        this.npmSettingsSettingsContainer = createElement('div', {
            elements: [
                createText("Current NPM Registry: "),
                this.currentNPMRegistry,
            ],
            className: 'deweb-dynamicengine-plugins-settings-container npm back'
        });
        // end NPM registry management
        //status container
        let statusContainer = createElement('div', {
            elements: [
                createElement('div', {
                    elements: [
                        this.offlineSettingsContainer,
                        this.npmSettingsSettingsContainer
                    ],
                    className: 'flipper'
                })
            ],
            className: 'flip-container'
        });
        let toolbarContainer = createElement('div', {
            elements: [
                offlineToggle, this.offlineButtonSDKPathSelector, this.btnViperaRegistrySelector, this.btnDefaultRegistrySelector,
                statusContainer
            ],
            className: 'block'
        });
        this.mainElement = createElement('div', {
            elements: [toolbarContainer]
        });
        this.setOfflineSDK(DESDKRegistry.getInstance().isOfflineSDK());
        EventBus.getInstance().subscribe(EventBus.EVT_CONFIG_CHANGED, () => {
            this.updateUI();
            this.notifyChanges();
        });
    }
    addActionListener(actionListener) {
        this.actionListener = actionListener;
        return this;
    }
    updateUI() {
        this.offlineSDKLocation.innerText = DESDKRegistry.getInstance().getOfflineSDKPath();
        this.currentNPMRegistry.innerText = DESDKRegistry.getInstance().getCurrentNPMRegistry();
        let checkbox = this.offlineToggleInput;
        let isOfflineSDK = DESDKRegistry.getInstance().isOfflineSDK();
        checkbox.checked = isOfflineSDK;
        if (isOfflineSDK) {
            this.showSDKSettings(true);
            this.showNPMRegistrySettings(false);
        }
        else {
            this.showSDKSettings(false);
            this.showNPMRegistrySettings(true);
        }
    }
    element() {
        return this.mainElement;
    }
    showNPMRegistrySettings(show) {
        if (show) {
            this.npmSettingsSettingsContainer.style.visibility = "visible";
            this.npmSettingsSettingsContainer.style.display = "block";
            this.btnViperaRegistrySelector.style.display = "inline-block";
            this.btnDefaultRegistrySelector.style.display = "inline-block";
        }
        else {
            this.npmSettingsSettingsContainer.style.display = "none";
            this.npmSettingsSettingsContainer.style.visibility = "hidden";
            this.btnViperaRegistrySelector.style.display = "none";
            this.btnDefaultRegistrySelector.style.display = "none";
        }
    }
    showSDKSettings(show) {
        if (show) {
            this.offlineSettingsContainer.style.visibility = "visible";
            this.offlineSettingsContainer.style.display = "block";
            this.offlineButtonSDKPathSelector.style.display = "inline-block";
        }
        else {
            this.offlineSettingsContainer.style.display = "none";
            this.offlineSettingsContainer.style.visibility = "hidden";
            this.offlineButtonSDKPathSelector.style.display = "none";
        }
    }
    setOfflineSDK(offline) {
        DESDKRegistry.getInstance().setOfflineSDK(offline);
        this.updateUI();
    }
    selectSDKOfflinePath() {
        var sdkPath = dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (!sdkPath) {
            return;
        }
        if (!fs.existsSync(sdkPath[0])) {
            atom.notifications.addError("Invalid sdk path");
            return;
        }
        DESDKRegistry.getInstance().setOfflineSDKPath(sdkPath[0]);
    }
    notifyChanges() {
        if (this.actionListener) {
            this.actionListener('reloadPluginsList');
        }
    }
}
//# sourceMappingURL=DEPluginsListUIHandler.js.map