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


export default {

  dewebCordovaPluginsProviderManager: null,


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
    console.log("DEWBEXT deferredActivation.");

    require('atom-package-deps').install('de-wb-vipera-extension', false).then(function(res){
      console.log("Dep packages installed.");
    })

    // add commands
    let commands = atom.commands.add('atom-workspace', {
        'dewb-menu-view-:foo-action': () => this.fooAction()
      });

  },

  deactivate () {
      console.log('DEWBEXT deactivated.');
  },

  fooAction(){
    alert('Foo action')
  },

  consumeCordovaPluginsProvider: function (dewebCordovaPluginsProviderManager) {
    console.log("Consuming DE WB plugin manager...");
    this.dewebCordovaPluginsProviderManager = dewebCordovaPluginsProviderManager;
    this.dewebCordovaPluginsProviderManager.registerProviderFactory(DEPluginsProviderFactory.getInstance());
    console.log("Consuming DE WB plugin manager...END");
  },

  consumeLogger:function(logger){
    console.log("Consuming DE WB Logger!!");
    LoggerService.setLogger(logger);
    console.log("Consuming DE WB Logger END!!");
  }


}
