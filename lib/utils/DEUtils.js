'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoggerService } from '../Logger';
import { WorkbenchServices } from '../WorkbenchServices';
export class DEUtils {
    static checkForDECli() {
        return __awaiter(this, void 0, void 0, function* () {
            LoggerService.debug("Checking for DE cli");
            try {
                let execService = WorkbenchServices.ExecutorService;
                let x = yield execService.runExec('.', 'de-cli');
                return true;
            }
            catch (ex) {
                LoggerService.error("Check for DE CLI error: " + ex);
                return false;
            }
        });
    }
    static installDECli() {
        return __awaiter(this, void 0, void 0, function* () {
            LoggerService.info("Installing the DE CLI...");
            try {
                let execService = WorkbenchServices.ExecutorService;
                let x = yield execService.runExec('.', 'npm install -g vipera-de-cli');
                LoggerService.info("DE CLI installed successfully.");
                return true;
            }
            catch (ex) {
                console.log("installDECli error: ", ex);
                LoggerService.error("DE CLI installation failure: " + ex);
                return false;
            }
        });
    }
}
//# sourceMappingURL=DEUtils.js.map