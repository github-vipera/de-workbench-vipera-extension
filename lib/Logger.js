'use babel';
const util = require('util');
export class LoggerService {
    static setLogger(logger) {
        console.log("Set logger");
        this.logger = logger;
    }
    static info(msg) {
        if (this.logger) {
            this.logger.info(msg);
        }
    }
    static debug(msg) {
        if (this.logger) {
            this.logger.debug(msg);
        }
    }
    static warn(msg) {
        if (this.logger) {
            this.logger.warn(msg);
        }
    }
    static error(msg) {
        if (this.logger) {
            this.logger.error(msg);
        }
    }
    static perfLog(msg) {
        console.log(msg + " [" + performance.now() + "]");
    }
}
export class DefaultTransport {
    formatMsg(args) {
        return util.format(args);
    }
    constructor() {
        console.log("Constructor!!");
    }
    trace(message, ...optionalParams) {
    }
    debug(message, ...optionalParams) {
    }
    info(message, ...optionalParams) {
        let msg = "";
        if (typeof (message) == "string" && message.indexOf('%') >= 0) {
            msg = util.format(message, optionalParams);
        }
        else {
            msg = typeof (message) === "object" ? JSON.stringify(message) : message.toString();
            optionalParams.forEach((value) => {
                msg += "  " + (typeof (value) === "object" ? JSON.stringify(value) : value.toString());
            });
        }
        LoggerService.info(msg);
    }
    warn(message, ...optionalParams) {
    }
    error(message, ...optionalParams) {
    }
}
//# sourceMappingURL=Logger.js.map