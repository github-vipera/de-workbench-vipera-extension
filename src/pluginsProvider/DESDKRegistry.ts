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
const fs = require('fs')
const path = require('path');
const _ = require('lodash');

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

  public getLocalSDKPlugins(){
    let pluginArray= new Array();
    let sdkLocation = this.getOfflineSDKPath()
    let pluginDirectories = this.getDirectories(sdkLocation);
    _.forEach(pluginDirectories,(singlePath) => {
      let pluginInfo = this.loadLocalPluginInfo(path.join(sdkLocation, singlePath));
      if(!pluginInfo){
        console.error("Invalid plugin dir:",singlePath);
        return;
      }
      pluginArray.push(pluginInfo)
    });
    return pluginArray;
  }

  private getDirectories (srcpath) {
    return fs.readdirSync(srcpath)
      .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
  }

  private loadLocalPluginInfo(dir){
    var completePath = path.join(dir, 'package.json');
    if(!fs.existsSync(completePath)){
      return undefined;
    }
    var packageJSON = JSON.parse(fs.readFileSync(completePath, 'utf8'));
    if(!packageJSON.cordova){
      return undefined;
    }
    console.log("Found plugin: ", packageJSON)
    return {
      "id": packageJSON.name,
      "name": packageJSON.name,
      "url": packageJSON.repository != undefined ? packageJSON.repository.url : "",
      "repoUrl": packageJSON.repository != undefined ? packageJSON.repository.url : "",
      "version": packageJSON.version,
      "description": packageJSON.description,
      "lastUpdate": "",
      installed: false,
      repository: "local",
      repositoryType: "private",
      license: packageJSON.license,
      author: packageJSON.author,
      platforms: this.readAvailablePlatforms(packageJSON)
      //homepage: "https://&www.vipera.com",
      //lastUpdateTime: ""+ new Date(),
      //rating: 10,
      //platforms: [this.getPlatformDesc('ios'), this.getPlatformDesc('android')]
    };
  }


  private readAvailablePlatforms(jsonRaw:any):Array<string>{
    if (!jsonRaw.keywords){
      return [];
    }
    let ret = new Array();
    if (this.isPlatformSupported(jsonRaw,'ios')){
      ret.push({ name:"ios", displayName: "iOS" })
    }
    if (this.isPlatformSupported(jsonRaw,'android')){
      ret.push({ name:"android", displayName: "Android" })
    }
    if (this.isPlatformSupported(jsonRaw,'browser')){
      ret.push({ name:"browser", displayName: "Browser" })
    }
    return ret
  }

  private isPlatformSupported(jsonRaw:any, platform:string):boolean {
    if (_.indexOf(jsonRaw.keywords, 'cordova-' + platform )>-1){
      return true;
    }
    else if (_.indexOf(jsonRaw.keywords, platform )>-1){
      return true;
    }
    else return false;
  }

}
