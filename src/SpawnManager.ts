import { ConfigManager } from "./ConfigManager";
import {
    DatabaseServer,
    BotHelper,
    BotEquipmentModService,
    BotModificationService,
    BotSpawnService,
    BotGenerationCacheService,
    RandomUtil,
    TimeUtil,
    ItemHelper,
    Logger,
    IBotType,
    IBotBase,
    BotDifficulty,
    BotType
} from "./types/spt-types";

export class SpawnManager {
    private databaseServer: DatabaseServer;
    private botHelper: BotHelper | null;
    private botEquipmentModService: BotEquipmentModService | null;
    private botModificationService: BotModificationService | null;
    private botSpawnService: BotSpawnService | null;
    private botGenerationCacheService: BotGenerationCacheService | null;
    private randomUtil: RandomUtil | null;
    private timeUtil: TimeUtil | null;
    private itemHelper: ItemHelper | null;
    private logger: Logger;
    private configManager: ConfigManager;
    private sainAvailable: boolean = false;

    constructor(
        databaseServer: DatabaseServer,
        botHelper: BotHelper | null,
        botEquipmentModService: BotEquipmentModService | null,
        botModificationService: BotModificationService | null,
        botSpawnService: BotSpawnService | null,
        botGenerationCacheService: BotGenerationCacheService | null,
        randomUtil: RandomUtil | null,
        timeUtil: TimeUtil | null,
        itemHelper: ItemHelper | null,
        logger: Logger
    ) {
        this.databaseServer = databaseServer;
        this.botHelper = botHelper;
        this.botEquipmentModService = botEquipmentModService;
        this.botModificationService = botModificationService;
        this.botSpawnService = botSpawnService;
        this.botGenerationCacheService = botGenerationCacheService;
        this.randomUtil = randomUtil;
        this.timeUtil = timeUtil;
        this.itemHelper = itemHelper;
        this.logger = logger;
        this.configManager = new ConfigManager();
    }

    public initialize(): void {
        try {
            this.logger.info("[LiveTarkovAI] Initializing SpawnManager...");
            
            // Check if SAIN is available for enhanced behavior
            this.checkSAINAvailability();
            
            // Apply custom spawn configurations
            this.applyCustomSpawnConfig();
            
            this.logger.info("[LiveTarkovAI] SpawnManager initialized successfully");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error initializing SpawnManager: ${error}`);
        }
    }

    private checkSAINAvailability(): void {
        try {
            // Use the same robust SAIN detection as the main mod
            const sainDetected = this.detectSAINMod();
            
            if (sainDetected) {
                this.sainAvailable = true;
                this.logger.info("[LiveTarkovAI] SAIN integration available - enhanced bot behavior enabled");
            } else {
                this.sainAvailable = false;
                this.logger.info("[LiveTarkovAI] SAIN not available - using standard bot behavior");
            }
        } catch (error) {
            this.sainAvailable = false;
            this.logger.info("[LiveTarkovAI] SAIN not available - using standard bot behavior");
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

            // Method 2: Check for SAIN in global scope
            if (globalThis.SAIN || globalThis.SainService || globalThis.sain) {
                return true;
            }

            // Method 3: Check for SAIN in SPT container if available
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

    // Apply custom spawn configurations to the database
    public applyCustomSpawnConfig(): void {
        try {
            this.logger.info("[LiveTarkovAI] Applying custom spawn configurations...");
            
            // Modify bot types in the database
            this.modifyBotTypes();
            
            // Apply gear progression if enabled
            if (this.configManager.isGearProgressionEnabled()) {
                this.applyGearProgression();
            }
            
            this.logger.info("[LiveTarkovAI] Custom spawn configurations applied successfully");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying custom spawn config: ${error}`);
        }
    }

    // Modify bot types in the database
    private modifyBotTypes(): void {
        try {
            const config = this.configManager.getConfig();
            const database = this.databaseServer.getTables();
            let modifiedCount = 0;
            const modifiedTypes: string[] = [];

            for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
                if (!botConfig || !botConfig.enabled) {
                    continue;
                }

                const dbBotType = database.bots.types[botType];
                if (!dbBotType) {
                    this.logger.warn(`[LiveTarkovAI] Bot type ${botType} not found in database`);
                    continue;
                }

                // Apply gear tier restrictions
                this.applyGearTierRestrictions(dbBotType, botConfig);
                
                // Apply difficulty settings
                this.applyDifficultySettings(dbBotType, botConfig);

                // Apply live Tarkov behavior
                this.applyBotBehaviorSettings(dbBotType, botConfig);

                modifiedCount++;
                modifiedTypes.push(botType);
            }

            // Show summary instead of individual logs
            if (modifiedCount > 0) {
                this.logger.info(`[LiveTarkovAI] Modified ${modifiedCount} bot types: ${modifiedTypes.join(', ')}`);
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error modifying bot types: ${error}`);
        }
    }

    // Apply gear tier restrictions to bot types
    private applyGearTierRestrictions(dbBotType: IBotType, botConfig: any): void {
        try {
            if (!botConfig.gearRestrictions) return;
            
            // Apply weapon tier restrictions
            if (botConfig.gearRestrictions.weapons && botConfig.gearRestrictions.weapons.length > 0) {
                // Store weapon restrictions for later use during bot generation
                if (!dbBotType.weaponRestrictions) {
                    dbBotType.weaponRestrictions = [];
                }
                dbBotType.weaponRestrictions.push(...botConfig.gearRestrictions.weapons);
            }
            
            // Apply armor tier restrictions  
            if (botConfig.gearRestrictions.armor && botConfig.gearRestrictions.armor.length > 0) {
                if (!dbBotType.armorRestrictions) {
                    dbBotType.armorRestrictions = [];
                }
                dbBotType.armorRestrictions.push(...botConfig.gearRestrictions.armor);
            }
            
            // Apply item restrictions
            if (botConfig.gearRestrictions.items && botConfig.gearRestrictions.items.length > 0) {
                if (!dbBotType.itemRestrictions) {
                    dbBotType.itemRestrictions = [];
                }
                dbBotType.itemRestrictions.push(...botConfig.gearRestrictions.items);
            }
            
            // Apply level-based gear scaling
            if (botConfig.levelProgression && botConfig.levelProgression.gearScaling) {
                dbBotType.levelBasedGear = true;
                dbBotType.minLevel = botConfig.levelProgression.minLevel || 1;
                dbBotType.maxLevel = botConfig.levelProgression.maxLevel || 60;
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying gear restrictions: ${error}`);
        }
    }

    // Apply difficulty settings to bot types
    private applyDifficultySettings(dbBotType: IBotType, botConfig: any): void {
        try {
            if (!botConfig.difficulty) return;
            
            // Convert string difficulty to BotDifficulty enum
            let difficulty: BotDifficulty;
            switch (botConfig.difficulty) {
                case "easy":
                    difficulty = BotDifficulty.EASY;
                    break;
                case "normal":
                    difficulty = BotDifficulty.NORMAL;
                    break;
                case "hard":
                    difficulty = BotDifficulty.HARD;
                    break;
                case "impossible":
                    difficulty = BotDifficulty.IMPOSSIBLE;
                    break;
                default:
                    difficulty = BotDifficulty.NORMAL;
            }
            
            // Apply difficulty to bot type
            dbBotType.Difficulty = difficulty;
            
            // Apply difficulty-based behavior modifications
            this.applyDifficultyBasedBehavior(dbBotType, difficulty);
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying difficulty settings: ${error}`);
        }
    }

    // Apply difficulty-based behavior modifications
    private applyDifficultyBasedBehavior(dbBotType: IBotType, difficulty: BotDifficulty): void {
        try {
            switch (difficulty) {
                case BotDifficulty.EASY:
                    // Reduce accuracy, reaction time, etc.
                    if (!dbBotType.behaviorModifiers) {
                        dbBotType.behaviorModifiers = {};
                    }
                    dbBotType.behaviorModifiers.accuracy = 0.3;
                    dbBotType.behaviorModifiers.reactionTime = 2.0;
                    dbBotType.behaviorModifiers.aggression = 0.4;
                    break;
                    
                case BotDifficulty.NORMAL:
                    // Default settings
                    if (!dbBotType.behaviorModifiers) {
                        dbBotType.behaviorModifiers = {};
                    }
                    dbBotType.behaviorModifiers.accuracy = 0.6;
                    dbBotType.behaviorModifiers.reactionTime = 1.2;
                    dbBotType.behaviorModifiers.aggression = 0.7;
                    break;
                    
                case BotDifficulty.HARD:
                    // Increase accuracy, reaction time, etc.
                    if (!dbBotType.behaviorModifiers) {
                        dbBotType.behaviorModifiers = {};
                    }
                    dbBotType.behaviorModifiers.accuracy = 0.8;
                    dbBotType.behaviorModifiers.reactionTime = 0.8;
                    dbBotType.behaviorModifiers.aggression = 0.9;
                    break;
                    
                case BotDifficulty.IMPOSSIBLE:
                    // Maximum difficulty settings
                    if (!dbBotType.behaviorModifiers) {
                        dbBotType.behaviorModifiers = {};
                    }
                    dbBotType.behaviorModifiers.accuracy = 0.95;
                    dbBotType.behaviorModifiers.reactionTime = 0.3;
                    dbBotType.behaviorModifiers.aggression = 1.0;
                    break;
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying difficulty-based behavior: ${error}`);
        }
    }

    // Apply live Tarkov behavior settings
    private applyBotBehaviorSettings(dbBotType: IBotType, botConfig: any): void {
        try {
            const behavior = botConfig.liveTarkovBehavior;
            if (!behavior) return;
            
            // Apply live Tarkov behavior settings to bot type
            if (!dbBotType.liveTarkovBehavior) {
                dbBotType.liveTarkovBehavior = {};
            }
            
            // Apply accuracy
            if (behavior.accuracy !== undefined) {
                dbBotType.liveTarkovBehavior.accuracy = behavior.accuracy;
            }
            
            // Apply reaction time
            if (behavior.reactionTime !== undefined) {
                dbBotType.liveTarkovBehavior.reactionTime = behavior.reactionTime;
            }
            
            // Apply aggression
            if (behavior.aggression !== undefined) {
                dbBotType.liveTarkovBehavior.aggression = behavior.aggression;
            }
            
            // Apply hearing
            if (behavior.hearing !== undefined) {
                dbBotType.liveTarkovBehavior.hearing = behavior.hearing;
            }
            
            // Apply vision
            if (behavior.vision !== undefined) {
                dbBotType.liveTarkovBehavior.vision = behavior.vision;
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying bot behavior settings: ${error}`);
        }
    }

    // Apply gear progression system
    private applyGearProgression(): void {
        try {
            const config = this.configManager.getConfig();
            const gearProgression = config.globalSettings?.gearProgression;
            
            if (!gearProgression || !gearProgression.enabled) return;
            
            this.logger.info("[LiveTarkovAI] Applying gear progression system...");
            
            // Apply level-based gear scaling to PMCs
            this.applyPMCGearProgression(gearProgression);
            
            // Apply meta ammo enforcement
            if (gearProgression.enforceMetaAmmo) {
                this.applyMetaAmmoEnforcement(gearProgression);
            }
            
            this.logger.info("[LiveTarkovAI] Gear progression system applied successfully");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying gear progression: ${error}`);
        }
    }

    // Apply PMC gear progression based on level
    private applyPMCGearProgression(gearProgression: any): void {
        try {
            const database = this.databaseServer.getTables();
            const pmcTypes = ["pmcbear", "pmcusec"];
            
            for (const pmcType of pmcTypes) {
                const dbBotType = database.bots.types[pmcType];
                if (!dbBotType) continue;
                
                // Set level-based gear scaling
                dbBotType.levelBasedGear = true;
                dbBotType.minLevel = 1;
                dbBotType.maxLevel = 60;
                
                // Set high-tier threshold
                if (gearProgression.minLevelForHighTier) {
                    dbBotType.highTierThreshold = gearProgression.minLevelForHighTier;
                }
                
                // Store gear progression data
                if (!dbBotType.gearProgression) {
                    dbBotType.gearProgression = {};
                }
                dbBotType.gearProgression.metaAmmoTypes = gearProgression.metaAmmoTypes || [];
                dbBotType.gearProgression.highTierArmor = gearProgression.highTierArmor || [];
                dbBotType.gearProgression.metaWeapons = gearProgression.metaWeapons || [];
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying PMC gear progression: ${error}`);
        }
    }

    // Apply meta ammo enforcement
    private applyMetaAmmoEnforcement(gearProgression: any): void {
        try {
            const database = this.databaseServer.getTables();
            const pmcTypes = ["pmcbear", "pmcusec"];
            
            for (const pmcType of pmcTypes) {
                const dbBotType = database.bots.types[pmcType];
                if (!dbBotType) continue;
                
                // Store meta ammo types for enforcement
                if (!dbBotType.metaAmmoTypes) {
                    dbBotType.metaAmmoTypes = [];
                }
                dbBotType.metaAmmoTypes.push(...(gearProgression.metaAmmoTypes || []));
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying meta ammo enforcement: ${error}`);
        }
    }

    // Hook into SPT spawn service
    public hookIntoSpawnService(spawnService: any): void {
        try {
            if (!spawnService || typeof spawnService !== "object") return;
            
            // Store reference to spawn service
            this.botSpawnService = spawnService;
            
            // Hook into spawn methods if they exist
            if (spawnService.spawnBot && typeof spawnService.spawnBot === "function") {
                const originalSpawnBot = spawnService.spawnBot;
                spawnService.spawnBot = async (botType: string, location: string, count: number) => {
                    // Apply our custom spawn logic before spawning
                    const modifiedCount = this.calculateCustomBotCount(botType, location, count);
                    const modifiedBotType = this.getModifiedBotType(botType);
                    
                    // Call original spawn method with our modifications
                    return await originalSpawnBot.call(spawnService, modifiedBotType, location, modifiedCount);
                };
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into spawn service");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into spawn service: ${error}`);
        }
    }

    // Calculate custom bot count based on configuration
    private calculateCustomBotCount(botType: string, location: string, originalCount: number): number {
        try {
            const config = this.configManager.getConfig();
            const mapConfig = config.mapSettings[location];
            
            if (!mapConfig || !mapConfig.enabled) return originalCount;
            
            const botTypeConfig = mapConfig.botTypes[botType];
            if (!botTypeConfig || !botTypeConfig.enabled) return 0;
            
            // Use configured max count or original count
            return Math.min(botTypeConfig.maxCount, originalCount);
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error calculating custom bot count: ${error}`);
            return originalCount;
        }
    }

    // Get modified bot type based on configuration
    private getModifiedBotType(originalBotType: string): string {
        try {
            // For now, return original bot type
            // This can be enhanced to modify bot types based on configuration
            return originalBotType;
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error getting modified bot type: ${error}`);
            return originalBotType;
        }
    }

    // Get spawn statistics
    public getSpawnStatistics(): any {
        try {
            const config = this.configManager.getConfig();
            const stats = {
                totalBots: 0,
                botTypes: {},
                maps: {},
                dependencies: {
                    waypoints: true, // Always true since it's required
                    bigBrain: true,  // Always true since it's required
                    sain: this.sainAvailable,
                    fika: false // Would need to check this separately
                }
            };

            // Calculate statistics based on configuration
            for (const [mapName, mapConfig] of Object.entries(config.mapSettings || {})) {
                if (mapConfig && mapConfig.enabled) {
                    stats.maps[mapName] = {
                        totalBots: mapConfig.maxBots || 0,
                        botTypes: mapConfig.botTypes || {},
                        liveTarkovSettings: mapConfig.liveTarkovSettings || {}
                    };
                    stats.totalBots += mapConfig.maxBots || 0;
                }
            }

            for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
                if (botConfig && botConfig.enabled) {
                    stats.botTypes[botType] = {
                        gearTier: botConfig.gearTier,
                        difficulty: botConfig.difficulty,
                        spawnChance: botConfig.spawnChance,
                        liveTarkovBehavior: botConfig.liveTarkovBehavior || {}
                    };
                }
            }

            return stats;
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error getting spawn statistics: ${error}`);
            return {};
        }
    }
}