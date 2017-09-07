declare const _default: {
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
};
export default _default;
