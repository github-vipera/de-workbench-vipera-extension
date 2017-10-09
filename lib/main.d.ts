declare const _default: {
    subcriptions: any;
    config: {
        ViperaNPMRegistry: {
            title: string;
            description: string;
            type: string;
            default: string;
        };
    };
    activate(state: any): void;
    deferredActivation(): void;
    deactivate(): void;
    fooAction(): void;
    consumeCordovaPluginsProvider: (dewebCordovaPluginsProviderManager: any) => void;
    consumeLogger: (logger: any) => void;
    consumeProjectManager: (projectManager: any) => void;
    consumeEvents: (eventBus: any) => void;
    consumeServerManager: (serverManager: any) => void;
    consumeExecutorService: (executorService: any) => void;
    installDECli(): Promise<void>;
    checkForDECli(): Promise<void>;
    needDECLICheck(): boolean;
};
export default _default;
