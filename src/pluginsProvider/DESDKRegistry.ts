'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'
import { EventBus } from '../utils/EventBus'

const registryUrl = require('registry-url')
const spawn = require('child_process').spawn;

export class DESDKRegistry {

  private static instance:DESDKRegistry;

  private offlineSDK:boolean = false;
  private offlineSDKPath:string = "Not defined";
  private isWin:boolean;
  private spawnRef:any = undefined;

  private constructor() {
    LoggerService.debug("Creating DESDKRegistry...")

    this.isWin = /^win/.test(process.platform);

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
    this.installNPMRegistry(defaultNPMRegistry)
    return defaultNPMRegistry;
  }

  installViperaNPMRegistry():string {
      // get from configuration
      let viperaNPMRegistry = atom.config.get('de-workbench-vipera-extension.ViperaNPMRegistry')
      this.installNPMRegistry(viperaNPMRegistry)
      return viperaNPMRegistry;
  }

  notifyChanges(){
    EventBus.getInstance().publish(EventBus.EVT_CONFIG_CHANGED);
  }

  public installNPMRegistry(registryURL:string){
    var cmd = "npm";
    cmd = this.prepareCommand(cmd);
    this.spawnRef = spawn(cmd, ["set", "registry", registryURL], {});
    this.spawnRef.stdout.on('data', (data) => {
        LoggerService.info("[NPM Registry Set] " + data.toString())
    });

    this.spawnRef.stderr.on('data', (data) => {
        LoggerService.error("[scriptTools] " + data.toString())
    });

    this.spawnRef.on('close', (code) => {
        LoggerService.info('setNPMRegistry process exited with code ' + code)
        this.spawnRef = undefined;
        this.notifyChanges()
    });
  }

  prepareCommand(cmd){
    if (this.isWin){
      cmd = cmd + ".cmd";
    }
    return cmd;
  }

}
