'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */


export class MotifServerConfig {
  public port:number=3000
  public isMockEnabled:boolean=true
  public mockModulePath:string=""
  public libraryLoaderPath:string=""
  public localDBPath:string=""
  public liveReload:boolean=true
}
