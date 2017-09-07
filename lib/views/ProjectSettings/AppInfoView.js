'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createElement } from '../../element/index';
import { ProjectManager } from '../../DEWorkbench/ProjectManager';
import { UIBaseComponent } from '../../ui-components/UIComponent';
import { UIInputFormElement } from '../../ui-components/UIInputFormElement';
import { UIButtonGroup, UIButtonConfig, UIButtonGroupMode } from '../../ui-components/UIButtonGroup';
import { UINotifications } from '../../ui-components/UINotifications';
export class AppInfoView extends UIBaseComponent {
    constructor() {
        super();
        this.buildUI();
    }
    buildUI() {
        this.currentProjectPath = ProjectManager.getInstance().getCurrentProjectPath();
        this.nameCtrl = new UIInputFormElement().setCaption('Name').setPlaceholder('name (appId)').addChangeListener((evtCtrl) => {
            this.onTextValueChanged(evtCtrl);
        });
        this.displayName = new UIInputFormElement().setCaption('Display Name').setPlaceholder('display name').addChangeListener((evtCtrl) => {
            this.onTextValueChanged(evtCtrl);
        });
        this.descriptionCtrl = new UIInputFormElement().setCaption('Description').setPlaceholder('description').addChangeListener((evtCtrl) => {
            this.onTextValueChanged(evtCtrl);
        });
        this.authorCtrl = new UIInputFormElement().setCaption('Author').setPlaceholder('author').addChangeListener((evtCtrl) => {
            this.onTextValueChanged(evtCtrl);
        });
        this.licenseCtrl = new UIInputFormElement().setCaption('License').setPlaceholder('license').addChangeListener((evtCtrl) => {
            this.onTextValueChanged(evtCtrl);
        });
        this.versionCtrl = new UIInputFormElement().setCaption('Version').setWidth("150px").setPlaceholder('0.0.0').addChangeListener((evtCtrl) => {
            this.onTextValueChanged(evtCtrl);
        });
        //Action buttons
        this.actionButtons = new UIButtonGroup(UIButtonGroupMode.Standard)
            .addButton(new UIButtonConfig()
            .setId('revertChanges')
            .setCaption('Revert Changes')
            .setClickListener(() => {
            this.reload();
        }))
            .addButton(new UIButtonConfig()
            .setId('saveChanges')
            .setButtonType('success')
            .setCaption('Save changes')
            .setClickListener(() => {
            this.saveChanges();
        }));
        let actionButtonsContainer = createElement('div', {
            elements: [
                this.actionButtons.element()
            ],
            className: 'de-workbench-appinfo-form-action-buttons'
        });
        this.mainFormElement = createElement('form', {
            elements: [
                this.nameCtrl.element(),
                this.displayName.element(),
                this.descriptionCtrl.element(),
                this.authorCtrl.element(),
                this.licenseCtrl.element(),
                this.versionCtrl.element(),
                actionButtonsContainer
            ],
            className: 'de-workbench-appinfo-form general-info-form'
        });
        this.mainFormElement.setAttribute("tabindex", "-1");
        this.mainElement = this.mainFormElement;
        this.reload();
    }
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            ProjectManager.getInstance().cordova.getProjectInfo(this.currentProjectPath, false).then((ret) => {
                if (ret == null) {
                    //This is not a Cordova Project
                    return;
                }
                this.nameCtrl.setValue(ret.name);
                this.displayName.setValue(ret.displayName);
                this.descriptionCtrl.setValue(ret.description);
                this.authorCtrl.setValue(ret.author);
                this.licenseCtrl.setValue(ret.license);
                this.versionCtrl.setValue(ret.version);
            });
        });
    }
    saveChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            var currentPackageJson = yield ProjectManager.getInstance().cordova.getPackageJson(this.currentProjectPath);
            currentPackageJson.name = this.nameCtrl.getValue();
            currentPackageJson.displayName = this.displayName.getValue();
            currentPackageJson.description = this.descriptionCtrl.getValue();
            currentPackageJson.author = this.authorCtrl.getValue();
            currentPackageJson.license = this.licenseCtrl.getValue();
            currentPackageJson.version = this.versionCtrl.getValue();
            yield ProjectManager.getInstance().cordova.storePackageJson(this.currentProjectPath, currentPackageJson);
            UINotifications.showInfo("Project information changes saved successfully.");
        });
    }
    onTextValueChanged(sourceCtrl) {
        console.log("Changed value: ", sourceCtrl.getValue());
    }
}
//# sourceMappingURL=AppInfoView.js.map