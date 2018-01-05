'use babel'
const util = require('util');
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

export class LoggerService {

  private static logger:any;

  public static setLogger(logger){
    console.log("Set logger");
    this.logger = logger;
  }
  
  public static info(msg:string){
    if (this.logger){
      this.logger.info(msg);
    }
  }

  public static debug(msg:string){
    if (this.logger){
      this.logger.debug(msg);
    }
  }

  public static warn(msg:string){
    if (this.logger){
      this.logger.warn(msg);
    }
  }

  public static error(msg:string){
    if (this.logger){
      this.logger.error(msg);
    }
  }

}


export class DefaultTransport {

  private formatMsg(args):string{
    /*if(optionalParams && optionalParams.length >0){
      return util.format(message,optionalParams);
    }
    return message;*/
    return util.format(args);
  }

  constructor(){
    console.log("Constructor!!");
  }

  trace(message?: any, ...optionalParams: any[]){
    /*let msg = " ";
    if(optionalParams.length > 0){
       msg = this.formatMsg(message, optionalParams);
    }else{
      msg = this.formatMsg(message);
    }
    LoggerService.debug(msg);*/
  }
  debug(message?: any, ...optionalParams: any[]){
   
  }
  info(message?: any, ...optionalParams: any[]){
    let msg = "";
    if(typeof(message) == "string" &&  message.indexOf('%') >= 0){
      msg = util.format(message,optionalParams);
    }else{
      msg = typeof(message) === "object" ? JSON.stringify(message): message.toString();
      optionalParams.forEach((value) => {
        msg += "  " + (typeof(value) === "object" ? JSON.stringify(value) : value.toString() );
      });
    }
    LoggerService.info(msg);
  }
  warn(message?: any, ...optionalParams: any[]){

  }
  error(message?: any, ...optionalParams: any[]){

  }
}
