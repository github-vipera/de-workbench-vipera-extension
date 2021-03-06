'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement } from '../element/index';
import { UIBaseComponent } from './UIComponent';
import { UIListView } from './UIListView';
const moment = require('moment');
const _ = require("lodash");
export class UIPluginsList extends UIListView {
    constructor() {
        super(null);
        this.displayConfiguration = {
            ratingVisible: true,
            lastUpdateVisible: true,
            platformsVisible: true,
            authorVisible: true
        };
        this.initModel();
    }
    initModel() {
        this.pluginListModel = new PluginsListModel(this.displayConfiguration).setEventListener((pluginInfo, actionType) => {
            if (this.callbackFunc) {
                this.callbackFunc(pluginInfo, actionType);
            }
        });
        this.setModel(this.pluginListModel);
    }
    clearList() {
        this.pluginListModel.clear();
        this.modelChanged();
    }
    addPlugin(pluginInfo) {
        this.pluginListModel.addPlugin(pluginInfo);
        this.modelChanged();
    }
    addPlugins(plugins) {
        this.pluginListModel.addPlugins(plugins);
        this.modelChanged();
    }
    setPlugins(plugins) {
        this.clearList();
        this.pluginListModel.addPlugins(plugins);
        this.modelChanged();
    }
    setEventListener(callbackFunc) {
        this.callbackFunc = callbackFunc;
        return this;
    }
    setPluginInstallPending(pluginInfo, installing) {
        this.pluginListModel.setPluginInstallPending(pluginInfo, installing);
    }
    setPluginUInstallPending(pluginInfo, unistalling) {
        this.pluginListModel.setPluginUInstallPending(pluginInfo, unistalling);
    }
    setRatingVisible(visible) {
        this.displayConfiguration.ratingVisible = visible;
        this.updateUI();
        return this;
    }
    setLastUpdateVisible(visible) {
        this.displayConfiguration.lastUpdateVisible = visible;
        this.updateUI();
        return this;
    }
    setPlatformsVisible(visible) {
        this.displayConfiguration.platformsVisible = visible;
        this.updateUI();
        return this;
    }
    updateUI() {
        this.pluginListModel.updateUI(this.displayConfiguration);
    }
}
class PluginsListModel {
    constructor(displayConfiguration) {
        this.pluginsMap = {};
        this.pluginList = new Array();
        this.displayConfiguration = displayConfiguration;
    }
    addPlugins(plugins) {
        let i = 0;
        for (i = 0; i < plugins.length; i++) {
            this.addPlugin(plugins[i]);
        }
    }
    addPlugin(pluginInfo) {
        let pluginItem = new UIPluginItem(pluginInfo, this.displayConfiguration);
        pluginItem.setEventListener((pluginInfo, actionType) => {
            if (this.callbackFunc) {
                this.callbackFunc(pluginInfo, actionType);
            }
        });
        this.pluginList.push(pluginItem);
        this.pluginsMap[pluginInfo.id] = pluginItem;
    }
    setEventListener(callbackFunc) {
        this.callbackFunc = callbackFunc;
        return this;
    }
    hasHeader() {
        return false;
    }
    getRowCount() {
        return this.pluginList.length;
    }
    getColCount() {
        return 1;
    }
    getElementAt(row, col) {
        return this.pluginList[row].element();
    }
    getValueAt(row, col) {
        return row + "_" + col;
    }
    getClassNameAt(row, col) {
        return '';
    }
    getColumnName(col) {
        return '';
    }
    getClassName() {
        return 'de-workbench-plugins-list';
    }
    clear() {
        this.pluginList = new Array();
        this.pluginsMap = {};
    }
    setPluginInstallPending(pluginInfo, installing) {
        let pluginItem = this.pluginsMap[pluginInfo.id];
        if (pluginItem) {
            pluginItem.setPluginInstallPending(installing);
        }
    }
    setPluginUInstallPending(pluginInfo, unistalling) {
        let pluginItem = this.pluginsMap[pluginInfo.id];
        if (pluginItem) {
            pluginItem.setPluginUInstallPending(unistalling);
        }
    }
    updateUI(displayConfiguration) {
        this.displayConfiguration = displayConfiguration;
        for (var i = 0; i < this.pluginList.length; i++) {
            this.pluginList[i].updateUI(displayConfiguration);
        }
    }
}
export class UIPluginItem extends UIBaseComponent {
    constructor(pluginInfo, displayConfiguration) {
        super();
        this.pluginInfo = pluginInfo;
        this.displayConfiguration = displayConfiguration;
        this.buildUI();
    }
    buildUI() {
        // BODY PART ========================================================================
        this.bodySection = new UIPluginBodySection(this.pluginInfo, this.displayConfiguration);
        // META PART ========================================================================
        this.metSection = new UIPluginMetaSection(this.pluginInfo, this.displayConfiguration).setEventListener((plugin, actionType) => {
            if (this.callbackFunc) {
                this.callbackFunc(plugin, actionType);
            }
        });
        // STATS PART ========================================================================
        this.statsSection = new UIPluginStatsSection(this.pluginInfo, this.displayConfiguration);
        this.mainElement = createElement('div', {
            elements: [
                this.statsSection.element(), this.bodySection.element(), this.metSection.element()
            ],
            className: 'de-workbench-plugins-list-item'
        });
    }
    updateUI(displayConfiguration) {
        this.displayConfiguration = displayConfiguration;
        this.metSection.updateUI(displayConfiguration);
        this.bodySection.updateUI(displayConfiguration);
        this.statsSection.updateUI(displayConfiguration);
    }
    setEventListener(callbackFunc) {
        this.callbackFunc = callbackFunc;
        return this;
    }
    setPluginInstallPending(installing) {
        this.bodySection.setPluginInstallPending(installing);
        this.metSection.setPluginInstallPending(installing);
        this.statsSection.setPluginInstallPending(installing);
    }
    setPluginUInstallPending(unistalling) {
        this.bodySection.setPluginUInstallPending(unistalling);
        this.metSection.setPluginUInstallPending(unistalling);
        this.statsSection.setPluginUInstallPending(unistalling);
    }
}
export class UIPluginSection extends UIBaseComponent {
    constructor(pluginInfo, displayConfiguration) {
        super();
        this.displayConfiguration = displayConfiguration;
        this.pluginInfo = pluginInfo;
        this.buildUI();
        this.updateUI(this.displayConfiguration);
    }
    buildUI() {
        //NOP, override in subclass
    }
    updateUI(displayConfiguration) {
        this.displayConfiguration = displayConfiguration;
    }
    setPluginInstallPending(installing) {
    }
    setPluginUInstallPending(unistalling) {
    }
    changeElementVisibility(element, visible) {
        if (!visible) {
            element.style.visibility = "hidden";
        }
        else {
            element.style.visibility = "visible";
        }
    }
}
export class UIPluginStatsSection extends UIPluginSection {
    constructor(pluginInfo, displayConfiguration) {
        super(pluginInfo, displayConfiguration);
    }
    buildUI() {
        this.mainElement = createElement('div', {
            elements: [
                createElement('span', {
                    elements: [
                        createText('TODO!!')
                    ]
                })
            ],
            className: 'stats pull-right'
        });
        this.mainElement.style.display = 'none';
    }
    updateUI(displayConfiguration) {
        super.updateUI(displayConfiguration);
        //NOP
    }
}
export class UIPluginBodySection extends UIPluginSection {
    constructor(pluginInfo, displayConfiguration) {
        super(pluginInfo, displayConfiguration);
    }
    buildUI() {
        super.buildUI();
        let pluginNameEl = createElement('a', {
            elements: [
                createText(this.pluginInfo.name)
            ]
        });
        pluginNameEl.className = "de-workbench-plugins-list-item-plugname";
        pluginNameEl.setAttribute('homepage', this.pluginInfo.homepage);
        pluginNameEl.setAttribute('href', this.pluginInfo.homepage);
        let pluginVersionEl = createElement('span', {
            elements: [
                createText("v" + this.pluginInfo.version)
            ]
        });
        pluginVersionEl.className = "de-workbench-plugins-list-item-plugversion";
        // Last Update
        let lastUpdateTimeStr = "Not Available";
        if (this.pluginInfo.lastUpdateTime) {
            try {
                var date = new Date(this.pluginInfo.lastUpdateTime);
                lastUpdateTimeStr = moment(date).fromNow();
            }
            catch (ex) { }
        }
        this.pluginUpdateDateEl = createElement('span', {
            elements: [
                createText("Last update: " + lastUpdateTimeStr)
            ]
        });
        this.pluginUpdateDateEl.className = "de-workbench-plugins-list-item-lastupdate";
        // end Last Update
        // Name
        let nameEl = createElement('h4', {
            elements: [
                pluginNameEl,
                pluginVersionEl,
                this.pluginUpdateDateEl
            ]
        });
        let descEl = createElement('span', {
            elements: [
                createText(this.pluginInfo.description)
            ]
        });
        descEl.className = "de-workbench-plugins-list-item-plugdesc";
        // end nameEl
        this.mainElement = createElement('div', {
            elements: [
                nameEl, descEl
            ]
        });
    }
    updateUI(displayConfiguration) {
        super.updateUI(displayConfiguration);
        this.changeElementVisibility(this.pluginUpdateDateEl, displayConfiguration.lastUpdateVisible);
    }
}
export class UIPluginMetaSection extends UIPluginSection {
    constructor(pluginInfo, displayConfiguration) {
        super(pluginInfo, displayConfiguration);
    }
    buildUI() {
        super.buildUI();
        // Owner
        let userOwner = this.pluginInfo.author;
        let userOwnerEl = createElement('a', {
            elements: [
                createText("by " + userOwner)
            ]
        });
        userOwnerEl.setAttribute("href", this.pluginInfo.homepage);
        userOwnerEl.className = "de-workbench-plugins-list-item-owner";
        // end Owner
        // Rating
        this.ratingEl = createElement('span', {
            elements: [
                createText("" + this.pluginInfo.rating)
            ],
            className: 'badge badge-info de-workbench-plugins-list-item-rating'
        });
        // end Rating
        // Supported platforms
        this.platformsEl = this.renderPlatforms(this.pluginInfo.platforms);
        // end Supported platforms
        // Owner
        let metaUser = createElement('div', {
            elements: [this.ratingEl, userOwnerEl, this.platformsEl],
            className: 'de-workbench-plugins-list-meta-user'
        });
        // end Owner
        // Controls
        this.metaButtons = new UIPluginMetaButtons(this.pluginInfo, this.displayConfiguration);
        if (this.pluginInfo.installed) {
            this.metaButtons.showButtons(UIPluginMetaButtons.BTN_TYPE_UNINSTALL)
                .setButtonEnabled(UIPluginMetaButtons.BTN_TYPE_UNINSTALL, true);
        }
        else {
            this.metaButtons.showButtons(UIPluginMetaButtons.BTN_TYPE_INSTALL)
                .setButtonEnabled(UIPluginMetaButtons.BTN_TYPE_INSTALL, true);
        }
        this.metaButtons.setEventListener((buttonClicked) => {
            //alert("Clicked " + buttonClicked + " for " + this.pluginInfo.id);
            this.callbackFunc(this.pluginInfo, buttonClicked);
        });
        let metaControls = createElement('div', {
            elements: [
                createElement('div', {
                    elements: [
                        this.metaButtons.element()
                    ],
                    className: 'btn-toolbar'
                })
            ]
        });
        // end Controls
        this.mainElement = createElement('div', {
            elements: [
                metaUser, metaControls
            ],
            className: 'de-workbench-plugins-list-meta-cont'
        });
    }
    setEventListener(callbackFunc) {
        this.callbackFunc = callbackFunc;
        return this;
    }
    renderPlatforms(platforms) {
        let textValue = "(" + _.map(platforms, 'displayName').join(",") + ")";
        return createElement('span', {
            elements: [
                createText(textValue)
            ],
            className: 'de-workbench-plugins-list-item-platforms'
        });
    }
    setPluginInstallPending(installing) {
        this.metaButtons.setPluginInstallPending(installing);
    }
    setPluginUInstallPending(installing) {
        this.metaButtons.setPluginUInstallPending(installing);
    }
    updateUI(displayConfiguration) {
        super.updateUI(displayConfiguration);
        this.metaButtons.updateUI(displayConfiguration);
        this.changeElementVisibility(this.ratingEl, displayConfiguration.ratingVisible);
        this.changeElementVisibility(this.platformsEl, displayConfiguration.platformsVisible);
    }
}
export class UIPluginMetaButtons extends UIPluginSection {
    constructor(pluginInfo, displayConfiguration) {
        super(pluginInfo, displayConfiguration);
    }
    setEventListener(callbackFunc) {
        this.callbackFunc = callbackFunc;
    }
    buildUI() {
        super.buildUI();
        //<span class='loading loading-spinner-tiny inline-block'></span>
        this.spinner = createElement('span', {
            className: 'loading loading-spinner-small plugin-install-spinner'
        });
        this.spinner.style.visibility = "hidden";
        this.btnInstall = this.buildButton('Install');
        this.btnInstall.className = this.btnInstall.className + " btn-info icon icon-cloud-download install-button";
        this.btnInstall.addEventListener('click', (evt) => {
            this.callbackFunc(UIPluginMetaButtons.BTN_TYPE_INSTALL);
        });
        this.btnUninstall = this.buildButton('Uninstall');
        this.btnUninstall.className = this.btnUninstall.className + " icon icon-trashcan uninstall-button";
        this.btnUninstall.addEventListener('click', (evt) => {
            if (this.callbackFunc) {
                this.callbackFunc(UIPluginMetaButtons.BTN_TYPE_UNINSTALL);
            }
        });
        this.mainElement = createElement('div', {
            elements: [
                this.btnInstall,
                this.btnUninstall,
                this.spinner
            ],
            className: 'btn-group'
        });
    }
    buildButton(caption) {
        let btn = createElement('button');
        btn.className = "btn de-workbench-plugins-list-meta-btn ";
        btn.textContent = caption;
        btn["disabled"] = true;
        return btn;
    }
    showButtons(buttonType) {
        if (buttonType == UIPluginMetaButtons.BTN_TYPE_INSTALL) {
            this.btnInstall.style["display"] = 'initial';
            this.btnUninstall.style["display"] = 'none';
        }
        else if (buttonType == UIPluginMetaButtons.BTN_TYPE_UNINSTALL) {
            this.btnUninstall.style["display"] = 'initial';
            this.btnInstall.style["display"] = 'none';
        }
        else if (buttonType == (UIPluginMetaButtons.BTN_TYPE_UNINSTALL | UIPluginMetaButtons.BTN_TYPE_INSTALL)) {
            this.btnInstall.style["display"] = 'initial';
            this.btnUninstall.style["display"] = 'initial';
        }
        else {
            this.btnInstall.style["display"] = 'none';
            this.btnUninstall.style["display"] = 'none';
        }
        return this;
    }
    setButtonEnabled(buttonType, enabled) {
        if (buttonType == UIPluginMetaButtons.BTN_TYPE_INSTALL) {
            this.btnInstall["disabled"] = !enabled;
        }
        else if (buttonType == UIPluginMetaButtons.BTN_TYPE_UNINSTALL) {
            this.btnUninstall["disabled"] = !enabled;
        }
        else if (buttonType == (UIPluginMetaButtons.BTN_TYPE_UNINSTALL | UIPluginMetaButtons.BTN_TYPE_INSTALL)) {
            this.btnInstall["disabled"] = !enabled;
            this.btnUninstall["disabled"] = !enabled;
        }
        return this;
    }
    setPluginInstallPending(installing) {
        if (installing) {
            this.btnInstall.style.visibility = "hidden";
            this.spinner.style.visibility = "visible";
        }
        else {
            this.spinner.style.visibility = "hidden";
            this.btnInstall.style.visibility = "visible";
        }
    }
    setPluginUInstallPending(unistalling) {
        if (unistalling) {
            this.btnUninstall.style.visibility = "hidden";
            this.spinner.style.visibility = "visible";
        }
        else {
            this.spinner.style.visibility = "hidden";
            this.btnUninstall.style.visibility = "visible";
        }
    }
    updateUI(displayConfiguration) {
        super.updateUI(displayConfiguration);
        //NOP
    }
}
UIPluginMetaButtons.BTN_TYPE_INSTALL = 1;
UIPluginMetaButtons.BTN_TYPE_UNINSTALL = 2;
//# sourceMappingURL=UIPluginsList.js.map