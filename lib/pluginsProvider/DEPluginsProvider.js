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
import { LoggerService } from '../Logger';
import { DEWBResourceManager } from '../utils/DEWBResourceManager';
import { DEPlusinsListUIHandler } from './DEPluginsListUIHandler';
import { DESDKRegistry } from './DESDKRegistry';
import { WorkbenchServices } from '../WorkbenchServices';
export class DEPluginsProvider {
    constructor() {
        LoggerService.debug("Creating CordovaPluginsProvidersManager...");
        this.currentProjectRoot = WorkbenchServices.ProjectManager.getCurrentProjectPath();
        // subcribe for plugins events
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
    /**
     * called from the Workbench
     **/
    getProviderName() {
        return "Dynamic Engine Plugins";
    }
    /**
     * called from the Workbench
     **/
    getCordovaPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            var ret = [];
            if (DESDKRegistry.getInstance().isOfflineSDK()) {
                //read from local path
                ret = DESDKRegistry.getInstance().getLocalSDKPlugins();
            }
            else {
                //read from URI
                ret = DEWBResourceManager.getJSONResource('dynamic_engine_plugins.json')["plugins"];
            }
            let installedPlugins = yield WorkbenchServices.ProjectManager.cordova.getInstalledPlugins(this.currentProjectRoot);
            let processedResults = WorkbenchServices.ProjectManager.cordova.markInstalledPlugins(ret, installedPlugins);
            return processedResults;
        });
    }
    /**
    private createCordovaPluginDesc(){
      return {
        name: "pippo",
        id: "pippo",
        version: "1.0.2",
        description: "bklabkla",
        installed: false,
        author: "Vipera Plc",
        homepage: "https://&www.vipera.com",
        license: "Vipera Commercial",
        repository: "local",
        repositoryType: "private",
        lastUpdateTime: ""+ new Date(),
        rating: 10,
        platforms: [this.getPlatformDesc('ios'), this.getPlatformDesc('android')]
      }
    }
    **/
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
    /**
     * called from the Workbench
     **/
    getExtendedUI() {
        if (!this.uiHandler) {
            this.uiHandler = new DEPlusinsListUIHandler().addActionListener((action) => {
                // reload plugins and notify list changes
                this.notifyListChanged();
            });
        }
        return this.uiHandler.element();
    }
    /**
     * Notify the Workbench to reload the list
     **/
    notifyListChanged() {
        if (this.eventHandler) {
            this.eventHandler({ type: 'listChanged' });
        }
    }
    /**
     * called from the Workbench
     **/
    addEventHandler(handler) {
        this.eventHandler = handler;
    }
}
//# sourceMappingURL=DEPluginsProvider.js.map