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
    /**
     * called from the Workbench
     **/
    getProviderName(): string;
    /**
     * called from the Workbench
     **/
    getCordovaPlugins(): Promise<any[]>;
    /**
    private createCordovaPluginDesc(){
      return {
        name: "pippo",
        id: "pippo",
        version: "1.0.2",
        description: "bklabkla",
        installed: false,
        author: "Vipera Plc",
        homepage: "https://&www.vipera.com",
        license: "Vipera Commercial",
        repository: "local",
        repositoryType: "private",
        lastUpdateTime: ""+ new Date(),
        rating: 10,
        platforms: [this.getPlatformDesc('ios'), this.getPlatformDesc('android')]
      }
    }
    **/
    private getPlatformDesc(platform);
    /**
     * called from the Workbench
     **/
    getExtendedUI(): HTMLElement;
    /**
     * Notify the Workbench to reload the list
     **/
    private notifyListChanged();
    /**
     * called from the Workbench
     **/
    addEventHandler(handler: Function): void;
}
