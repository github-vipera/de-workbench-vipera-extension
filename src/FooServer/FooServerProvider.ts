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


export class FakeMOTIFServerProvider implements ServerProvider {

  constructor(){
  }

  createInstance(configuration:any):ServerInstance {
    return new FakeMotifServer();
  }

  getProviderName():string {
      return "(Fake)MOTIF Vipera Server"
  }

  destroyInstance(instance:ServerInstance) {
    //TODO!!
  }

}

class FakeMotifServer implements ServerInstance {

  status:ServerStatus=ServerStatus.Stopped;
  protected events:EventEmitter;
  protected configurator: FooConfigurator;

  constructor(){
    this.events = new EventEmitter();
    this.configurator = new FooConfigurator();
  }

  start(){
    console.log("FOOSERVER start called")
    this.status = ServerStatus.Starting
    this.events.emit('onDidStatusChange', this)
    setTimeout(()=>{ this.doStarted() }, 3000);
  }

  stop(){
    console.log("FOOSERVER stop called")
    this.status = ServerStatus.Stopping
    this.events.emit('onDidStatusChange', this)
    setTimeout(()=>{ this.doStopped() }, 3000);
  }

  protected doStarted(){
    this.status = ServerStatus.Running
    this.events.emit('onDidStatusChange', this)
  }

  protected doStopped(){
    this.status = ServerStatus.Stopped
    this.events.emit('onDidStatusChange', this)
  }

  configure(){
    //NOP
  }

  addEventListener(event:string, listener){
    this.events.addListener(event, listener)
  }

  removeEventListener(event:string, listener){
    this.events.removeListener(event, listener)
  }

  getConfigurator(configuration:any):FooConfigurator {
    return this.configurator;
  }





}

class FooConfigurator implements ServerInstanceConfigurator {

  events:EventEmitter;
  currentConfig:any;
  inputA:HTMLElement;
  inputB:HTMLElement;
  mainElement:HTMLElement;

  constructor(){
    this.events = new EventEmitter();
  }

  protected initUI(){
    this.inputA = createElement('input',{
      className: 'input-text native-key-bindings'
    })
    this.inputA.setAttribute('type', 'text')
    this.inputA.setAttribute('placeholder', 'Server URL')
    this.inputA.addEventListener('keydown',(evt)=>{
      this.fireConfigChanged()
    })

    let spacer = createElement('div',{
    })
    spacer.style.height = "10px";

    this.inputB = createElement('input',{
      className: 'input-text native-key-bindings'
    })
    this.inputB.setAttribute('type', 'text')
    this.inputB.setAttribute('placeholder', 'Configuration file')
    this.inputB.addEventListener('keydown',(evt)=>{
      this.fireConfigChanged()
    })

    this.mainElement  = createElement('div',{
      elements:[ this.inputA, spacer, this.inputB ]
    })

    this.updateUI();
  }

  addEventListener(event:string, listener) {
    this.events.addListener(event, listener)
  }

  removeEventListener(event:string, listener){
    this.events.removeListener(event, listener)
  }

  applyConfiguration(configuration:any){
    this.currentConfig = configuration;
    if (this.mainElement){
      this.updateUI();
    }
  }

  getConfigurationPane():HTMLElement {
    if (!this.mainElement){
      this.initUI();
    }
    return this.mainElement;
  }

  protected updateUI(){
    if (this.currentConfig.url){
      this.inputA["value"] = this.currentConfig.url
    }
    if (this.currentConfig.configPath){
      this.inputB["value"] = this.currentConfig.configPath
    }
  }

  protected fireConfigChanged(){
    this.events.emit("didConfigurationChange", this)
  }

  revertChanges(){
    this.updateUI()
  }

  getConfiguration():any {
    return { url:this.inputA["value"], configPath:this.inputB["value"]}
  }


}
