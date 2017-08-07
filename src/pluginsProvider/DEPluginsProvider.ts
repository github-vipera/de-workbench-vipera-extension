'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'
import { DEWBResourceManager } from '../utils/DEWBResourceManager'

export interface CordovaPluginsProviderService {
  getCordovaPlugins():Array<any>;
  getProviderName():string;
  getExtendedUI():HTMLElement;
}

export class CordovaPluginsProvider implements CordovaPluginsProviderService {

  private static instance:CordovaPluginsProvider;

  private constructor() {
    LoggerService.debug("Creating CordovaPluginsProvidersManager...")
  }

  static getInstance() {
      if (!CordovaPluginsProvider.instance) {
          CordovaPluginsProvider.instance = new CordovaPluginsProvider();
      }
      return CordovaPluginsProvider.instance;
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
    return null;
  }

}
