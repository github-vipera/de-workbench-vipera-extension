/// <reference types="node" />
import { EventEmitter } from 'events';
import { MotifServerConfig } from './MOTIFMockServerCommons';
import { UIInput } from '../ui-components/UIInput';
import { UIToggle } from '../ui-components/UIToggle';
export declare class MOTIFServerConfigUI {
    events: EventEmitter;
    mainElement: HTMLElement;
    protected txtServerPort: UIInput;
    protected txtMockModulePath: UIInput;
    protected txtLibraryLoaderPath: UIInput;
    protected txtLocalDbPath: UIInput;
    protected mockEnabled: UIToggle;
    protected liveReloadEnabled: UIToggle;
    constructor();
    protected initUI(): void;
    protected fireConfigChanged(): void;
    updateUI(config: MotifServerConfig): void;
    addEventListener(event: string, listener: any): void;
    removeEventListener(event: string, listener: any): void;
    getConfiguration(): MotifServerConfig;
    portNumber: number;
    mockModulePath: string;
    libraryLoaderPath: string;
    localDBPath: string;
    isMockEnabled: boolean;
    liveReload: boolean;
}
