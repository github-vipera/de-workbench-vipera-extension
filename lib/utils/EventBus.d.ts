export declare class EventBus {
    static readonly EVT_CONFIG_CHANGED: string;
    private static instance;
    private _eventBus;
    private eventEmitter;
    private constructor();
    static getInstance(): EventBus;
    subscribe(topic: string, callback: any): void;
    publish(topic: string, ...args: any[]): void;
    unsubscribe(topic: string, callback: any): void;
}
