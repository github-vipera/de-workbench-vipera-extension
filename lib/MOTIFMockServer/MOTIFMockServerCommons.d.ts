export interface LoggerTransport {
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}
export declare class MotifServerConfig {
    port: number;
    isMockEnabled: boolean;
    mockModulePath: string;
    libraryLoaderPath: string;
    localDBPath: string;
    liveReload: boolean;
    serverUrl?: string;
    loggerTransport?: LoggerTransport;
}
