// Remove problematic SPT imports and use our custom interfaces
// import { DependencyContainer } from "tsyringe";
// import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
// import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
// import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
// import { ICoreConfig } from "@spt/models/spt/config/ICoreConfig";
// import { ConfigServer } from "@spt/servers/ConfigServer";
// import { FileSystemSync } from "@spt/utils/FileSystemSync";
// import { DatabaseServer } from "@spt/servers/DatabaseServer";
// import { ILocationBase } from "@spt/models/eft/common/ILocationBase";
// import { IRaidChanges } from "@spt/models/spt/location/IRaidChanges";
import { minVersion, satisfies, SemVer } from "semver";
import path from "node:path";
import fs from "node:fs";

import { SpawnManager } from "./SpawnManager";
import { ConfigManager } from "./ConfigManager";

// Define custom interfaces for SPT types
interface DependencyContainer {
    resolve<T>(token: string): T;
    afterResolution<T>(token: string, callback: (token: string, result: T) => void, options?: any): void;
}

interface DatabaseServer {
    getTables(): {
        bots: {
            types: { [key: string]: any };
        };
    };
}

interface IPreSptLoadMod {
    preSptLoad(container: DependencyContainer): void;
}

interface IPostDBLoadMod {
    postDBLoad(container: DependencyContainer): void;
}

class LiveTarkovAIMod implements IPreSptLoadMod, IPostDBLoadMod
{
    private spawnManager: SpawnManager;
    private configManager: ConfigManager;

    constructor() {
        this.spawnManager = new SpawnManager();
        this.configManager = new ConfigManager();
    }

    // PreSPTLoad - Initialize mod and register hooks
    public preSptLoad(container: DependencyContainer): void 
    {
        if (!this.validSptVersion(container)) 
        {
            console.error(`[LiveTarkovAI] This version was not made for your version of SPT. Disabling. Requires ${this.validMinimumSptVersion(container)} or higher.`);
            return;
        }

        console.log("[LiveTarkovAI] Initializing Live Tarkov - AI Mod...");
        
        // Check for required dependencies
        this.checkRequiredDependencies(container);
        
        // Initialize configuration
        this.configManager.initialize();
        
        // Register spawn hooks
        this.registerSpawnHooks(container);
        
        console.log("[LiveTarkovAI] Live Tarkov - AI Mod initialized successfully!");
    }

    // PostDBLoad - Configure spawn data after database is loaded
    public postDBLoad(container: DependencyContainer): void 
    {
        console.log("[LiveTarkovAI] Configuring live Tarkov spawn data...");
        
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        
        // Initialize spawn manager with available services
        this.spawnManager.initialize(databaseServer);
        
        // Apply custom spawn configurations
        this.spawnManager.applyCustomSpawnConfig();
        
        console.log("[LiveTarkovAI] Live Tarkov spawn data configuration completed!");
    }
    
    // Check for required dependencies
    private checkRequiredDependencies(container: DependencyContainer): void {
        try {
            // Check for SAIN (optional but recommended)
            const sainDetected = this.detectSAINMod();
            if (sainDetected) {
                console.log("[LiveTarkovAI] ✓ SAIN found - enhanced bot behavior enabled");
            } else {
                console.log("[LiveTarkovAI] ℹ️ SAIN not found - enhanced bot behavior disabled (optional)");
                // Debug: Show why SAIN wasn't detected
                this.debugSAINDetection();
            }

            // Check for Fika (optional but recommended)
            const fikaDetected = this.detectFikaMod();
            if (fikaDetected) {
                console.log("[LiveTarkovAI] ✓ Fika found - multiplayer compatibility enabled");
            } else {
                console.log("[LiveTarkovAI] ℹ️ Fika not found - multiplayer compatibility disabled (optional)");
            }

            // Check for BepInEx plugins (BigBrain, Waypoints)
            this.checkBepInExPlugins();

        } catch (error) {
            console.error(`[LiveTarkovAI] Error checking dependencies: ${error}`);
        }
    }

    // Detect SAIN mod using multiple methods
    private detectSAINMod(): boolean {
        try {
            // Method 1: Try to require SAIN directly
            try {
                require("zSolarint-SAIN-ServerMod");
                return true;
            } catch (error) {
                // Continue to next method
            }

            // Method 2: Check for SAIN in mods folder
            const possibleSainPaths = [
                path.join(process.cwd(), "user", "mods", "zSolarint-SAIN-ServerMod"),
                path.join(__dirname, "..", "..", "zSolarint-SAIN-ServerMod"),
                path.join(process.cwd(), "mods", "zSolarint-SAIN-ServerMod")
            ];

            for (const sainPath of possibleSainPaths) {
                if (fs.existsSync(sainPath)) {
                    return true;
                }
            }

            // Method 3: Check for SAIN in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.includes("zSolarint-SAIN-ServerMod") || modulePath.includes("SAIN")) {
                    return true;
                }
            }

            // Method 4: Check for SAIN in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && (child.filename.includes("SAIN") || child.filename.includes("zSolarint"))) {
                        return true;
                    }
                }
            }

            // Method 5: Check for SAIN in global scope (like Fika)
            if (globalThis.SAINService || globalThis.SAINBotService || globalThis.SAIN) {
                return true;
            }

            // Method 6: Check for SAIN in SPT container if available
            try {
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("SAINService")) {
                        return true;
                    }
                    if (container.resolve && container.resolve("SAINBotService")) {
                        return true;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            // Method 7: Check for SAIN in package.json dependencies
            try {
                const packageJsonPath = path.join(process.cwd(), "package.json");
                if (fs.existsSync(packageJsonPath)) {
                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                    if (packageJson.dependencies && packageJson.dependencies["zSolarint-SAIN-ServerMod"]) {
                        return true;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Detect Fika mod using multiple methods
    private detectFikaMod(): boolean {
        try {
            // Method 1: Try to require Fika directly
            try {
                require("fika-server");
                return true;
            } catch (error) {
                // Continue to next method
            }

            // Method 2: Check for Fika in mods folder
            const possibleFikaPaths = [
                path.join(process.cwd(), "user", "mods", "fika-server"),
                path.join(__dirname, "..", "..", "fika-server"),
                path.join(process.cwd(), "mods", "fika-server")
            ];

            for (const fikaPath of possibleFikaPaths) {
                if (fs.existsSync(fikaPath)) {
                    return true;
                }
            }

            // Method 3: Check for Fika in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.includes("fika-server") || modulePath.includes("fika")) {
                    return true;
                }
            }

            // Method 4: Check for Fika in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && (child.filename.includes("fika") || child.filename.includes("Fika"))) {
                        return true;
                    }
                }
            }

            // Method 5: Check for Fika in global scope
            if (globalThis.FikaService || globalThis.FikaServerService || globalThis.fika) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Check for BepInEx plugins (BigBrain, Waypoints)
    private checkBepInExPlugins(): void {
        try {
            // Check if they're available through other means
            const bigBrainDetected = this.detectBigBrainPlugin();
            const waypointsDetected = this.detectWaypointsPlugin();

            if (bigBrainDetected) {
                console.log("[LiveTarkovAI] ✓ BigBrain plugin detected - enhanced AI enabled");
            } else {
                console.log("[LiveTarkovAI] ℹ️ BigBrain plugin not detected - basic AI behavior");
            }

            if (waypointsDetected) {
                console.log("[LiveTarkovAI] ✓ Waypoints plugin detected - pathfinding enabled");
            } else {
                console.log("[LiveTarkovAI] ℹ️ Waypoints plugin not detected - basic pathfinding");
            }

        } catch (error) {
            console.log("[LiveTarkovAI] ℹ️ Unable to detect BepInEx plugins - using basic functionality");
        }
    }

    // Detect BigBrain plugin by checking for DLL and folder
    private detectBigBrainPlugin(): boolean {
        try {
            // Method 1: Check for global BigBrain objects
            if (globalThis.BigBrain || globalThis.BigBrainService || globalThis.BigBrainPlugin) {
                return true;
            }

            // Method 2: Check if we can access BigBrain through SPT services
            try {
                // Try to access BigBrain through SPT container if available
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("BigBrainService")) {
                        return true;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            // Method 3: Check for BigBrain in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && child.filename.includes("DrakiaXYZ-BigBrain")) {
                        return true;
                    }
                }
            }

            // Method 4: Check for BigBrain in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.includes("DrakiaXYZ-BigBrain")) {
                    return true;
                }
            }

            // Method 5: Check file system for BepInEx plugin files
            try {
                // Check common BepInEx paths
                const possiblePaths = [
                    path.join(process.cwd(), "BepInEx", "plugins", "DrakiaXYZ-BigBrain.dll"),
                    path.join(process.cwd(), "BepInEx", "plugins", "DrakiaXYZ-BigBrain", "DrakiaXYZ-BigBrain.dll"),
                    path.join(__dirname, "..", "..", "..", "BepInEx", "plugins", "DrakiaXYZ-BigBrain.dll"),
                    path.join(__dirname, "..", "..", "BepInEx", "plugins", "DrakiaXYZ-BigBrain.dll")
                ];

                for (const pluginPath of possiblePaths) {
                    if (fs.existsSync(pluginPath)) {
                        return true;
                    }
                }

                // Method 6: Scan BepInEx plugins folder comprehensively
                if (this.scanBepInExFolder("DrakiaXYZ-BigBrain")) {
                    return true;
                }

            } catch (error) {
                // File system check failed, continue
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Detect Waypoints plugin by checking for folder and functionality
    private detectWaypointsPlugin(): boolean {
        try {
            // Method 1: Check for global Waypoints objects
            if (globalThis.Waypoints || globalThis.WaypointsService || globalThis.WaypointsPlugin) {
                return true;
            }

            // Method 2: Check if we can access Waypoints through SPT services
            try {
                // Try to access Waypoints through SPT container if available
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("WaypointsService")) {
                        return true;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            // Method 3: Check for Waypoints in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && child.filename.includes("DrakiaXYZ-Waypoints")) {
                        return true;
                    }
                }
            }

            // Method 4: Check for Waypoints in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.includes("DrakiaXYZ-Waypoints")) {
                    return true;
                }
            }

            // Method 5: Try to require Waypoints directly (might work in some cases)
            try {
                require("DrakiaXYZ-Waypoints");
                return true;
            } catch (error) {
                // Continue to next method
            }

            // Method 6: Check file system for BepInEx plugin folder
            try {
                // Check common BepInEx paths
                const possiblePaths = [
                    path.join(process.cwd(), "BepInEx", "plugins", "DrakiaXYZ-Waypoints"),
                    path.join(process.cwd(), "BepInEx", "plugins", "DrakiaXYZ-Waypoints", "DrakiaXYZ-Waypoints.dll"),
                    path.join(__dirname, "..", "..", "..", "BepInEx", "plugins", "DrakiaXYZ-Waypoints"),
                    path.join(__dirname, "..", "..", "BepInEx", "plugins", "DrakiaXYZ-Waypoints", "DrakiaXYZ-Waypoints.dll")
                ];

                for (const pluginPath of possiblePaths) {
                    if (fs.existsSync(pluginPath)) {
                        return true;
                    }
                }

                // Method 7: Scan BepInEx plugins folder comprehensively
                if (this.scanBepInExFolder("DrakiaXYZ-Waypoints")) {
                    return true;
                }

            } catch (error) {
                // File system check failed, continue
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Comprehensive BepInEx folder scanner
    private scanBepInExFolder(pluginName: string): boolean {
        try {
            // Try multiple possible BepInEx locations
            const possibleBepInExPaths = [
                path.join(process.cwd(), "BepInEx"),
                path.join(__dirname, "..", "..", "..", "BepInEx"),
                path.join(process.cwd(), "..", "BepInEx"),
                path.join(process.cwd(), "..", "..", "BepInEx")
            ];

            for (const bepInExPath of possibleBepInExPaths) {
                if (fs.existsSync(bepInExPath)) {
                    const pluginsPath = path.join(bepInExPath, "plugins");
                    if (fs.existsSync(pluginsPath)) {
                        // Scan for the plugin silently
                        if (this.scanPluginsFolder(pluginsPath, pluginName)) {
                            return true;
                        }
                    }
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Scan a specific plugins folder for a plugin
    private scanPluginsFolder(pluginsPath: string, pluginName: string): boolean {
        try {
            const items = fs.readdirSync(pluginsPath);
            
            for (const item of items) {
                const itemPath = path.join(pluginsPath, item);
                const stats = fs.statSync(itemPath);
                
                if (stats.isDirectory()) {
                    // Check if this directory contains the plugin
                    if (item.includes(pluginName)) {
                        return true;
                    }
                    
                    // Check inside the directory for DLL files
                    try {
                        const subItems = fs.readdirSync(itemPath);
                        for (const subItem of subItems) {
                            if (subItem.includes(pluginName) && subItem.endsWith('.dll')) {
                                return true;
                            }
                        }
                    } catch (error) {
                        // Skip subdirectory scanning if it fails
                    }
                } else if (stats.isFile() && item.endsWith('.dll')) {
                    // Check if this DLL file is the plugin
                    if (item.includes(pluginName)) {
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }
    
    // Register hooks for spawn modifications
    private registerSpawnHooks(container: DependencyContainer): void 
    {
        // Hook into raid time adjustment service for wave modifications
        container.afterResolution("RaidTimeAdjustmentService", (_t, result: any) =>
        {
            const originalAdjustWaves = result.adjustWaves;
            result.adjustWaves = (mapBase: any, raidAdjustments: any) =>
            {
                // Call original method first
                if (originalAdjustWaves) {
                    originalAdjustWaves(mapBase, raidAdjustments);
                }
                
                // Apply custom spawn modifications
                this.spawnManager.modifyRaidSpawns(mapBase, raidAdjustments);
            }
        }, {frequency: "Always"});
        
        console.log("[LiveTarkovAI] Live Tarkov spawn hooks registered successfully");
    }
    
    // Version validation
    public validSptVersion(container: DependencyContainer): boolean
    {
        try {
            // Try to get SPT version from global or package.json
            const sptVersion = globalThis.G_SPTVERSION || "3.11.0";
            const packageJsonPath: string = path.join(__dirname, "../package.json");
            
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                const modSptVersion = packageJson.sptVersion || "~3.11";
                return satisfies(sptVersion, modSptVersion);
            }
            
            return true; // Default to true if we can't check
        } catch (error) {
            console.warn(`[LiveTarkovAI] Version check failed: ${error}`);
            return true; // Default to true on error
        }
    }

    public validMinimumSptVersion(container: DependencyContainer): SemVer
    {
        try {
            const packageJsonPath: string = path.join(__dirname, "../package.json");
            
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                const modSptVersion = packageJson.sptVersion || "~3.11";
                const minVer = minVersion(modSptVersion);
                return minVer || new SemVer("3.11.0");
            }
            
            return new SemVer("3.11.0"); // Default minimum version
        } catch (error) {
            console.warn(`[LiveTarkovAI] Minimum version check failed: ${error}`);
            return new SemVer("3.11.0"); // Default minimum version on error
        }
    }

    // Debug method to show why SAIN wasn't detected
    private debugSAINDetection(): void {
        console.log("[LiveTarkovAI] Debugging SAIN detection...");
        console.log("[LiveTarkovAI] 1. Checking for zSolarint-SAIN-ServerMod in mods folder...");
        const possibleSainPaths = [
            path.join(process.cwd(), "user", "mods", "zSolarint-SAIN-ServerMod"),
            path.join(__dirname, "..", "..", "zSolarint-SAIN-ServerMod"),
            path.join(process.cwd(), "mods", "zSolarint-SAIN-ServerMod")
        ];
        for (const sainPath of possibleSainPaths) {
            if (fs.existsSync(sainPath)) {
                console.log(`[LiveTarkovAI] ✓ Found at: ${sainPath}`);
            } else {
                console.log(`[LiveTarkovAI] ℹ️ Not found at: ${sainPath}`);
            }
        }

        console.log("[LiveTarkovAI] 2. Checking for SAIN in require.cache...");
        for (const modulePath in require.cache) {
            if (modulePath.includes("zSolarint-SAIN-ServerMod") || modulePath.includes("SAIN")) {
                console.log(`[LiveTarkovAI] ✓ Found in require.cache: ${modulePath}`);
            }
        }

        console.log("[LiveTarkovAI] 3. Checking for SAIN in process modules...");
        if (process.mainModule && process.mainModule.children) {
            for (const child of process.mainModule.children) {
                if (child.filename && (child.filename.includes("SAIN") || child.filename.includes("zSolarint"))) {
                    console.log(`[LiveTarkovAI] ✓ Found in process modules: ${child.filename}`);
                }
            }
        }

        console.log("[LiveTarkovAI] 4. Checking for SAIN in global scope...");
        if (globalThis.SAINService || globalThis.SAINBotService || globalThis.SAIN) {
            console.log("[LiveTarkovAI] ✓ Found in global scope.");
        } else {
            console.log("[LiveTarkovAI] ℹ️ Not found in global scope.");
        }

        console.log("[LiveTarkovAI] 5. Checking for SPT_CONTAINER...");
        if (globalThis.SPT_CONTAINER) {
            console.log("[LiveTarkovAI] ✓ SPT_CONTAINER found.");
            try {
                const container = globalThis.SPT_CONTAINER;
                if (container.resolve && container.resolve("SAINService")) {
                    console.log("[LiveTarkovAI] ✓ SAINService found in SPT_CONTAINER.");
                } else {
                    console.log("[LiveTarkovAI] ℹ️ SAINService not found in SPT_CONTAINER.");
                }
                if (container.resolve && container.resolve("SAINBotService")) {
                    console.log("[LiveTarkovAI] ✓ SAINBotService found in SPT_CONTAINER.");
                } else {
                    console.log("[LiveTarkovAI] ℹ️ SAINBotService not found in SPT_CONTAINER.");
                }
            } catch (error) {
                console.log("[LiveTarkovAI] ℹ️ Error accessing SPT_CONTAINER: " + error);
            }
        } else {
            console.log("[LiveTarkovAI] ℹ️ SPT_CONTAINER not found.");
        }

        console.log("[LiveTarkovAI] 6. Checking for zSolarint-SAIN-ServerMod in package.json dependencies...");
        try {
            const packageJsonPath = path.join(process.cwd(), "package.json");
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                if (packageJson.dependencies && packageJson.dependencies["zSolarint-SAIN-ServerMod"]) {
                    console.log("[LiveTarkovAI] ✓ zSolarint-SAIN-ServerMod found in package.json.");
                } else {
                    console.log("[LiveTarkovAI] ℹ️ zSolarint-SAIN-ServerMod not found in package.json.");
                }
            } else {
                console.log("[LiveTarkovAI] ℹ️ package.json not found.");
            }
        } catch (error) {
            console.log("[LiveTarkovAI] ℹ️ Error reading package.json: " + error);
        }
    }
}

export const mod = new LiveTarkovAIMod();
