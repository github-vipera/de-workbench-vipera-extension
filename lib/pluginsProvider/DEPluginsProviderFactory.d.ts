import { CordovaPluginsProviderService } from './DEPluginsProvider';
export interface CordovaPluginsProviderFactory {
    createProvider(): CordovaPluginsProviderService;
}
export declare class DEPluginsProviderFactory implements CordovaPluginsProviderFactory {
    private static instance;
    private constructor();
    static getInstance(): CordovaPluginsProviderFactory;
    createProvider(): CordovaPluginsProviderService;
}
