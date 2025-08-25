import path from "node:path";
import fs from "node:fs";

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
    private spawnManager: SpawnManager;
    private configManager: ConfigManager;
    private hotZoneManager: HotZoneManager;
    private sainIntegration: SainIntegrationService;
    private fikaIntegration: FikaIntegrationService;
    private bushShootingService: BushShootingService;
    private logger: Logger;
    private randomUtil: RandomUtil;
    private timeUtil: TimeUtil;
    private jsonUtil: JsonUtil;
    private itemHelper: ItemHelper;
    private botHelper: BotHelper;
    private botEquipmentModService: BotEquipmentModService;
    private botModificationService: BotModificationService;
    private botSpawnService: BotSpawnService;
    private botGenerationCacheService: BotGenerationCacheService;
    private databaseServer: DatabaseServer;
    private configServer: ConfigServer;
    private locationController: LocationController;
    private botController: BotController;

    constructor(
        logger: Logger,
        randomUtil: RandomUtil,
        timeUtil: TimeUtil,
        jsonUtil: JsonUtil,
        itemHelper: ItemHelper,
        botHelper: BotHelper,
        botEquipmentModService: BotEquipmentModService,
        botModificationService: BotModificationService,
        botSpawnService: BotSpawnService,
        botGenerationCacheService: BotGenerationCacheService,
        databaseServer: DatabaseServer,
        configServer: ConfigServer,
        locationController: LocationController,
        botController: BotController
    ) {
        this.logger = logger;
        this.randomUtil = randomUtil;
        this.timeUtil = timeUtil;
        this.jsonUtil = jsonUtil;
        this.itemHelper = itemHelper;
        this.botHelper = botHelper;
        this.botEquipmentModService = botEquipmentModService;
        this.botModificationService = botModificationService;
        this.botSpawnService = botSpawnService;
        this.botGenerationCacheService = botGenerationCacheService;
        this.databaseServer = databaseServer;
        this.configServer = configServer;
        this.locationController = locationController;
        this.botController = botController;

        // Initialize our services
        this.configManager = new ConfigManager();
        this.spawnManager = new SpawnManager(
            this.databaseServer,
            this.botHelper,
            this.botEquipmentModService,
            this.botModificationService,
            this.botSpawnService,
            this.botGenerationCacheService,
            this.randomUtil,
            this.timeUtil,
            this.itemHelper,
            this.logger
        );
        this.hotZoneManager = new HotZoneManager(this.configManager, this.locationController, this.logger);
        this.sainIntegration = new SainIntegrationService(this.configManager, this.botModificationService, this.logger);
        this.fikaIntegration = new FikaIntegrationService(this.configManager, this.botController, this.logger);
        this.bushShootingService = new BushShootingService(this.configManager, this.botModificationService, this.logger);
    }

    // PreSPTLoad - Initialize mod and register hooks
    public preSptLoad(container: DependencyContainer): void 
    {
        try {
            console.log("[LiveTarkovAI] Initializing Live Tarkov - AI Mod...");
            
            // Check SPT version compatibility
            if (!this.validSptVersion()) {
                console.error(`[LiveTarkovAI] SPT version incompatible. Requires 3.11.0 or higher.`);
                return;
            }
            
            // Check for required dependencies
            this.checkRequiredDependencies();
            
            // Initialize configuration
            this.configManager.initialize();
            
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
            
            // Initialize spawn manager with database
            this.spawnManager.initialize();
            
            // Apply custom spawn configurations
            this.spawnManager.applyCustomSpawnConfig();
            
            // Initialize hot zone management
            this.hotZoneManager.initialize();
            
            // Initialize integration services
            this.sainIntegration.initialize();
            this.fikaIntegration.initialize();
            this.bushShootingService.initialize();
            
            console.log("[LiveTarkovAI] Live Tarkov spawn data configuration completed!");
        } catch (error) {
            console.error(`[LiveTarkovAI] Error during postDBLoad: ${error}`);
        }
    }
    
    // Check SPT version compatibility
    private validSptVersion(): boolean {
        try {
            const sptVersion = this.configServer.getConfig<ICoreConfig>(ConfigTypes.CORE).version;
            const minVersion = "3.11.0";
            
            // Simple version check - can be enhanced with semver
            return sptVersion >= minVersion;
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
                    if (child.filename && (child.filename.includes("SAIN") || child.filename.includes("sain"))) {
                        return true;
                    }
                }
            }

            // Method 5: Check for SAIN in global scope
            if (globalThis.SAIN || globalThis.SainService || globalThis.sain) {
                return true;
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
            // Method 1: Check for global BigBrain objects
            if (globalThis.BigBrain || globalThis.BigBrainService || globalThis.BigBrainPlugin) {
                return true;
            }

            // Method 2: Check if we can access BigBrain through SPT services
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

    // Detect Waypoints plugin
    private detectWaypointsPlugin(): boolean {
        try {
            // Method 1: Check for global Waypoints objects
            if (globalThis.Waypoints || globalThis.WaypointsService || globalThis.WaypointsPlugin) {
                return true;
            }

            // Method 2: Check if we can access Waypoints through SPT services
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

            // Method 5: Check file system for BepInEx plugin files
            try {
                const possiblePaths = [
                    path.join(process.cwd(), "BepInEx", "plugins", "DrakiaXYZ-Waypoints.dll"),
                    path.join(process.cwd(), "BepInEx", "plugins", "DrakiaXYZ-Waypoints", "DrakiaXYZ-Waypoints.dll"),
                    path.join(__dirname, "..", "..", "..", "BepInEx", "plugins", "DrakiaXYZ-Waypoints.dll"),
                    path.join(__dirname, "..", "..", "BepInEx", "plugins", "DrakiaXYZ-Waypoints.dll")
                ];

                for (const pluginPath of possiblePaths) {
                    if (fs.existsSync(pluginPath)) {
                        return true;
                    }
                }

                // Method 6: Scan BepInEx plugins folder comprehensively
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
                    this.configManager.setGearProgressionEnabled(false);
                    foundMod = true;
                    break;
                }
            }

            if (!foundMod) {
                console.log("[LiveTarkovAI] ✓ No external progression mods detected - using built-in gear progression");
                this.configManager.setGearProgressionEnabled(true);
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
                    this.spawnManager.hookIntoSpawnService(result);
                }
            });

            // Register our location controller to handle map-specific spawns
            container.afterResolution("LocationController", (token: string, result: any) => {
                if (result && typeof result === "object") {
                    // Hook into location spawning process
                    this.hotZoneManager.hookIntoLocationController(result);
                }
            });

            console.log("[LiveTarkovAI] Spawn hooks registered successfully");
        } catch (error) {
            console.error(`[LiveTarkovAI] Error registering spawn hooks: ${error}`);
        }
    }
}

// Export the mod class
export default LiveTarkovAIMod;
