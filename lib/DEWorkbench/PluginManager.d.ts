import { CordovaPlugin } from '../cordova/Cordova';
export interface Service {
}
export interface CordovaPluginsProviderService extends Service {
    getCordovaPlugins(): Array<CordovaPlugin>;
    getProviderName(): string;
    getExtendedUI(): HTMLElement;
}
export interface Plugin {
    name: string;
    options: any;
    onRegistration(): any;
    providedServices(): Array<Service>;
}
export interface UIProvider {
}
export interface UIPluginsProvider {
    domElement: HTMLElement;
}
export declare class PluginManager {
    plugins: Array<Plugin>;
    constructor();
    registerPlugin(plugin: Plugin): void;
}
