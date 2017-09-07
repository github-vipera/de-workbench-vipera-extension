'use babel';
import { createText, createElement, insertElement, createButton } from '../element/index';
import { UIBaseComponent } from './UIComponent';
import { UISelect } from './UISelect';
import { UISelectButton } from './UISelectButton';
import { ProjectManager } from '../DEWorkbench/ProjectManager';
import * as _ from 'lodash';
import * as path from 'path';
export class UIRunSelectorComponent extends UIBaseComponent {
    constructor(events) {
        super();
        this.projectSelector = null;
        this.taskSelector = null;
        this.taskSelectorText = null;
        this.events = events;
        this.projectSelectListener = {
            onItemSelected: (selection) => {
                this.onSelectProject(selection);
            }
        };
        this.initUI();
        this.subscribeEvents();
    }
    initUI() {
        this.mainElement = createElement('div', {
            className: "de-workbench-uiruncomponent-container"
        });
        let projects = this.getAllAvailableProjects();
        this.projectSelector = this.createProjectSelector(projects);
        this.projectSelector.addSelectListener(this.projectSelectListener);
        this.selectButton = new UISelectButton(this.projectSelector, "Select Project", { withArrow: true, rightIcon: 'arrow-down' });
        insertElement(this.mainElement, this.selectButton.element());
        this.addTaskSelectorButton();
        //this.addStatusIndicator();
        this.taskSelector.addEventListener('click', this.onTaskSelectClick.bind(this));
    }
    addTaskSelectorButton() {
        let tasks = []; //TODO
        this.taskSelectorText = createText("...");
        this.taskSelector = createButton({
            className: "task-btn"
        }, [
            this.taskSelectorText
        ]);
        insertElement(this.mainElement, this.taskSelector);
    }
    /*addStatusIndicator():void {
      let statusContainer = new UIStatusIndicatorComponent("No task in progress");
      insertElement(this.mainElement,statusContainer.element());
    }*/
    subscribeEvents() {
        ProjectManager.getInstance().didPathChanged(this.reloadProjectList.bind(this));
    }
    reloadProjectList() {
        console.log("reloadProjectList");
        let projects = this.getAllAvailableProjects();
        let items = this.createProjectSelectOptions(projects);
        let selected = this.projectSelector.getSelectedItem();
        this.projectSelector.setItems(items);
        let reloadSelection = (!selected || selected != this.projectSelector.getSelectedItem()) ? true : false;
        if (reloadSelection) {
            this.selectButton.setSelectedItem(items[0].value);
            this.onSelectProject(items[0].value);
        }
    }
    getAllAvailableProjects() {
        return ProjectManager.getInstance().getAllAvailableProjects();
    }
    createProjectSelector(projects) {
        let options = this.createProjectSelectOptions(projects);
        console.log("OPTIONS:", options);
        return new UISelect(options);
    }
    createProjectSelectOptions(projects) {
        let options = [];
        if (!projects || projects.length == 0) {
            options.push({
                name: 'No projects',
                value: ''
            });
            return options;
        }
        _.forEach(projects, (item) => {
            options.push({
                name: path.basename(item),
                value: item
            });
        });
        return options;
    }
    onTaskSelectClick() {
        console.log("onTaskSelectClick");
        this.events.emit('didSelectTaskClick');
    }
    onSelectProject(path) {
        console.log("onSelectProject", path);
        setTimeout(() => {
            ProjectManager.getInstance().cordova.getProjectInfo(path).then((info) => {
                console.log(info);
                this.events.emit('didSelectProjectForRun', info);
            }, (reason) => {
                console.error(reason);
            }).catch((err) => {
                console.error(err);
            });
        });
    }
    updateTaskText(taskInfo) {
        this.taskSelectorText.textContent = taskInfo == null ? '...' : taskInfo.name;
    }
    setTaskConfiguration(taskInfo) {
        this.taskInfo = taskInfo;
        this.updateTaskText(taskInfo);
    }
    getTaskConfiguration() {
        return this.taskInfo;
    }
    destroy() {
        this.taskSelector.removeEventListener('click', this.onTaskSelectClick.bind(this));
        this.projectSelector.removeSelectListener(this.projectSelectListener);
        this.selectButton.destroy();
        this.element().remove();
    }
}
//# sourceMappingURL=UIRunSelectorComponent.js.map