'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement, insertElement } from '../../element/index';
import { Logger } from '../../logger/Logger';
import { UITabbedView, UITabbedViewItem } from '../../ui-components/UITabbedView';
import { InstalledPluginsView } from './InstalledPluginsView';
import { InstallNewPluginsView } from './InstallNewPluginsView';
import { VariantsView } from './VariantsView';
import { AppSignatureView } from './AppSignatureView';
import { GeneralSettingsView } from './GeneralSettingsView';
const crypto = require('crypto');
export class ProjectSettingsView {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.projectId = crypto.createHash('md5').update(projectRoot).digest("hex");
        Logger.getInstance().debug("ProjectSettingsView creating for ", this.projectRoot, this.projectId);
        // Isnitialize the UI
        this.initUI();
        this.reloadProjectSettings();
    }
    reloadProjectSettings() {
    }
    initUI() {
        Logger.getInstance().debug("ProjectSettingsView initUI called.");
        // create the single views
        this.installedPluginsView = new InstalledPluginsView();
        this.installNewPluginsView = new InstallNewPluginsView();
        this.variantsView = new VariantsView();
        this.appSignatureView = new AppSignatureView();
        this.generalSettingsView = new GeneralSettingsView();
        // Create the main UI
        this.element = document.createElement('de-workbench-project-settings');
        this.tabbedView = new UITabbedView(); //.setTabType(UITabbedViewTabType.Horizontal);
        this.tabbedView.addView(new UITabbedViewItem('general', 'General', this.generalSettingsView.element()).setTitleClass('icon icon-settings'));
        this.tabbedView.addView(new UITabbedViewItem('installed_plugins', 'Installed Plugins', this.installedPluginsView.element()).setTitleClass('icon icon-beaker'));
        this.tabbedView.addView(new UITabbedViewItem('install_plugins', 'Install New Plugins', this.installNewPluginsView.element()).setTitleClass('icon icon-broadcast'));
        this.tabbedView.addView(new UITabbedViewItem('variants', 'Build Variants', this.variantsView.element()).setTitleClass('icon icon-code'));
        this.tabbedView.addView(new UITabbedViewItem('app_signature', 'App Signature', this.appSignatureView.element()).setTitleClass('icon icon-circuit-board'));
        let el = createElement('div', {
            elements: [
                this.tabbedView.element()
            ],
            className: 'de-workbench-project-settings-view'
        });
        insertElement(this.element, el);
    }
    createSimpleEmptyView(color) {
        let el = createElement('div', {
            elements: [
                createText(color)
            ]
        });
        el.style["background-color"] = color;
        el.style["width"] = "100%";
        el.style["heightz"] = "100%";
        return el;
    }
    /**
     * Open this view
     */
    open() {
        Logger.getInstance().debug("ProjectSettingsView open called for ", this.projectRoot, this.projectId);
        if (this.item) {
            atom.workspace["toggle"](this.item);
        }
        else {
            const prefix = "dewb";
            const uri = prefix + '//' + '_prjsettings_' + this.projectId;
            this.item = {
                activatePane: true,
                searchAllPanes: true,
                location: 'center',
                element: this.element,
                getTitle: () => 'DE Project Settings',
                getURI: () => uri,
                destroy: () => {
                    this.destroy();
                }
            };
            let atomWorkspace = atom.workspace;
            atomWorkspace["open"](this.item).then((view) => {
                this.atomTextEditor = view;
            });
        }
    }
    destroy() {
        this.generalSettingsView.destroy();
        this.installedPluginsView.destroy();
        this.installNewPluginsView.destroy();
        this.variantsView.destroy();
        this.appSignatureView.destroy();
        this.tabbedView.destroy();
        this.element.remove();
    }
}
//# sourceMappingURL=ProjectSettingsView.js.map