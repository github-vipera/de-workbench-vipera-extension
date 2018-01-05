export declare class LoggerService {
    private static logger;
    static setLogger(logger: any): void;
    static info(msg: string): void;
    static debug(msg: string): void;
    static warn(msg: string): void;
    static error(msg: string): void;
}
export declare class DefaultTransport {
    private formatMsg(args);
    constructor();
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}
