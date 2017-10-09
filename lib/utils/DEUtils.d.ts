export declare class DEUtils {
    /**
     * Returns TRUE if the DE CLI seems to be available
     */
    static checkForDECli(): Promise<boolean>;
    /**
     * installs globally the DE CLI
     */
    static installDECli(): Promise<boolean>;
}
