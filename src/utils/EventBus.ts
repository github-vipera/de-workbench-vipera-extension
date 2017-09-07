'use babel'

/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */

import { EventEmitter }  from 'events'


export class EventBus {

    // Configuration events
    public static get EVT_CONFIG_CHANGED():string { return "dewb.vipext.configurationChanged"; }


    private static instance: EventBus;
    private _eventBus:any;
    private eventEmitter:EventEmitter;

    private constructor() {
      this.eventEmitter = new EventEmitter();
    }

    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public subscribe(topic:string, callback:Function){
      this.eventEmitter.on(topic,callback);
    }

    public publish(topic:string, ...args) {
      //this._eventBus.publish(topic, args)
      this.eventEmitter.emit(topic,args);
    }

    public unsubscribe(topic:string, callback:Function){
      this.eventEmitter.removeListener(topic, callback)
    }

}
