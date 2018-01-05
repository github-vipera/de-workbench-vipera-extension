'use babel'
export interface LoggerTransport{
  trace(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */


export class MotifServerConfig {
  public port:number=3000
  public isMockEnabled:boolean=false;
  public mockModulePath:string=""
  public libraryLoaderPath:string=""
  public localDBPath:string=""
  public liveReload:boolean=true
  public serverUrl?:string = undefined;
  public loggerTransport?:LoggerTransport;
}
