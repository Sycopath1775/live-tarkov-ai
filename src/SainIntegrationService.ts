import { ConfigManager } from "./ConfigManager";
import { BotModificationService, Logger } from "./types/spt-types";

export class SainIntegrationService {
    private configManager: ConfigManager;
    private botModificationService: BotModificationService;
    private logger: Logger;
    private sainConfig: any;
    private sainAvailable: boolean = false;
    private sainService: any = null;

    constructor(configManager: ConfigManager, botModificationService: BotModificationService, logger: Logger) {
        this.configManager = configManager;
        this.botModificationService = botModificationService;
        this.logger = logger;
    }

    public initialize(): void {
        try {
            this.logger.info("[LiveTarkovAI] Initializing SAIN integration...");
            
            // Load SAIN integration configuration
            this.sainConfig = this.configManager.getSainIntegrationConfig();
            
            if (this.sainConfig.enabled) {
                this.checkSAINAvailability();
                
                if (this.sainAvailable) {
                    this.setupSAINIntegration();
                    this.logger.info("[LiveTarkovAI] SAIN integration initialized successfully");
                } else {
                    this.logger.info("[LiveTarkovAI] SAIN not available - integration disabled");
                }
            } else {
                this.logger.info("[LiveTarkovAI] SAIN integration disabled in configuration");
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error initializing SAIN integration: ${error}`);
        }
    }

    // Check if SAIN mod is available
    private checkSAINAvailability(): void {
        try {
            // Method 1: Try to require SAIN directly
            try {
                this.sainService = require("zSolarint-SAIN-ServerMod");
                this.sainAvailable = true;
                return;
            } catch (error) {
                // Continue to next method
            }

            // Method 2: Check for SAIN in global scope
            if (globalThis.SAIN || globalThis.SainService || globalThis.sain) {
                this.sainService = globalThis.SAIN || globalThis.SainService || globalThis.sain;
                this.sainAvailable = true;
                return;
            }

            // Method 3: Check for SAIN in SPT container if available
            try {
                if (globalThis.SPT_CONTAINER) {
                    const container = globalThis.SPT_CONTAINER;
                    if (container.resolve && container.resolve("SAINService")) {
                        this.sainService = container.resolve("SAINService");
                        this.sainAvailable = true;
                        return;
                    }
                }
            } catch (error) {
                // Continue to next method
            }

            this.sainAvailable = false;
        } catch (error) {
            this.sainAvailable = false;
        }
    }

    // Setup SAIN integration
    private setupSAINIntegration(): void {
        try {
            if (!this.sainService) return;
            
            // Apply SAIN behavior modifications
            this.applySAINBehaviorModifications();
            
            // Hook into SAIN services if available
            this.hookIntoSAINServices();
            
            this.logger.info("[LiveTarkovAI] SAIN integration setup completed");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error setting up SAIN integration: ${error}`);
        }
    }

    // Apply SAIN behavior modifications
    private applySAINBehaviorModifications(): void {
        try {
            const config = this.configManager.getConfig();
            
            // Apply scav behavior modifications
            if (this.sainConfig.scavBehavior) {
                this.applyScavBehaviorModifications();
            }
            
            // Apply PMC behavior modifications
            if (this.sainConfig.pmcBehavior) {
                this.applyPMCBehaviorModifications();
            }
            
            // Apply boss behavior modifications
            if (this.sainConfig.bossBehavior) {
                this.applyBossBehaviorModifications();
            }
            
            this.logger.info("[LiveTarkovAI] SAIN behavior modifications applied");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying SAIN behavior modifications: ${error}`);
        }
    }

    // Apply scav behavior modifications
    private applyScavBehaviorModifications(): void {
        try {
            const scavBehavior = this.sainConfig.scavBehavior;
            
            if (scavBehavior.annoyingButNotDeadly) {
                // Reduce scav accuracy and aggression
                this.modifyScavBehavior("annoying_but_not_deadly", {
                    accuracy: scavBehavior.reducedAccuracy || 0.4,
                    avoidHeadshots: scavBehavior.avoidHeadshots || true,
                    preventStomachBlacking: scavBehavior.preventStomachBlacking || true
                });
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying scav behavior modifications: ${error}`);
        }
    }

    // Apply PMC behavior modifications
    private applyPMCBehaviorModifications(): void {
        try {
            const pmcBehavior = this.sainConfig.pmcBehavior;
            
            if (pmcBehavior.tacticalAndTough) {
                // Apply tactical PMC behavior
                this.modifyPMCBehavior("tactical_and_tough", {
                    accuracy: pmcBehavior.realisticAccuracy || 0.75,
                    avoidInstaKills: pmcBehavior.avoidInstaKills || true,
                    properGearUsage: pmcBehavior.properGearUsage || true
                });
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying PMC behavior modifications: ${error}`);
        }
    }

    // Apply boss behavior modifications
    private applyBossBehaviorModifications(): void {
        try {
            const bossBehavior = this.sainConfig.bossBehavior;
            
            if (bossBehavior.toughButNotInstaKill) {
                // Apply balanced boss behavior
                this.modifyBossBehavior("tough_but_not_insta_kill", {
                    avoidHeadshotSpam: bossBehavior.avoidHeadshotSpam || true,
                    realisticDifficulty: bossBehavior.realisticDifficulty || true,
                    properMechanics: bossBehavior.properMechanics || true
                });
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error applying boss behavior modifications: ${error}`);
        }
    }

    // Modify scav behavior using SAIN
    private modifyScavBehavior(behaviorType: string, modifications: any): void {
        try {
            if (!this.sainService || !this.sainService.modifyScavBehavior) return;
            
            // Apply modifications through SAIN service
            this.sainService.modifyScavBehavior(behaviorType, modifications);
            
            this.logger.info(`[LiveTarkovAI] Applied ${behaviorType} scav behavior through SAIN`);
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error modifying scav behavior through SAIN: ${error}`);
        }
    }

    // Modify PMC behavior using SAIN
    private modifyPMCBehavior(behaviorType: string, modifications: any): void {
        try {
            if (!this.sainService || !this.sainService.modifyPMCBehavior) return;
            
            // Apply modifications through SAIN service
            this.sainService.modifyPMCBehavior(behaviorType, modifications);
            
            this.logger.info(`[LiveTarkovAI] Applied ${behaviorType} PMC behavior through SAIN`);
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error modifying PMC behavior through SAIN: ${error}`);
        }
    }

    // Modify boss behavior using SAIN
    private modifyBossBehavior(behaviorType: string, modifications: any): void {
        try {
            if (!this.sainService || !this.sainService.modifyBossBehavior) return;
            
            // Apply modifications through SAIN service
            this.sainService.modifyBossBehavior(behaviorType, modifications);
            
            this.logger.info(`[LiveTarkovAI] Applied ${behaviorType} boss behavior through SAIN`);
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error modifying boss behavior through SAIN: ${error}`);
        }
    }

    // Hook into SAIN services
    private hookIntoSAINServices(): void {
        try {
            if (!this.sainService) return;
            
            // Hook into SAIN bot modification service if available
            if (this.sainService.botModificationService) {
                this.hookIntoSAINBotModification(this.sainService.botModificationService);
            }
            
            // Hook into SAIN spawn service if available
            if (this.sainService.spawnService) {
                this.hookIntoSAINSpawnService(this.sainService.spawnService);
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into SAIN services");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into SAIN services: ${error}`);
        }
    }

    // Hook into SAIN bot modification service
    private hookIntoSAINBotModification(sainBotModService: any): void {
        try {
            if (!sainBotModService || typeof sainBotModService !== "object") return;
            
            // Store reference to SAIN bot modification service
            this.botModificationService = sainBotModService;
            
            // Hook into bot modification methods if they exist
            if (sainBotModService.modifyBot && typeof sainBotModService.modifyBot === "function") {
                const originalModifyBot = sainBotModService.modifyBot;
                sainBotModService.modifyBot = (bot: any, modifications: any) => {
                    // Apply our custom modifications before SAIN modifications
                    this.applyCustomBotModifications(bot, modifications);
                    
                    // Call original SAIN modification method
                    return originalModifyBot.call(sainBotModService, bot, modifications);
                };
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into SAIN bot modification service");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into SAIN bot modification service: ${error}`);
        }
    }

    // Hook into SAIN spawn service
    private hookIntoSAINSpawnService(sainSpawnService: any): void {
        try {
            if (!sainSpawnService || typeof sainSpawnService !== "object") return;
            
            // Hook into spawn methods if they exist
            if (sainSpawnService.spawnBot && typeof sainSpawnService.spawnBot === "function") {
                const originalSpawnBot = sainSpawnService.spawnBot;
                sainSpawnService.spawnBot = async (botType: string, location: string, count: number) => {
                    // Apply our custom spawn logic before SAIN spawning
                    const modifiedCount = this.calculateCustomBotCount(botType, location, count);
                    const modifiedBotType = this.getModifiedBotType(botType);
                    
                    // Call original SAIN spawn method with our modifications
                    return await originalSpawnBot.call(sainSpawnService, modifiedBotType, location, modifiedCount);
                };
            }
            
            this.logger.info("[LiveTarkovAI] Successfully hooked into SAIN spawn service");
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error hooking into SAIN spawn service: ${error}`);
        }
    }

    // Apply custom bot modifications
    private applyCustomBotModifications(bot: any, modifications: any): void {
        try {
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

    // Check if SAIN integration is available
    public isSAINAvailable(): boolean {
        return this.sainAvailable;
    }

    // Get SAIN configuration
    public getSAINConfig(): any {
        return this.sainConfig;
    }

    // Update SAIN configuration
    public updateSAINConfig(newConfig: any): void {
        try {
            this.sainConfig = { ...this.sainConfig, ...newConfig };
            
            if (this.sainConfig.enabled && this.sainAvailable) {
                this.setupSAINIntegration();
                this.logger.info("[LiveTarkovAI] SAIN configuration updated");
            }
        } catch (error) {
            this.logger.error(`[LiveTarkovAI] Error updating SAIN configuration: ${error}`);
        }
    }
}

