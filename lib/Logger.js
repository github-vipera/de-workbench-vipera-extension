'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
export class LoggerService {
    static setLogger(logger) {
        this.logger = logger;
    }
    static info(...msg) {
        if (this.logger) {
            this.logger.info(msg);
        }
    }
    static debug(...msg) {
        if (this.logger) {
            this.logger.debug(msg);
        }
    }
    static warn(...msg) {
        if (this.logger) {
            this.logger.warn(msg);
        }
    }
    static error(...msg) {
        if (this.logger) {
            this.logger.error(msg);
        }
    }
}
//# sourceMappingURL=Logger.js.map