export declare class LoggerService {
    private static logger;
    static setLogger(logger: any): void;
    static info(...msg: any[]): void;
    static debug(...msg: any[]): void;
    static warn(...msg: any[]): void;
    static error(...msg: any[]): void;
}
