'use babel';
import { UIStackedView } from '../../ui-components/UIStackedView';
import { UIBaseComponent } from '../../ui-components/UIComponent';
export class VariantsView extends UIBaseComponent {
    constructor() {
        super();
        this.buildUI();
    }
    buildUI() {
        this.stackedPage = new UIStackedView()
            .setTitle('Build Variants');
        this.mainElement = this.stackedPage.element();
        /**
        let root:UITreeItem = {
          id : 'root',
          name: 'root',
          expanded : true,
          icon: 'icon-file-directory',
          children: [
              { id: 'test', name: 'test', icon: 'test-ts-icon'},
              { id: 'test2', name: 'test 2', icon: 'icon-file-directory',
                children: [
                  { id: 'test6', name: 'test 6'},
                  { id: 'test7', name: 'test 7'}
                ]
              },
              { id: 'test3', name: 'test 3', icon: 'icon-file-directory',
                children : [
                  { id: 'test4', name: 'test 4'},
                  { id: 'test5', name: 'test 5'}
                ]
              },
          ]
        }
        this.treeModel = {
          root: root
        };
    
    
        let treeView = new UITreeView(this.treeModel);
        let div = createElement('div', { className: 'test-treeview-container'})
        insertElement(div, treeView.element())
        this.stackedPage.setInnerView(div)
    
        div.style.width = '400px';
        div.style.height = '400px';
        div.style.border = 'solid 1px white';
        **/
    }
}
//# sourceMappingURL=VariantsView.js.map