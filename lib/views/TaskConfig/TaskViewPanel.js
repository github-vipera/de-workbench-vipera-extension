'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createText, createElement, insertElement, createInput } from '../../element/index';
import { UIBaseComponent } from '../../ui-components/UIComponent';
import { UISelect } from '../../ui-components/UISelect';
import { TaskManager } from '../../tasks/TaskManager';
import { UITreeView, findItemInTreeModel } from '../../ui-components/UITreeView';
import { find, map } from 'lodash';
import { CordovaDeviceManager } from '../../cordova/CordovaDeviceManager';
import { UILineLoader } from '../../ui-components/UILineLoader';
class TaskViewContentPanel extends UIBaseComponent {
    constructor() {
        super();
        this.initUI();
    }
    initUI() {
        this.mainElement = createElement('atom-panel', {
            className: 'de-workbench-taskpanel-content',
            elements: []
        });
        this.mainElement.classList.add('form-container');
        this.createPlatformSelect();
        this.createDeviceSelect();
        this.createCheckboxSelect();
        this.createNodeTaskSelector();
        //this.createMockPanel();
    }
    createPlatformSelect() {
        this.platformSelect = new UISelect();
        this.platformSelectListener = {
            onItemSelected: () => {
                this.updateDevices(this.getSelectedPlatform());
            }
        };
        this.platformSelect.addSelectListener(this.platformSelectListener);
        let row = this.createFormRow(createText('Platform'), this.platformSelect.element(), 'platforms');
        insertElement(this.mainElement, row);
    }
    updatePlatforms() {
        let platforms = this.projectInfo ? this.projectInfo.platforms : [];
        let model = map(platforms, (single) => {
            return {
                value: single.name,
                name: single.name
            };
        });
        this.platformSelect.setItems(model);
    }
    createNodeTaskSelector() {
        this.npmScriptsSelect = new UISelect();
        let row = this.createFormRow(createText('Npm scripts (before task)'), this.npmScriptsSelect.element(), 'npmScript');
        insertElement(this.mainElement, row);
    }
    updateNodeScripts() {
        let npmScripts = this.projectInfo ? this.projectInfo.npmScripts : [];
        let model = map(npmScripts, (value, key) => {
            return {
                name: key,
                value: key
            };
        });
        model.unshift({
            name: '-- None -- ',
            value: ''
        });
        this.npmScriptsSelect.setItems(model);
    }
    createMockPanel() {
    }
    createDeviceSelect() {
        this.deviceSelect = new UISelect();
        this.deviceLineLoader = new UILineLoader();
        let wrapper = createElement('div', {
            className: 'line-loader-wrapper',
            elements: [
                this.deviceSelect.element(),
                this.deviceLineLoader.element()
            ]
        });
        let row = this.createFormRow(createText('Device / Emulator'), wrapper, 'devices');
        insertElement(this.mainElement, row);
    }
    updateDevices(platform) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deviceManager || !platform) {
                return Promise.resolve([]);
            }
            this.deviceLineLoader.setOnLoading(true);
            let devices = yield this.deviceManager.getDeviceList(platform.name);
            let model = map(devices, (single) => {
                return {
                    value: single.targetId,
                    name: single.name
                };
            });
            this.deviceSelect.setItems(model);
            this.deviceLineLoader.setOnLoading(false);
        });
    }
    createRowId(elementId) {
        return "row-" + elementId;
    }
    createFormRow(text, element, rowId) {
        let row = createElement('div', {
            className: 'control-row',
            id: this.createRowId(rowId || element.id),
            elements: [
                text,
                element
            ]
        });
        return row;
    }
    contextualize(taskConfig, projectInfo) {
        this.taskConfig = taskConfig;
        this.projectInfo = projectInfo;
        if (!this.deviceManager) {
            this.deviceManager = new CordovaDeviceManager(this.projectInfo.path);
        }
        setTimeout(() => {
            this.contextualizeImpl();
        });
    }
    setRowVisible(rowId, visible) {
        var el = document.getElementById(rowId);
        if (el && el.style) {
            el.style.display = visible ? 'block' : 'none';
        }
    }
    contextualizeImpl() {
        if (!this.getSelectedPlatform()) {
            this.updatePlatforms();
        }
        this.applyConstraintsToView(this.taskConfig.constraints);
    }
    applyConstraintsToView(constraints) {
        if (constraints.isDeviceEnabled) {
            this.updateDevices(this.getSelectedPlatform());
        }
        this.setRowVisible(this.createRowId('devices'), constraints.isDeviceEnabled);
        if (constraints.isNodeTaskEnabled) {
            this.updateNodeScripts();
        }
        this.setRowVisible(this.createRowId('npmScript'), constraints.isNodeTaskEnabled);
    }
    getSelectedPlatform() {
        let platformValue = this.platformSelect.getSelectedItem();
        if (platformValue) {
            return { name: platformValue };
        }
        return null;
    }
    getSelectedDevice() {
        let value = this.deviceSelect.getSelectedItem();
        if (value) {
            return {
                targetId: value,
                name: value
            };
        }
        return null;
    }
    createCheckboxSelect() {
        this.isReleaseEl = createInput({
            type: 'checkbox'
        });
        this.isReleaseEl.classList.remove('form-control');
        this.isReleaseEl.setAttribute('name', 'release');
        let label = createElement('label', {
            className: "label-for"
        });
        label.innerText = 'Release';
        label.setAttribute('for', 'release');
        let row = this.createFormRow(label, this.isReleaseEl, 'isRelease');
        insertElement(this.mainElement, row);
    }
    getCurrentConfiguration() {
        let platformValue = this.platformSelect.getSelectedItem();
        if (platformValue) {
            this.taskConfig.selectedPlatform = { name: platformValue };
        }
        return this.taskConfig;
    }
}
// SELECTOR PANEL
class TaskViewSelectorPanel extends UIBaseComponent {
    constructor() {
        super();
        this.initUI();
    }
    buildTreeModel(cvdTask) {
        let customTaskNode = this.createCustomTaskNode();
        let cvdTaskNode = this.createCdvTaskNode(cvdTask);
        let root = {
            id: 'root',
            name: 'task',
            expanded: true,
            children: [
                cvdTaskNode,
                customTaskNode
            ]
        };
        this.treeModel = {
            root: root,
            getItemById: findItemInTreeModel
        };
    }
    initUI() {
        this.mainElement = createElement('atom-panel', {
            className: 'de-workbench-taskpanel-tree-area',
        });
    }
    buildAndAddTreeView(cvdTask) {
        this.buildTreeModel(cvdTask);
        this.treeView = new UITreeView(this.treeModel);
        this.treeView.addSelectListener(this);
        insertElement(this.mainElement, this.treeView.element());
    }
    createCustomTaskNode() {
        //TODO load from project file
        return { id: 'custom', name: 'Custom', icon: 'test-ts-icon' };
    }
    createCdvTaskNode(cvdTask) {
        let children = map(cvdTask, (item) => {
            return { id: item.name, name: item.displayName };
        });
        return { id: 'default', name: 'Cordova', icon: null,
            expanded: true,
            children: children
        };
    }
    onItemSelected(itemId, item) {
        console.log("selected: ", itemId, item);
        if (this.taskSelectionListener) {
            this.taskSelectionListener(itemId);
        }
    }
    setOnTaskChangeListener(callback) {
        this.taskSelectionListener = callback;
    }
}
// VIEW PANEL (aka main panel)
export class TaskViewPanel extends UIBaseComponent {
    constructor() {
        super();
        this.initUI();
    }
    initUI() {
        this.mainElement = createElement('div', {
            className: 'de-workbench-taskpanel-container'
        });
        this.threeViewPanel = this.createTreeViewPanel();
        this.threeViewPanel.setOnTaskChangeListener((itemId) => {
            let config = this.getTaskConfigurationByName(itemId);
            this.taskContentPanel.contextualize(config, this.project);
        });
        this.taskContentPanel = this.createContentPanel();
        insertElement(this.mainElement, this.threeViewPanel.element());
        insertElement(this.mainElement, this.taskContentPanel.element());
    }
    createContentPanel() {
        let taskContentPanel = new TaskViewContentPanel();
        return taskContentPanel;
    }
    createTreeViewPanel() {
        let taskThreeViewContainer = new TaskViewSelectorPanel();
        return taskThreeViewContainer;
    }
    setProject(project) {
        this.project = project;
        this.update();
    }
    update() {
        this.threeViewPanel.buildAndAddTreeView(TaskManager.getInstance().getDefaultTask());
    }
    getTaskConfigurationByName(name) {
        let tasks = TaskManager.getInstance().getDefaultTask();
        return find(tasks, (single) => {
            return single.name == name;
        });
    }
    getConfiguration() {
        return this.taskContentPanel.getCurrentConfiguration();
    }
}
//# sourceMappingURL=TaskViewPanel.js.map