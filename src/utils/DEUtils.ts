'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'
import { WorkbenchServices } from '../WorkbenchServices'

export class DEUtils {


  /**
   * Returns TRUE if the DE CLI seems to be available
   */
  public static async checkForDECli(){
    LoggerService.debug("Checking for DE cli");
    try {
      let execService = WorkbenchServices.ExecutorService;
      let x = await execService.runExec('.', 'de-cli');
      return true;
    } catch (ex){
      LoggerService.error("Check for DE CLI error: ", ex);
      return false;
    }
  }

  /**
   * installs globally the DE CLI
   */
  public static async installDECli(){
    LoggerService.info("Installing the DE CLI...");
    try {
      let execService = WorkbenchServices.ExecutorService;
      let x = await execService.runExec('.', 'npm install -g vipera-de-cli');
      LoggerService.info("DE CLI installed successfully.");
      return true;
    } catch (ex){
      console.log("installDECli error: ", ex);
      LoggerService.error("DE CLI installation failure: " + ex);
      return false;
    }
  }

}
