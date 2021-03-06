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
// --------------------------------------------------------------------------------
//import CordovaCommandBuilder from './CordovaCommandBuilder';
// --------------------------------------------------------------------------------
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const kill = require('tree-kill');
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
import { CordovaUtils } from './CordovaUtils';
import { CordovaPluginScanner } from './CordovaPluginScanner';
import { Logger } from '../logger/Logger';
import { CordovaExecutor } from './CordovaExecutor';
import { EventBus } from '../DEWorkbench/EventBus';
export class CordovaPlatform {
}
export class CordovaPlugin {
    constructor() {
        this.installed = false;
        this.author = '';
        this.homepage = '';
        this.license = '';
        this.repository = '';
        this.repositoryType = '';
        this.sourceType = '';
        this.lastUpdateTime = '';
        this.rating = 0;
        this.platforms = [];
    }
}
export class Cordova {
    constructor() {
        Logger.getInstance().debug("Creating Cordova...");
        this.cordovaUtils = new CordovaUtils();
    }
    isCordovaProject(projectRoot) {
        return new Promise((resolve, reject) => {
            resolve(this.isCordovaProjectSync(projectRoot));
        });
    }
    isCordovaProjectSync(projectRoot) {
        try {
            let ret = this.getInstalledPlatformsSync(projectRoot);
            if (ret && ret.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (ex) {
            return false;
        }
    }
    /**
     * Returns a list of installed platforms for a Cordova Project
     */
    getInstalledPlatforms(projectRoot) {
        return new Promise((resolve, reject) => {
            let ret = this.getInstalledPlatformsSync(projectRoot);
            resolve(ret);
        });
    }
    /**
     * Returns a list of installed platforms for a Cordova Project in a sync way
     */
    getInstalledPlatformsSync(projectRoot) {
        let ret = this.cordovaUtils.getInstalledPlatforms(projectRoot);
        return ret.installed;
    }
    addPlatform(projectRoot, platformName) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.getInstance().debug("addPlatform called for ...", projectRoot, platformName);
            let executor = new CordovaExecutor(null);
            let projectInfo = yield this.getProjectInfo(projectRoot, false);
            yield executor.addPlatform(projectInfo, platformName);
            EventBus.getInstance().publish(EventBus.EVT_PLATFORM_ADDED, projectRoot, platformName);
        });
    }
    removePlatform(projectRoot, platformName) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.getInstance().debug("removePlatform called " + platformName + " for ...", projectRoot);
            let executor = new CordovaExecutor(null);
            yield executor.removePlatforms([platformName], projectRoot);
            EventBus.getInstance().publish(EventBus.EVT_PLATFORM_REMOVED, projectRoot, platformName);
        });
    }
    addPlugin(projectRoot, pluginInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.getInstance().debug("addPlugin called with " + pluginInfo.name + " for " + projectRoot);
            let executor = new CordovaExecutor(null);
            let projectInfo = yield this.getProjectInfo(projectRoot, false);
            yield executor.addPlugin(projectInfo, pluginInfo.id, null);
            EventBus.getInstance().publish(EventBus.EVT_PLUGIN_ADDED, projectRoot, pluginInfo);
        });
    }
    removePlugin(projectRoot, pluginInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.getInstance().debug("removePlugin called with " + pluginInfo.name + " for " + projectRoot);
            let executor = new CordovaExecutor(null);
            let projectInfo = yield this.getProjectInfo(projectRoot, false);
            yield executor.removePlugin(projectInfo, pluginInfo.id);
            EventBus.getInstance().publish(EventBus.EVT_PLUGIN_REMOVED, projectRoot, pluginInfo);
        });
    }
    /**
     * Returns a list of installed plugins for a Cordova Project
     */
    getInstalledPlugins(projectRoot) {
        Logger.getInstance().debug("getInstalledPlugins called...");
        return new Promise((resolve, reject) => {
            let that = this;
            let cordovaPluginScanner = new CordovaPluginScanner();
            cordovaPluginScanner.scan(projectRoot, (results) => {
                let pluginsRaw = cordovaPluginScanner.getInstalledPlugin();
                let plugins = new Array();
                Object.keys(results.plugins).forEach((key) => {
                    let pluginRaw = pluginsRaw.plugins[key];
                    if (pluginRaw["plugin"] && pluginRaw["plugin"]["$"]) {
                        let plugin = new CordovaPlugin();
                        plugin.name = key;
                        plugin.id = pluginRaw["plugin"]["$"]["id"];
                        plugin.version = pluginRaw["plugin"]["$"]["version"];
                        plugin.description = (pluginRaw["plugin"]["description"] || ["n.a"])[0];
                        plugin.isTopLevel = pluginRaw["is_top_level"];
                        plugin.installed = true;
                        plugin.info = pluginRaw;
                        // gets extra info if availables
                        if (pluginRaw["packageJson"]) {
                            if (pluginRaw["packageJson"]["author"]) {
                                if (pluginRaw["packageJson"]["author"] instanceof Object) {
                                    if (pluginRaw["packageJson"]["author"]) {
                                        plugin.author = pluginRaw["packageJson"]["author"]["name"];
                                    }
                                }
                                else {
                                    plugin.author = pluginRaw["packageJson"]["author"];
                                }
                            }
                            if (pluginRaw["packageJson"]["license"]) {
                                plugin.license = pluginRaw["packageJson"]["license"];
                            }
                            if (pluginRaw["packageJson"]["repository"] && pluginRaw["packageJson"]["repository"]["url"]) {
                                plugin.repository = pluginRaw["packageJson"]["repository"]["url"];
                            }
                            if (pluginRaw["packageJson"]["repository"] && pluginRaw["packageJson"]["repository"]["type"]) {
                                plugin.repositoryType = pluginRaw["packageJson"]["type"];
                            }
                            if (pluginRaw["packageJson"]["homepage"]) {
                                plugin.homepage = pluginRaw["packageJson"]["homepage"];
                            }
                        }
                        if (pluginRaw["source"] && pluginRaw["source"]["type"]) {
                            plugin.sourceType = pluginRaw["source"]["type"];
                        }
                        plugins.push(plugin);
                    }
                });
                resolve(plugins);
            });
        });
    }
    /**
     * Returns the assets path for the given platform
     */
    getPlatformPath(projectRoot, platform) {
        Logger.getInstance().debug("getPlatformPath ", projectRoot, platform);
        var result = projectRoot; // != undefined ? projectRoot : atom.project["getPaths"]()[0];
        if (platform === "android") {
            return result + "/platforms/android/assets/www";
        }
        else if (platform === "ios") {
            return result + "/platforms/ios/www";
        }
        else {
            console.error("getPlatformPath with unknown platform:" + platform);
            return undefined;
        }
    }
    /**
     * Creates a new Cordova project with the given parameters
     */
    createNewProject(projectInfo) {
        Logger.getInstance().debug("createNewProject: ", projectInfo);
        let executor = new CordovaExecutor(null);
        return executor.createNewProject(projectInfo);
    }
    /**
     * Creates a new Cordova project with the given parameters
     */
    removeAllPlatforms(projectInfo) {
        Logger.getInstance().debug("removeAllPlatforms: ", projectInfo);
        let executor = new CordovaExecutor(null);
        return executor.removeAllPlatforms(projectInfo);
    }
    /**
     * Adds platforms to a project
     */
    addPlatforms(projectInfo) {
        Logger.getInstance().debug("removeAllPlatforms: ", projectInfo);
        let executor = new CordovaExecutor(null);
        return executor.addPlatforms(projectInfo);
    }
    /**
     * Removes platforms from project
     **/
    removePlatforms(projectRoot, platformList) {
        Logger.getInstance().debug("removePlatforms: ", projectRoot);
        let executor = new CordovaExecutor(null);
        return executor.removePlatforms(platformList, projectRoot);
    }
    rejectForBusySharedExecutor() {
        return Promise.reject({
            'ERROR_CODE': 'EXECUTOR_BUSY',
            'ERROR_MESSAGE': 'Executor is busy'
        });
    }
    /**
     * Runs build command fot the given Cordova project
     */
    buildProject(projectRoot, platform, options) {
        Logger.getInstance().debug("buildProject: ", projectRoot);
        if (this.isBusy()) {
            return this.rejectForBusySharedExecutor();
        }
        this.sharedExecutor = new CordovaExecutor(null);
        return this.sharedExecutor.runBuild(projectRoot, platform, options);
    }
    /**
     * Clean the given Cordova project
     */
    cleanProject(projectRoot, platform) {
        Logger.getInstance().debug("cleanProject: ", projectRoot);
        if (this.isBusy()) {
            return this.rejectForBusySharedExecutor();
        }
        this.sharedExecutor = new CordovaExecutor(null);
        return this.sharedExecutor.runClean(projectRoot, platform);
    }
    isBusy() {
        return this.sharedExecutor && this.sharedExecutor.isBusy();
    }
    /**
     * Prepare the given Cordova project
     */
    prepareProject(projectRoot, platform) {
        Logger.getInstance().debug("prepareProject: ", projectRoot);
        if (this.isBusy()) {
            return this.rejectForBusySharedExecutor();
        }
        this.sharedExecutor = new CordovaExecutor(null);
        return this.sharedExecutor.runPrepare(projectRoot, platform);
    }
    prepareProjectWithBrowserPatch(projectRoot) {
        Logger.getInstance().debug("prepareProject: ", projectRoot);
        if (this.isBusy()) {
            return this.rejectForBusySharedExecutor();
        }
        this.sharedExecutor = new CordovaExecutor(null);
        return this.sharedExecutor.runPrepareWithBrowserPatch(projectRoot);
    }
    runProject(projectRoot, platform, target, options) {
        Logger.getInstance().debug("runProject: ", projectRoot);
        if (this.isBusy()) {
            return this.rejectForBusySharedExecutor();
        }
        this.sharedExecutor = new CordovaExecutor(null);
        return this.sharedExecutor.runProject(projectRoot, platform, target, options);
    }
    getPackageJson(projectRoot) {
        let jsonPath = path.join(projectRoot, "package.json");
        return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
    storePackageJson(projectRoot, packageJson) {
        let jsonPath = path.join(projectRoot, "package.json");
        fs.writeFileSync(jsonPath, JSON.stringify(packageJson, null, "\t"), 'utf8');
    }
    stopExecutor() {
        if (this.sharedExecutor) {
            this.sharedExecutor.stopSpawn();
        }
    }
    /**
    public getProjectInfo(projectRoot:string):Promise<any> {
      return new Promise((resolve, reject) => {
        let jsonPath = path.join(projectRoot, "package.json");
        var obj;
        fs.readFile(jsonPath, 'utf8', function (err, data) {
          if (err) throw err;
          obj = JSON.parse(data);
          resolve(obj);
        });
      })
    }
    **/
    getProjectInfo(projectRoot, loadPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = this.getPackageJson(projectRoot);
            if (!json || !json.cordova) {
                return null; // is not a cordova project
            }
            let cdv = json.cordova;
            if (!cdv.platforms) {
                cdv.platforms = [];
            }
            let cordovaPlatforms = [];
            cdv.platforms.forEach((single) => {
                cordovaPlatforms.push({ name: single });
            });
            let cordovaPlugins = null;
            if (loadPlugins) {
                cordovaPlugins = yield this.getInstalledPlugins(projectRoot);
            }
            return {
                name: json.name,
                displayName: json.displayName,
                description: json.description,
                author: json.author,
                license: json.license,
                version: json.version,
                path: projectRoot,
                platforms: cordovaPlatforms,
                npmScripts: json.scripts || [],
                plugins: cordovaPlugins,
                variants: []
            };
        });
    }
    saveProjectInfo(projectRoot, projectInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            var packageJson = this.getPackageJson(projectRoot);
            packageJson.name = projectInfo.name;
            packageJson.displayName = projectInfo.displayName;
            packageJson.description = projectInfo.description;
            packageJson.author = projectInfo.author;
            packageJson.license = projectInfo.license;
            packageJson.version = projectInfo.version;
            this.storePackageJson(projectRoot, packageJson);
        });
    }
}
//# sourceMappingURL=Cordova.js.map