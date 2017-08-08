'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
 import { LoggerService } from '../Logger'
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

import { DESDKRegistry } from './DESDKRegistry'
import { EventBus } from '../utils/EventBus'
const remote = require('remote');
const dialog = remote.require('electron').dialog;
const fs = require('fs');

export class DEPlusinsListUIHandler {

  private mainElement: HTMLElement;

  //private offlineButton: HTMLElement;
  private offlineSettingsContainer: HTMLElement;
  private offlineSDKLocation: HTMLElement;
  private offlineButtonSDKPathSelector: HTMLElement;
  private offlineToggleInput: HTMLElement;

  private btnViperaRegistrySelector:HTMLElement;
  private btnDefaultRegistrySelector:HTMLElement;
  private npmSettingsSettingsContainer:HTMLElement;
  private currentNPMRegistry:HTMLElement;

  private actionListener:Function;

  constructor(){
    this.initUI();
  }

  private initUI(){

    // offline toggle
    this.offlineToggleInput = createElement('input',{
        className: 'input-toggle'
    })
    this.offlineToggleInput.setAttribute('type','checkbox')
    let offlineToggle = createElement('label',{
      elements: [
        this.offlineToggleInput,
        createText('Offline SDK')
      ],
      className: 'input-label deweb-dynamicengine-plugins-offlinemode-toggle-label'
    })
    this.offlineToggleInput.addEventListener('change', (evt:any)=>{
      let checkValue = evt.srcElement.checked;
      this.setOfflineSDK(checkValue);
    })
    // offline toggle input


    // Offline Management
    this.offlineSDKLocation = createElement('span',{
      elements: [
        createText("/"),
      ],
      className: 'deweb-dynamicengine-plugins-offlinemode-currentpath highlight'
    })
    this.offlineSettingsContainer = createElement('div',{
      elements: [
        createText("Current SDK location: "),
        this.offlineSDKLocation,
      ],
      className : 'deweb-dynamicengine-plugins-settings-container offline front'
    });
    this.offlineButtonSDKPathSelector = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-package'
        }),
        createText('Set Vipera SDK location')
      ],
      className: 'inline-block btn'
    })
    this.offlineButtonSDKPathSelector.addEventListener('click',()=>{
      this.selectSDKOfflinePath();
    })
    // Offline Management




    // NPM registry Management
    this.btnViperaRegistrySelector = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-repo-clone'
        }),
        createText('Set Vipera NPM Registry')
      ],
      className: 'inline-block btn'
    })
    this.btnViperaRegistrySelector.addEventListener('click',()=>{
      DESDKRegistry.getInstance().installViperaNPMRegistry()
    })
    this.btnDefaultRegistrySelector = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-repo-clone'
        }),
        createText('Restore Default NPM Registry')
      ],
      className: 'inline-block btn'
    })
    this.btnDefaultRegistrySelector.addEventListener('click',()=>{
      DESDKRegistry.getInstance().restoreDefaultNPMRegistry()
    })

    this.currentNPMRegistry = createElement('span',{
      elements: [
        createText("https://---"), //TODO!!
      ],
      className: 'deweb-dynamicengine-plugins-offlinemode-currentpath highlight'
    })
    this.npmSettingsSettingsContainer = createElement('div',{
      elements: [
        createText("Current NPM Registry: "),
        this.currentNPMRegistry,
      ],
      className : 'deweb-dynamicengine-plugins-settings-container npm back'
    });
    // end NPM registry management


    //status container
    let statusContainer = createElement('div',{
      elements: [
        createElement('div',{
          elements: [
            this.offlineSettingsContainer,
            this.npmSettingsSettingsContainer
          ],
          className: 'flipper'
        })
      ],
      className : 'flip-container'
    })


    let toolbarContainer = createElement('div',{
      elements: [
        offlineToggle, this.offlineButtonSDKPathSelector,this.btnViperaRegistrySelector,this.btnDefaultRegistrySelector,
        statusContainer
      ],
      className: 'block'
    })

    this.mainElement = createElement('div',{
      elements: [ toolbarContainer]
    })

    this.setOfflineSDK(DESDKRegistry.getInstance().isOfflineSDK())

    EventBus.getInstance().subscribe(EventBus.EVT_CONFIG_CHANGED,()=>{
      this.updateUI();
      this.notifyChanges();
    });

  }

  public addActionListener(actionListener:Function):DEPlusinsListUIHandler{
    this.actionListener = actionListener;
    return this;
  }

  private updateUI(){
    this.offlineSDKLocation.innerText = DESDKRegistry.getInstance().getOfflineSDKPath();
    this.currentNPMRegistry.innerText = DESDKRegistry.getInstance().getCurrentNPMRegistry();
    let checkbox:any = this.offlineToggleInput;
    let isOfflineSDK = DESDKRegistry.getInstance().isOfflineSDK()
    checkbox.checked =isOfflineSDK
    if (isOfflineSDK){
      this.showSDKSettings(true);
      this.showNPMRegistrySettings(false);
    } else {
      this.showSDKSettings(false);
      this.showNPMRegistrySettings(true);
    }
  }

  public element():HTMLElement {
    return this.mainElement;
  }

  private showNPMRegistrySettings(show:boolean){
    if (show){
      this.npmSettingsSettingsContainer.style.visibility = "visible"
      this.npmSettingsSettingsContainer.style.display = "block"

      this.btnViperaRegistrySelector.style.display = "inline-block"
      this.btnDefaultRegistrySelector.style.display = "inline-block"
    } else {
      this.npmSettingsSettingsContainer.style.display = "none"
      this.npmSettingsSettingsContainer.style.visibility = "hidden"

      this.btnViperaRegistrySelector.style.display = "none"
      this.btnDefaultRegistrySelector.style.display = "none"
    }
  }

  private showSDKSettings(show:boolean){
    if (show){
      this.offlineSettingsContainer.style.visibility = "visible"
      this.offlineSettingsContainer.style.display = "block"

      this.offlineButtonSDKPathSelector.style.display = "inline-block"
    } else {
      this.offlineSettingsContainer.style.display = "none"
      this.offlineSettingsContainer.style.visibility = "hidden"

      this.offlineButtonSDKPathSelector.style.display = "none"
    }
  }


  public setOfflineSDK(offline:boolean){
    DESDKRegistry.getInstance().setOfflineSDK(offline);
    this.updateUI();
  }

  private selectSDKOfflinePath(){
    var sdkPath = dialog.showOpenDialog({properties: ['openDirectory']});
    if(!sdkPath){
      return;
    }
    if(!fs.existsSync(sdkPath[0])){
      atom.notifications.addError("Invalid sdk path");
      return;
    }
    DESDKRegistry.getInstance().setOfflineSDKPath(sdkPath[0]);
  }

  private notifyChanges(){
    if (this.actionListener){
      this.actionListener('reloadPluginsList')
    }
  }

}
