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
const remote = require('remote');
const dialog = remote.require('electron').dialog;


export interface UIInputOptions {
  caption?:string;
  placeholder?:string;
  value?:string;
  browseFor?:string;
}

export class UIInput {

  mainElement : HTMLElement;
  txtInput:HTMLElement;
  lblCaption:HTMLElement;
  options:UIInputOptions;
  actionButton:HTMLElement;

  constructor(options?:UIInputOptions){
    this.options = options;
    this.initUI();
  }

  protected initUI(){
    this.mainElement = createElement('div',{
      className: 'de-wb-vipera-ext-ui-input-container'
    })

    if (this.options && this.options.caption){
      this.lblCaption = createElement('label',{
        elements : [ createText(this.options.caption) ]
      })
      insertElement(this.mainElement, this.lblCaption)
    }

    let inputContainer = createElement('div',{
      className:'de-wb-vipera-ext-ui-input-inline-control'
    });
    this.txtInput = createElement('input',{
      className: 'input-text native-key-bindings de-wb-vipera-ext-ui-input'
    })
    this.txtInput.setAttribute('type', 'text')
    if (this.options && this.options.placeholder){
      this.txtInput.setAttribute('placeholder', this.options.placeholder)
    }
    this.txtInput.addEventListener('keydown',(evt)=>{
      //this.fireConfigChanged()
    })
    insertElement(inputContainer, this.txtInput)

    if (this.options && this.options.browseFor){
      this.actionButton = this.createActionButtonFor(this.options.browseFor)
      insertElement(inputContainer, this.actionButton)
    }

    insertElement(this.mainElement, inputContainer)

  }

  protected createActionButtonFor(action:string):HTMLElement{
    if (action==="folder"){
      return this.createActionButtonForFolder();
    } else if (action==="file") {
      return this.createActionButtonForFile();
    }
  }

  protected createActionButtonForFolder():HTMLElement {
    let button = this.createActionButton('Browse...');
    button.addEventListener('click',()=>{
      this.chooseFolder();
    })
    return button;
  }

  protected createActionButtonForFile():HTMLElement {
    let button = this.createActionButton('Browse...');
    button.addEventListener('click',()=>{
      this.chooseFile();
    })
    return button;
  }

  protected createActionButton(caption:string):HTMLElement {
    let button = createElement('button',{
        elements: [ createText(caption)],
        className: 'btn btn-sm de-wb-vipera-ext-ui-input-action-button'
    })
    button.style["margin-left"] = "10px"
    return button;
  }

  protected chooseFolder(){
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (path && path.length>0){
      this.value = path;
    }
  }

  protected chooseFile(){
    var path = dialog.showOpenDialog({
      properties: ['openFile']
    });
    if (path && path.length>0){
      this.value = path;
    }
  }


  public get element():HTMLElement {
    return this.mainElement
  }

  public get value():string{
    return this.txtInput["value"];
  }

  public set value(value:string){
    this.txtInput["value"] = value;
  }


}
