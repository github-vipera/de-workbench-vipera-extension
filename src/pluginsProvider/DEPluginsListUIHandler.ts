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

  private isOfflineSDK:boolean = false;

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
    this.offlineToggleInput.addEventListener('change', ()=>{
      this.toggleOfflineMode();
    })
    // offline toggle input


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
    this.offlineButtonSDKPathSelector = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-package'
        }),
        createText('Set Vipera SDK location')
      ],
      className: 'inline-block btn'
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
    this.btnDefaultRegistrySelector = createElement('button',{
      elements: [
        createElement('span',{
          className: 'icon icon-repo-clone'
        }),
        createText('Restore Default NPM Registry')
      ],
      className: 'inline-block btn'
    })

    this.currentNPMRegistry = createElement('span',{
      elements: [
        createText("https://hhfjdkshfjdskh"), //TODO!!
      ],
      className: 'deweb-dynamicengine-plugins-offlinemode-currentpath highlight'
    })
    this.npmSettingsSettingsContainer = createElement('div',{
      elements: [
        createText("Current NPM Registry: "),
        this.currentNPMRegistry,
      ],
      className : 'deweb-dynamicengine-plugins-offlinemode-container'
    });
    // end NPM registry management


    //status container
    let statusContainer = createElement('div',{
      elements: [
        this.offlineSettingsContainer,
        this.npmSettingsSettingsContainer
      ]
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
  }

  private toggleOfflineMode(){
    this.isOfflineSDK = !this.isOfflineSDK;
    this.updateUI();
  }

  private updateUI(){
    this.offlineSDKLocation.innerText = DESDKRegistry.getInstance().getOfflineSDKPath();
    if (this.isOfflineSDK){
      this.offlineToggleInput.setAttribute("checked","true");
      this.showSDKSettings(true);
      this.showNPMRegistrySettings(false);
    } else {
      this.offlineToggleInput.setAttribute("checked","false");
      this.showSDKSettings(false);
      this.showNPMRegistrySettings(true);
    }
  }

  public element():HTMLElement {
    return this.mainElement;
  }

  private showNPMRegistrySettings(show:boolean){
    if (!show){
      this.npmSettingsSettingsContainer.style.display = "block"
      this.btnViperaRegistrySelector.style.display = "inline-block"
      this.btnDefaultRegistrySelector.style.display = "inline-block"
    } else {
      this.npmSettingsSettingsContainer.style.display = "none"
      this.btnViperaRegistrySelector.style.display = "none"
      this.btnDefaultRegistrySelector.style.display = "none"
    }
  }

  private showSDKSettings(show:boolean){
    if (!show){
      this.offlineSettingsContainer.style.display = "inline-block"
      this.offlineButtonSDKPathSelector.style.display = "inline-block"
    } else {
      this.offlineSettingsContainer.style.display = "none"
      this.offlineButtonSDKPathSelector.style.display = "none"
    }
  }

  public setOfflineSDK(offline:boolean){
    this.isOfflineSDK = offline;
    this.updateUI();
  }

}
