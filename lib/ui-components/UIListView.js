'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement, insertElement } from '../element/index';
import { UIBaseComponent } from './UIComponent';
export class UIListView extends UIBaseComponent {
    constructor(model) {
        super();
        if (model) {
            this.setModel(model);
        }
    }
    setModel(model) {
        this.model = model;
        this.buildUI();
    }
    buildUI() {
        let listViewClass = "de-workbench-listview";
        let customClass = this.model.getClassName();
        if (customClass) {
            listViewClass += " " + customClass;
        }
        this.tableElement = this.createTableElement();
        this.mainElement = createElement('div', {
            elements: [
                this.tableElement
            ],
            className: listViewClass
        });
        this.mainElement.id = this.uiComponentId;
    }
    createTableElement() {
        let table = createElement('table', {
            className: "de-workbench-listview-tb"
        });
        // create header if required
        if (this.model.hasHeader()) {
            let tbRow = createElement('tr');
            for (var c = 0; c < this.model.getColCount(); c++) {
                let tbCol = createElement('th', {
                    elements: [
                        createText(this.model.getColumnName(c))
                    ]
                });
                insertElement(tbRow, tbCol);
            }
            insertElement(table, tbRow);
        }
        // create rows
        for (var r = 0; r < this.model.getRowCount(); r++) {
            let tbRow = createElement('tr');
            for (var c = 0; c < this.model.getColCount(); c++) {
                let innerElement = undefined;
                if (typeof this.model.getElementAt == "function") {
                    innerElement = this.model.getElementAt(r, c);
                }
                else {
                    innerElement = createText(this.model.getValueAt(r, c));
                }
                let tbCol = createElement('td', {
                    elements: [
                        innerElement
                    ]
                });
                insertElement(tbRow, tbCol);
            }
            insertElement(table, tbRow);
        }
        return table;
    }
    modelChanged() {
        let oldTable = this.tableElement;
        this.tableElement = this.createTableElement();
        this.mainElement.replaceChild(this.tableElement, oldTable);
    }
}
//# sourceMappingURL=UIListView.js.map