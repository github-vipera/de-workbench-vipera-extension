'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'

export class DESDKRegistry {

  private static instance:DESDKRegistry;

  private offlineSDK:boolean;
  private offlineSDKPath:string = "Not defined";

  private constructor() {
    LoggerService.debug("Creating DESDKRegistry...")
  }

  static getInstance() {
      if (!DESDKRegistry.instance) {
          DESDKRegistry.instance = new DESDKRegistry();
      }
      return DESDKRegistry.instance;
  }

  isOfflineSDK():boolean {
    return this.offlineSDK;
  }

  setOfflineSDK(offline:boolean) {
    this.offlineSDK = offline;
  }

  getOfflineSDKPath():string {
    return this.offlineSDKPath;
  }

  setOfflineSDKPath(path:string){
    this.offlineSDKPath = path;
  }

  getCurrentNPMRegistry():string {
      //TODO!!
      return "";
  }

  restoreDefaultNPMRegistry():string {
      //TODO!!
      return "";
  }

  setViperaNPMRegistry():string {
      //TODO!!
      return "";
  }

}
