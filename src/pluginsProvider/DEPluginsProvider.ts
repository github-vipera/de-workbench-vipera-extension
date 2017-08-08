'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'
import { DEWBResourceManager } from '../utils/DEWBResourceManager'
import { DEPlusinsListUIHandler } from './DEPluginsListUIHandler'

export interface CordovaPluginsProviderService {
  getCordovaPlugins():Array<any>;
  getProviderName():string;
  getExtendedUI():HTMLElement;
}

export class DEPluginsProvider implements CordovaPluginsProviderService {

  private uiHandler:DEPlusinsListUIHandler;

  public constructor() {
    LoggerService.debug("Creating CordovaPluginsProvidersManager...")

  }

  public getProviderName():string {
    return "Dynamic Engine Plugins"
  }

  getCordovaPlugins():Array<any>{
    var ret = [];

    ret = DEWBResourceManager.getJSONResource('dynamic_engine_plugins.json')["plugins"];

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
          // TODO!!
          // reload plugins and notify list changes
          console.info("TODO!! notify list changes")
      });
    }
    return this.uiHandler.element()
  }

}
