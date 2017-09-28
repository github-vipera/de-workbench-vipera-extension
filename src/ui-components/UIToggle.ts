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


export interface UIToggleOptions {
  caption:string;
  value?:boolean;
}

export class UIToggle {

  mainElement : HTMLElement;
  options:UIToggleOptions;
  lblCaption:HTMLElement;
  toggleInput:HTMLElement;
  events:EventEmitter;

  constructor(options:UIToggleOptions){
    this.options = options;
    this.events = new EventEmitter();
    this.initUI();
  }

  protected initUI(){
    this.mainElement = createElement('div',{
      className: 'de-wb-vipera-ext-ui-toggle-container'
    })

    this.toggleInput = createElement('input',{
      className: 'input-toggle'
    })
    this.toggleInput.setAttribute('type','checkbox')
    if (this.options.value){
      this.toggleInput.setAttribute('checked','')
    }

    this.toggleInput.addEventListener('change',() => {
      this.fireValueChange(this.value);
    });

    //<label class='input-label'><input class='input-toggle' type='checkbox' checked> Toggle</label>
    this.lblCaption = createElement('label',{
      elements:[ this.toggleInput, createText(this.options.caption) ],
      className: 'input-label'
    })

    insertElement(this.mainElement, this.lblCaption)

  }


    public get element():HTMLElement {
      return this.mainElement
    }

    public get value():boolean{
      return this.toggleInput["checked"];
    }

    public set value(value:boolean){
      if (value){
        this.toggleInput.setAttribute('checked','')
      } else {
        this.toggleInput.removeAttribute('checked')
      }
    }

    private fireValueChange(value:boolean){
      this.events.emit('didValueChanged',value);
    }

    public onDidValueChange(listener) {
      this.addEventListener("didValueChanged", listener)
    }

    public addEventListener(event:string, listener) {
      this.events.addListener(event, listener)
    }

    public removeEventListener(event:string, listener){
      this.events.removeListener(event, listener)
    }


}
