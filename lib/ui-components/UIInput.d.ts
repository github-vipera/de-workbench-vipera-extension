export interface UIInputOptions {
    caption?: string;
    placeholder?: string;
    value?: string;
    browseFor?: string;
}
export declare class UIInput {
    mainElement: HTMLElement;
    txtInput: HTMLElement;
    lblCaption: HTMLElement;
    options: UIInputOptions;
    actionButton: HTMLElement;
    constructor(options?: UIInputOptions);
    protected initUI(): void;
    protected createActionButtonFor(action: string): HTMLElement;
    protected createActionButtonForFolder(): HTMLElement;
    protected createActionButtonForFile(): HTMLElement;
    protected createActionButton(caption: string): HTMLElement;
    protected chooseFolder(): void;
    protected chooseFile(): void;
    readonly element: HTMLElement;
    value: string;
}
