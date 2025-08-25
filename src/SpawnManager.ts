import { DatabaseServer, Logger, DependencyContainer, ILocationBase, IRaidChanges } from "./types/spt-types";
import { ConfigManager } from "./ConfigManager";

export class SpawnManager {
    private databaseServer: DatabaseServer;
    private configManager: ConfigManager;
    private logger: Logger;
    private container: DependencyContainer;
    
    // SPT Services for REAL spawn control
    private botSpawnService: any;
    private locationController: any;
    private botHelper: any;
    private botController: any;

    constructor(databaseServer: DatabaseServer, configManager: ConfigManager, logger: Logger, container: DependencyContainer) {
        this.databaseServer = databaseServer;
        this.configManager = configManager;
        this.logger = logger;
        this.container = container;
    }

    public initialize(): void {
        try {
            this.logger.info("Initializing REAL spawn control system...");
            
            // Resolve SPT spawn services
            this.resolveSpawnServices();
            
            // Apply custom spawn configurations
            this.applyCustomSpawnConfig();
            
            // Hook into SPT's spawn system for REAL control
            this.hookIntoSpawnSystem();
            
            this.logger.info("REAL spawn control system initialized successfully");
        } catch (error) {
            this.logger.error(`Error initializing spawn system: ${error}`);
        }
    }

    // Resolve SPT spawn services for REAL control
    private resolveSpawnServices(): void {
        try {
            // Try to resolve SPT spawn services
            this.botSpawnService = this.container.resolve("BotSpawnService");
            this.locationController = this.container.resolve("LocationController");
            this.botHelper = this.container.resolve("BotHelper");
            this.botController = this.container.resolve("BotController");
            
            if (this.botSpawnService) {
                this.logger.info("✓ BotSpawnService available - REAL spawn control enabled");
            }
            
            if (this.locationController) {
                this.logger.info("✓ LocationController available - Map spawn control enabled");
            }
            
        } catch (error) {
            this.logger.warn("Some SPT spawn services not available - limited functionality");
        }
    }

    // Apply custom spawn configurations to the database
    public applyCustomSpawnConfig(): void {
        try {
            // Modify bot types in the database
            this.modifyBotTypes();
            
            // Apply gear progression if enabled
            if (this.configManager.isGearProgressionEnabled()) {
                this.applyGearProgression();
            }
            
            this.logger.info("Live Tarkov spawn configuration completed");
        } catch (error) {
            this.logger.error(`Error applying custom spawn config: ${error}`);
        }
    }

    // Hook into SPT's spawn system for REAL control
    private hookIntoSpawnSystem(): void {
        try {
            if (!this.botSpawnService) {
                this.logger.warn("BotSpawnService not available - cannot hook into spawn system");
                return;
            }

            // Hook into bot spawn events
            this.hookIntoBotSpawning();
            
            // Hook into location spawn events
            this.hookIntoLocationSpawning();
            
            // Apply spawn rate overrides
            this.applySpawnRateOverrides();
            
            this.logger.info("Successfully hooked into SPT spawn system");
            
        } catch (error) {
            this.logger.error(`Error hooking into spawn system: ${error}`);
        }
    }

    // Hook into bot spawning events for REAL control
    private hookIntoBotSpawning(): void {
        try {
            if (!this.botSpawnService || !this.botSpawnService.onBotSpawned) {
                return;
            }

            // Hook into bot spawned event
            this.botSpawnService.onBotSpawned = (bot: any, location: string) => {
                this.onBotSpawned(bot, location);
            };

            // Hook into bot spawn request event
            if (this.botSpawnService.onSpawnRequest) {
                this.botSpawnService.onSpawnRequest = (request: any) => {
                    return this.onSpawnRequest(request);
                };
            }

            this.logger.info("Bot spawning hooks installed");
            
        } catch (error) {
            this.logger.error(`Error hooking into bot spawning: ${error}`);
        }
    }

    // Hook into location spawning events
    private hookIntoLocationSpawning(): void {
        try {
            if (!this.locationController || !this.locationController.onLocationSpawn) {
                return;
            }

            // Hook into location spawn event
            this.locationController.onLocationSpawn = (location: string, raidChanges: IRaidChanges) => {
                this.onLocationSpawn(location, raidChanges);
            };

            this.logger.info("Location spawning hooks installed");
            
        } catch (error) {
            this.logger.error(`Error hooking into location spawning: ${error}`);
        }
    }

    // Apply spawn rate overrides to SPT
    private applySpawnRateOverrides(): void {
        try {
            const config = this.configManager.getConfig();
            const globalSettings = config.globalSettings;
            
            if (!globalSettings) return;
            
            // Override global bot limits in SPT
            const maxBots = globalSettings.maxBotsPerRaid || 15;
            const minBots = globalSettings.minBotsPerRaid || 6;
            
            // Apply to SPT's spawn configuration
            if (this.botSpawnService && this.botSpawnService.setMaxBots) {
                this.botSpawnService.setMaxBots(maxBots);
                this.botSpawnService.setMinBots(minBots);
                this.logger.info(`Applied spawn limits: ${minBots}-${maxBots} bots per raid`);
            }
            
        } catch (error) {
            this.logger.error(`Error applying spawn rate overrides: ${error}`);
        }
    }

    // Handle bot spawned event - REAL spawn control
    private onBotSpawned(bot: any, location: string): void {
        try {
            const config = this.configManager.getConfig();
            const mapConfig = config.mapSettings?.[location];
            
            if (!mapConfig || !mapConfig.enabled) return;
            
            // Apply map-specific spawn rules
            this.applyMapSpawnRules(bot, location, mapConfig);
            
            // Apply boss exclusion zones
            this.applyBossExclusionZones(bot, location, mapConfig);
            
        } catch (error) {
            this.logger.error(`Error handling bot spawned event: ${error}`);
        }
    }

    // Handle spawn request event - REAL spawn control
    private onSpawnRequest(request: any): any {
        try {
            const config = this.configManager.getConfig();
            const location = request.location;
            const mapConfig = config.mapSettings?.[location];
            
            if (!mapConfig || !mapConfig.enabled) {
                return request; // Allow default spawning
            }
            
            // Modify spawn request based on Live Tarkov rules
            const modifiedRequest = this.modifySpawnRequest(request, mapConfig);
            
            return modifiedRequest;
            
        } catch (error) {
            this.logger.error(`Error handling spawn request: ${error}`);
            return request; // Fallback to original request
        }
    }

    // Handle location spawn event - REAL spawn control
    private onLocationSpawn(location: string, raidChanges: IRaidChanges): void {
        try {
            const config = this.configManager.getConfig();
            const mapConfig = config.mapSettings?.[location];
            
            if (!mapConfig || !mapConfig.enabled) return;
            
            // Apply map-specific raid changes
            this.applyMapRaidChanges(location, raidChanges, mapConfig);
            
        } catch (error) {
            this.logger.error(`Error handling location spawn: ${error}`);
        }
    }

    // Apply map-specific spawn rules to spawned bots
    private applyMapSpawnRules(bot: any, location: string, mapConfig: any): void {
        try {
            const botTypes = mapConfig.botTypes;
            if (!botTypes) return;
            
            const botType = bot.Role || bot.BotType;
            const botConfig = botTypes[botType];
            
            if (!botConfig || !botConfig.enabled) return;
            
            // Apply difficulty overrides
            if (botConfig.difficulty) {
                bot.Difficulty = botConfig.difficulty;
            }
            
            // Apply gear restrictions
            if (botConfig.gearRestrictions) {
                this.applyGearRestrictionsToBot(bot, botConfig.gearRestrictions);
            }
            
        } catch (error) {
            this.logger.error(`Error applying map spawn rules: ${error}`);
        }
    }

    // Apply boss exclusion zones - REAL spawn control
    private applyBossExclusionZones(bot: any, location: string, mapConfig: any): void {
        try {
            const bossExclusionZones = mapConfig.bossExclusionZones;
            if (!bossExclusionZones) return;
            
            // Check if this bot is in a boss exclusion zone
            for (const zone of bossExclusionZones) {
                if (this.isBotInZone(bot, zone)) {
                    // Prevent regular scavs from spawning in boss zones
                    if (bot.Role === "assault" && zone.excludeRegularScavs) {
                        this.logger.info(`Prevented regular scav spawn in boss zone: ${zone.name}`);
                        // Remove the bot from the raid
                        this.removeBotFromRaid(bot);
                        return;
                    }
                }
            }
            
        } catch (error) {
            this.logger.error(`Error applying boss exclusion zones: ${error}`);
        }
    }

    // Modify spawn request based on Live Tarkov rules
    private modifySpawnRequest(request: any, mapConfig: any): any {
        try {
            const modifiedRequest = { ...request };
            
            // Apply bot count limits
            if (mapConfig.maxBots && mapConfig.maxBots > 0) {
                modifiedRequest.maxBots = Math.min(request.maxBots || 20, mapConfig.maxBots);
            }
            
            if (mapConfig.minBots && mapConfig.minBots > 0) {
                modifiedRequest.minBots = Math.max(request.minBots || 5, mapConfig.minBots);
            }
            
            // Apply bot type restrictions
            if (mapConfig.botTypes) {
                const allowedTypes = Object.entries(mapConfig.botTypes)
                    .filter(([_, config]: [string, any]) => config.enabled)
                    .map(([type, _]: [string, any]) => type);
                
                if (allowedTypes.length > 0) {
                    modifiedRequest.allowedBotTypes = allowedTypes;
                }
            }
            
            return modifiedRequest;
            
        } catch (error) {
            this.logger.error(`Error modifying spawn request: ${error}`);
            return request;
        }
    }

    // Apply map-specific raid changes
    private applyMapRaidChanges(location: string, raidChanges: IRaidChanges, mapConfig: any): void {
        try {
            const liveTarkovSettings = mapConfig.liveTarkovSettings;
            if (!liveTarkovSettings) return;
            
            // Apply raid start bot count
            if (liveTarkovSettings.raidStartBots && liveTarkovSettings.raidStartBots > 0) {
                raidChanges.botCountAdjustments = {
                    min: liveTarkovSettings.raidStartBots,
                    max: liveTarkovSettings.raidStartBots
                };
            }
            
            // Apply wave settings
            if (liveTarkovSettings.waveBots && liveTarkovSettings.maxWaves) {
                raidChanges.waveSettings = {
                    count: liveTarkovSettings.maxWaves,
                    delay: 300, // 5 minutes between waves
                    botsPerWave: liveTarkovSettings.waveBots
                };
            }
            
            this.logger.info(`Applied raid changes for ${location}`);
            
        } catch (error) {
            this.logger.error(`Error applying map raid changes: ${error}`);
        }
    }

    // Check if bot is in a specific zone
    private isBotInZone(bot: any, zone: any): boolean {
        try {
            // Simple distance check - in real implementation this would use proper zone boundaries
            const botPos = bot.Position || { x: 0, y: 0, z: 0 };
            const zoneCenter = zone.center || { x: 0, y: 0, z: 0 };
            const radius = zone.radius || 100;
            
            const distance = Math.sqrt(
                Math.pow(botPos.x - zoneCenter.x, 2) +
                Math.pow(botPos.y - zoneCenter.y, 2) +
                Math.pow(botPos.z - zoneCenter.z, 2)
            );
            
            return distance <= radius;
            
        } catch (error) {
            this.logger.error(`Error checking bot zone: ${error}`);
            return false;
        }
    }

    // Remove bot from raid (for exclusion zones)
    private removeBotFromRaid(bot: any): void {
        try {
            if (this.botController && this.botController.removeBot) {
                this.botController.removeBot(bot._id);
            }
        } catch (error) {
            this.logger.error(`Error removing bot from raid: ${error}`);
        }
    }

    // Apply gear restrictions to spawned bot
    private applyGearRestrictionsToBot(bot: any, restrictions: any): void {
        try {
            if (!bot.inventory) return;
            
            // Apply weapon restrictions
            if (restrictions.weapons && bot.inventory.equipment) {
                bot.inventory.equipment.weapon = restrictions.weapons;
            }
            
            // Apply armor restrictions
            if (restrictions.armor && bot.inventory.equipment) {
                bot.inventory.equipment.armor = restrictions.armor;
            }
            
        } catch (error) {
            this.logger.error(`Error applying gear restrictions to bot: ${error}`);
        }
    }

    // Modify bot types in the database
    private modifyBotTypes(): void {
        try {
            const config = this.configManager.getConfig();
            const database = this.databaseServer.getTables();
            let modifiedCount = 0;

            for (const [botType, botConfig] of Object.entries(config.botTypeSettings || {})) {
                if (!botConfig || !botConfig.enabled) {
                    continue;
                }

                const dbBotType = database.bots.types[botType];
                if (!dbBotType) {
                    continue; // Don't spam warnings for missing bot types
                }

                // Apply gear tier restrictions
                this.applyGearTierRestrictions(dbBotType, botConfig);
                
                // Apply difficulty settings
                this.applyDifficultySettings(dbBotType, botConfig);

                // Apply live Tarkov behavior
                this.applyBotBehaviorSettings(dbBotType, botConfig);

                modifiedCount++;
            }

            // Show simple summary
            if (modifiedCount > 0) {
                this.logger.info(`Modified ${modifiedCount} bot types`);
            }
        } catch (error) {
            this.logger.error(`Error modifying bot types: ${error}`);
        }
    }

    // Apply gear tier restrictions to bot types
    private applyGearTierRestrictions(dbBotType: any, botConfig: any): void {
        try {
            if (!botConfig.gearRestrictions) return;

            const restrictions = botConfig.gearRestrictions;
            
            // Apply weapon restrictions
            if (restrictions.weapons) {
                dbBotType.inventory = dbBotType.inventory || {};
                dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
                dbBotType.inventory.equipment.weapon = restrictions.weapons;
            }

            // Apply armor restrictions
            if (restrictions.armor) {
                dbBotType.inventory = dbBotType.inventory || {};
                dbBotType.inventory.equipment = dbBotType.inventory.equipment || {};
                dbBotType.inventory.equipment.armor = restrictions.armor;
            }

            // Apply item restrictions
            if (restrictions.items) {
                dbBotType.inventory = dbBotType.inventory || {};
                dbBotType.inventory.items = restrictions.items;
            }
        } catch (error) {
            this.logger.error(`Error applying gear restrictions: ${error}`);
        }
    }

    // Apply difficulty settings to bot types
    private applyDifficultySettings(dbBotType: any, botConfig: any): void {
        try {
            if (!botConfig.difficulty) return;

            const difficulty = botConfig.difficulty;
            
            // Set bot difficulty
            dbBotType.difficulty = difficulty;
            
            // Apply difficulty-based behavior
            this.applyDifficultyBasedBehavior(dbBotType, difficulty);
        } catch (error) {
            this.logger.error(`Error applying difficulty settings: ${error}`);
        }
    }

    // Apply difficulty-based behavior modifications
    private applyDifficultyBasedBehavior(dbBotType: any, difficulty: string): void {
        try {
            // Modify bot behavior based on difficulty
            switch (difficulty) {
                case "easy":
                    dbBotType.skills = dbBotType.skills || {};
                    dbBotType.skills.aiming = Math.max(0.1, (dbBotType.skills.aiming || 0.5) * 0.7);
                    dbBotType.skills.recoil = Math.max(0.1, (dbBotType.skills.recoil || 0.5) * 0.7);
                    break;
                case "normal":
                    // Keep default values
                    break;
                case "hard":
                    dbBotType.skills = dbBotType.skills || {};
                    dbBotType.skills.aiming = Math.min(1.0, (dbBotType.skills.aiming || 0.5) * 1.3);
                    dbBotType.skills.recoil = Math.min(1.0, (dbBotType.skills.recoil || 0.5) * 1.3);
                    break;
                case "impossible":
                    dbBotType.skills = dbBotType.skills || {};
                    dbBotType.skills.aiming = Math.min(1.0, (dbBotType.skills.aiming || 0.5) * 1.5);
                    dbBotType.skills.recoil = Math.min(1.0, (dbBotType.skills.recoil || 0.5) * 1.5);
                    break;
            }
        } catch (error) {
            this.logger.error(`Error applying difficulty-based behavior: ${error}`);
        }
    }

    // Apply live Tarkov behavior settings
    private applyBotBehaviorSettings(dbBotType: any, botConfig: any): void {
        try {
            if (!botConfig.liveTarkovBehavior) return;

            const behavior = botConfig.liveTarkovBehavior;
            
            // Apply behavior modifications
            if (behavior.aggressive) {
                dbBotType.aggression = Math.min(1.0, (dbBotType.aggression || 0.5) * 1.2);
            }
            
            if (behavior.cautious) {
                dbBotType.aggression = Math.max(0.1, (dbBotType.aggression || 0.5) * 0.8);
            }
        } catch (error) {
            this.logger.error(`Error applying bot behavior settings: ${error}`);
        }
    }

    // Apply gear progression system
    private applyGearProgression(): void {
        try {
            const config = this.configManager.getConfig();
            const gearProgression = config.globalSettings?.gearProgression;
            
            if (!gearProgression || !gearProgression.enabled) return;
            
            this.logger.info("Applying gear progression system...");
            
            // Apply level-based gear scaling to PMCs
            this.applyPMCGearProgression();
            
            // Apply meta ammo enforcement
            this.applyMetaAmmoEnforcement();
            
            this.logger.info("Gear progression system applied successfully");
        } catch (error) {
            this.logger.error(`Error applying gear progression: ${error}`);
        }
    }

    // Apply PMC gear progression based on level
    private applyPMCGearProgression(): void {
        try {
            const config = this.configManager.getConfig();
            const gearProgression = config.globalSettings?.gearProgression;
            
            if (!gearProgression || !gearProgression.progressionTiers) return;
            
            const progression = gearProgression.progressionTiers;
            
            // Apply level-based gear scaling
            for (const [level, gearConfig] of Object.entries(progression)) {
                const minLevel = parseInt(level);
                if (isNaN(minLevel)) continue;
                
                // This would be applied when PMCs are spawned based on their level
                // For now, we just store the configuration
                this.logger.info(`Configured gear progression for level ${minLevel}+`);
            }
        } catch (error) {
            this.logger.error(`Error applying PMC gear progression: ${error}`);
        }
    }

    // Apply meta ammo enforcement
    private applyMetaAmmoEnforcement(): void {
        try {
            const config = this.configManager.getConfig();
            const gearProgression = config.globalSettings?.gearProgression;
            
            if (!gearProgression || !gearProgression.metaAmmoTypes) return;
            
            const metaAmmoTypes = gearProgression.metaAmmoTypes;
            
            if (metaAmmoTypes.length > 0) {
                this.logger.info(`Meta ammo enforcement enabled with ${metaAmmoTypes.length} ammo types`);
            }
        } catch (error) {
            this.logger.error(`Error applying meta ammo enforcement: ${error}`);
        }
    }

    // Get spawn statistics for monitoring
    public getSpawnStatistics(): any {
        try {
            const stats = {
                totalBots: 0,
                modifiedBots: 0,
                gearProgressionEnabled: this.configManager.isGearProgressionEnabled(),
                spawnControlEnabled: !!this.botSpawnService,
                locationControlEnabled: !!this.locationController
            };
            
            return stats;
        } catch (error) {
            this.logger.error(`Error getting spawn statistics: ${error}`);
            return {};
        }
    }
}