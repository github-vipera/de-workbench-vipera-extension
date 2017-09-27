/// <reference types="node" />
import { EventEmitter } from 'events';
export interface UIToggleOptions {
    caption: string;
    value?: boolean;
}
export declare class UIToggle {
    mainElement: HTMLElement;
    options: UIToggleOptions;
    lblCaption: HTMLElement;
    toggleInput: HTMLElement;
    events: EventEmitter;
    constructor(options: UIToggleOptions);
    protected initUI(): void;
    readonly element: HTMLElement;
    value: boolean;
    private fireValueChange(value);
    onDidValueChange(listener: any): void;
    addEventListener(event: string, listener: any): void;
    removeEventListener(event: string, listener: any): void;
}
