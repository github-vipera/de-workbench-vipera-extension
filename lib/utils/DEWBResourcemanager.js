'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
const fs = require('fs');
export class DEWBResourceManager {
    static getResourcePath(resourceName) {
        let packagePath = atom["packages"].getActivePackage('de-workbench-vipera-extension').path;
        return packagePath + "/resources/" + resourceName;
    }
    static getResourceContent(resourceName) {
        let path = DEWBResourceManager.getResourcePath(resourceName);
        return fs.readFileSync(path, "utf-8");
    }
    static getJSONResource(resourceName) {
        return JSON.parse(DEWBResourceManager.getResourceContent(resourceName));
    }
}
//# sourceMappingURL=DEWBResourceManager.js.map