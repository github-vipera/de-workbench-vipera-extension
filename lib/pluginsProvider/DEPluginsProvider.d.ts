export interface CordovaPluginsProviderService {
    getCordovaPlugins(): Promise<Array<any>>;
    getProviderName(): string;
    getExtendedUI(): HTMLElement;
}
export declare class DEPluginsProvider implements CordovaPluginsProviderService {
    private uiHandler;
    private eventHandler;
    private currentProjectRoot;
    constructor();
    getProviderName(): string;
    getCordovaPlugins(): Promise<any[]>;
    private getPlatformDesc(platform);
    getExtendedUI(): HTMLElement;
    private notifyListChanged();
    addEventHandler(handler: Function): void;
}
