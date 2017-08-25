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

  /**
  class MotifServerConfig {
    port:number=3000
    isMockEnabled:boolean=true
    mockModulePath:string=""
    libraryLoaderPath:string=""
    localDBPath:string=""
    liveReload:boolean=true
  }
  **/

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
        this.txtLibraryLoaderPath.element,
        this.txtLocalDbPath.element,
        this.liveReloadEnabled.element
      ]
    })


  }

  protected fireConfigChanged(){
    this.events.emit("didConfigurationChange", this)
  }

  public updateUI(config:MotifServerConfig){
    //TODO!!
  }

  addEventListener(event:string, listener) {
    this.events.addListener(event, listener)
  }

  removeEventListener(event:string, listener){
    this.events.removeListener(event, listener)
  }


}
