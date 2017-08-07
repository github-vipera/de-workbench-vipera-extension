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

export class DEPlusinsListUIHandler {

  private mainElement: HTMLElement;

  private offlineButton: HTMLElement;
  private offlineSettingsContainer: HTMLElement;
  private offlineSDKLocation: HTMLElement;
  private offlineButtonSDKPathSelector: HTMLElement;

  private btnViperaRegistrySelector:HTMLElement;
  private btnDefaultRegistrySelector:HTMLElement;

  private isOfflineSDK:boolean = false;

  constructor(){
    this.initUI();
  }

  private initUI(){

    // Offline Management
    this.offlineSDKLocation = createElement('span',{
      elements: [
        createText("/pippo/pluto/paperino"), //TODO!!
      ],
      className: 'deweb-dynamicengine-plugins-offlinemode-currentpath highlight'
    })
    this.offlineSettingsContainer = createElement('div',{
      elements: [
        createText("Current SDK location: "),
        this.offlineSDKLocation,
      ],
      className : 'deweb-dynamicengine-plugins-offlinemode-container'
    });
    this.offlineSettingsContainer.style.visibility = "hidden"

    this.offlineButton = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-package'
        }),
        createText('Offline SDK')
      ],
      className: 'inline-block btn'
    })
    this.offlineButton.addEventListener('click',()=>{
      this.toggleOfflineMode();
    })
    this.offlineButtonSDKPathSelector = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-package'
        }),
        createText('Set Vipera SDK location')
      ],
      className: 'inline-block btn'
    })
    this.offlineButtonSDKPathSelector.style.display = "none"
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
    this.btnViperaRegistrySelector.style.display = "inline-block"
    this.btnDefaultRegistrySelector = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-repo-clone'
        }),
        createText('Restore Default NPM Registry')
      ],
      className: 'inline-block btn'
    })
    this.btnDefaultRegistrySelector.style.display = "inline-block"



    let toolbarContainer = createElement('div',{
      elements: [
        this.offlineButton,this.offlineButtonSDKPathSelector,this.btnViperaRegistrySelector,this.btnDefaultRegistrySelector,

        this.offlineSettingsContainer
      ],
      className: 'block'
    })

    this.mainElement = createElement('div',{
      elements: [ toolbarContainer]
    })
  }

  private toggleOfflineMode(){
    this.offlineButton.classList.toggle('selected')
    this.isOfflineSDK = !this.isOfflineSDK;
    if (this.isOfflineSDK){
      this.offlineSettingsContainer.style.visibility = "visible"
      this.offlineButtonSDKPathSelector.style.display = "inline-block"
      this.btnViperaRegistrySelector.style.display = "none"
      this.btnDefaultRegistrySelector.style.display = "none"
    } else {
      this.offlineSettingsContainer.style.visibility = "hidden"
      this.offlineButtonSDKPathSelector.style.display = "none"
      this.btnViperaRegistrySelector.style.display = "inline-block"
      this.btnDefaultRegistrySelector.style.display = "inline-block"
    }
  }

  public element():HTMLElement {
    return this.mainElement;
  }


}
