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
import { EventEmitter }  from 'events'
import { MotifServerConfig } from './MOTIFMockServerCommons'
import { UIInput } from '../ui-components/UIInput'
import { UIToggle } from '../ui-components/UIToggle'

export class MOTIFServerConfigUI {

  events:EventEmitter;
  public mainElement:HTMLElement;

  protected txtServerPort:UIInput;
  protected txtMockModulePath:UIInput;
  protected txtLibraryLoaderPath:UIInput;
  protected txtLocalDbPath:UIInput;
  protected mockEnabled:UIToggle;
  protected liveReloadEnabled:UIToggle;

  constructor(){
    this.initUI()
  }

  protected initUI(){
    this.events = new EventEmitter();

    this.txtServerPort = new UIInput({
      caption: "Server Port",
      placeholder : "Server Port"
    })

    this.txtMockModulePath = new UIInput({
      caption: "Mock Module File",
      placeholder : "Mock Module File",
      browseFor: "file"
    })

    this.txtLibraryLoaderPath = new UIInput({
      caption: "Library Loader File",
      placeholder : "Library Loader File",
      browseFor: "file"
    })

    this.txtLocalDbPath = new UIInput({
      caption: "Local Database Path",
      placeholder : "Local Database  Path",
      browseFor:"folder"
    })

    this.mockEnabled = new UIToggle({
      caption: 'Use mock'
    })

    this.liveReloadEnabled = new UIToggle({
      caption: 'Live reload'
    })

    this.mainElement = createElement('div',{
      elements:[ this.txtServerPort.element,
        this.txtMockModulePath.element,
        this.mockEnabled.element,
        this.liveReloadEnabled.element,
        this.txtLibraryLoaderPath.element,
        this.txtLocalDbPath.element
      ]
    })


  }

  protected fireConfigChanged(){
    this.events.emit("didConfigurationChange", this)
  }

  public updateUI(config:MotifServerConfig){
    this.portNumber = config.port
    this.isMockEnabled = config.isMockEnabled
    this.mockModulePath = config.mockModulePath
    this.libraryLoaderPath = config.libraryLoaderPath
    this.localDBPath = config.localDBPath
    this.liveReload = config.liveReload
  }

  addEventListener(event:string, listener) {
    this.events.addListener(event, listener)
  }

  removeEventListener(event:string, listener){
    this.events.removeListener(event, listener)
  }

  getConfiguration():MotifServerConfig{
    let ret = {
      port: this.portNumber,
      isMockEnabled: this.isMockEnabled,
      mockModulePath: this.mockModulePath,
      libraryLoaderPath: this.libraryLoaderPath,
      localDBPath: this.localDBPath,
      liveReload: this.liveReload
    }
    return ret;
  }

  public get portNumber():number {
    try {
      return parseInt(this.txtServerPort.value)
    } catch(err){
      alert("Invalid server port number defined")
    }
  }

  public get mockModulePath():string {
    return this.txtMockModulePath.value;
  }

  public get libraryLoaderPath():string {
    return this.txtLibraryLoaderPath.value;
  }

  public get localDBPath():string {
    return this.txtLocalDbPath.value;
  }

  public get isMockEnabled():boolean {
    return this.mockEnabled.value;
  }

  public get liveReload():boolean {
    return this.liveReloadEnabled.value;
  }


  public set portNumber(value:number) {
    this.txtServerPort.value = ""+value;
  }

  public set mockModulePath(value:string) {
    this.txtMockModulePath.value = value;
  }

  public set libraryLoaderPath(value:string) {
    this.txtLibraryLoaderPath.value = value;
  }

  public set localDBPath(value:string) {
    this.txtLocalDbPath.value = value;
  }

  public set isMockEnabled(value:boolean) {
    this.mockEnabled.value = value;
  }

  public set liveReload(value:boolean) {
    this.liveReloadEnabled.value = value;
  }

}
