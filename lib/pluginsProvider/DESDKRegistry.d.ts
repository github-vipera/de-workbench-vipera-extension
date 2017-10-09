export declare class DESDKRegistry {
    private static instance;
    private offlineSDK;
    private offlineSDKPath;
    private isWin;
    private spawnRef;
    private constructor();
    static getInstance(): DESDKRegistry;
    isOfflineSDK(): boolean;
    setOfflineSDK(offline: boolean): void;
    getOfflineSDKPath(): string;
    setOfflineSDKPath(path: string): void;
    getCurrentNPMRegistry(): string;
    restoreDefaultNPMRegistry(): string;
    installViperaNPMRegistry(): string;
    notifyChanges(): void;
    installNPMRegistry(registryURL: string): void;
    prepareCommand(cmd: any): any;
    getLocalSDKPlugins(): any[];
    private getDirectories(srcpath);
    private loadLocalPluginInfo(dir);
    private readAvailablePlatforms(jsonRaw);
    private isPlatformSupported(jsonRaw, platform);
}
