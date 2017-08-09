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
  getCordovaPlugins():Array<any>;
  getProviderName():string;
  getExtendedUI():HTMLElement;
}

export class DEPluginsProvider implements CordovaPluginsProviderService {

  private uiHandler:DEPlusinsListUIHandler;
  private eventHandler:Function;

  public constructor() {
    LoggerService.debug("Creating CordovaPluginsProvidersManager...")

  }

  public getProviderName():string {
    return "Dynamic Engine Plugins"
  }

  getCordovaPlugins():Array<any>{
    var ret = [];

    if (DESDKRegistry.getInstance().isOfflineSDK()){
      //read from local path
      ret = DESDKRegistry.getInstance().getLocalSDKPlugins()
    } else {
      //read from URI
      ret = DEWBResourceManager.getJSONResource('dynamic_engine_plugins.json')["plugins"];
    }

    //let platforms = WorkbenchServices.ProjectManager.cordova.getInstalledPlatformsSync(WorkbenchServices.ProjectManager.getCurrentProjectPath())
    //alert(JSON.stringify(platforms))

    return ret;
  }

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

  getExtendedUI():HTMLElement {
    if (!this.uiHandler){
      this.uiHandler = new DEPlusinsListUIHandler().addActionListener((action)=>{
          // reload plugins and notify list changes
          //TODO!! reload plugins
          if (this.eventHandler){
            this.eventHandler({ type: 'listChanged' })
          }
      });
    }
    return this.uiHandler.element()
  }

  addEventHandler(handler:Function){
    this.eventHandler = handler;
  }

}
