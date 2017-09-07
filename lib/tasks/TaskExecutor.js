'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProjectManager } from '../DEWorkbench/ProjectManager';
export class TaskExecutor {
    constructor() {
        this.cordova = ProjectManager.getInstance().cordova;
    }
    executeTask(taskConfig, project) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isBusy()) {
                throw new Error("TaskExecutor is busy");
            }
            this.currentTask = taskConfig;
            try {
                switch (this.currentTask.taskType) {
                    case "prepare":
                        yield this.executePrepare(project);
                        this.currentTask = null;
                        break;
                    case "build":
                        yield this.executeBuild(project);
                        this.currentTask = null;
                        break;
                    case "run":
                        yield this.executeRun(project);
                        this.currentTask = null;
                    case "buildRun":
                        yield this.executeBuild(project);
                        // TODO publish progress
                        yield this.executeRun(project);
                        this.currentTask = null;
                        break;
                }
            }
            catch (err) {
                this.currentTask = null;
                throw err;
            }
        });
    }
    executeTaskChain(taskChain, project) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let task of taskChain) {
                yield this.executeTask(task, project);
            }
        });
    }
    isBusy() {
        return this.currentTask != null;
    }
    executeBuild(project) {
        return __awaiter(this, void 0, void 0, function* () {
            let platform = this.currentTask.selectedPlatform ? this.currentTask.selectedPlatform.name : null;
            return this.cordova.buildProject(project.path, platform, {});
        });
    }
    executeRun(project) {
        return __awaiter(this, void 0, void 0, function* () {
            let platform = this.currentTask.selectedPlatform ? this.currentTask.selectedPlatform.name : null;
            return this.cordova.runProject(project.path, platform, null, {});
        });
    }
    executePrepare(project) {
        return __awaiter(this, void 0, void 0, function* () {
            let platform = this.currentTask.selectedPlatform ? this.currentTask.selectedPlatform.name : null;
            //return this.cordova.prepareProjectWithBrowserPatch(project.path);
            return this.cordova.prepareProject(project.path, platform);
        });
    }
    stop() {
        this.cordova.stopExecutor();
    }
}
//# sourceMappingURL=TaskExecutor.js.map