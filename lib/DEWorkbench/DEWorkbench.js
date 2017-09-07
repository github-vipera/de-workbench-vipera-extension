'use babel';
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
import { ToolbarView } from '../toolbar/ToolbarView';
import { NewProjectView } from '../views/NewProject/NewProjectView';
import { EventEmitter } from 'events';
const { CompositeDisposable } = require('atom');
import { DebugAreaView } from '../views/DebugAreaView';
import { ProjectManager } from '../DEWorkbench/ProjectManager';
import { Logger } from '../logger/Logger';
import { ProjectSettingsView } from '../views/ProjectSettings/ProjectSettingsView';
import { LoggerView } from '../views/LoggerView';
import { TaskConfigView } from '../views/TaskConfig/TastConfigView';
import { TaskExecutor } from '../tasks/TaskExecutor';
import { attachEventFromObject } from '../element/index';
export class DEWorkbench {
    constructor(options) {
        Logger.getInstance().info("Initializing DEWorkbench...");
        //let cu = new CordovaUtils();
        this.projectManager = ProjectManager.getInstance();
        this.events = new EventEmitter();
        // Create the main toolbar
        this.toolbarView = new ToolbarView({
            didNewProject: () => {
                this.showNewProjectModal();
            },
            didToggleToolbar: () => {
                this.toggleToolbar();
            },
            didToggleDebugArea: () => {
                this.toggleDebugArea();
            },
            didProjectSettings: () => {
                this.showProjectSettings();
            },
            didToggleConsole: () => {
                this.toggleLogger();
            },
            didSelectProjectForRun: (projectInfo) => {
                console.log("didSelectProjectForRun", projectInfo);
                this.selectedProjectForTask = projectInfo;
            },
            didSelectTaskClick: () => {
                console.log("didSelectTaskClick");
                this.showCordovaTaskModal();
            },
            didStop: () => {
                this.onStopTask();
            },
            didRun: () => {
                this.onTaskRunRequired(this.taskConfiguration);
            }
        });
        // Create the Logger inspector
        //this.loggerView = new LoggerView();
        //this.debugAreaView = new DebugAreaView();
        attachEventFromObject(this.events, [
            'didToggleToolbar'
        ], options);
        ProjectManager.getInstance().didProjectChanged((projectPath) => this.onProjectChanged(projectPath));
        //this.events.on('didStop',this.onStopTask.bind(this));
        this.events.on('didRunTask', this.onTaskRunRequired.bind(this));
        Logger.getInstance().info("DEWorkbench initialized successfully.");
    }
    showNewProjectModal() {
        // Create the New Project modal window
        let newProjectView = new NewProjectView();
        newProjectView.open();
    }
    onProjectChanged(projectPath) {
        Logger.getInstance().debug("DEWorkbench onProjectChanged: ", projectPath);
    }
    openProjectInspector() {
    }
    openDebugArea() {
        if (!this.debugAreaView) {
            this.debugAreaView = new DebugAreaView();
        }
        this.debugAreaView.open();
    }
    openLogger() {
        if (!this.loggerView) {
            this.loggerView = new LoggerView();
        }
        this.loggerView.open();
    }
    showProjectSettings() {
        Logger.getInstance().debug("DEWorkbench showProjectSettings called");
        let currentprojectPath = this.projectManager.getCurrentProjectPath();
        if (currentprojectPath) {
            let projectSettingsView = new ProjectSettingsView(currentprojectPath);
            projectSettingsView.open();
        }
    }
    toggleToolbar() {
        this.toolbarView.toggle();
    }
    toggleDebugArea() {
        Logger.getInstance().debug("DEWorkbench toggleDebugArea called");
        this.events.emit('didToggleDebugArea');
        this.openDebugArea();
    }
    toggleLogger() {
        Logger.getInstance().debug("DEWorkbench toggleLogger called");
        this.events.emit('didToggleLogger');
        this.openLogger();
    }
    getToolbarElement() {
        return this.toolbarView.getElement();
    }
    showCordovaTaskModal() {
        console.log("showCordovaTaskModal");
        if (this.selectedProjectForTask == null) {
            Logger.getInstance().warn("select project before run task");
            return;
        }
        let taskConfigView = new TaskConfigView("Task Configuration", this.events);
        taskConfigView.setProject(this.selectedProjectForTask);
        taskConfigView.show();
    }
    onTaskRunRequired(taskConfiguration) {
        console.log("onTaskRunRequired", taskConfiguration);
        this.taskConfiguration = taskConfiguration;
        if (!taskConfiguration) {
            Logger.getInstance().warn("Null task selected");
            this.toolbarView.setTaskConfiguration(null);
            return;
        }
        Logger.getInstance().info("Require execute of task", taskConfiguration.name, this.selectedProjectForTask);
        this.toolbarView.setTaskConfiguration(taskConfiguration);
        let project = this.selectedProjectForTask;
        let platform = taskConfiguration.selectedPlatform ? taskConfiguration.selectedPlatform.name : "";
        this.toolbarView.setInProgressStatus(`${taskConfiguration.displayName} - ${platform}  in progress...`);
        this.getTaskExecutor().executeTask(taskConfiguration, project).then(() => {
            this.toolbarView.setSuccessStatus(`${taskConfiguration.displayName} - ${platform} Done`);
        }, (reason) => {
            this.toolbarView.setErrorStatus(`${taskConfiguration.displayName} - ${platform} Fail`);
            Logger.getInstance().error(reason);
        }).catch((err) => {
            this.toolbarView.setErrorStatus(`${taskConfiguration.displayName} - ${platform} Fail`);
            Logger.getInstance().error(err.message, err.stack);
        });
    }
    onStopTask() {
        console.log("onStopTask");
        if (this.taskExecutor && this.taskExecutor.isBusy()) {
            this.taskExecutor.stop();
        }
    }
    getTaskExecutor() {
        if (!this.taskExecutor) {
            this.taskExecutor = new TaskExecutor();
        }
        return this.taskExecutor;
    }
    destroy() {
        // destroy all
        Logger.getInstance().info("DEWorkbench destroying...");
    }
}
//# sourceMappingURL=DEWorkbench.js.map