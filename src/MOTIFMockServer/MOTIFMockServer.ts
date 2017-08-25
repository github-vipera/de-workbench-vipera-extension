'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

 import {
   createText,
   createElement,
   insertElement,
   createGroupButtons,
   createButton,
   createIcon,
   createIconFromPath,
   attachEventFromObject,
   createTextEditor
 } from '../element/index';

import { LoggerService } from '../Logger'
import { DEWBResourceManager } from '../utils/DEWBResourceManager'
import { WorkbenchServices } from '../WorkbenchServices'
import { EventEmitter }  from 'events'
import { MOTIFServerConfigUI } from './MOTIFServerConfigUI'
import { MotifServerConfig } from './MOTIFMockServerCommons'

const {allowUnsafeEval, allowUnsafeNewFunction} = require('loophole');
const {ServerManagerFactory,ServerManager}  = allowUnsafeNewFunction(()=> allowUnsafeEval(() => require('de-mock-server-lib')));

const fs = require('fs');
const path = require('path');
const basePath = process.cwd();

export enum ServerStatus {
  Stopped = 0,
  Starting,
  Running,
  Stopping
}

export interface ServerInstance {
  start();
  stop();
  status:ServerStatus;
  configure(configuration:any);
  addEventListener(event:string, listener);
  removeEventListener(event:string, listener);
  getConfigurator(configuration:any):ServerInstanceConfigurator;
}

export interface ServerInstanceConfigurator {
    getConfiguration():any;
    addEventListener(event:string, listener);
    removeEventListener(event:string, listener);
    getConfigurationPane():HTMLElement;
    revertChanges();
    applyConfiguration(configuration:any);
}

export interface ServerProvider {
  createInstance(configuration:any):ServerInstance;
  destroyInstance(instance:ServerInstance);
  getProviderName():string;
}


export class MotifMockServerProvider implements ServerProvider {

  constructor(){
  }

  createInstance(configuration:any):ServerInstance {
    return new MotifMockServer();
  }

  getProviderName():string {
      return "Vipera MOTIF Mock Server"
  }

  destroyInstance(instance:ServerInstance) {
    //TODO!!
  }

}

class MotifMockServer implements ServerInstance {

  status:ServerStatus=ServerStatus.Stopped;
  protected events:EventEmitter;
  protected config:any;
  protected serverManager:any;
  protected configurator:MotifFMockConfigurator;

  constructor(){
    this.events = new EventEmitter();
    this.initConfigurator();
  }

  initConfigurator(){
    this.configurator = new MotifFMockConfigurator();
  }

  private validateConfiguration(){
    if (!this.config){
        throw("Unable to start the server because it is not yet properly configured.")
    }
  }

  start(){
    if (this.status===ServerStatus.Stopped){
      this.validateConfiguration();
      console.log("Starting MOTIF Mock server: ",basePath);
      //const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
      this.resolvePaths(this.config);
      this.serverManager = ServerManagerFactory.createServerManager();
      this.serverManager.start(this.config);
      this.status = ServerStatus.Running
      this.fireStatusChange()
    } else {
      //server already started...
    }
  }

  stop(){
    if (this.status===ServerStatus.Running){
      console.log("Stopping MOTIF Mock server: ",basePath);
      this.status = ServerStatus.Stopping
      this.serverManager.stop();
      this.serverManager = null;
      this.status = ServerStatus.Stopped
      this.fireStatusChange()
    } else {
      //server not runnig or stopping
    }
  }

  configure(){
    this.config = this.configurator.getConfiguration();
  }

  addEventListener(event:string, listener){
    this.events.addListener(event, listener)
  }

  removeEventListener(event:string, listener){
    this.events.removeListener(event, listener)
  }

  getConfigurator(configuration:any):MotifFMockConfigurator {
    return this.configurator;
  }

  protected fireStatusChange(){
    this.events.emit('onDidStatusChange', this)
  }

  // Utilities
  resolvePaths(config) {
    if(config.mockModulePath) {
      config.mockModulePath = path.resolve(basePath,config.mockModulePath);
    }
    if(config.libraryLoaderPath) {
      config.libraryLoaderPath = path.resolve(basePath,config.libraryLoaderPath);
    }
    if(config.mockModulePath) {
      config.localDBPath = path.resolve(basePath,config.localDBPath);
    }
  }

}

class MotifFMockConfigurator implements ServerInstanceConfigurator {

  events:EventEmitter;
  currentConfig:MotifServerConfig;
  configUI:MOTIFServerConfigUI;

  constructor(){
    this.events = new EventEmitter();
  }

  protected initUI(){
    this.configUI = new MOTIFServerConfigUI();
    this.updateUI();
  }

  getConfiguration():MotifServerConfig{
    return this.configUI.getConfiguration();
  }

  addEventListener(event:string, listener) {
    this.events.addListener(event, listener)
  }

  removeEventListener(event:string, listener){
    this.events.removeListener(event, listener)
  }

  applyConfiguration(configuration:any){
    this.currentConfig = configuration;
    if (this.configUI){
      this.updateUI();
    }
  }

  getConfigurationPane():HTMLElement {
    if (!this.configUI){
      this.initUI();
    }
    return this.configUI.mainElement;
  }

  protected updateUI(){
    if (this.configUI){
      this.configUI.updateUI(this.currentConfig);
    }
  }

  protected fireConfigChanged(){
    this.events.emit("didConfigurationChange", this)
  }

  revertChanges(){
    this.updateUI()
  }

}
