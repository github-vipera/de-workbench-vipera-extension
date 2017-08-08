'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'
import { EventBus } from '../utils/EventBus'

const registryUrl = require('registry-url')

export class DESDKRegistry {

  private static instance:DESDKRegistry;

  private offlineSDK:boolean = false;
  private offlineSDKPath:string = "Not defined";

  private constructor() {
    LoggerService.debug("Creating DESDKRegistry...")

    //listening for changes
    atom.config["observe"]('de-workbench-vipera-extension.UseOfflineSDK', (value)=>{
      this.notifyChanges()
    });
    atom.config["observe"]('de-workbench-vipera-extension.OfflineSDKPath', (value)=>{
      this.notifyChanges()
    });
    atom.config["observe"]('de-workbench-vipera-extension.DefaultNPMRegistry', (value)=>{
      this.notifyChanges()
    });
    atom.config["observe"]('de-workbench-vipera-extension.ViperaNPMRegistry', (value)=>{
      this.notifyChanges()
    });

  }

  static getInstance() {
      if (!DESDKRegistry.instance) {
          DESDKRegistry.instance = new DESDKRegistry();
      }
      return DESDKRegistry.instance;
  }

  isOfflineSDK():boolean {
    return  atom.config.get('de-workbench-vipera-extension.UseOfflineSDK')
  }

  setOfflineSDK(offline:boolean) {
    atom.config["set"]('de-workbench-vipera-extension.UseOfflineSDK', offline)
  }

  getOfflineSDKPath():string {
    return  atom.config.get('de-workbench-vipera-extension.OfflineSDKPath')
  }

  setOfflineSDKPath(path:string){
    return atom.config["set"]('de-workbench-vipera-extension.OfflineSDKPath', path)
  }

  getCurrentNPMRegistry():string {
    return registryUrl();
  }

  restoreDefaultNPMRegistry():string {
    // get from configuration
    let defaultNPMRegistry = atom.config.get('de-workbench-vipera-extension.DefaultNPMRegistry')
    this.setNPMRegistry(defaultNPMRegistry)
    return defaultNPMRegistry;
  }

  setViperaNPMRegistry():string {
      // get from configuration
      let viperaNPMRegistry = atom.config.get('de-workbench-vipera-extension.ViperaNPMRegistry')
      this.setNPMRegistry(viperaNPMRegistry)
      return viperaNPMRegistry;
  }

  private setNPMRegistry(url:string){
  }

  notifyChanges(){
    EventBus.getInstance().publish(EventBus.EVT_CONFIG_CHANGED);
  }

}
