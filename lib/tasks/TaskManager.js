'use babel';
import { CordovaTaskConfiguration } from '../cordova/CordovaTasks';
export class TaskManager {
    constructor() {
        this.defaultTasks = null;
        console.log("Create TaskManager");
    }
    static getInstance() {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }
    getDefaultTask() {
        if (this.defaultTasks == null) {
            this.defaultTasks = this.createDefaultTasks();
        }
        return this.defaultTasks;
    }
    createDefaultTasks() {
        let cdvPrepare = new CordovaTaskConfiguration('CordovaPrepare', 'prepare');
        cdvPrepare.displayName = 'Prepare';
        cdvPrepare.constraints = {
            isDeviceEnabled: false,
            isMockConfigEnabled: false,
            isEnvVarEnabled: true,
            isNodeTaskEnabled: true
        };
        let cdvBuild = new CordovaTaskConfiguration('CordovaBuid', 'build');
        cdvBuild.displayName = 'Build';
        cdvBuild.constraints = {
            isDeviceEnabled: false,
            isMockConfigEnabled: false,
            isEnvVarEnabled: true,
            isNodeTaskEnabled: true
        };
        let cdvRun = new CordovaTaskConfiguration('CordovaRun', 'run');
        cdvRun.displayName = 'Run';
        cdvRun.constraints = {
            isDeviceEnabled: true,
            isMockConfigEnabled: false,
            isEnvVarEnabled: true,
            isNodeTaskEnabled: true
        };
        let cdvBuildAndRun = new CordovaTaskConfiguration('CordovaBuidRun', 'buildRun');
        cdvBuildAndRun.displayName = 'Build & Run';
        cdvBuildAndRun.constraints = {
            isDeviceEnabled: true,
            isMockConfigEnabled: false,
            isEnvVarEnabled: true,
            isNodeTaskEnabled: true
        };
        let tasks = [cdvPrepare, cdvBuild, cdvRun, cdvBuildAndRun];
        return tasks;
    }
}
//# sourceMappingURL=TaskManager.js.map