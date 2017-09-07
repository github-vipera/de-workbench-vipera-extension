'use babel';
import { insertElement, createModalActionButtons } from '../../element/index';
import { UIModalView } from '../../ui-components/UIModalView';
import { UIButtonGroup, UIButtonGroupMode, UIButtonConfig } from '../../ui-components/UIButtonGroup';
import { TaskViewPanel } from './TaskViewPanel';
export class TaskConfigView extends UIModalView {
    constructor(title, events) {
        super(title);
        this.events = events;
    }
    addFooter() {
        let actionButtons = new UIButtonGroup(UIButtonGroupMode.Standard)
            .addButton(new UIButtonConfig()
            .setId('cancel')
            .setCaption('Cancel')
            .setClickListener(() => {
            this.close();
        }))
            .addButton(new UIButtonConfig()
            .setId('run')
            .setButtonType('success')
            .setCaption('Run')
            .setClickListener(() => {
            let taskConfig = this.taskPanel.getConfiguration();
            this.events.emit("didRunTask", taskConfig);
            this.close();
        }));
        let modalActionButtons = createModalActionButtons(actionButtons.element());
        insertElement(this.modalContainer, modalActionButtons);
    }
    close() {
        super.hide();
        this.destroy();
    }
    addContent() {
        this.taskPanel = new TaskViewPanel();
        insertElement(this.modalContainer, this.taskPanel.element());
    }
    setProject(project) {
        this.taskPanel.setProject(project);
    }
}
//# sourceMappingURL=TastConfigView.js.map