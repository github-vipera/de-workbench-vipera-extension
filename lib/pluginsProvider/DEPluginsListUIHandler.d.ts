export declare class DEPlusinsListUIHandler {
    private mainElement;
    private offlineSettingsContainer;
    private offlineSDKLocation;
    private offlineButtonSDKPathSelector;
    private offlineToggleInput;
    private btnViperaRegistrySelector;
    private btnDefaultRegistrySelector;
    private npmSettingsSettingsContainer;
    private currentNPMRegistry;
    private actionListener;
    constructor();
    private initUI();
    addActionListener(actionListener: Function): DEPlusinsListUIHandler;
    private updateUI();
    element(): HTMLElement;
    private showNPMRegistrySettings(show);
    private showSDKSettings(show);
    setOfflineSDK(offline: boolean): void;
    private selectSDKOfflinePath();
    private notifyChanges();
}
