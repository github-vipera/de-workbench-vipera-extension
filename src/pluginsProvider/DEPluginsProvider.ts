'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'
import { DEWBResourceManager } from '../utils/DEWBResourceManager'
import { DEPlusinsListUIHandler } from './DEPluginsListUIHandler'
import { DESDKRegistry } from './DESDKRegistry'
import { WorkbenchServices } from '../WorkbenchServices'

export interface CordovaPluginsProviderService {
  getCordovaPlugins():Promise<Array<any>>;
  getProviderName():string;
  getExtendedUI():HTMLElement;
}

export class DEPluginsProvider implements CordovaPluginsProviderService {

  private uiHandler:DEPlusinsListUIHandler;
  private eventHandler:Function;
  private currentProjectRoot:string;

  public constructor() {
    LoggerService.debug("Creating CordovaPluginsProvidersManager...")
    this.currentProjectRoot = WorkbenchServices.ProjectManager.getCurrentProjectPath();

    // subcribe for plugins events
    WorkbenchServices.Events.on('dewb.project.cordova.pluginAdded',()=>{
      this.notifyListChanged();
    })
    WorkbenchServices.Events.on('dewb.project.cordova.pluginRemoved',()=>{
      this.notifyListChanged();
    })

  }

  /**
   * called from the Workbench
   **/
  public getProviderName():string {
    return "Dynamic Engine Plugins"
  }

  /**
   * called from the Workbench
   **/
  async getCordovaPlugins(){
    var ret = [];

    if (DESDKRegistry.getInstance().isOfflineSDK()){
      //read from local path
      ret = DESDKRegistry.getInstance().getLocalSDKPlugins()
    } else {
      //read from URI
      ret = DEWBResourceManager.getJSONResource('dynamic_engine_plugins.json')["plugins"];
    }

    let installedPlugins = await WorkbenchServices.ProjectManager.cordova.getInstalledPlugins(this.currentProjectRoot);
    let processedResults:Array<any> = WorkbenchServices.ProjectManager.cordova.markInstalledPlugins(ret, installedPlugins);

    return processedResults;
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

  private getPlatformDesc(platform:string){
    if (platform==='ios'){
      return {
        name: 'ios',
        displayName: 'iOS'
      }
    }
    else if (platform==='android'){
      return {
        name: 'android',
        displayName: 'Android'
      }
    }
    else if (platform==='browser'){
      return {
        name: 'browser',
        displayName: 'Browser'
      }
    }
  }

  /**
   * called from the Workbench
   **/
  getExtendedUI():HTMLElement {
    if (!this.uiHandler){
      this.uiHandler = new DEPlusinsListUIHandler().addActionListener((action)=>{
          // reload plugins and notify list changes
          this.notifyListChanged();
      });
    }
    return this.uiHandler.element()
  }

  /**
   * Notify the Workbench to reload the list
   **/
  private notifyListChanged(){
    if (this.eventHandler){
      this.eventHandler({ type: 'listChanged' })
    }
  }

  /**
   * called from the Workbench
   **/
  addEventHandler(handler:Function){
    this.eventHandler = handler;
  }

}
