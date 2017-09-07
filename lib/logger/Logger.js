'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
var winston = require('winston');
import { EventSupport } from '../utils/EventSupport';
export class Logger {
    constructor() {
        this.logger = new (winston.Logger)({
            transports: [
                new winston.transports.File({
                    level: 'verbose',
                    filename: '/Users/enrico/Develop/NewDynamicEngine/Atom Plugins/de-workbench/all-logs.log',
                    handleExceptions: true,
                    json: true,
                    maxsize: 5242880,
                    maxFiles: 5,
                    colorize: false
                }),
                new winston.transports.Console({
                    level: 'verbose',
                    handleExceptions: true,
                    json: false,
                    colorize: true
                })
            ]
        });
        this.evtSupport = new EventSupport();
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    info(...msg) {
        this.fireLogEvent(LogLevel.INFO, msg);
        this.logger.info(msg);
    }
    debug(...msg) {
        this.fireLogEvent(LogLevel.DEBUG, msg);
        this.logger.debug(msg);
    }
    warn(...msg) {
        this.fireLogEvent(LogLevel.WARN, msg);
        this.logger.warn(msg);
    }
    error(...msg) {
        this.fireLogEvent(LogLevel.ERROR, msg);
        this.logger.error(msg);
    }
    fireLogEvent(level, ...msg) {
        this.evtSupport.fireEvent('logging', level, msg.join(' , '));
    }
    addLoggingListener(listener) {
        //this.logger.on('logging',listener.onLogging.bind(listener));
        //this.logger.on('logging',listener.onLogging.bind(listener));
        this.evtSupport.addEventListener((event, data) => {
            listener.onLogging(data[0], data[1]);
        });
    }
}
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=Logger.js.map