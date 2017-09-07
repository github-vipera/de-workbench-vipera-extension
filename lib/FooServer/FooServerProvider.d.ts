export declare enum ServerStatus {
    Stopped = 0,
    Starting = 1,
    Running = 2,
    Stopping = 3,
}
export interface ServerInstance {
    start(): any;
    stop(): any;
    status: ServerStatus;
    configure(configuration: any): any;
    addEventListener(event: string, listener: any): any;
    removeEventListener(event: string, listener: any): any;
    getConfigurator(configuration: any): ServerInstanceConfigurator;
}
export interface ServerInstanceConfigurator {
    getConfiguration(): any;
    addEventListener(event: string, listener: any): any;
    removeEventListener(event: string, listener: any): any;
    getConfigurationPane(): HTMLElement;
    revertChanges(): any;
    applyConfiguration(configuration: any): any;
}
export interface ServerProvider {
    createInstance(configuration: any): ServerInstance;
    destroyInstance(instance: ServerInstance): any;
    getProviderName(): string;
}
export declare class FakeMOTIFServerProvider implements ServerProvider {
    constructor();
    createInstance(configuration: any): ServerInstance;
    getProviderName(): string;
    destroyInstance(instance: ServerInstance): void;
}
