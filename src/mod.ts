import * as path from "path";
import * as fs from "fs";

import { SpawnManager } from "./SpawnManager";
import { ConfigManager } from "./ConfigManager";
import { HotZoneManager } from "./HotZoneManager";
import { SainIntegrationService } from "./SainIntegrationService";
import { FikaIntegrationService } from "./FikaIntegrationService";
import { BushShootingService } from "./BushShootingService";
import {
    IPreSptLoadMod,
    IPostDBLoadMod,
    DependencyContainer,
    DatabaseServer,
    ConfigServer,
    BotHelper,
    BotGenerationCacheService,
    BotController,
    LocationController,
    IRaidChanges,
    ILocationBase,
    IBotType,
    IBotBase,
    BotDifficulty,
    BotType,
    EquipmentSlots,
    ItemHelper,
    BotEquipmentModService,
    BotModificationService,
    BotSpawnService,
    RandomUtil,
    TimeUtil,
    JsonUtil,
    ConfigTypes,
    ICoreConfig,
    FileSystemSync,
    Logger
} from "./types/spt-types";

class LiveTarkovAIMod implements IPreSptLoadMod, IPostDBLoadMod
{
    private spawnManager: SpawnManager | null = null;
    private configManager: ConfigManager | null = null;
    private hotZoneManager: HotZoneManager | null = null;
    private sainIntegration: SainIntegrationService | null = null;
    private fikaIntegration: FikaIntegrationService | null = null;
    private bushShootingService: BushShootingService | null = null;

    constructor() {
        // Empty constructor for SPT compatibility
        // Services will be initialized when SPT provides them
    }

    // PreSPTLoad - Initialize mod and register hooks
    public preSptLoad(container: DependencyContainer): void 
    {
        try {
            console.log("[LiveTarkovAI] Initializing Live Tarkov - AI Mod...");
            
            // Initialize configuration first
            this.configManager = new ConfigManager();
            this.configManager.initialize();
            
            // Check SPT version compatibility
            if (!this.validSptVersion(container)) {
                console.error(`[LiveTarkovAI] SPT version incompatible. Requires 3.11.0 or higher.`);
                return;
            }
            
            // Check for required dependencies
            this.checkRequiredDependencies();
            
            // Register spawn hooks
            this.registerSpawnHooks(container);
            
            console.log("[LiveTarkovAI] Live Tarkov - AI Mod initialized successfully!");
        } catch (error) {
            console.error(`[LiveTarkovAI] Error during preSptLoad: ${error}`);
        }
    }

    // PostDBLoad - Configure spawn data after database is loaded
    public postDBLoad(container: DependencyContainer): void 
    {
        try {
            console.log("[LiveTarkovAI] Configuring live Tarkov spawn data...");
            
            // Get required services from container
            const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
            const configServer = container.resolve<ConfigServer>("ConfigServer");
            const botHelper = container.resolve<BotHelper>("BotHelper");
            const botEquipmentModService = container.resolve<BotEquipmentModService>("BotEquipmentModService");
            const botModificationService = container.resolve<BotModificationService>("BotModificationService");
            const botSpawnService = container.resolve<BotSpawnService>("BotSpawnService");
            const botGenerationCacheService = container.resolve<BotGenerationCacheService>("BotGenerationCacheService");
            const randomUtil = container.resolve<RandomUtil>("RandomUtil");
            const timeUtil = container.resolve<TimeUtil>("TimeUtil");
            const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
            const itemHelper = container.resolve<ItemHelper>("ItemHelper");
            const locationController = container.resolve<LocationController>("LocationController");
            const botController = container.resolve<BotController>("BotController");
            
            // Create a mock logger since SPT might not provide one
            const logger: Logger = {
                info: (msg: string) => console.log(`[LiveTarkovAI] ${msg}`),
                warn: (msg: string) => console.warn(`[LiveTarkovAI] ${msg}`),
                error: (msg: string) => console.error(`[LiveTarkovAI] ${msg}`),
                debug: (msg: string) => console.log(`[LiveTarkovAI] [DEBUG] ${msg}`)
            };
            
            // Initialize spawn manager with database
            this.spawnManager = new SpawnManager(
                databaseServer,
                botHelper,
                botEquipmentModService,
                botModificationService,
                botSpawnService,
                botGenerationCacheService,
                randomUtil,
                timeUtil,
                itemHelper,
                logger
            );
            this.spawnManager.initialize();
            
            // Initialize hot zone management
            this.hotZoneManager = new HotZoneManager(this.configManager!, locationController, logger);
            this.hotZoneManager.initialize();
            
            // Initialize integration services
            this.sainIntegration = new SainIntegrationService(this.configManager!, botModificationService, logger);
            this.sainIntegration.initialize();
            this.fikaIntegration = new FikaIntegrationService(this.configManager!, botController, logger);
            this.fikaIntegration.initialize();
            this.bushShootingService = new BushShootingService(this.configManager!, botModificationService, logger);
            this.bushShootingService.initialize();
            
            // Apply custom spawn configurations
            this.spawnManager.applyCustomSpawnConfig();
            
            console.log("[LiveTarkovAI] Live Tarkov spawn data configuration completed!");
        } catch (error) {
            console.error(`[LiveTarkovAI] Error during postDBLoad: ${error}`);
        }
    }
    
    // Check SPT version compatibility
    private validSptVersion(container: DependencyContainer): boolean {
        try {
            const configServer = container.resolve<ConfigServer>("ConfigServer");
            
            // Try to get SPT version, but don't fail if the structure is different
            let sptVersion = "unknown";
            try {
                const coreConfig = configServer.getConfig<any>("CORE");
                if (coreConfig && coreConfig.version) {
                    sptVersion = coreConfig.version;
                }
            } catch (error) {
                // Config structure might be different, continue with unknown version
            }
            
            console.log(`[LiveTarkovAI] SPT Version detected: ${sptVersion}`);
            
            // For now, assume compatibility and let the mod try to work
            // Users can report issues if they encounter problems
            console.log(`[LiveTarkovAI] ✓ SPT version compatibility check passed`);
            return true;
        } catch (error) {
            console.warn("[LiveTarkovAI] Could not verify SPT version, continuing...");
            return true;
        }
    }
    
    // Check for required dependencies
    private checkRequiredDependencies(): void {
        try {
            // Check for SAIN (optional but recommended)
            const sainDetected = this.detectSAINMod();
            if (sainDetected) {
                console.log("[LiveTarkovAI] ✓ SAIN found - enhanced bot behavior enabled");
            } else {
                console.log("[LiveTarkovAI] ℹ️ SAIN not found - enhanced bot behavior disabled (optional)");
            }

            // Check for Fika (optional but recommended)
            const fikaDetected = this.detectFikaMod();
            if (fikaDetected) {
                console.log("[LiveTarkovAI] ✓ Fika found - multiplayer compatibility enabled");
            } else {
                console.log("[LiveTarkovAI] ℹ️ Fika not found - multiplayer compatibility disabled (optional)");
            }

            // Check for BepInEx plugins (BigBrain, Waypoints) - REQUIRED
            this.checkBepInExPlugins();
            
        } catch (error) {
            console.error(`[LiveTarkovAI] Error checking dependencies: ${error}`);
        }
    }

    // Detect SAIN mod using multiple methods
    private detectSAINMod(): boolean {
        try {
            // Method 1: Check for SAIN in mods folder (most reliable)
            const sainPaths = [
                path.join(process.cwd(), "user", "mods", "zSolarint-SAIN-ServerMod"),
                path.join(process.cwd(), "user", "mods", "SAIN"),
                path.join(process.cwd(), "user", "mods", "sain"),
                path.join(__dirname, "..", "..", "zSolarint-SAIN-ServerMod"),
                path.join(__dirname, "..", "..", "SAIN"),
                path.join(__dirname, "..", "..", "sain")
            ];

            for (const sainPath of sainPaths) {
                if (fs.existsSync(sainPath)) {
                    return true;
                }
            }

            // Method 2: Check for SAIN in BepInEx plugins folder
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const sainFolder = path.join(bepinExPath, "SAIN");
                    if (fs.existsSync(sainFolder)) {
                        return true;
                    }
                }
            }

            // Method 3: Check for SAIN in global scope
            if (globalThis.SAIN || globalThis.SainService || globalThis.sain) {
                return true;
            }

            // Method 4: Check for SAIN in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.toLowerCase().includes("sain") || modulePath.toLowerCase().includes("zSolarint")) {
                    return true;
                }
            }

            // Method 5: Check for SAIN in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && (child.filename.toLowerCase().includes("sain") || child.filename.toLowerCase().includes("zSolarint"))) {
                        return true;
                    }
                }
            }

            // Method 6: Try to require SAIN directly
            try {
                require("zSolarint-SAIN-ServerMod");
                return true;
            } catch (error) {
                // Continue to next method
            }

            // Method 7: Check for SAIN in SPT container if available
            try {
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("SAINService")) {
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
            // Method 1: Check for Fika in mods folder (most reliable)
            const fikaPaths = [
                path.join(process.cwd(), "user", "mods", "fika-server"),
                path.join(process.cwd(), "user", "mods", "Fika"),
                path.join(process.cwd(), "user", "mods", "fika"),
                path.join(__dirname, "..", "..", "fika-server"),
                path.join(__dirname, "..", "..", "Fika"),
                path.join(__dirname, "..", "..", "fika")
            ];

            for (const fikaPath of fikaPaths) {
                if (fs.existsSync(fikaPath)) {
                    return true;
                }
            }

            // Method 2: Check for Fika in BepInEx plugins folder
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "BepInEx", "plugins")
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

            // Method 3: Check for Fika in global scope
            if (globalThis.FikaService || globalThis.FikaServerService || globalThis.fika) {
                return true;
            }

            // Method 4: Check for Fika in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.toLowerCase().includes("fika")) {
                    return true;
                }
            }

            // Method 5: Check for Fika in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && child.filename.toLowerCase().includes("fika")) {
                        return true;
                    }
                }
            }

            // Method 6: Try to require Fika directly
            try {
                require("fika-server");
                return true;
            } catch (error) {
                // Continue to next method
            }

            // Method 7: Check for Fika in SPT container if available
            try {
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("FikaService")) {
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

    // Check for BepInEx plugins (BigBrain, Waypoints) - REQUIRED
    private checkBepInExPlugins(): void {
        try {
            const bigBrainDetected = this.detectBigBrainPlugin();
            const waypointsDetected = this.detectWaypointsPlugin();

            if (bigBrainDetected) {
                console.log("[LiveTarkovAI] ✓ BigBrain plugin detected - enhanced AI enabled");
            } else {
                console.error("[LiveTarkovAI] ❌ BigBrain plugin NOT detected - REQUIRED for enhanced AI behavior");
                console.error("[LiveTarkovAI] Please install DrakiaXYZ-BigBrain BepInEx plugin");
            }

            if (waypointsDetected) {
                console.log("[LiveTarkovAI] ✓ Waypoints plugin detected - pathfinding enabled");
            } else {
                console.error("[LiveTarkovAI] ❌ Waypoints plugin NOT detected - REQUIRED for pathfinding");
                console.error("[LiveTarkovAI] Please install DrakiaXYZ-Waypoints BepInEx plugin");
            }

            // Check for progression mods to disable our gear progression
            this.checkProgressionMods();

        } catch (error) {
            console.error(`[LiveTarkovAI] Error checking BepInEx plugins: ${error}`);
        }
    }

    // Detect BigBrain plugin
    private detectBigBrainPlugin(): boolean {
        try {
            // Method 1: Check BepInEx plugins folder (most reliable)
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const bigBrainDll = path.join(bepinExPath, "DrakiaXYZ-BigBrain.dll");
                    if (fs.existsSync(bigBrainDll)) {
                        return true;
                    }
                    
                    // Also check for folder-based plugins
                    const bigBrainFolder = path.join(bepinExPath, "DrakiaXYZ-BigBrain");
                    if (fs.existsSync(bigBrainFolder)) {
                        return true;
                    }
                }
            }

            // Method 2: Check for global BigBrain objects
            if (globalThis.BigBrain || globalThis.BigBrainService || globalThis.BigBrainPlugin) {
                return true;
            }

            // Method 3: Check if we can access BigBrain through SPT services
            try {
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("BigBrainService")) {
                        return true;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            // Method 4: Check for BigBrain in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && child.filename.includes("DrakiaXYZ-BigBrain")) {
                        return true;
                    }
                }
            }

            // Method 5: Check for BigBrain in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.includes("DrakiaXYZ-BigBrain")) {
                    return true;
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
            // Method 1: Check BepInEx plugins folder (most reliable)
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const waypointsDll = path.join(bepinExPath, "DrakiaXYZ-Waypoints.dll");
                    if (fs.existsSync(waypointsDll)) {
                        return true;
                    }
                    
                    // Also check for folder-based plugins
                    const waypointsFolder = path.join(bepinExPath, "DrakiaXYZ-Waypoints");
                    if (fs.existsSync(waypointsFolder)) {
                        return true;
                    }
                }
            }

            // Method 2: Check for global Waypoints objects
            if (globalThis.Waypoints || globalThis.WaypointsService || globalThis.WaypointsPlugin) {
                return true;
            }

            // Method 3: Check if we can access Waypoints through SPT services
            try {
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("WaypointsService")) {
                        return true;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            // Method 4: Check for Waypoints in process modules
            if (process.mainModule && process.mainModule.children) {
                for (const child of process.mainModule.children) {
                    if (child.filename && child.filename.includes("DrakiaXYZ-Waypoints")) {
                        return true;
                    }
                }
            }

            // Method 5: Check for Waypoints in require.cache
            for (const modulePath in require.cache) {
                if (modulePath.includes("DrakiaXYZ-Waypoints")) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Scan BepInEx plugins folder for specific plugin
    private scanBepInExFolder(pluginName: string): boolean {
        try {
            const bepinExPaths = [
                path.join(process.cwd(), "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "..", "BepInEx", "plugins"),
                path.join(__dirname, "..", "..", "BepInEx", "plugins")
            ];

            for (const bepinExPath of bepinExPaths) {
                if (fs.existsSync(bepinExPath)) {
                    const items = fs.readdirSync(bepinExPath);
                    for (const item of items) {
                        if (item.includes(pluginName)) {
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

    // Check for progression mods to disable our gear progression
    private checkProgressionMods(): void {
        try {
            const progressionMods = [
                "APBS - Acid's Progressive Bot System",
                "ALP - Algorithmic Level Progression", 
                "Valens-Progression"
            ];

            let foundMod = false;
            for (const modName of progressionMods) {
                if (this.detectProgressionMod(modName)) {
                    console.log(`[LiveTarkovAI] ⚠️ ${modName} detected - disabling built-in gear progression`);
                    this.configManager!.setGearProgressionEnabled(false);
                    foundMod = true;
                    break;
                }
            }

            if (!foundMod) {
                console.log("[LiveTarkovAI] ✓ No external progression mods detected - using built-in gear progression");
                this.configManager!.setGearProgressionEnabled(true);
            }
        } catch (error) {
            console.error(`[LiveTarkovAI] Error checking progression mods: ${error}`);
        }
    }

    // Detect specific progression mod
    private detectProgressionMod(modName: string): boolean {
        try {
            // Check mods folder
            const modPaths = [
                path.join(process.cwd(), "user", "mods"),
                path.join(__dirname, "..", ".."),
                path.join(process.cwd(), "mods")
            ];

            for (const modPath of modPaths) {
                if (fs.existsSync(modPath)) {
                    const items = fs.readdirSync(modPath);
                    for (const item of items) {
                        if (item.toLowerCase().includes(modName.toLowerCase().replace(/\s+/g, ""))) {
                            return true;
                        }
                    }
                }
            }

            // Check require.cache
            for (const modulePath in require.cache) {
                if (modulePath.toLowerCase().includes(modName.toLowerCase().replace(/\s+/g, ""))) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // Register spawn hooks with SPT
    private registerSpawnHooks(container: DependencyContainer): void {
        try {
            // Register our spawn manager to handle bot spawning
            container.afterResolution("BotSpawnService", (token: string, result: any) => {
                if (result && typeof result === "object") {
                    // Hook into bot spawning process
                    this.spawnManager?.hookIntoSpawnService(result);
                }
            });

            // Register our location controller to handle map-specific spawns
            container.afterResolution("LocationController", (token: string, result: any) => {
                if (result && typeof result === "object") {
                    // Hook into location spawning process
                    this.hotZoneManager?.hookIntoLocationController(result);
                }
            });

            console.log("[LiveTarkovAI] Spawn hooks registered successfully");
        } catch (error) {
            console.error(`[LiveTarkovAI] Error registering spawn hooks: ${error}`);
        }
    }
}

// Export the mod instance for SPT to load
export const mod = new LiveTarkovAIMod();
