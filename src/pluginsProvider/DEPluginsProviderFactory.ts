'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { LoggerService } from '../Logger'
import { DEWBResourceManager } from '../utils/DEWBResourceManager'
import { DEPlusinsListUIHandler } from './DEPluginsListUIHandler'
import { DEPluginsProvider, CordovaPluginsProviderService } from './DEPluginsProvider'

export interface CordovaPluginsProviderFactory {
  createProvider():CordovaPluginsProviderService;
}

export class DEPluginsProviderFactory implements CordovaPluginsProviderFactory {

  private static instance:CordovaPluginsProviderFactory;

  private constructor() {
    LoggerService.debug("Creating CordovaPluginsProviderFactory...")
  }

  static getInstance() {
      if (!DEPluginsProviderFactory.instance) {
          DEPluginsProviderFactory.instance = new DEPluginsProviderFactory();
      }
      return DEPluginsProviderFactory.instance;
  }

  createProvider():CordovaPluginsProviderService {
    return new DEPluginsProvider();
  }


}
