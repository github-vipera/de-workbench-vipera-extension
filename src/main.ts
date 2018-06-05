'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

const { CompositeDisposable } = require('atom')
declare function require(moduleName: string): any;

import { LoggerService } from './Logger'
import { DEPluginsProviderFactory } from './pluginsProvider/DEPluginsProviderFactory'
import { WorkbenchServices } from './WorkbenchServices'
//import { MotifMockServerProvider } from './MOTIFMockServer/MOTIFMockServer'
import { DEUtils } from './utils/DEUtils'
import { UINotifications } from './ui-components/UINotifications'


export default {

  subcriptions: null,

  config:{
      ViperaNPMRegistry: {
        title: 'Vipera NPM Registry',
        description: 'Vipera NPM Registry',
        type: 'string',
        default: "https://npm-proxy.fury.io/Mr43aEGkxz47vyf7VZ_y/vipera-npm-registry/"
      }
  },

  activate (state: any) {
    console.log("DEWBEXT activated.");
    this.deferredActivation();
  },

  deferredActivation(){
    LoggerService.perfLog("DEWBEXT deferredActivation.");
    
    /* TIME CONSUMING
    require('atom-package-deps').install('de-wb-vipera-extension', false).then(function(res){
      console.log("Dep packages installed.");
    })
    */

    // add commands
    let commands = atom.commands.add('atom-workspace', {
        'dewb-ext-menu-view-:install-de-cli': ()=> this.installDECli(),
        'dewb-ext-menu-view-:check-de-cli': ()=> this.checkForDECli()
      });
    this.subscriptions = new CompositeDisposable();
    // add commands subs
    this.subscriptions.add(commands);
    
    LoggerService.perfLog("DEWBEXT deferredActivation.END");
  },

  deactivate () {
      console.log('DEWBEXT deactivated.');
  },

  fooAction(){
    alert('Foo action')
  },

  consumeCordovaPluginsProvider: function (dewebCordovaPluginsProviderManager) {
    LoggerService.perfLog("Consuming DE WB plugin manager...");
    WorkbenchServices.CordovaPluginsProviderManager = dewebCordovaPluginsProviderManager;
    DEPluginsProviderFactory.getInstance();
    WorkbenchServices.CordovaPluginsProviderManager.registerProviderFactory(DEPluginsProviderFactory.getInstance());
    LoggerService.perfLog("Consuming DE WB plugin manager...END");
  },

  
  consumeLogger:function(logger){
    LoggerService.perfLog("Consuming DE WB Logger!!");
    WorkbenchServices.Logger = logger;
    LoggerService.setLogger(logger);
    LoggerService.perfLog("Consuming DE WB Logger END!");
  },

  consumeProjectManager:function(projectManager){
    LoggerService.perfLog("Consuming DE WB Project Manager!!");
    WorkbenchServices.ProjectManager = projectManager;
    LoggerService.perfLog("Consuming DE WB Project Manager END!");
  },

  consumeEvents:function(eventBus){
    LoggerService.perfLog("Consuming DE WB Event Bus!!");
    WorkbenchServices.Events = eventBus;
    LoggerService.perfLog("Consuming DE WB Event Bus END!");
  },

  consumeServerManager:function(serverManager){
    LoggerService.perfLog("Consuming DE WB Server Manager!!");
    WorkbenchServices.ServerManager = serverManager;
    setTimeout(()=>{
      LoggerService.perfLog("WB Server Manager registerProvider...");
      let xx = require('./MOTIFMockServer/MOTIFMockServer').MotifMockServerProvider;
      WorkbenchServices.ServerManager.registerProvider(new xx())
      LoggerService.perfLog("WB Server Manager registerProvider...END");
    }, 1);
    //WorkbenchServices.ServerManager.registerProvider(new MotifMockServerProvider)
    LoggerService.perfLog("Consuming DE WB Server Manager END!");
  },

  consumeExecutorService:function(executorService){
    LoggerService.perfLog("Consuming DE WB Executor Service!!");
    WorkbenchServices.ExecutorService = executorService;
    LoggerService.perfLog("Consuming DE WB Executor Service END!");

    if (this.needDECLICheck()){
      this.checkForDECli();
    }

  },

  async installDECli(){
    let installRunningNotification = UINotifications.showInfo("Installing DE CLI...", { dismissable: true })
    let ok = await DEUtils.installDECli();
    if (ok){
      installRunningNotification.dismiss()
      UINotifications.showSuccess("DE CLI installed successfully.")
    } else {
      installRunningNotification.dismiss()
      UINotifications.showError("Error installing the DE CLI. See the log for more details.")
    }
  },

  async checkForDECli(){
    let deCliOK = await DEUtils.checkForDECli();
    atom.config["set"]('de-workbench-vipera-extension.DECCLICheck', false);
    if (!deCliOK){
      let notification = UINotifications.showInfo("DE CLI Not Installed.", {
        dismissable: true,
        buttons: [
          {
            text: 'Do Install',
            onDidClick: ()=>{
              notification.dismiss();
              this.installDECli();
            }
          },
          {
            text: 'Cancel',
            onDidClick: ()=>{
              notification.dismiss();
            }
          }
        ],
        detail: "La DE CLI non sembra essere installata. Vuoi procedere ora con l'installazione?"
      })
    }
  },

  needDECLICheck():boolean {
    return  atom.config.get('de-workbench-vipera-extension.DECCLICheck')
  }
  
}
