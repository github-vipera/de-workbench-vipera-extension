import { Cordova } from '../cordova/Cordova';
export declare class ProjectManager {
    private static instance;
    private currentProjectPath;
    private events;
    cordova: Cordova;
    private constructor();
    static getInstance(): ProjectManager;
    private firePathChanged();
    getFirstAvailableProjectRootFolder(): any;
    getAllAvailableProjects(): Array<any>;
    /**
     * Return true if an editore opened and selected is available
     */
    private fireEditorChanged();
    private fireProjectChanged(projectPath);
    didProjectChanged(callback: Function): void;
    didPathChanged(callback: Function): void;
    getCurrentProjectPath(): string;
}
