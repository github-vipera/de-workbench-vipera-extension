import { UIBaseComponent } from './UIComponent';
export interface UIListViewModel {
    hasHeader(): boolean;
    getRowCount(): number;
    getColCount(): number;
    getElementAt?(row: number, col: number): HTMLElement;
    getValueAt(row: number, col: number): any;
    getClassNameAt(row: number, col: number): string;
    getColumnName(col: number): string;
    getClassName(): string;
}
export declare class UIListView extends UIBaseComponent {
    private model;
    private tableElement;
    constructor(model: UIListViewModel);
    setModel(model: UIListViewModel): void;
    protected buildUI(): void;
    protected createTableElement(): HTMLElement;
    modelChanged(): void;
}
