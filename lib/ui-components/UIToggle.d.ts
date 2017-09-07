export interface UIToggleOptions {
    caption: string;
    value?: boolean;
}
export declare class UIToggle {
    mainElement: HTMLElement;
    options: UIToggleOptions;
    lblCaption: HTMLElement;
    toggleInput: HTMLElement;
    constructor(options: UIToggleOptions);
    protected initUI(): void;
    readonly element: HTMLElement;
    value: boolean;
}
