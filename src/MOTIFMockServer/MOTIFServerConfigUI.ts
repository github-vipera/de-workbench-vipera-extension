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
  protected txtMotifServerUrl:UIInput;
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
      browseFor: "file",
      visible:false
    })

    this.txtMotifServerUrl = new UIInput({
      caption: "Motif Server Url",
      placeholder:"http://localhost:8080/json",
      visible:true
    });

    this.txtLibraryLoaderPath = new UIInput({
      caption: "Library Loader File",
      placeholder : "Library Loader File",
      browseFor: "file",
      visible:false
    })

    this.txtLocalDbPath = new UIInput({
      caption: "Local Database Path",
      placeholder : "Local Database  Path",
      browseFor:"folder",
      visible:false
    })

    this.mockEnabled = new UIToggle({
      caption: 'Use mock'
    })

    this.mockEnabled.onDidValueChange(() => {
      this.updateMockUI();
    });

    this.liveReloadEnabled = new UIToggle({
      caption: 'Live reload'
    })

    this.mainElement = createElement('div',{
      elements:[ this.txtServerPort.element,
        this.txtMockModulePath.element,
        this.txtMotifServerUrl.element,
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
    this.serverUrl = config.serverUrl
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
      liveReload: this.liveReload,
      serverUrl: this.serverUrl
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

  public get serverUrl():string {
    return this.txtMotifServerUrl.value;
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
    this.updateMockUI();
  }

  public set liveReload(value:boolean) {
    this.liveReloadEnabled.value = value;
  }

  public set serverUrl(value:string){
    this.txtMotifServerUrl.value = value;
  }


  private updateMockUI(){
    if(!this.isMockEnabled){
      this.txtMockModulePath.setVisible(false);
      this.txtLocalDbPath.setVisible(false);
      this.txtLibraryLoaderPath.setVisible(false);
      this.txtMotifServerUrl.setVisible(true);
    }else{
      this.txtMockModulePath.setVisible(true);
      this.txtLocalDbPath.setVisible(true);
      this.txtLibraryLoaderPath.setVisible(true);
      this.txtMotifServerUrl.setVisible(false);
    }
  }

}
