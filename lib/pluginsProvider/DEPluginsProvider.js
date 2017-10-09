'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoggerService } from '../Logger';
import { DEWBResourceManager } from '../utils/DEWBResourceManager';
import { DEPlusinsListUIHandler } from './DEPluginsListUIHandler';
import { DESDKRegistry } from './DESDKRegistry';
import { WorkbenchServices } from '../WorkbenchServices';
export class DEPluginsProvider {
    constructor() {
        LoggerService.debug("Creating CordovaPluginsProvidersManager...");
        this.currentProjectRoot = WorkbenchServices.ProjectManager.getCurrentProjectPath();
        WorkbenchServices.Events.on('dewb.project.cordova.pluginAdded', () => {
            this.notifyListChanged();
        });
        WorkbenchServices.Events.on('dewb.project.cordova.pluginRemoved', () => {
            this.notifyListChanged();
        });
        atom.config["onDidChange"]('de-workbench-vipera-extension.OfflineSDKPath', (oldValue, newValue) => {
            this.notifyListChanged();
        });
    }
    getProviderName() {
        return "Dynamic Engine Plugins";
    }
    getCordovaPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            var ret = [];
            if (DESDKRegistry.getInstance().isOfflineSDK()) {
                ret = DESDKRegistry.getInstance().getLocalSDKPlugins();
            }
            else {
                ret = DEWBResourceManager.getJSONResource('dynamic_engine_plugins.json')["plugins"];
            }
            let installedPlugins = yield WorkbenchServices.ProjectManager.cordova.getInstalledPlugins(this.currentProjectRoot);
            let processedResults = WorkbenchServices.ProjectManager.cordova.markInstalledPlugins(ret, installedPlugins);
            return processedResults;
        });
    }
    getPlatformDesc(platform) {
        if (platform === 'ios') {
            return {
                name: 'ios',
                displayName: 'iOS'
            };
        }
        else if (platform === 'android') {
            return {
                name: 'android',
                displayName: 'Android'
            };
        }
        else if (platform === 'browser') {
            return {
                name: 'browser',
                displayName: 'Browser'
            };
        }
    }
    getExtendedUI() {
        if (!this.uiHandler) {
            this.uiHandler = new DEPlusinsListUIHandler().addActionListener((action) => {
                this.notifyListChanged();
            });
        }
        return this.uiHandler.element();
    }
    notifyListChanged() {
        if (this.eventHandler) {
            this.eventHandler({ type: 'listChanged' });
        }
    }
    addEventHandler(handler) {
        this.eventHandler = handler;
    }
}
//# sourceMappingURL=DEPluginsProvider.js.map