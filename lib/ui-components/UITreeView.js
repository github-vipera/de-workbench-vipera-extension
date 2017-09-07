'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { createText, createElement, insertElement } from '../element/index';
import { UIBaseComponent } from './UIComponent';
import { forEach, remove } from 'lodash';
export class UITreeView extends UIBaseComponent {
    constructor(model) {
        super();
        this.listeners = [];
        this.initUI();
        if (model) {
            this.setModel(model);
        }
    }
    initUI() {
        this.mainElement = createElement('div', {
            elements: [],
            className: 'de-workbench-treeview'
        });
    }
    setModel(model) {
        this.model = model;
        this.modelChanged();
    }
    modelChanged() {
        let oldTree = this.treeElement;
        this.treeElement = this.rebuildTree();
        if (oldTree) {
            this.mainElement.replaceChild(this.treeElement, oldTree);
        }
        else {
            insertElement(this.mainElement, this.treeElement);
        }
    }
    rebuildTree() {
        let rootItemEl = this.buildTreeItem(this.model.root);
        let ulMainTree = createElement('ul', {
            elements: [rootItemEl],
            className: 'list-tree has-collapsable-children focusable-panel'
        });
        return ulMainTree;
    }
    buildTreeItem(item) {
        let iconClass = "";
        if (item.icon) {
            iconClass = "icon " + item.icon;
        }
        // create item caption
        let treeItemCaption = createElement('span', {
            elements: [createText(item.name)],
            className: iconClass
        });
        let treeItemHeader = createElement('div', {
            elements: [treeItemCaption],
            className: 'header list-item'
        });
        treeItemHeader.setAttribute("treeitemId", item.id);
        treeItemHeader.setAttribute("id", "de-woekbench-treeview-treeitem-header-" + item.id);
        if (item.selected) {
            treeItemHeader.classList.add("selected");
        }
        treeItemHeader.addEventListener('click', (evt) => {
            this.onItemClicked(evt);
        });
        // create children
        let childCount = 0;
        let treeItemChildren = createElement('ol', {
            className: 'de-workbench-treeview-chidlren-list entries list-tree'
        });
        if (item.children) {
            childCount = item.children.length;
            for (var i = 0; i < item.children.length; i++) {
                let child = this.buildTreeItem(item.children[i]);
                insertElement(treeItemChildren, child);
            }
        }
        let listClassName = 'list-item';
        if (childCount > 0) {
            listClassName = 'list-nested-item';
        }
        if (!item.expanded) {
            listClassName += ' collapsed';
        }
        let treeItem = createElement('li', {
            className: 'de-woekbench-treeview-treeitem entry ' + listClassName,
            elements: [treeItemHeader, treeItemChildren]
        });
        treeItem.setAttribute("treeitemId", item.id);
        treeItem.setAttribute("id", this.buildItemElementId(item.id));
        return treeItem;
    }
    addSelectListener(listener) {
        this.listeners.push(listener);
    }
    removeSelectListener(listener) {
        remove(this.listeners, function (single) {
            return single == listener;
        });
    }
    onItemClicked(evt) {
        // Expand/Collapse if necessary
        let itemId = evt.currentTarget.attributes["treeitemId"].value;
        this.toggleTreeItemExpansion(itemId);
        // Select the item
        if (this.currentSelection) {
            // remove current selection
            this.selectItemById(this.currentSelection, false);
        }
        this.selectItemById(itemId, true);
        this.currentSelection = itemId;
        this.fireSelectionChange(this.currentSelection);
    }
    fireSelectionChange(itemId) {
        forEach(this.listeners, (single) => {
            let item = null;
            if (this.model.getItemById) {
                item = this.model.getItemById(itemId, this.model);
            }
            single.onItemSelected(itemId, item);
        });
    }
    getCurrentSelectedItemId() {
        return this.currentSelection;
    }
    selectItemById(id, select) {
        let el = this.mainElement.querySelector('#de-woekbench-treeview-treeitem-header-' + id);
        if (select) {
            el.classList.add("selected");
        }
        else {
            el.classList.remove("selected");
        }
    }
    buildItemElementId(id) {
        return "de-woekbench-treeview-treeitem-li-" + id;
    }
    expandItemById(id) {
        let el = this.getTreeItemById(id);
        el.classList.remove("collapsed");
    }
    collapseItemById(id) {
        let el = this.getTreeItemById(id);
        el.classList.add("collapsed");
    }
    toggleTreeItemExpansion(id) {
        let el = this.getTreeItemById(id);
        el.classList.toggle("collapsed");
    }
    getTreeItemById(id) {
        let itemElementId = this.buildItemElementId(id);
        return this.mainElement.querySelector("#" + itemElementId);
    }
    destroy() {
        this.model = undefined;
        this.listeners = null;
        if (this.treeElement) {
            this.treeElement.remove();
        }
        super.destroy();
    }
}
export function findItemInTreeModel(itemId, model) {
    function _findInTreeItem(item) {
        if (item.id == itemId) {
            return item;
        }
        if (!item.children) {
            return null;
        }
        for (let i = 0; i < item.children.length; i++) {
            let found = _findInTreeItem(item.children[i]);
            if (found) {
                return found;
            }
        }
    }
    return _findInTreeItem(model.root);
}
//# sourceMappingURL=UITreeView.js.map