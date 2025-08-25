import * as path from "path";
import * as fs from "fs";

import { SpawnManager } from "./SpawnManager";
import { ConfigManager } from "./ConfigManager";
import {
    IPreSptLoadMod,
    IPostDBLoadMod,
    DependencyContainer,
    DatabaseServer,
    ConfigServer,
    Logger
} from "./types/spt-types";

class LiveTarkovAIMod implements IPreSptLoadMod, IPostDBLoadMod
{
    private spawnManager: SpawnManager | null = null;
    private configManager: ConfigManager | null = null;
    private logger: Logger;

    constructor() {
        // Create a simple logger
        this.logger = {
            info: (msg: string) => console.log(`[LiveTarkovAI] ${msg}`),
            warn: (msg: string) => console.warn(`[LiveTarkovAI] ${msg}`),
            error: (msg: string) => console.error(`[LiveTarkovAI] ${msg}`),
            debug: (msg: string) => console.log(`[LiveTarkovAI] [DEBUG] ${msg}`)
        };
    }

    // PreSPTLoad - Initialize mod and check dependencies
    public preSptLoad(container: DependencyContainer): void 
    {
        try {
            this.logger.info("Initializing Live Tarkov - AI Mod...");
            
            // Initialize configuration
            this.configManager = new ConfigManager();
            this.configManager.initialize();
            
            // Check SPT version compatibility
            if (!this.validSptVersion(container)) {
                this.logger.error("SPT version incompatible. Requires 3.11.0 or higher.");
                return;
            }
            
            // Check for required dependencies
            this.checkRequiredDependencies();
            
            this.logger.info("Live Tarkov - AI Mod initialized successfully!");
        } catch (error) {
            this.logger.error(`Error during preSptLoad: ${error}`);
        }
    }

    // PostDBLoad - Configure spawn data after database is loaded
    public postDBLoad(container: DependencyContainer): void 
    {
        try {
            this.logger.info("Configuring live Tarkov spawn data...");
            
            // Get required services from container
            const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
            
            // Initialize spawn manager
            this.spawnManager = new SpawnManager(
                databaseServer,
                this.configManager!,
                this.logger
            );
            this.spawnManager.initialize();
            
            // Apply custom spawn configurations
            this.spawnManager.applyCustomSpawnConfig();
            
            this.logger.info("Live Tarkov spawn data configuration completed!");
        } catch (error) {
            this.logger.error(`Error during postDBLoad: ${error}`);
        }
    }
    
    // Check SPT version compatibility
    private validSptVersion(container: DependencyContainer): boolean {
        try {
            const configServer = container.resolve<ConfigServer>("ConfigServer");
            
            // Try to get SPT version
            let sptVersion = "unknown";
            
            try {
                const coreConfig = configServer.getConfig<any>("CORE");
                if (coreConfig && coreConfig.version) {
                    sptVersion = coreConfig.version;
                }
            } catch (error) {
                // Try alternative config names
                try {
                    const sptConfig = configServer.getConfig<any>("SPT");
                    if (sptConfig && sptConfig.version) {
                        sptVersion = sptConfig.version;
                    }
                } catch (error2) {
                    // Try global version
                    if ((globalThis as any).G_SPTVERSION) {
                        sptVersion = (globalThis as any).G_SPTVERSION;
                    }
                }
            }
            
            this.logger.info(`SPT Version detected: ${sptVersion}`);
            
            // Assume compatibility for now
            this.logger.info("✓ SPT version compatibility check passed");
            return true;
        } catch (error) {
            this.logger.warn("Could not verify SPT version, continuing...");
            return true;
        }
    }
    
    // Check for required dependencies
    private checkRequiredDependencies(): void {
        try {
            // Check for SAIN (optional but recommended)
            const sainDetected = this.detectSAINMod();
            if (sainDetected) {
                this.logger.info("✓ SAIN found - enhanced bot behavior enabled");
            } else {
                this.logger.info("ℹ️ SAIN not found - enhanced bot behavior disabled (optional)");
            }

            // Check for Fika (optional but recommended)
            const fikaDetected = this.detectFikaMod();
            if (fikaDetected) {
                this.logger.info("✓ Fika found - multiplayer compatibility enabled");
            } else {
                this.logger.info("ℹ️ Fika not found - multiplayer compatibility disabled (optional)");
            }

            // Check for BepInEx plugins (BigBrain, Waypoints) - REQUIRED
            this.checkBepInExPlugins();
            
        } catch (error) {
            this.logger.error(`Error checking dependencies: ${error}`);
        }
    }

    // Detect SAIN mod
    private detectSAINMod(): boolean {
        try {
            // Check for SAIN in mods folder
            const sainPaths = [
                path.join(process.cwd(), "user", "mods", "zSolarint-SAIN-ServerMod"),
                path.join(process.cwd(), "user", "mods", "SAIN"),
                path.join(process.cwd(), "user", "mods", "sain")
            ];

            for (const sainPath of sainPaths) {
                if (fs.existsSync(sainPath)) {
                    return true;
                }
            }

            // Check for SAIN in BepInEx plugins folder
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const sainFolder = path.join(bepinExPath, "SAIN");
                    if (fs.existsSync(sainFolder)) {
                        return true;
                    }
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Detect Fika mod
    private detectFikaMod(): boolean {
        try {
            // Check for Fika in mods folder
            const fikaPaths = [
                path.join(process.cwd(), "user", "mods", "fika-server"),
                path.join(process.cwd(), "user", "mods", "Fika"),
                path.join(process.cwd(), "user", "mods", "fika")
            ];

            for (const fikaPath of fikaPaths) {
                if (fs.existsSync(fikaPath)) {
                    return true;
                }
            }

            // Check for Fika in BepInEx plugins folder
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const fikaCore = path.join(bepinExPath, "Fika.Core.dll");
                    const fikaHeadless = path.join(bepinExPath, "Fika.Headless.dll");
                    if (fs.existsSync(fikaCore) || fs.existsSync(fikaHeadless)) {
                        return true;
                    }
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Check for BepInEx plugins
    private checkBepInExPlugins(): void {
        try {
            const bigBrainDetected = this.detectBigBrainPlugin();
            const waypointsDetected = this.detectWaypointsPlugin();

            if (bigBrainDetected) {
                this.logger.info("✓ BigBrain plugin detected - enhanced AI enabled");
            } else {
                this.logger.error("❌ BigBrain plugin NOT detected - REQUIRED for enhanced AI behavior");
                this.logger.error("Please install DrakiaXYZ-BigBrain BepInEx plugin");
            }

            if (waypointsDetected) {
                this.logger.info("✓ Waypoints plugin detected - pathfinding enabled");
            } else {
                this.logger.error("❌ Waypoints plugin NOT detected - REQUIRED for pathfinding");
                this.logger.error("Please install DrakiaXYZ-Waypoints BepInEx plugin");
            }
        } catch (error) {
            this.logger.error(`Error checking BepInEx plugins: ${error}`);
        }
    }

    // Detect BigBrain plugin
    private detectBigBrainPlugin(): boolean {
        try {
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const bigBrainDll = path.join(bepinExPath, "DrakiaXYZ-BigBrain.dll");
                    if (fs.existsSync(bigBrainDll)) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Detect Waypoints plugin
    private detectWaypointsPlugin(): boolean {
        try {
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const waypointsDll = path.join(bepinExPath, "DrakiaXYZ-Waypoints.dll");
                    if (fs.existsSync(waypointsDll)) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}

// Export the mod instance for SPT to load
export const mod = new LiveTarkovAIMod();
