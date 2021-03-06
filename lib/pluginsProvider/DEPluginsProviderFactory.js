'use babel';
import { LoggerService } from '../Logger';
import { DEPluginsProvider } from './DEPluginsProvider';
export class DEPluginsProviderFactory {
    constructor() {
        LoggerService.debug("Creating CordovaPluginsProviderFactory...");
    }
    static getInstance() {
        if (!DEPluginsProviderFactory.instance) {
            DEPluginsProviderFactory.instance = new DEPluginsProviderFactory();
        }
        return DEPluginsProviderFactory.instance;
    }
    createProvider() {
        return new DEPluginsProvider();
    }
}
//# sourceMappingURL=DEPluginsProviderFactory.js.map