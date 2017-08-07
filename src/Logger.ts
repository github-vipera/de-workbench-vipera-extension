'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

export class LoggerService {

  private static logger:any;

  public static setLogger(logger){
    this.logger = logger;
  }
  
  public static info(...msg){
    if (this.logger){
      this.logger.info(msg);
    }
  }

  public static debug(...msg){
    if (this.logger){
      this.logger.debug(msg);
    }
  }

  public static warn(...msg){
    if (this.logger){
      this.logger.warn(msg);
    }
  }

  public static error(...msg){
    if (this.logger){
      this.logger.error(msg);
    }
  }

}
