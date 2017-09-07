'use babel';
const uuidv4 = require('uuid/v4');
export class UIBaseComponent {
    constructor() {
        this.uiComponentId = uuidv4();
    }
    element() {
        return this.mainElement;
    }
    uiComponentID() {
        return this.uiComponentId;
    }
    destroy() {
        while (this.mainElement.hasChildNodes()) {
            this.mainElement.removeChild(this.mainElement.lastChild);
        }
        this.mainElement.remove();
        this.mainElement = undefined;
    }
}
//# sourceMappingURL=UIComponent.js.map