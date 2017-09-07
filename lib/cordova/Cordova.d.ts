export declare class CordovaPlatform {
    name: string;
    version?: string;
    virtualRun?: boolean;
}
export declare class CordovaPlugin {
    name: string;
    id: string;
    version: string;
    description: string;
    isTopLevel: boolean;
    info: any;
    installed: boolean;
    author: string;
    homepage: string;
    license: string;
    repository: string;
    repositoryType: string;
    sourceType: string;
    lastUpdateTime: string;
    rating: number;
    platforms: Array<string>;
}
export interface NewProjectInfo {
    name: string;
    packageId: string;
    basePath: string;
    path: string;
    platforms: Array<string>;
    type: string;
    template: string;
}
export interface CordovaProjectInfo {
    path: string;
    name: string;
    displayName: string;
    description: string;
    author: string;
    license: string;
    version: string;
    platforms: Array<CordovaPlatform>;
    variants: Array<string>;
    projectSettings?: any;
    plugins?: Array<CordovaPlugin>;
    npmScripts?: Array<string>;
}
export declare class Cordova {
    private cordovaUtils;
    private sharedExecutor;
    constructor();
    isCordovaProject(projectRoot: string): Promise<boolean>;
    isCordovaProjectSync(projectRoot: string): boolean;
    /**
     * Returns a list of installed platforms for a Cordova Project
     */
    getInstalledPlatforms(projectRoot: string): Promise<Array<CordovaPlatform>>;
    /**
     * Returns a list of installed platforms for a Cordova Project in a sync way
     */
    getInstalledPlatformsSync(projectRoot: string): Array<CordovaPlatform>;
    addPlatform(projectRoot: string, platformName: string): Promise<void>;
    removePlatform(projectRoot: string, platformName: string): Promise<void>;
    addPlugin(projectRoot: string, pluginInfo: CordovaPlugin): Promise<void>;
    removePlugin(projectRoot: string, pluginInfo: CordovaPlugin): Promise<void>;
    /**
     * Returns a list of installed plugins for a Cordova Project
     */
    getInstalledPlugins(projectRoot: string): Promise<Array<CordovaPlugin>>;
    /**
     * Returns the assets path for the given platform
     */
    getPlatformPath(projectRoot: string, platform: string): string;
    /**
     * Creates a new Cordova project with the given parameters
     */
    createNewProject(projectInfo: NewProjectInfo): Promise<any>;
    /**
     * Creates a new Cordova project with the given parameters
     */
    removeAllPlatforms(projectInfo: any): Promise<any>;
    /**
     * Adds platforms to a project
     */
    addPlatforms(projectInfo: any): Promise<any>;
    /**
     * Removes platforms from project
     **/
    removePlatforms(projectRoot: string, platformList: Array<String>): Promise<any>;
    private rejectForBusySharedExecutor();
    /**
     * Runs build command fot the given Cordova project
     */
    buildProject(projectRoot: string, platform: string, options: any): Promise<any>;
    /**
     * Clean the given Cordova project
     */
    cleanProject(projectRoot: string, platform: string): Promise<any>;
    isBusy(): boolean;
    /**
     * Prepare the given Cordova project
     */
    prepareProject(projectRoot: string, platform: string): Promise<any>;
    prepareProjectWithBrowserPatch(projectRoot: string): Promise<any>;
    runProject(projectRoot: string, platform: string, target: string, options: any): Promise<any>;
    getPackageJson(projectRoot: string): any;
    storePackageJson(projectRoot: string, packageJson: Object): void;
    stopExecutor(): void;
    /**
    public getProjectInfo(projectRoot:string):Promise<any> {
      return new Promise((resolve, reject) => {
        let jsonPath = path.join(projectRoot, "package.json");
        var obj;
        fs.readFile(jsonPath, 'utf8', function (err, data) {
          if (err) throw err;
          obj = JSON.parse(data);
          resolve(obj);
        });
      })
    }
    **/
    getProjectInfo(projectRoot: string, loadPlugins?: boolean): Promise<CordovaProjectInfo>;
    saveProjectInfo(projectRoot: string, projectInfo: CordovaProjectInfo): Promise<any>;
}
