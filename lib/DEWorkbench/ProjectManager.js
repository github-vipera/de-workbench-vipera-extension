'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { EventEmitter } from 'events';
import { Cordova } from '../cordova/Cordova';
import { Logger } from '../logger/Logger';
import { EventBus } from '../DEWorkbench/EventBus';
export class ProjectManager {
    constructor() {
        Logger.getInstance().debug("ProjectManager initializing...");
        this.events = new EventEmitter();
        // create Cordova utilities
        this.cordova = new Cordova();
        // By default use the first project root
        this.currentProjectPath = this.getFirstAvailableProjectRootFolder();
        if (this.currentProjectPath) {
            this.fireProjectChanged(this.currentProjectPath);
        }
        // Listen for ATOM projects
        //atom.workspace["onDidChangeActiveTextEditor"](() => this.fireEditorChanged());
        atom.workspace["onDidChangeActivePaneItem"](() => this.fireEditorChanged());
        atom.workspace["onDidOpen"](() => this.fireEditorChanged());
        atom.project["onDidChangePaths"](() => this.firePathChanged());
    }
    static getInstance() {
        if (!ProjectManager.instance) {
            ProjectManager.instance = new ProjectManager();
        }
        return ProjectManager.instance;
    }
    firePathChanged() {
        this.events.emit('didPathChanged');
        console.log("PathChanges");
        let ok = this.fireEditorChanged();
        if (!ok) {
            this.currentProjectPath = this.getFirstAvailableProjectRootFolder();
            if (this.currentProjectPath) {
                this.fireProjectChanged(this.currentProjectPath);
            }
        }
    }
    getFirstAvailableProjectRootFolder() {
        let currentPaths = atom.project["getPaths"]();
        if (currentPaths && currentPaths.length > 0) {
            return atom.project["getPaths"]()[0];
        }
        return undefined;
    }
    getAllAvailableProjects() {
        let currentPaths = atom.project["getPaths"]();
        if (currentPaths) {
            return currentPaths;
        }
        else {
            return [];
        }
    }
    /**
     * Return true if an editore opened and selected is available
     */
    fireEditorChanged() {
        var editor = atom.workspace.getActiveTextEditor();
        if (editor) {
            var yourPath = editor["getPath"]();
            let projects = atom.project['getPaths']();
            if (projects == undefined || projects.length == 0) {
                return false;
            }
            let i = 0;
            let currentProjectPath;
            for (i = 0; i < projects.length; i++) {
                if (yourPath && yourPath.indexOf(projects[i]) == 0) {
                    currentProjectPath = projects[i];
                    if (!this.currentProjectPath || currentProjectPath != this.currentProjectPath) {
                        this.fireProjectChanged(currentProjectPath);
                    }
                    break;
                }
            }
            return true;
        }
        return false;
    }
    fireProjectChanged(projectPath) {
        this.currentProjectPath = projectPath;
        //console.log("Project changed: ", projectPath);
        this.events.emit('didProjectChanged', projectPath);
    }
    didProjectChanged(callback) {
        this.events.on('didProjectChanged', callback);
        EventBus.getInstance().publish(EventBus.EVT_PROJECT_CHANGED, this.currentProjectPath);
    }
    didPathChanged(callback) {
        this.events.on('didPathChanged', callback);
        EventBus.getInstance().publish(EventBus.EVT_PATH_CHANGED, this.currentProjectPath);
    }
    getCurrentProjectPath() {
        return this.currentProjectPath;
    }
}
//# sourceMappingURL=ProjectManager.js.map