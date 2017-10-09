'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*!
 * Dynamic Engine Workbench
 * Copyright(c) 2017 Dynamic Engine Team @ Vipera Plc
 * MIT Licensed
 */
const { CompositeDisposable } = require('atom');
import { LoggerService } from './Logger';
import { DEPluginsProviderFactory } from './pluginsProvider/DEPluginsProviderFactory';
import { WorkbenchServices } from './WorkbenchServices';
import { MotifMockServerProvider } from './MOTIFMockServer/MOTIFMockServer';
import { DEUtils } from './utils/DEUtils';
import { UINotifications } from './ui-components/UINotifications';
export default {
    subcriptions: null,
    config: {
        ViperaNPMRegistry: {
            title: 'Vipera NPM Registry',
            description: 'Vipera NPM Registry',
            type: 'string',
            default: "https://npm-proxy.fury.io/Mr43aEGkxz47vyf7VZ_y/vipera-npm-registry/"
        }
    },
    activate(state) {
        console.log("DEWBEXT activated.");
        this.deferredActivation();
    },
    deferredActivation() {
        console.log("DEWBEXT deferredActivation.");
        require('atom-package-deps').install('de-wb-vipera-extension', false).then(function (res) {
            console.log("Dep packages installed.");
        });
        // add commands
        let commands = atom.commands.add('atom-workspace', {
            'dewb-ext-menu-view-:install-de-cli': () => this.installDECli(),
            'dewb-ext-menu-view-:check-de-cli': () => this.checkForDECli()
        });
        this.subscriptions = new CompositeDisposable();
        // add commands subs
        this.subscriptions.add(commands);
    },
    deactivate() {
        console.log('DEWBEXT deactivated.');
    },
    fooAction() {
        alert('Foo action');
    },
    consumeCordovaPluginsProvider: function (dewebCordovaPluginsProviderManager) {
        console.log("Consuming DE WB plugin manager...");
        WorkbenchServices.CordovaPluginsProviderManager = dewebCordovaPluginsProviderManager;
        WorkbenchServices.CordovaPluginsProviderManager.registerProviderFactory(DEPluginsProviderFactory.getInstance());
        console.log("Consuming DE WB plugin manager...END");
    },
    consumeLogger: function (logger) {
        console.log("Consuming DE WB Logger!!");
        WorkbenchServices.Logger = logger;
        LoggerService.setLogger(logger);
        console.log("Consuming DE WB Logger END!");
    },
    consumeProjectManager: function (projectManager) {
        console.log("Consuming DE WB Project Manager!!");
        WorkbenchServices.ProjectManager = projectManager;
        console.log("Consuming DE WB Project Manager END!");
    },
    consumeEvents: function (eventBus) {
        console.log("Consuming DE WB Event Bus!!");
        WorkbenchServices.Events = eventBus;
        console.log("Consuming DE WB Event Bus END!");
    },
    consumeServerManager: function (serverManager) {
        console.log("Consuming DE WB Server Manager!!");
        WorkbenchServices.ServerManager = serverManager;
        WorkbenchServices.ServerManager.registerProvider(new MotifMockServerProvider);
        console.log("Consuming DE WB Server Manager END!");
    },
    consumeExecutorService: function (executorService) {
        console.log("Consuming DE WB Executor Service!!");
        WorkbenchServices.ExecutorService = executorService;
        console.log("Consuming DE WB Executor Service END!");
        if (this.needDECLICheck()) {
            this.checkForDECli();
        }
    },
    installDECli() {
        return __awaiter(this, void 0, void 0, function* () {
            let installRunningNotification = UINotifications.showInfo("Installing DE CLI...", { dismissable: true });
            let ok = yield DEUtils.installDECli();
            if (ok) {
                installRunningNotification.dismiss();
                UINotifications.showSuccess("DE CLI installed successfully.");
            }
            else {
                installRunningNotification.dismiss();
                UINotifications.showError("Error installing the DE CLI. See the log for more details.");
            }
        });
    },
    checkForDECli() {
        return __awaiter(this, void 0, void 0, function* () {
            let deCliOK = yield DEUtils.checkForDECli();
            atom.config["set"]('de-workbench-vipera-extension.DECCLICheck', false);
            if (!deCliOK) {
                let notification = UINotifications.showInfo("DE CLI Not Installed.", {
                    dismissable: true,
                    buttons: [
                        {
                            text: 'Do Install',
                            onDidClick: () => {
                                notification.dismiss();
                                this.installDECli();
                            }
                        },
                        {
                            text: 'Cancel',
                            onDidClick: () => {
                                notification.dismiss();
                            }
                        }
                    ],
                    detail: "La DE CLI non sembra essere installata. Vuoi procedere ora con l'installazione?"
                });
            }
        });
    },
    needDECLICheck() {
        return atom.config.get('de-workbench-vipera-extension.DECCLICheck');
    }
};
//# sourceMappingURL=main.js.map