export declare class EventBus {
    static readonly EVT_PROJECT_CHANGED: string;
    static readonly EVT_PATH_CHANGED: string;
    static readonly EVT_PLUGIN_ADDED: string;
    static readonly EVT_PLUGIN_REMOVED: string;
    static readonly EVT_PLATFORM_ADDED: string;
    static readonly EVT_PLATFORM_REMOVED: string;
    static readonly EVT_WORKBENCH_PLUGIN_ADDED: string;
    private static instance;
    private _eventBus;
    private constructor();
    static getInstance(): EventBus;
    subscribe(topic: string, callback: Function): void;
    subscribeAll(callback: Function): void;
    publish(topic: string, ...args: any[]): void;
}
