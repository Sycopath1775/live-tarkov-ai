import { ConfigManager } from "./ConfigManager";
import { BotController, Logger } from "./types/spt-types";

export class FikaIntegrationService {
    private configManager: ConfigManager;
    private botController: BotController;
    private logger: Logger;
    private fikaConfig: any;
    private fikaAvailable: boolean = false;
    private fikaService: any = null;

    constructor(configManager: ConfigManager, botController: BotController, logger: Logger) {
        this.configManager = configManager;
        this.botController = botController;
        this.logger = logger;
    }

    public initialize(): void {
        try {
            this.logger.info("[LiveTarkovAI] Initializing Fika integration...");
            
            // Load Fika integration configuration
            this.fikaConfig = this.configManager.getFikaIntegrationConfig();
            
            if (this.fikaConfig.enabled) {
                this.checkFikaAvailability();
                
                if (this.fikaAvailable) {
                    this.setupFikaIntegration();
                    this.logger.info("[LiveTarkovAI] Fika integration initialized successfully");
                } else {
                    this.logger.info("[LiveTarkovAI] Fika not available - integration disabled");
                }
            } else {
                this.logger.info("[LiveTarkovAI] Fika integration disabled in configuration");
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error initializing Fika integration: ${error}`);
        }
    }

    // Check if Fika mod is available
    private checkFikaAvailability(): void {
        try {
            // Method 1: Try to require Fika directly
            try {
                this.fikaService = require("fika-server");
                this.fikaAvailable = true;
                return;
            } catch (error) {
                // Continue to next method
            }

            // Method 2: Check for Fika in global scope
            if (globalThis.FikaService || globalThis.FikaServerService || globalThis.fika) {
                this.fikaService = globalThis.FikaService || globalThis.FikaServerService || globalThis.fika;
                this.fikaAvailable = true;
                return;
            }

            // Method 3: Check for Fika in SPT container if available
            try {
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("FikaService")) {
                        this.fikaService = container.resolve("FikaService");
                        this.fikaAvailable = true;
                        return;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            this.fikaAvailable = false;
        } catch (error) {
            this.fikaAvailable = false;
        }
    }

    // Setup Fika integration
    private setupFikaIntegration(): void {
        try {
            if (!this.fikaService) return;
            
            // Apply Fika integration features
            this.applyFikaIntegrationFeatures();
            
            // Hook into Fika services if available
            this.hookIntoFikaServices();
            
            this.logger.info("[LiveTarkovAI] Fika integration setup completed");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error setting up Fika integration: ${error}`);
        }
    }

    // Apply Fika integration features
    private applyFikaIntegrationFeatures(): void {
        try {
            // Apply multiplayer compatibility
            if (this.fikaConfig.multiplayerCompatibility) {
                this.setupMultiplayerCompatibility();
            }
            
            // Apply player scav handling
            if (this.fikaConfig.playerScavHandling) {
                this.setupPlayerScavHandling();
            }
            
            // Apply bot brain optimization
            if (this.fikaConfig.botBrainOptimization) {
                this.setupBotBrainOptimization();
            }
            
            // Apply bot conflict prevention
            if (this.fikaConfig.preventBotConflicts) {
                this.setupBotConflictPrevention();
            }
            
            this.logger.info("[LiveTarkovAI] Fika integration features applied");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying Fika integration features: ${error}`);
        }
    }

    // Setup multiplayer compatibility
    private setupMultiplayerCompatibility(): void {
        try {
            if (!this.fikaService || !this.fikaService.setupMultiplayerCompatibility) return;
            
            // Setup multiplayer compatibility through Fika service
            this.fikaService.setupMultiplayerCompatibility({
                syncBotStates: true,
                preventDesync: true,
                handleMultiplePlayers: true
            });
            
            this.logger.info("[LiveTarkovAI] Multiplayer compatibility configured with Fika");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error setting up multiplayer compatibility: ${error}`);
        }
    }

    // Setup player scav handling
    private setupPlayerScavHandling(): void {
        try {
            if (!this.fikaService || !this.fikaService.setupPlayerScavHandling) return;
            
            // Setup player scav handling through Fika service
            this.fikaService.setupPlayerScavHandling({
                preventBotConflicts: true,
                syncPlayerScavStates: true,
                handlePlayerScavSpawns: true
            });
            
            this.logger.info("[LiveTarkovAI] Player scav handling configured with Fika");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error setting up player scav handling: ${error}`);
        }
    }

    // Setup bot brain optimization
    private setupBotBrainOptimization(): void {
        try {
            if (!this.fikaService || !this.fikaService.setupBotBrainOptimization) return;
            
            // Setup bot brain optimization through Fika service
            this.fikaService.setupBotBrainOptimization({
                optimizePathfinding: true,
                reduceCPUUsage: true,
                improveBotIntelligence: true
            });
            
            this.logger.info("[LiveTarkovAI] Bot brain optimization configured with Fika");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error setting up bot brain optimization: ${error}`);
        }
    }

    // Setup bot conflict prevention
    private setupBotConflictPrevention(): void {
        try {
            if (!this.fikaService || !this.fikaService.setupBotConflictPrevention) return;
            
            // Setup bot conflict prevention through Fika service
            this.fikaService.setupBotConflictPrevention({
                preventDuplicateSpawns: true,
                handleBotCollisions: true,
                manageBotTerritories: true
            });
            
            this.logger.info("[LiveTarkovAI] Bot conflict prevention configured with Fika");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error setting up bot conflict prevention: ${error}`);
        }
    }

    // Hook into Fika services
    private hookIntoFikaServices(): void {
        try {
            if (!this.fikaService) return;
            
            // Hook into Fika bot controller if available
            if (this.fikaService.botController) {
                this.hookIntoFikaBotController(this.fikaService.botController);
            }
            
            // Hook into Fika spawn service if available
            if (this.fikaService.spawnService) {
                this.hookIntoFikaSpawnService(this.fikaService.spawnService);
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into Fika services");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into Fika services: ${error}`);
        }
    }

    // Hook into Fika bot controller
    private hookIntoFikaBotController(fikaBotController: any): void {
        try {
            if (!fikaBotController || typeof fikaBotController !== "object") return;
            
            // Store reference to Fika bot controller
            this.botController = fikaBotController;
            
            // Hook into bot management methods if they exist
            if (fikaBotController.getBots && typeof fikaBotController.getBots === "function") {
                const originalGetBots = fikaBotController.getBots;
                fikaBotController.getBots = () => {
                    // Get bots through Fika service
                    const bots = originalGetBots.call(fikaBotController);
                    
                    // Apply our custom modifications to bots
                    this.applyCustomBotModifications(bots);
                    
                    return bots;
                };
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into Fika bot controller");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into Fika bot controller: ${error}`);
        }
    }

    // Hook into Fika spawn service
    private hookIntoFikaSpawnService(fikaSpawnService: any): void {
        try {
            if (!fikaSpawnService || typeof fikaSpawnService !== "object") return;
            
            // Hook into spawn methods if they exist
            if (fikaSpawnService.spawnBot && typeof fikaSpawnService.spawnBot === "function") {
                const originalSpawnBot = fikaSpawnService.spawnBot;
                fikaSpawnService.spawnBot = async (botType: string, location: string, count: number) => {
                    // Apply our custom spawn logic before Fika spawning
                    const modifiedCount = this.calculateCustomBotCount(botType, location, count);
                    const modifiedBotType = this.getModifiedBotType(botType);
                    
                    // Call original Fika spawn method with our modifications
                    return await originalSpawnBot.call(fikaSpawnService, modifiedBotType, location, modifiedCount);
                };
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into Fika spawn service");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into Fika spawn service: ${error}`);
        }
    }

    // Apply custom bot modifications
    private applyCustomBotModifications(bots: any[]): void {
        try {
            if (!Array.isArray(bots)) return;
            
            for (const bot of bots) {
                // Apply our custom modifications based on configuration
                const config = this.configManager.getConfig();
                const botTypeConfig = config.botTypeSettings[bot.Role];
                
                if (botTypeConfig && botTypeConfig.enabled) {
                    // Apply gear restrictions
                    if (botTypeConfig.gearRestrictions) {
                        this.applyGearRestrictions(bot, botTypeConfig.gearRestrictions);
                    }
                    
                    // Apply behavior modifications
                    if (botTypeConfig.liveTarkovBehavior) {
                        this.applyBehaviorModifications(bot, botTypeConfig.liveTarkovBehavior);
                    }
                }
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying custom bot modifications: ${error}`);
        }
    }

    // Apply gear restrictions to bot
    private applyGearRestrictions(bot: any, gearRestrictions: any): void {
        try {
            // Apply weapon restrictions
            if (gearRestrictions.weapons && gearRestrictions.weapons.length > 0) {
                bot.weaponRestrictions = gearRestrictions.weapons;
            }
            
            // Apply armor restrictions
            if (gearRestrictions.armor && gearRestrictions.armor.length > 0) {
                bot.armorRestrictions = gearRestrictions.armor;
            }
            
            // Apply item restrictions
            if (gearRestrictions.items && gearRestrictions.items.length > 0) {
                bot.itemRestrictions = gearRestrictions.items;
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying gear restrictions: ${error}`);
        }
    }

    // Apply behavior modifications to bot
    private applyBehaviorModifications(bot: any, behavior: any): void {
        try {
            // Apply accuracy modification
            if (behavior.accuracy !== undefined) {
                bot.accuracy = behavior.accuracy;
            }
            
            // Apply reaction time modification
            if (behavior.reactionTime !== undefined) {
                bot.reactionTime = behavior.reactionTime;
            }
            
            // Apply aggression modification
            if (behavior.aggression !== undefined) {
                bot.aggression = behavior.aggression;
            }
            
            // Apply hearing modification
            if (behavior.hearing !== undefined) {
                bot.hearing = behavior.hearing;
            }
            
            // Apply vision modification
            if (behavior.vision !== undefined) {
                bot.vision = behavior.vision;
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying behavior modifications: ${error}`);
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

    // Check if Fika integration is available
    public isFikaAvailable(): boolean {
        return this.fikaAvailable;
    }

    // Get Fika configuration
    public getFikaConfig(): any {
        return this.fikaConfig;
    }

    // Update Fika configuration
    public updateFikaConfig(newConfig: any): void {
        try {
            this.fikaConfig = { ...this.fikaConfig, ...newConfig };
            
            if (this.fikaConfig.enabled && this.fikaAvailable) {
                this.setupFikaIntegration();
                this.logger.info("[LiveTarkovAI] Fika configuration updated");
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error updating Fika configuration: ${error}`);
        }
    }
}

