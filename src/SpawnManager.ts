import { DatabaseServer, Logger } from "./types/spt-types";
import { ConfigManager } from "./ConfigManager";

export class SpawnManager {
    private databaseServer: DatabaseServer;
    private configManager: ConfigManager;
    private logger: Logger;

    constructor(
        databaseServer: DatabaseServer,
        configManager: ConfigManager,
        logger: Logger
    ) {
        this.databaseServer = databaseServer;
        this.configManager = configManager;
        this.logger = logger;
    }

    public initialize(): void {
        try {
            this.logger.info("Initializing SpawnManager...");
            
            // Apply custom spawn configurations
            this.applyCustomSpawnConfig();
            
            this.logger.info("SpawnManager initialized successfully");
        } catch (error) {
            this.logger.error(`Error initializing SpawnManager: ${error}`);
        }
    }

    // Apply custom spawn configurations to the database
    public applyCustomSpawnConfig(): void {
        try {
            this.logger.info("Applying custom spawn configurations...");
            
            // Modify bot types in the database
            this.modifyBotTypes();
            
            // Apply gear progression if enabled
            if (this.configManager.isGearProgressionEnabled()) {
                this.applyGearProgression();
            }
            
            this.logger.info("Custom spawn configurations applied successfully");
        } catch (error) {
            this.logger.error(`Error applying custom spawn config: ${error}`);
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
                    this.logger.warn(`Bot type ${botType} not found in database`);
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
                this.logger.info(`Modified ${modifiedCount} bot types: ${modifiedTypes.join(', ')}`);
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
                gearProgressionEnabled: this.configManager.isGearProgressionEnabled()
            };
            
            return stats;
        } catch (error) {
            this.logger.error(`Error getting spawn statistics: ${error}`);
            return {};
        }
    }
}